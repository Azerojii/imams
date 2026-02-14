import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getWikiArticle } from '@/lib/wiki'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const decodedSlug = decodeURIComponent(slug)
    const article = await getWikiArticle(decodedSlug)

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error('Error fetching article:', error)
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
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
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    const { slug } = await params
    const decodedSlug = decodeURIComponent(slug)

    // Check if article exists
    const { data: existing } = await supabase
      .from('articles')
      .select('slug')
      .eq('slug', decodedSlug)
      .maybeSingle()

    if (!existing) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    const updates: Record<string, unknown> = {
      title,
      description: description || '',
      content,
      category: category || '',
      last_updated: new Date().toISOString().split('T')[0],
    }

    if (articleType) updates.article_type = articleType
    if (wilaya !== undefined) updates.wilaya = wilaya || null
    if (commune !== undefined) updates.commune = commune || null
    if (wilayaCode !== undefined) updates.wilaya_code = wilayaCode || null
    if (image) {
      updates.image_src = image.src
      updates.image_caption = image.caption
    }
    if (youtubeVideos !== undefined) updates.youtube_videos = youtubeVideos || []

    if (birthDate !== undefined) updates.birth_date = birthDate || null
    if (deathDate !== undefined) updates.death_date = deathDate || null
    if (isAlive !== undefined) updates.is_alive = isAlive
    if (mosquesServed !== undefined) updates.mosques_served = mosquesServed || []
    if (dateBuilt !== undefined) updates.date_built = dateBuilt || null
    if (imamsServed !== undefined) updates.imams_served = imamsServed || []

    const { error } = await supabase
      .from('articles')
      .update(updates)
      .eq('slug', decodedSlug)

    if (error) {
      console.error('Supabase update error:', error)
      return NextResponse.json(
        { error: 'Failed to update article' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      slug: decodedSlug,
      message: 'Article updated successfully'
    })
  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const decodedSlug = decodeURIComponent(slug)

    const { data: existing } = await supabase
      .from('articles')
      .select('slug')
      .eq('slug', decodedSlug)
      .maybeSingle()

    if (!existing) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('slug', decodedSlug)

    if (error) {
      console.error('Supabase delete error:', error)
      return NextResponse.json(
        { error: 'Failed to delete article' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Article deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    )
  }
}
