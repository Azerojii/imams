-- Migration v7: add mosque workers field for mosque articles/submissions

ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS mosque_workers JSONB DEFAULT '[]'::jsonb;

ALTER TABLE submissions
  ADD COLUMN IF NOT EXISTS mosque_workers JSONB DEFAULT '[]'::jsonb;
