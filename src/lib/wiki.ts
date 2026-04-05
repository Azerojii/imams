import { supabase } from './supabase'

export interface MosqueReference {
  name: string
  slug?: string
  startDate?: string
  endDate?: string
  wilaya?: string
  commune?: string
  wilayaCode?: string
}

export interface CustomField {
  label: string
  value: string
}

export interface ImamReference {
  name: string
  slug?: string
  startDate?: string
  endDate?: string
  rutba?: string
}

export interface Founder {
  name: string
  rutba?: string
}

export interface RankEntry {
  rank: string
  fromDate?: string
  toDate?: string
}

export interface Reference {
  id: string
  author?: string
  title: string
  year?: string
  url?: string
  publisher?: string
  accessDate?: string
}

export interface WikiArticle {
  slug: string
  title: string
  description: string
  lastUpdated: string
  category: string
  articleType: 'imam' | 'mosque' | 'quran_teacher' | 'mourshida'
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
  // Contact info (all types)
  phone?: string
  email?: string
  whatsapp?: string
  facebook?: string
  youtubeChannel?: string
  // Author
  authorName?: string
  authorEmail?: string
  // Imam-specific (also used by quran_teacher & mourshida)
  birthDate?: string
  deathDate?: string
  isAlive?: boolean
  rank?: string
  ranks?: RankEntry[]
  mosquesServed?: MosqueReference[]
  customFields?: CustomField[]
  // Mosque-specific
  mosqueType?: string
  dateBuilt?: string
  founders?: Founder[]
  imamsServed?: ImamReference[]
  prayerHallArea?: string
  prayerHallCapacity?: string
  minaretHeight?: string
  totalArea?: string
  otherFacilities?: string
  customMosqueFields?: CustomField[]
  // New mosque fields
  website?: string
  dateInauguration?: string
  mosqueGallery?: string[]
  currentImam?: string
  currentCouncil?: string
  // References/Citations
  references?: Reference[]
}

export interface WikiMetadata {
  slug: string
  title: string
  description: string
  category: string
  lastUpdated: string
  articleType: 'imam' | 'mosque' | 'quran_teacher' | 'mourshida'
  wilaya?: string
  commune?: string
  authorName?: string
  imageSrc?: string
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

// Helper to map a Supabase row to WikiArticle
function rowToArticle(row: any): WikiArticle {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description || '',
    lastUpdated: row.last_updated || '',
    category: row.category || '',
    articleType: row.article_type as WikiArticle['articleType'],
    content: parseWikiLinks(row.content || ''),
    rawContent: row.content || '',
    wilaya: row.wilaya || undefined,
    commune: row.commune || undefined,
    wilayaCode: row.wilaya_code || undefined,
    image: row.image_src ? { src: row.image_src, caption: row.image_caption || '' } : undefined,
    youtubeVideos: row.youtube_videos?.length ? row.youtube_videos : undefined,
    // Contact info
    phone: row.phone || undefined,
    email: row.email || undefined,
    whatsapp: row.whatsapp || undefined,
    facebook: row.facebook || undefined,
    youtubeChannel: row.youtube_channel || undefined,
    // Author
    authorName: row.author_name || undefined,
    authorEmail: row.author_email || undefined,
    // Imam fields
    birthDate: row.birth_date || undefined,
    deathDate: row.death_date || undefined,
    isAlive: row.is_alive ?? undefined,
    rank: row.rank || undefined,
    ranks: row.ranks?.length ? row.ranks : undefined,
    mosquesServed: row.mosques_served?.length ? row.mosques_served : undefined,
    customFields: row.custom_fields?.length ? row.custom_fields : undefined,
    // Mosque fields
    mosqueType: row.mosque_type || undefined,
    dateBuilt: row.date_built || undefined,
    founders: row.founders?.length ? row.founders : undefined,
    imamsServed: row.imams_served?.length ? row.imams_served : undefined,
    prayerHallArea: row.prayer_hall_area || undefined,
    prayerHallCapacity: row.prayer_hall_capacity || undefined,
    minaretHeight: row.minaret_height || undefined,
    totalArea: row.total_area || undefined,
    otherFacilities: row.other_facilities || undefined,
    customMosqueFields: row.custom_mosque_fields?.length ? row.custom_mosque_fields : undefined,
    // New fields
    website: row.website || undefined,
    dateInauguration: row.date_inauguration || undefined,
    mosqueGallery: row.mosque_gallery?.length ? row.mosque_gallery : undefined,
    currentImam: row.current_imam || undefined,
    currentCouncil: row.current_council || undefined,
    references: row.references?.length ? row.references : undefined,
  }
}

