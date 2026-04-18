-- Migration v11: bank info for mosques + article view counts

-- Bank information for mosque articles
ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS bank_account_name TEXT,
  ADD COLUMN IF NOT EXISTS bank_account_number TEXT,
  ADD COLUMN IF NOT EXISTS bank_name TEXT;

ALTER TABLE submissions
  ADD COLUMN IF NOT EXISTS bank_account_name TEXT,
  ADD COLUMN IF NOT EXISTS bank_account_number TEXT,
  ADD COLUMN IF NOT EXISTS bank_name TEXT;

-- Article view counts (per article, per country)
CREATE TABLE IF NOT EXISTS article_view_counts (
  slug TEXT NOT NULL,
  country_code TEXT NOT NULL DEFAULT 'XX',
  country_name TEXT NOT NULL DEFAULT 'غير معروف',
  view_count BIGINT NOT NULL DEFAULT 0,
  PRIMARY KEY (slug, country_code)
);

CREATE INDEX IF NOT EXISTS idx_view_counts_slug ON article_view_counts (slug);
