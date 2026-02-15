import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('id, title, description, category, article_type, submitted_at, submitter_name, submitter_email, status')
      .eq('status', 'pending')
      .order('submitted_at', { ascending: false })

    if (error) {
      console.error('Error fetching submissions:', error)
      return NextResponse.json({ error: 'فشل في جلب المقالات المعلقة' }, { status: 500 })
    }

    const submissions = (data || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      articleType: row.article_type,
      submittedAt: row.submitted_at,
      submitterName: row.submitter_name,
      submitterEmail: row.submitter_email,
    }))

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
      birthDate, deathDate, isAlive, mosquesServed, customFields,
      mosqueType, dateBuilt, imamsServed,
    } = body

    if (!title || !content || !submitterName || !submitterEmail) {
      return NextResponse.json(
        { error: 'العنوان والمحتوى والاسم والبريد الإلكتروني مطلوبون' },
        { status: 400 }
      )
    }

    const slug = title.trim().replace(/\s+/g, '_')

    const row: Record<string, unknown> = {
      slug,
      title,
      description: description || '',
      content,
      category: category || (articleType === 'imam' ? 'أئمة' : 'مساجد'),
      article_type: articleType || 'imam',
      submitter_name: submitterName,
      submitter_email: submitterEmail,
      status: 'pending',
    }

    if (wilaya) row.wilaya = wilaya
    if (commune) row.commune = commune
    if (wilayaCode) row.wilaya_code = wilayaCode
    if (image) {
      row.image_src = image.src
      row.image_caption = image.caption
    }
    if (youtubeVideos?.length) row.youtube_videos = youtubeVideos

    if (articleType === 'imam') {
      if (birthDate) row.birth_date = birthDate
      if (deathDate) row.death_date = deathDate
      if (isAlive !== undefined) row.is_alive = isAlive
      if (mosquesServed?.length) row.mosques_served = mosquesServed
      if (customFields?.length) row.custom_fields = customFields
    }

    if (articleType === 'mosque') {
      if (mosqueType) row.mosque_type = mosqueType
      if (dateBuilt) row.date_built = dateBuilt
      if (imamsServed?.length) row.imams_served = imamsServed
    }

    const { data, error } = await supabase
      .from('submissions')
      .insert(row)
      .select('id')
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { error: 'فشل في حفظ المقال' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, id: data.id })
  } catch (error) {
    console.error('Error creating submission:', error)
    return NextResponse.json(
      { error: `فشل في تقديم المقال: ${error instanceof Error ? error.message : 'خطأ غير معروف'}` },
      { status: 500 }
    )
  }
}
