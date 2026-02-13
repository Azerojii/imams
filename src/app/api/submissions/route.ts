import { NextResponse } from 'next/server'
import { createOrUpdateGitHubFile } from '@/lib/github'
import matter from 'gray-matter'
import fs from 'fs'
import path from 'path'

const pendingDirectory = path.join(process.cwd(), 'content/pending')

export async function GET() {
  try {
    if (!fs.existsSync(pendingDirectory)) {
      fs.mkdirSync(pendingDirectory, { recursive: true })
      return NextResponse.json({ submissions: [] })
    }

    const files = fs.readdirSync(pendingDirectory)
    const submissions = files
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const fullPath = path.join(pendingDirectory, file)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data } = matter(fileContents)

        return {
          id: file.replace('.md', ''),
          title: data.title,
          description: data.description,
          category: data.category,
          articleType: data.articleType,
          submittedAt: data.submittedAt,
          submitterName: data.submitterName,
          submitterEmail: data.submitterEmail,
        }
      })
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())

    return NextResponse.json({ submissions })
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json({ error: 'فشل في جلب المقالات المعلقة' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      title, description, category, content, submitterName, submitterEmail,
      articleType, wilaya, commune, wilayaCode, image, youtubeVideos,
      birthDate, deathDate, isAlive, mosquesServed,
      dateBuilt, imamsServed,
    } = body

    if (!title || !content || !submitterName || !submitterEmail) {
      return NextResponse.json(
        { error: 'العنوان والمحتوى والاسم والبريد الإلكتروني مطلوبون' },
        { status: 400 }
      )
    }

    const timestamp = Date.now()
    const slug = title.trim().replace(/\s+/g, '_')
    const id = `${timestamp}_${slug}`
    const fileName = `${id}.md`
    const filePath = `content/pending/${fileName}`

    const frontmatter: Record<string, unknown> = {
      title,
      description: description || '',
      category: category || (articleType === 'imam' ? 'أئمة' : 'مساجد'),
      articleType: articleType || 'imam',
      submittedAt: new Date().toISOString(),
      submitterName,
      submitterEmail,
      status: 'pending',
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
      `تقديم جديد: ${title}`
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'فشل في حفظ المقال' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('Error creating submission:', error)
    return NextResponse.json(
      { error: `فشل في تقديم المقال: ${error instanceof Error ? error.message : 'خطأ غير معروف'}` },
      { status: 500 }
    )
  }
}
