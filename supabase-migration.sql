-- Migration: File-based storage → Supabase
-- Run this in the Supabase SQL Editor

-- ============================================
-- Articles table
-- ============================================
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  content TEXT DEFAULT '',
  category TEXT DEFAULT '',
  article_type TEXT NOT NULL CHECK (article_type IN ('imam', 'mosque')),
  wilaya TEXT,
  commune TEXT,
  wilaya_code TEXT,
  image_src TEXT,
  image_caption TEXT,
  youtube_videos TEXT[] DEFAULT '{}',
  -- Imam-specific
  birth_date TEXT,
  death_date TEXT,
  is_alive BOOLEAN,
  mosques_served JSONB DEFAULT '[]',
  -- Mosque-specific
  date_built TEXT,
  imams_served JSONB DEFAULT '[]',
  last_updated DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast slug lookups
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles (slug);
-- Index for filtering by type
CREATE INDEX IF NOT EXISTS idx_articles_type ON articles (article_type);
-- Index for search
CREATE INDEX IF NOT EXISTS idx_articles_title ON articles USING gin (to_tsvector('simple', title));

-- ============================================
-- Submissions table
-- ============================================
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  content TEXT DEFAULT '',
  category TEXT DEFAULT '',
  article_type TEXT NOT NULL CHECK (article_type IN ('imam', 'mosque')),
  wilaya TEXT,
  commune TEXT,
  wilaya_code TEXT,
  image_src TEXT,
  image_caption TEXT,
  youtube_videos TEXT[] DEFAULT '{}',
  -- Imam-specific
  birth_date TEXT,
  death_date TEXT,
  is_alive BOOLEAN,
  mosques_served JSONB DEFAULT '[]',
  -- Mosque-specific
  date_built TEXT,
  imams_served JSONB DEFAULT '[]',
  -- Submission-specific
  submitter_name TEXT NOT NULL,
  submitter_email TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for filtering by status
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions (status);

-- ============================================
-- Categories table
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

-- Seed default categories
INSERT INTO categories (name) VALUES ('أئمة'), ('مساجد')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- Storage bucket for uploads
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to uploads
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'uploads');

-- Allow authenticated uploads (or use service role from API)
CREATE POLICY "Allow uploads" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'uploads');
