-- Migration v4: Add current_imam and current_council columns to mosque articles

ALTER TABLE articles ADD COLUMN IF NOT EXISTS current_imam TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS current_council TEXT;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS current_imam TEXT;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS current_council TEXT;
