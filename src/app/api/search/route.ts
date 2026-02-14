import { NextResponse } from 'next/server'
import { getAllWikiMetadata, searchArticles } from '@/lib/wiki'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (query) {
      const results = await searchArticles(query)
      return NextResponse.json({ results })
    }

    const articles = await getAllWikiMetadata()
    return NextResponse.json({ results: articles })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
  }
}
