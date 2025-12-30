'use client'

import { useEffect, useState } from 'react'
import { supabase, Song } from '@/lib/supabase'
import SongCard from '@/components/SongCard'
import SearchBar from '@/components/SearchBar'
import FilterBar from '@/components/FilterBar'
import AddSongButton from '@/components/AddSongButton'

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([])
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [languageFilter, setLanguageFilter] = useState<string>('all')
  const [duetFilter, setDuetFilter] = useState<string>('all')

  useEffect(() => {
    // No authentication required - app is open to everyone
    fetchSongs()
  }, [])

  useEffect(() => {
    filterSongs()
  }, [songs, searchQuery, languageFilter, duetFilter])

  const fetchSongs = async () => {
    try {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .order('artist', { ascending: true })
        .order('title', { ascending: true })

      if (error) throw error
      setSongs(data || [])
    } catch (error) {
      console.error('Error fetching songs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterSongs = () => {
    let filtered = [...songs]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (song) =>
          song.title.toLowerCase().includes(query) ||
          song.artist.toLowerCase().includes(query)
      )
    }

    // Language filter
    if (languageFilter !== 'all') {
      filtered = filtered.filter((song) => song.language === languageFilter)
    }

    // Duet filter
    if (duetFilter !== 'all') {
      const isDuet = duetFilter === 'yes'
      filtered = filtered.filter((song) => song.duet === isDuet)
    }

    setFilteredSongs(filtered)
  }

  const handlePlay = (song: Song) => {
    // Open YouTube or local URL
    window.open(song.source_url, '_blank')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl">Loading your karaoke library...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-6xl font-bold text-white mb-2">🎤 Joia Karaoke</h1>
          <p className="text-xl text-gray-300">Your shared karaoke library</p>
        </div>

        {/* Controls */}
        <div className="mb-8 space-y-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <div className="flex gap-4 items-center justify-between">
            <FilterBar
              languageFilter={languageFilter}
              duetFilter={duetFilter}
              onLanguageChange={setLanguageFilter}
              onDuetChange={setDuetFilter}
              songs={songs}
            />
            <AddSongButton onSongAdded={fetchSongs} />
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 text-gray-300">
          Showing {filteredSongs.length} of {songs.length} songs
        </div>

        {/* Song Grid */}
        {filteredSongs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-2xl text-gray-400 mb-4">
              {searchQuery || languageFilter !== 'all' || duetFilter !== 'all'
                ? 'No songs match your filters'
                : 'No songs yet. Add your first karaoke song!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSongs.map((song) => (
              <SongCard key={song.id} song={song} onPlay={handlePlay} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


