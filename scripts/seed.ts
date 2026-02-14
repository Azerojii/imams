/**
 * Seed script: Migrate existing markdown articles from content/wiki/ into Supabase.
 *
 * Usage:
 *   npx tsx scripts/seed.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load .env.local
config({ path: path.join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Simple frontmatter parser (no gray-matter dependency needed)
function parseFrontmatter(fileContent: string): { data: Record<string, any>; content: string } {
  const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return { data: {}, content: fileContent }

  const yamlStr = match[1]
  const content = match[2]

  // Simple YAML parser for our known structure
  const data: Record<string, any> = {}
  let currentKey = ''
  let currentArray: any[] | null = null
  let currentObject: Record<string, any> | null = null

  for (const line of yamlStr.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    // Array item with object fields (like mosquesServed items)
    if (trimmed.startsWith('- name:') && currentKey) {
      if (!currentArray) currentArray = []
      currentObject = { name: trimmed.replace('- name:', '').trim().replace(/^"|"$/g, '') }
      currentArray.push(currentObject)
      continue
    }

    if (trimmed.startsWith('- ') && currentKey && !trimmed.includes(':')) {
      if (!currentArray) currentArray = []
      currentArray.push(trimmed.replace('- ', '').trim().replace(/^"|"$/g, ''))
      continue
    }

    // Sub-key of current object in array
    if (currentObject && line.startsWith('    ') && trimmed.includes(':')) {
      const [k, ...vParts] = trimmed.split(':')
      const v = vParts.join(':').trim().replace(/^"|"$/g, '')
      currentObject[k.trim()] = v
      continue
    }

    // Sub-key of current map (like image.src)
    if (currentKey && line.startsWith('  ') && trimmed.includes(':') && !trimmed.startsWith('-')) {
      const [k, ...vParts] = trimmed.split(':')
      const v = vParts.join(':').trim().replace(/^"|"$/g, '')
      if (typeof data[currentKey] !== 'object' || Array.isArray(data[currentKey])) {
        data[currentKey] = {}
      }
      data[currentKey][k.trim()] = v
      continue
    }

    // Save previous array
    if (currentArray && currentKey) {
      data[currentKey] = currentArray
      currentArray = null
      currentObject = null
    }

    // Top-level key
    const colonIdx = trimmed.indexOf(':')
    if (colonIdx > 0) {
      const key = trimmed.substring(0, colonIdx).trim()
      const value = trimmed.substring(colonIdx + 1).trim().replace(/^"|"$/g, '')

      if (value === '') {
        // Could be start of a nested object or array
        currentKey = key
        continue
      }

      // Parse booleans
      if (value === 'true') { data[key] = true; currentKey = key; continue }
      if (value === 'false') { data[key] = false; currentKey = key; continue }

      data[key] = value
      currentKey = key
    }
  }

  // Save last array if any
  if (currentArray && currentKey) {
    data[currentKey] = currentArray
  }

  return { data, content }
}

async function seed() {
  const wikiDir = path.join(process.cwd(), 'content', 'wiki')

  if (!fs.existsSync(wikiDir)) {
    console.log('No content/wiki/ directory found. Nothing to seed.')
    return
  }

  const files = fs.readdirSync(wikiDir).filter(f => f.endsWith('.md'))
  console.log(`Found ${files.length} articles to seed.`)

  for (const file of files) {
    const slug = file.replace('.md', '')
    const filePath = path.join(wikiDir, file)
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const { data, content } = parseFrontmatter(fileContent)

    const row: Record<string, any> = {
      slug,
      title: data.title || slug,
      description: data.description || '',
      content,
      category: data.category || '',
      article_type: data.articleType || 'imam',
      last_updated: data.lastUpdated || new Date().toISOString().split('T')[0],
    }

    if (data.wilaya) row.wilaya = data.wilaya
    if (data.commune) row.commune = data.commune
    if (data.wilayaCode) row.wilaya_code = data.wilayaCode
    if (data.image?.src) {
      row.image_src = data.image.src
      row.image_caption = data.image.caption || ''
    }
    if (data.youtubeVideos) row.youtube_videos = data.youtubeVideos
    if (data.birthDate) row.birth_date = data.birthDate
    if (data.deathDate) row.death_date = data.deathDate
    if (data.isAlive !== undefined) row.is_alive = data.isAlive
    if (data.mosquesServed) row.mosques_served = data.mosquesServed
    if (data.dateBuilt) row.date_built = data.dateBuilt
    if (data.imamsServed) row.imams_served = data.imamsServed

    const { error } = await supabase
      .from('articles')
      .upsert(row, { onConflict: 'slug' })

    if (error) {
      console.error(`Error seeding "${slug}":`, error.message)
    } else {
      console.log(`Seeded: ${slug}`)
    }
  }

  // Seed categories
  const categoriesPath = path.join(process.cwd(), 'content', 'categories.json')
  if (fs.existsSync(categoriesPath)) {
    const categories: string[] = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'))
    for (const name of categories) {
      await supabase.from('categories').upsert({ name }, { onConflict: 'name' })
    }
    console.log(`Seeded ${categories.length} categories.`)
  }

  console.log('Done!')
}

seed().catch(console.error)
