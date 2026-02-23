import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

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

    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error || !data) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
      articleType: data.article_type,
      content: data.content,
      wilaya: data.wilaya,
      commune: data.commune,
      wilayaCode: data.wilaya_code,
      image: data.image_src ? { src: data.image_src, caption: data.image_caption || '' } : undefined,
      youtubeVideos: data.youtube_videos,
      birthDate: data.birth_date,
      deathDate: data.death_date,
      isAlive: data.is_alive,
      rank: data.rank,
      ranks: data.ranks,
      mosquesServed: data.mosques_served,
      customFields: data.custom_fields,
      mosqueType: data.mosque_type,
      dateBuilt: data.date_built,
      founders: data.founders,
      imamsServed: data.imams_served,
      prayerHallArea: data.prayer_hall_area,
      prayerHallCapacity: data.prayer_hall_capacity,
      minaretHeight: data.minaret_height,
      totalArea: data.total_area,
      otherFacilities: data.other_facilities,
      customMosqueFields: data.custom_mosque_fields,
      phone: data.phone,
      email: data.email,
      whatsapp: data.whatsapp,
      facebook: data.facebook,
      youtubeChannel: data.youtube_channel,
      submitterName: data.submitter_name,
      submitterEmail: data.submitter_email,
      submittedAt: data.submitted_at,
      status: data.status,
    })
  } catch (error) {
    console.error('Error fetching submission:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submission' },
      { status: 500 }
    )
  }
}

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
    const { action } = body

    const { id } = await params

    const { data: submission, error: fetchError } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (fetchError || !submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    if (action === 'approve') {
      const slug = submission.title.trim().replace(/\s+/g, '_')

      const articleRow: Record<string, unknown> = {
        slug,
        title: submission.title,
        description: submission.description || '',
        content: submission.content || '',
        category: submission.category || '',
        article_type: submission.article_type,
        wilaya: submission.wilaya,
        commune: submission.commune,
        wilaya_code: submission.wilaya_code,
        image_src: submission.image_src,
        image_caption: submission.image_caption,
        youtube_videos: submission.youtube_videos || [],
        birth_date: submission.birth_date,
        death_date: submission.death_date,
        is_alive: submission.is_alive,
        rank: submission.rank,
        ranks: submission.ranks || [],
        mosques_served: submission.mosques_served || [],
        custom_fields: submission.custom_fields || [],
        mosque_type: submission.mosque_type,
        date_built: submission.date_built,
        founders: submission.founders || [],
        imams_served: submission.imams_served || [],
        prayer_hall_area: submission.prayer_hall_area,
        prayer_hall_capacity: submission.prayer_hall_capacity,
        minaret_height: submission.minaret_height,
        total_area: submission.total_area,
        other_facilities: submission.other_facilities,
        custom_mosque_fields: submission.custom_mosque_fields || [],
        phone: submission.phone,
        email: submission.email,
        whatsapp: submission.whatsapp,
        facebook: submission.facebook,
        youtube_channel: submission.youtube_channel,
        // Copy submitter as author
        author_name: submission.submitter_name,
        author_email: submission.submitter_email,
        last_updated: new Date().toISOString().split('T')[0],
      }

      const { error: insertError } = await supabase.from('articles').insert(articleRow)

      if (insertError) {
        console.error('Error publishing article:', insertError)
        return NextResponse.json(
          { error: 'Failed to publish article' },
          { status: 500 }
        )
      }

      await supabase
        .from('submissions')
        .update({ status: 'approved' })
        .eq('id', id)

      return NextResponse.json({
        success: true,
        slug,
        message: 'Article approuvé et publié'
      })
    } else if (action === 'reject') {
      await supabase
        .from('submissions')
        .update({ status: 'rejected' })
        .eq('id', id)

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
