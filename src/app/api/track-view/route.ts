import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { headers } from 'next/headers'

// Country name map for common codes
const COUNTRY_NAMES: Record<string, string> = {
  DZ: 'الجزائر',
  FR: 'فرنسا',
  MA: 'المغرب',
  TN: 'تونس',
  EG: 'مصر',
  SA: 'السعودية',
  AE: 'الإمارات',
  QA: 'قطر',
  KW: 'الكويت',
  LY: 'ليبيا',
  MR: 'موريتانيا',
  SD: 'السودان',
  TR: 'تركيا',
  DE: 'ألمانيا',
  GB: 'بريطانيا',
  US: 'الولايات المتحدة',
  CA: 'كندا',
  BE: 'بلجيكا',
  NL: 'هولندا',
  IT: 'إيطاليا',
  ES: 'إسبانيا',
}

export async function POST(request: Request) {
  try {
    const { slug } = await request.json()
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
    }

    const headersList = await headers()

    // Get country from Vercel/Cloudflare geo headers
    const countryCode =
      headersList.get('x-vercel-ip-country') ||
      headersList.get('cf-ipcountry') ||
      'XX'

    const countryName = COUNTRY_NAMES[countryCode] || countryCode

    // Upsert: increment view_count for (slug, country_code)
    const { error } = await supabase.rpc('increment_view_count', {
      p_slug: slug,
      p_country_code: countryCode,
      p_country_name: countryName,
    })

    if (error) {
      // Fallback: manual upsert if RPC not available
      const { data: existing } = await supabase
        .from('article_view_counts')
        .select('view_count')
        .eq('slug', slug)
        .eq('country_code', countryCode)
        .maybeSingle()

      if (existing) {
        await supabase
          .from('article_view_counts')
          .update({ view_count: (existing.view_count as number) + 1 })
          .eq('slug', slug)
          .eq('country_code', countryCode)
      } else {
        await supabase.from('article_view_counts').insert({
          slug,
          country_code: countryCode,
          country_name: countryName,
          view_count: 1,
        })
      }
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
