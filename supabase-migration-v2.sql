-- Migration V2: New article types, ranks, mosque details, contact info, author, edit suggestions
-- Run this in the Supabase SQL Editor after the initial migration

-- ============================================
-- Articles table: new columns
-- ============================================

-- Ranks array (replaces single rank text field)
ALTER TABLE articles ADD COLUMN IF NOT EXISTS ranks JSONB DEFAULT '[]';

-- Mosque detail fields
ALTER TABLE articles ADD COLUMN IF NOT EXISTS prayer_hall_area TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS prayer_hall_capacity TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS minaret_height TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS total_area TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS other_facilities TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS custom_mosque_fields JSONB DEFAULT '[]';

-- Contact info (all article types)
ALTER TABLE articles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS whatsapp TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS facebook TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS youtube_channel TEXT;

-- Author attribution
ALTER TABLE articles ADD COLUMN IF NOT EXISTS author_name TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS author_email TEXT;

-- Update article_type constraint to include new types
ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_article_type_check;
ALTER TABLE articles ADD CONSTRAINT articles_article_type_check
  CHECK (article_type IN ('imam', 'mosque', 'quran_teacher', 'mourshida'));

-- ============================================
-- Submissions table: mirror new columns
-- ============================================
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS ranks JSONB DEFAULT '[]';
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS prayer_hall_area TEXT;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS prayer_hall_capacity TEXT;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS minaret_height TEXT;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS total_area TEXT;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS other_facilities TEXT;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS custom_mosque_fields JSONB DEFAULT '[]';
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS whatsapp TEXT;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS facebook TEXT;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS youtube_channel TEXT;

ALTER TABLE submissions DROP CONSTRAINT IF EXISTS submissions_article_type_check;
ALTER TABLE submissions ADD CONSTRAINT submissions_article_type_check
  CHECK (article_type IN ('imam', 'mosque', 'quran_teacher', 'mourshida'));

-- ============================================
-- Edit suggestions table (public can suggest edits, admin reviews)
-- ============================================
CREATE TABLE IF NOT EXISTS edit_suggestions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_slug TEXT NOT NULL,
  article_title TEXT NOT NULL,
  suggested_by TEXT NOT NULL,
  suggested_by_email TEXT NOT NULL,
  description TEXT NOT NULL,
  new_content TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_edit_suggestions_status ON edit_suggestions (status);
CREATE INDEX IF NOT EXISTS idx_edit_suggestions_slug ON edit_suggestions (article_slug);

-- ============================================
-- Seed new categories
-- ============================================
INSERT INTO categories (name) VALUES ('معلمو قرآن'), ('مرشدات دينيات')
ON CONFLICT (name) DO NOTHING;