// Helper to map a Supabase row to WikiMetadata
function rowToMetadata(row: any): WikiMetadata {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description || '',
    category: row.category || '',
    articleType: row.article_type as WikiMetadata['articleType'],
    wilaya: row.wilaya || undefined,
    commune: row.commune || undefined,
    lastUpdated: row.last_updated || '',
    authorName: row.author_name || undefined,
    imageSrc: row.image_src || undefined,
  }
}

const METADATA_COLUMNS = 'slug, title, description, category, article_type, wilaya, commune, last_updated, author_name, image_src'

/**
 * Check if an article exists by slug
 */
export async function checkArticleExists(slug: string): Promise<boolean> {
  try {
    const decodedSlug = decodeURIComponent(slug)
    const { data, error } = await supabase
      .from('articles')
      .select('slug')
      .eq('slug', decodedSlug)
      .maybeSingle()

    if (error) return false
    return !!data
  } catch {
    return false
  }
}

/**
 * Get all wiki article slugs
 */
export async function getAllWikiSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('slug')

  if (error || !data) return []
  return data.map((row: any) => row.slug)
}

/**
 * Get metadata for all articles
 */
export async function getAllWikiMetadata(): Promise<WikiMetadata[]> {
  const { data, error } = await supabase
    .from('articles')
    .select(METADATA_COLUMNS)

  if (error || !data) return []
  return data.map(rowToMetadata)
}

/**
 * Get all imam articles
 */
export async function getImams(): Promise<WikiMetadata[]> {
  const { data, error } = await supabase
    .from('articles')
    .select(METADATA_COLUMNS)
    .eq('article_type', 'imam')

  if (error || !data) return []
  return data.map(rowToMetadata)
}

/**
 * Get all mosque articles
 */
export async function getMosques(): Promise<WikiMetadata[]> {
  const { data, error } = await supabase
    .from('articles')
    .select(METADATA_COLUMNS)
    .eq('article_type', 'mosque')

  if (error || !data) return []
  return data.map(rowToMetadata)
}

/**
 * Get all quran teacher articles
 */
export async function getQuranTeachers(): Promise<WikiMetadata[]> {
  const { data, error } = await supabase
    .from('articles')
    .select(METADATA_COLUMNS)
    .eq('article_type', 'quran_teacher')

  if (error || !data) return []
  return data.map(rowToMetadata)
}

/**
 * Get all mourshida articles
 */
export async function getMourshibat(): Promise<WikiMetadata[]> {
  const { data, error } = await supabase
    .from('articles')
    .select(METADATA_COLUMNS)
    .eq('article_type', 'mourshida')

  if (error || !data) return []
  return data.map(rowToMetadata)
}

/**
 * Get articles by wilaya
 */
export async function getArticlesByWilaya(wilaya: string): Promise<WikiMetadata[]> {
  const { data, error } = await supabase
    .from('articles')
    .select(METADATA_COLUMNS)
    .eq('wilaya', wilaya)

  if (error || !data) return []
  return data.map(rowToMetadata)
}

/**
 * Get all unique wilayas that have articles
 */
export async function getWilayasWithArticles(): Promise<string[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('wilaya')
    .not('wilaya', 'is', null)

  if (error || !data) return []
  const wilayas = new Set<string>()
  data.forEach((row: any) => {
    if (row.wilaya) wilayas.add(row.wilaya)
  })
  return Array.from(wilayas).sort()
}

/**
 * Get a single wiki article by slug
 */
export async function getWikiArticle(slug: string): Promise<WikiArticle | null> {
  try {
    const decodedSlug = decodeURIComponent(slug)
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', decodedSlug)
      .maybeSingle()

    if (error || !data) return null
    return rowToArticle(data)
  } catch (error) {
    console.error(`Error loading article ${slug}:`, error)
    return null
  }
}

/**
 * Search articles by query
 */
export async function searchArticles(query: string): Promise<WikiMetadata[]> {
  const { data, error } = await supabase
    .from('articles')
    .select(METADATA_COLUMNS)
    .or(`title.ilike.%${query}%,description.ilike.%${query}%,wilaya.ilike.%${query}%`)

  if (error || !data) return []
  return data.map(rowToMetadata)
}
