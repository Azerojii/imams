import { supabase } from './supabase'

export interface SiteFooterLink {
  id: string
  label: string
  value: string
  href: string
}

export interface SiteFooterSettings {
  footerText: string
  contactIntro: string
  contactLinks: SiteFooterLink[]
  websiteLinks: SiteFooterLink[]
}

const DEFAULT_SETTINGS: SiteFooterSettings = {
  footerText: 'جميع الحقوق محفوظة © 2026',
  contactIntro: 'يمكنكم التواصل معنا أو زيارة الروابط الرسمية التالية.',
  contactLinks: [],
  websiteLinks: [],
}

function normalizeLink(link: any, fallbackPrefix: string, index: number): SiteFooterLink {
  return {
    id: String(link?.id || `${fallbackPrefix}-${index}`),
    label: String(link?.label || ''),
    value: String(link?.value || ''),
    href: String(link?.href || ''),
  }
}

function normalizeSettings(row: any): SiteFooterSettings {
  if (!row) {
    return DEFAULT_SETTINGS
  }

  return {
    footerText: row.footer_text || DEFAULT_SETTINGS.footerText,
    contactIntro: row.contact_intro || DEFAULT_SETTINGS.contactIntro,
    contactLinks: Array.isArray(row.contact_links)
      ? row.contact_links.map((link: any, index: number) => normalizeLink(link, 'contact', index))
      : [],
    websiteLinks: Array.isArray(row.website_links)
      ? row.website_links.map((link: any, index: number) => normalizeLink(link, 'website', index))
      : [],
  }
}

export async function getSiteFooterSettings(): Promise<SiteFooterSettings> {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('footer_text, contact_intro, contact_links, website_links')
      .eq('key', 'global')
      .maybeSingle()

    if (error) {
      console.error('Error fetching site settings:', error)
      return DEFAULT_SETTINGS
    }

    return normalizeSettings(data)
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return DEFAULT_SETTINGS
  }
}

export function getDefaultSiteFooterSettings(): SiteFooterSettings {
  return DEFAULT_SETTINGS
}
