import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      title, description, category, content, articleType,
      wilaya, commune, wilayaCode, image, youtubeVideos,
      birthDate, deathDate, isAlive, mosquesServed,
      dateBuilt, imamsServed,
    } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'العنوان والمحتوى مطلوبان' },
        { status: 400 }
      )
    }

    const slug = title.trim().replace(/\s+/g, '_')

    // Check if article already exists
    const { data: existing } = await supabase
      .from('articles')
      .select('slug')
      .eq('slug', slug)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'المقال موجود مسبقاً' },
        { status: 409 }
      )
    }

    const row: Record<string, unknown> = {
      slug,
      title,
      description: description || '',
      content,
      category: category || (articleType === 'imam' ? 'أئمة' : 'مساجد'),
      article_type: articleType || 'imam',
      last_updated: new Date().toISOString().split('T')[0],
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
    }

    if (articleType === 'mosque') {
      if (dateBuilt) row.date_built = dateBuilt
      if (imamsServed?.length) row.imams_served = imamsServed
    }

    const { error } = await supabase.from('articles').insert(row)

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { error: 'فشل في إنشاء المقال' },
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
