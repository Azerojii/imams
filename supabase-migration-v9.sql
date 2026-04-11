-- Migration v9: add original_content to edit_suggestions, mosque_engineer and historical_period to articles/submissions

ALTER TABLE edit_suggestions
  ADD COLUMN IF NOT EXISTS original_content TEXT;

ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS mosque_engineer TEXT,
  ADD COLUMN IF NOT EXISTS historical_period TEXT;

ALTER TABLE submissions
  ADD COLUMN IF NOT EXISTS mosque_engineer TEXT,
  ADD COLUMN IF NOT EXISTS historical_period TEXT;
