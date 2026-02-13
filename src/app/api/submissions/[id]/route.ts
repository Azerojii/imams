import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const pendingDirectory = path.join(process.cwd(), 'content/pending')
const contentDirectory = path.join(process.cwd(), 'content/wiki')

// Get single submission
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const filePath = path.join(pendingDirectory, `${id}.md`)
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    return NextResponse.json({
      id,
      ...data,
      content,
    })
  } catch (error) {
    console.error('Error fetching submission:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submission' },
      { status: 500 }
    )
  }
}

// Approve submission
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, title, description, category, content, infobox } = body

    const { id } = await params
    const pendingPath = path.join(pendingDirectory, `${id}.md`)
    
    if (!fs.existsSync(pendingPath)) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    if (action === 'approve') {
      // Create slug and move to published
      const slug = title.trim().replace(/\s+/g, '_')
      const publishedPath = path.join(contentDirectory, `${slug}.md`)

      const frontmatter = {
        title,
        description: description || '',
        lastUpdated: new Date().toISOString().split('T')[0],
        category: category || 'Général',
        ...(infobox && { infobox }),
      }

      const fileContent = matter.stringify(content, frontmatter)
      fs.writeFileSync(publishedPath, fileContent, 'utf8')

      // Delete from pending
      fs.unlinkSync(pendingPath)

      return NextResponse.json({ 
        success: true,
        slug,
        message: 'Article approuvé et publié' 
      })
    } else if (action === 'reject') {
      // Delete submission
      fs.unlinkSync(pendingPath)

      return NextResponse.json({ 
        success: true,
        message: 'Soumission rejetée' 
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error processing submission:', error)
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    )
  }
}

