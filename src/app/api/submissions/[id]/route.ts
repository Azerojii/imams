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
      mosquesServed: data.mosques_served,
      dateBuilt: data.date_built,
      imamsServed: data.imams_served,
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

    // Fetch the submission
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

      // Insert into articles table
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
        mosques_served: submission.mosques_served || [],
        date_built: submission.date_built,
        imams_served: submission.imams_served || [],
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

      // Mark submission as approved
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
