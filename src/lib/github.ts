import { Octokit } from '@octokit/rest'
import fs from 'fs'
import path from 'path'

// Initialize Octokit with GitHub token
const octokit = process.env.GITHUB_TOKEN
  ? new Octokit({ auth: process.env.GITHUB_TOKEN })
  : null

// GitHub repository information
const GITHUB_OWNER = process.env.GITHUB_OWNER || ''
const GITHUB_REPO = process.env.GITHUB_REPO || ''
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main'

// Vercel Deploy Hook
const VERCEL_DEPLOY_HOOK = process.env.VERCEL_DEPLOY_HOOK_URL || ''

// Check if we're running on Vercel (production) or local
const isProduction = process.env.VERCEL === '1'

/**
 * Trigger Vercel redeployment
 */
async function triggerVercelDeploy(): Promise<void> {
  if (!VERCEL_DEPLOY_HOOK || !isProduction) {
    return
  }

  try {
    await fetch(VERCEL_DEPLOY_HOOK, { method: 'POST' })
    console.log('Vercel deployment triggered')
  } catch (error) {
    console.error('Failed to trigger Vercel deployment:', error)
  }
}

/**
 * Create or update a file in GitHub
 */
export async function createOrUpdateGitHubFile(
  filePath: string,
  content: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  // If running locally or GitHub not configured, use file system
  if (!isProduction || !octokit || !GITHUB_OWNER || !GITHUB_REPO) {
    try {
      const fullPath = path.join(process.cwd(), filePath)
      const dir = path.dirname(fullPath)
      
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      
      fs.writeFileSync(fullPath, content, 'utf8')
      return { success: true }
    } catch (error) {
      console.error('Local file write error:', error)
      return { success: false, error: 'Failed to write file locally' }
    }
  }

  // Use GitHub API in production
  try {
    // Get current file SHA if it exists
    let sha: string | undefined
    try {
      const { data } = await octokit.repos.getContent({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        path: filePath,
        ref: GITHUB_BRANCH,
      })

      if ('sha' in data) {
        sha = data.sha
      }
    } catch (error: any) {
      // File doesn't exist yet, which is fine for creation
      if (error.status !== 404) {
        throw error
      }
    }

    // Create or update the file
    await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: filePath,
      message,
      content: Buffer.from(content).toString('base64'),
      branch: GITHUB_BRANCH,
      ...(sha && { sha }),
    })

    // Trigger Vercel redeployment
    await triggerVercelDeploy()

    return { success: true }
  } catch (error: any) {
    console.error('GitHub API error:', error)
    return { 
      success: false, 
      error: error.message || 'Failed to update file on GitHub' 
    }
  }
}

/**
 * Delete a file from GitHub
 */
export async function deleteGitHubFile(
  filePath: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  // If running locally or GitHub not configured, use file system
  if (!isProduction || !octokit || !GITHUB_OWNER || !GITHUB_REPO) {
    try {
      const fullPath = path.join(process.cwd(), filePath)
      
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath)
      }
      
      return { success: true }
    } catch (error) {
      console.error('Local file delete error:', error)
      return { success: false, error: 'Failed to delete file locally' }
    }
  }

  // Use GitHub API in production
  try {
    // Get current file SHA
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: filePath,
      ref: GITHUB_BRANCH,
    })

    if (!('sha' in data)) {
      return { success: false, error: 'File not found' }
    }

    // Delete the file
    await octokit.repos.deleteFile({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: filePath,
      message,
      sha: data.sha,
      branch: GITHUB_BRANCH,
    })

    // Trigger Vercel redeployment
    await triggerVercelDeploy()

    return { success: true }
  } catch (error: any) {
    console.error('GitHub API error:', error)
    return { 
      success: false, 
      error: error.message || 'Failed to delete file on GitHub' 
    }
  }
}

/**
 * Check if file exists on GitHub
 */
export async function fileExistsOnGitHub(filePath: string): Promise<boolean> {
  // If running locally or GitHub not configured, check file system
  if (!isProduction || !octokit || !GITHUB_OWNER || !GITHUB_REPO) {
    const fullPath = path.join(process.cwd(), filePath)
    return fs.existsSync(fullPath)
  }

  // Check GitHub
  try {
    await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: filePath,
      ref: GITHUB_BRANCH,
    })
    return true
  } catch (error: any) {
    if (error.status === 404) {
      return false
    }
    throw error
  }
}
