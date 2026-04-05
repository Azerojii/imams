import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      title, description, category, content, submitterName, submitterEmail,
      articleType, wilaya, commune, wilayaCode, image, youtubeVideos,
      birthDate, deathDate, isAlive, rank, ranks, mosquesServed, customFields,
      mosqueType, dateBuilt, founders, imamsServed,
      prayerHallArea, prayerHallCapacity, minaretHeight, totalArea, otherFacilities, customMosqueFields,
      phone, email, whatsapp, facebook, youtubeChannel,
      currentImam, currentCouncil,
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
      category: category || 'أئمة',
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

    // Contact info
    if (phone) row.phone = phone
    if (email) row.email = email
    if (whatsapp) row.whatsapp = whatsapp
    if (facebook) row.facebook = facebook
    if (youtubeChannel) row.youtube_channel = youtubeChannel

    if (articleType === 'imam' || articleType === 'quran_teacher' || articleType === 'mourshida') {
      if (birthDate) row.birth_date = birthDate
      if (deathDate) row.death_date = deathDate
      if (isAlive !== undefined) row.is_alive = isAlive
      if (rank) row.rank = rank
      if (ranks?.length) row.ranks = ranks
      if (mosquesServed?.length) row.mosques_served = mosquesServed
      if (customFields?.length) row.custom_fields = customFields
    }

    if (articleType === 'mosque') {
      if (mosqueType) row.mosque_type = mosqueType
      if (dateBuilt) row.date_built = dateBuilt
      if (founders?.length) row.founders = founders
      if (imamsServed?.length) row.imams_served = imamsServed
      if (prayerHallArea) row.prayer_hall_area = prayerHallArea
      if (prayerHallCapacity) row.prayer_hall_capacity = prayerHallCapacity
      if (minaretHeight) row.minaret_height = minaretHeight
      if (totalArea) row.total_area = totalArea
      if (otherFacilities) row.other_facilities = otherFacilities
      if (customMosqueFields?.length) row.custom_mosque_fields = customMosqueFields
      if (currentImam) row.current_imam = currentImam
      if (currentCouncil) row.current_council = currentCouncil
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
