import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { slug, articleTitle, suggestedBy, suggestedByEmail, description, newContent } = body

    if (!slug || !suggestedBy || !suggestedByEmail || !description) {
      return NextResponse.json(
        { error: 'جميع الحقول المطلوبة يجب ملؤها' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('edit_suggestions')
      .insert({
        article_slug: slug,
        article_title: articleTitle,
        suggested_by: suggestedBy,
        suggested_by_email: suggestedByEmail,
        description,
        new_content: newContent || null,
        status: 'pending',
      })

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { error: 'فشل في حفظ الاقتراح' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error creating edit suggestion:', error)
    return NextResponse.json(
      { error: 'فشل في إرسال الاقتراح' },
      { status: 500 }
    )
  }
}
