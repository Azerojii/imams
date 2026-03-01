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
      birthDate, deathDate, isAlive, rank, ranks, mosquesServed, customFields,
      mosqueType, dateBuilt, founders, imamsServed,
      prayerHallArea, prayerHallCapacity, minaretHeight, totalArea, otherFacilities, customMosqueFields,
      phone, email, whatsapp, facebook, youtubeChannel, website,
      dateInauguration, mosqueGallery,
      authorName,
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

    // Contact info
    if (phone !== undefined) updates.phone = phone || null
    if (email !== undefined) updates.email = email || null
    if (whatsapp !== undefined) updates.whatsapp = whatsapp || null
    if (facebook !== undefined) updates.facebook = facebook || null
    if (youtubeChannel !== undefined) updates.youtube_channel = youtubeChannel || null
    if (website !== undefined) updates.website = website || null

    // Imam-like fields
    if (birthDate !== undefined) updates.birth_date = birthDate || null
    if (deathDate !== undefined) updates.death_date = deathDate || null
    if (isAlive !== undefined) updates.is_alive = isAlive
    if (rank !== undefined) updates.rank = rank || null
    if (ranks !== undefined) updates.ranks = ranks || []
    if (mosquesServed !== undefined) updates.mosques_served = mosquesServed || []
    if (customFields !== undefined) updates.custom_fields = customFields || []

    // Mosque fields
    if (mosqueType !== undefined) updates.mosque_type = mosqueType || null
    if (dateBuilt !== undefined) updates.date_built = dateBuilt || null
    if (founders !== undefined) updates.founders = founders || []
    if (imamsServed !== undefined) updates.imams_served = imamsServed || []
    if (prayerHallArea !== undefined) updates.prayer_hall_area = prayerHallArea || null
    if (prayerHallCapacity !== undefined) updates.prayer_hall_capacity = prayerHallCapacity || null
    if (minaretHeight !== undefined) updates.minaret_height = minaretHeight || null
    if (totalArea !== undefined) updates.total_area = totalArea || null
    if (otherFacilities !== undefined) updates.other_facilities = otherFacilities || null
    if (customMosqueFields !== undefined) updates.custom_mosque_fields = customMosqueFields || []
    if (dateInauguration !== undefined) updates.date_inauguration = dateInauguration || null
    if (mosqueGallery !== undefined) updates.mosque_gallery = mosqueGallery || []

    // Author (editor name for last modification)
    if (authorName !== undefined) updates.author_name = authorName || null

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
