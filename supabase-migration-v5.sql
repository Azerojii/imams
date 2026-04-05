-- Migration v5: Add global site settings for footer and contact page content

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  footer_text TEXT,
  contact_intro TEXT,
  contact_links JSONB NOT NULL DEFAULT '[]'::jsonb,
  website_links JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO site_settings (key, footer_text, contact_intro, contact_links, website_links)
VALUES (
  'global',
  'جميع الحقوق محفوظة © 2026',
  'يمكنكم التواصل معنا أو زيارة الروابط الرسمية التالية.',
  '[]'::jsonb,
  '[]'::jsonb
)
ON CONFLICT (key) DO NOTHING;
