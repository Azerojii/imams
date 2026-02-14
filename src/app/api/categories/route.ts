import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('name')
      .order('name')

    if (error) {
      console.error('Error fetching categories:', error)
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      )
    }

    const categories = (data || []).map((row: any) => row.name)
    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, category } = await request.json()

    if (!action || !category) {
      return NextResponse.json(
        { error: 'Action and category are required' },
        { status: 400 }
      )
    }

    if (action === 'add') {
      const { error } = await supabase
        .from('categories')
        .insert({ name: category })

      if (error) {
        if (error.code === '23505') {
          return NextResponse.json(
            { error: 'Category already exists' },
            { status: 400 }
          )
        }
        return NextResponse.json(
          { error: 'Failed to save categories' },
          { status: 500 }
        )
      }

      const { data: allCats } = await supabase.from('categories').select('name').order('name')
      const categories = (allCats || []).map((r: any) => r.name)
      return NextResponse.json({ success: true, categories })

    } else if (action === 'remove') {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('name', category)

      if (error) {
        return NextResponse.json(
          { error: 'Failed to save categories' },
          { status: 500 }
        )
      }

      const { data: allCats } = await supabase.from('categories').select('name').order('name')
      const categories = (allCats || []).map((r: any) => r.name)
      return NextResponse.json({ success: true, categories })

    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "add" or "remove"' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error managing categories:', error)
    return NextResponse.json(
      { error: 'Failed to manage categories' },
      { status: 500 }
    )
  }
}
