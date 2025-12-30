-- Joia Karaoke Database Schema
-- This schema supports both YouTube links (Phase A) and local Jellyfin URLs (Phase B)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Songs table - the core catalog
CREATE TABLE IF NOT EXISTS songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  language TEXT DEFAULT 'en',
  type TEXT NOT NULL CHECK (type IN ('youtube', 'local')),
  source_url TEXT NOT NULL,
  duration INTEGER, -- in seconds
  key TEXT, -- musical key (e.g., "C", "Am", "F#m")
  tempo INTEGER, -- BPM
  duet BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for fast searching
CREATE INDEX IF NOT EXISTS idx_songs_artist ON songs(artist);
CREATE INDEX IF NOT EXISTS idx_songs_title ON songs(title);
CREATE INDEX IF NOT EXISTS idx_songs_language ON songs(language);
CREATE INDEX IF NOT EXISTS idx_songs_type ON songs(type);
CREATE INDEX IF NOT EXISTS idx_songs_duet ON songs(duet);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_songs_search ON songs USING gin(to_tsvector('english', title || ' ' || artist));

-- Tags table for genres, moods, etc.
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#ef4444'
);

-- Song tags junction table
CREATE TABLE IF NOT EXISTS song_tags (
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (song_id, tag_id)
);

-- Users table (for sharing with cousin)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_songs_updated_at BEFORE UPDATE ON songs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE song_tags ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read songs
CREATE POLICY "Anyone can read songs" ON songs
  FOR SELECT USING (true);

-- Allow authenticated users to insert songs
CREATE POLICY "Authenticated users can insert songs" ON songs
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to update songs
CREATE POLICY "Authenticated users can update songs" ON songs
  FOR UPDATE USING (true);

-- Allow authenticated users to delete songs
CREATE POLICY "Authenticated users can delete songs" ON songs
  FOR DELETE USING (true);

-- Similar policies for tags
CREATE POLICY "Anyone can read tags" ON tags
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage tags" ON tags
  FOR ALL USING (true);

CREATE POLICY "Anyone can read song_tags" ON song_tags
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage song_tags" ON song_tags
  FOR ALL USING (true);


