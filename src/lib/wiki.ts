import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDirectory = path.join(process.cwd(), 'content/wiki')

export interface MosqueReference {
  name: string
  slug?: string
  startDate?: string
  endDate?: string
}

export interface ImamReference {
  name: string
  slug?: string
  startDate?: string
  endDate?: string
}

export interface WikiArticle {
  slug: string
  title: string
  description: string
  lastUpdated: string
  category: string
  articleType: 'imam' | 'mosque'
  content: string
  rawContent: string
  // Shared
  wilaya?: string
  commune?: string
  wilayaCode?: string
  image?: {
    src: string
    caption: string
  }
  youtubeVideos?: string[]
  // Imam-specific
  birthDate?: string
  deathDate?: string
  isAlive?: boolean
  mosquesServed?: MosqueReference[]
  // Mosque-specific
  dateBuilt?: string
  imamsServed?: ImamReference[]
}

export interface WikiMetadata {
  slug: string
  title: string
  description: string
  category: string
  lastUpdated: string
  articleType: 'imam' | 'mosque'
  wilaya?: string
  commune?: string
}

/**
 * Parse WikiLinks [[Article Name]] and convert to Next.js links
 */
export function parseWikiLinks(content: string): string {
  return content.replace(/\[\[(.*?)\]\]/g, (match, articleName) => {
    const slug = articleName.trim().replace(/\s+/g, '_')
    return `[${articleName}](/wiki/${slug})`
  })
}

/**
 * Extract table of contents from markdown headers
 */
export interface TocItem {
  level: number
  text: string
  slug: string
}

export function generateTableOfContents(content: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  const toc: TocItem[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2]
    const slug = text
      .replace(/\s+/g, '-')
      .replace(/[^\u0600-\u06FF\w\s-]/g, '')

    toc.push({ level, text, slug })
  }

  return toc
}

/**
 * Check if an article exists by slug
 */
export function checkArticleExists(slug: string): boolean {
  try {
    const decodedSlug = decodeURIComponent(slug)
    const fullPath = path.join(contentDirectory, `${decodedSlug}.md`)
    return fs.existsSync(fullPath)
  } catch {
    return false
  }
}

/**
 * Get all wiki article slugs
 */
export function getAllWikiSlugs(): string[] {
  try {
    const fileNames = fs.readdirSync(contentDirectory)
    return fileNames
      .filter(f => f.endsWith('.md'))
      .map((fileName) => fileName.replace(/\.md$/, ''))
  } catch {
    return []
  }
}

/**
 * Get metadata for all articles
 */
export function getAllWikiMetadata(): WikiMetadata[] {
  const slugs = getAllWikiSlugs()
  return slugs.map((slug) => {
    const fullPath = path.join(contentDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data } = matter(fileContents)

    return {
      slug,
      title: String(data.title || ''),
      description: String(data.description || ''),
      category: String(data.category || ''),
      articleType: (data.articleType as 'imam' | 'mosque') || 'imam',
      wilaya: data.wilaya ? String(data.wilaya) : undefined,
      commune: data.commune ? String(data.commune) : undefined,
      lastUpdated: typeof data.lastUpdated === 'string'
        ? data.lastUpdated
        : data.lastUpdated instanceof Date
          ? data.lastUpdated.toISOString().split('T')[0]
          : String(data.lastUpdated),
    }
  })
}

/**
 * Get all imam articles
 */
export function getImams(): WikiMetadata[] {
  return getAllWikiMetadata().filter(a => a.articleType === 'imam')
}

/**
 * Get all mosque articles
 */
export function getMosques(): WikiMetadata[] {
  return getAllWikiMetadata().filter(a => a.articleType === 'mosque')
}

/**
 * Get articles by wilaya
 */
export function getArticlesByWilaya(wilaya: string): WikiMetadata[] {
  return getAllWikiMetadata().filter(a => a.wilaya === wilaya)
}

/**
 * Get all unique wilayas that have articles
 */
export function getWilayasWithArticles(): string[] {
  const articles = getAllWikiMetadata()
  const wilayas = new Set<string>()
  articles.forEach(a => {
    if (a.wilaya) wilayas.add(a.wilaya)
  })
  return Array.from(wilayas).sort()
}

/**
 * Get a single wiki article by slug
 */
export async function getWikiArticle(slug: string): Promise<WikiArticle | null> {
  try {
    const decodedSlug = decodeURIComponent(slug)
    const fullPath = path.join(contentDirectory, `${decodedSlug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    const { data, content } = matter(fileContents)
    const contentWithLinks = parseWikiLinks(content)

    return {
      slug: decodedSlug,
      title: data.title,
      description: data.description,
      lastUpdated: typeof data.lastUpdated === 'string'
        ? data.lastUpdated
        : data.lastUpdated instanceof Date
          ? data.lastUpdated.toISOString().split('T')[0]
          : String(data.lastUpdated),
      category: data.category,
      articleType: (data.articleType as 'imam' | 'mosque') || 'imam',
      wilaya: data.wilaya,
      commune: data.commune,
      wilayaCode: data.wilayaCode,
      image: data.image,
      youtubeVideos: data.youtubeVideos && Array.isArray(data.youtubeVideos) ? data.youtubeVideos : undefined,
      birthDate: data.birthDate,
      deathDate: data.deathDate,
      isAlive: data.isAlive,
      mosquesServed: data.mosquesServed,
      dateBuilt: data.dateBuilt,
      imamsServed: data.imamsServed,
      content: contentWithLinks,
      rawContent: content,
    }
  } catch (error) {
    console.error(`Error loading article ${slug}:`, error)
    return null
  }
}

/**
 * Search articles by query
 */
export function searchArticles(query: string): WikiMetadata[] {
  const allArticles = getAllWikiMetadata()
  return allArticles.filter(
    (article) =>
      article.title.includes(query) ||
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.description.includes(query) ||
      (article.wilaya && article.wilaya.includes(query))
  )
}
