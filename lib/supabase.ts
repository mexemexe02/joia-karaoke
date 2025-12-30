import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Song {
  id: string
  title: string
  artist: string
  language: string
  type: 'youtube' | 'local'
  source_url: string
  duration: number | null
  key: string | null
  tempo: number | null
  duet: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Tag {
  id: string
  name: string
  color: string
}

// Helper function to extract YouTube video ID
export function extractYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : null
}

// Helper function to get YouTube thumbnail
export function getYouTubeThumbnail(url: string): string {
  const videoId = extractYouTubeId(url)
  if (!videoId) return ''
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}


