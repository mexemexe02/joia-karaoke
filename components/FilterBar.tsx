'use client'

import { Song } from '@/lib/supabase'
import { Filter } from 'lucide-react'

interface FilterBarProps {
  languageFilter: string
  duetFilter: string
  onLanguageChange: (value: string) => void
  onDuetChange: (value: string) => void
  songs: Song[]
}

export default function FilterBar({
  languageFilter,
  duetFilter,
  onLanguageChange,
  onDuetChange,
  songs,
}: FilterBarProps) {
  // Get unique languages from songs
  const languages = Array.from(new Set(songs.map((s) => s.language).filter(Boolean))).sort()

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex items-center gap-2 text-gray-300">
        <Filter className="w-5 h-5" />
        <span className="font-semibold">Filters:</span>
      </div>

      {/* Language Filter */}
      <select
        value={languageFilter}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="all">All Languages</option>
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {lang.toUpperCase()}
          </option>
        ))}
      </select>

      {/* Duet Filter */}
      <select
        value={duetFilter}
        onChange={(e) => onDuetChange(e.target.value)}
        className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="all">All Songs</option>
        <option value="yes">Duets Only</option>
        <option value="no">Solo Only</option>
      </select>
    </div>
  )
}


