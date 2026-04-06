-- Migration v6: add configurable dua limit and mosque association fields

ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS dua_character_limit INTEGER NOT NULL DEFAULT 250;

UPDATE site_settings
SET dua_character_limit = COALESCE(dua_character_limit, 250)
WHERE key = 'global';

ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS current_association TEXT,
  ADD COLUMN IF NOT EXISTS association_members TEXT;

ALTER TABLE submissions
  ADD COLUMN IF NOT EXISTS current_association TEXT,
  ADD COLUMN IF NOT EXISTS association_members TEXT;
