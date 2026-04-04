-- Migration v3: Add references (تهميش) column to articles and submissions

ALTER TABLE articles ADD COLUMN IF NOT EXISTS "references" JSONB DEFAULT '[]';
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS "references" JSONB DEFAULT '[]';
