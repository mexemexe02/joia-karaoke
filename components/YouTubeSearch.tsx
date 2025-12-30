'use client'

import { useState } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { extractYouTubeId, getYouTubeThumbnail } from '@/lib/supabase'
import Image from 'next/image'

interface YouTubeVideo {
  id: string
  title: string
  channelTitle: string
  thumbnail: string
  duration?: string
}

interface YouTubeSearchProps {
  onSelectVideo: (video: { url: string; title: string; artist: string }) => void
}

export default function YouTubeSearch({ onSelectVideo }: YouTubeSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<YouTubeVideo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const searchYouTube = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setError('')
    
    try {
      // Use YouTube's oEmbed API as a fallback, but for proper search we'd need Data API v3
      // For now, let's use a simple approach: search YouTube directly
      // Note: This requires YouTube Data API v3 for full functionality
      // For MVP, we'll use a workaround with YouTube's search URL
      
      // Since we don't have API key, we'll use a proxy approach or guide users
      // For now, let's create a simple solution that opens YouTube search
      // and allows manual selection
      
      // Alternative: Use YouTube iframe API (limited)
      // Or use a public API proxy service
      
      // For now, let's implement a solution that helps users find videos
      // and paste URLs, with future API integration ready
      
      setError('YouTube search requires an API key. For now, please search on YouTube.com and paste the video URL.')
      
      // TODO: Implement with YouTube Data API v3 when API key is available
      // const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery + ' karaoke')}&type=video&key=${YOUTUBE_API_KEY}&maxResults=10`)
      // const data = await response.json()
      // Process results...
      
    } catch (err: any) {
      setError(err.message || 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectFromYouTube = () => {
    // Open YouTube search in new tab with karaoke query
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery + ' karaoke')}`
    window.open(searchUrl, '_blank')
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleSelectFromYouTube()
            }
          }}
          placeholder="Search for karaoke songs on YouTube..."
          className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleSelectFromYouTube}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <Search className="w-5 h-5" />
          Search YouTube
        </button>
      </div>
      
      {error && (
        <div className="bg-yellow-900 border border-yellow-700 text-yellow-200 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}
      
      <div className="text-sm text-gray-400">
        <p>💡 <strong>Tip:</strong> Click "Search YouTube" to open YouTube in a new tab. Find your karaoke video, copy the URL, and paste it below.</p>
      </div>

      {searchResults.length > 0 && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {searchResults.map((video) => (
            <button
              key={video.id}
              type="button"
              onClick={() => {
                const url = `https://www.youtube.com/watch?v=${video.id}`
                // Try to extract artist and title from video title
                const parts = video.title.split(' - ')
                const artist = parts.length > 1 ? parts[0].trim() : video.channelTitle
                const title = parts.length > 1 ? parts.slice(1).join(' - ').trim() : video.title
                
                onSelectVideo({
                  url,
                  title: title.replace(/karaoke/gi, '').trim(),
                  artist: artist.replace(/karaoke/gi, '').trim()
                })
              }}
              className="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-lg flex gap-3 items-start text-left transition-colors"
            >
              <div className="relative w-24 h-16 flex-shrink-0 rounded overflow-hidden">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm line-clamp-2">{video.title}</p>
                <p className="text-gray-400 text-xs mt-1">{video.channelTitle}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

