import { NextResponse } from 'next/server'
import matter from 'gray-matter'
import { createOrUpdateGitHubFile, fileExistsOnGitHub } from '@/lib/github'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      title, description, category, content, articleType,
      wilaya, commune, wilayaCode, image, youtubeVideos,
      // Imam fields
      birthDate, deathDate, isAlive, mosquesServed,
      // Mosque fields
      dateBuilt, imamsServed,
    } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'العنوان والمحتوى مطلوبان' },
        { status: 400 }
      )
    }

    const slug = title.trim().replace(/\s+/g, '_')
    const filePath = `content/wiki/${slug}.md`

    const exists = await fileExistsOnGitHub(filePath)
    if (exists) {
      return NextResponse.json(
        { error: 'المقال موجود مسبقاً' },
        { status: 409 }
      )
    }

    const frontmatter: Record<string, unknown> = {
      title,
      description: description || '',
      lastUpdated: new Date().toISOString().split('T')[0],
      category: category || (articleType === 'imam' ? 'أئمة' : 'مساجد'),
      articleType: articleType || 'imam',
    }

    // Shared fields
    if (wilaya) frontmatter.wilaya = wilaya
    if (commune) frontmatter.commune = commune
    if (wilayaCode) frontmatter.wilayaCode = wilayaCode
    if (image) frontmatter.image = image
    if (youtubeVideos && youtubeVideos.length > 0) frontmatter.youtubeVideos = youtubeVideos

    // Imam fields
    if (articleType === 'imam') {
      if (birthDate) frontmatter.birthDate = birthDate
      if (deathDate) frontmatter.deathDate = deathDate
      if (isAlive !== undefined) frontmatter.isAlive = isAlive
      if (mosquesServed && mosquesServed.length > 0) frontmatter.mosquesServed = mosquesServed
    }

    // Mosque fields
    if (articleType === 'mosque') {
      if (dateBuilt) frontmatter.dateBuilt = dateBuilt
      if (imamsServed && imamsServed.length > 0) frontmatter.imamsServed = imamsServed
    }

    const fileContent = matter.stringify(content, frontmatter)

    const result = await createOrUpdateGitHubFile(
      filePath,
      fileContent,
      `إنشاء مقال: ${title}`
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'فشل في إنشاء المقال' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, slug })
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: 'فشل في إنشاء المقال' },
      { status: 500 }
    )
  }
}
