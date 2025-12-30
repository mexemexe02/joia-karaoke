'use client'

import { Song, getYouTubeThumbnail } from '@/lib/supabase'
import { Play, Music } from 'lucide-react'
import Image from 'next/image'

interface SongCardProps {
  song: Song
  onPlay: (song: Song) => void
}

export default function SongCard({ song, onPlay }: SongCardProps) {
  const thumbnail = song.type === 'youtube' ? getYouTubeThumbnail(song.source_url) : null
  const duration = song.duration ? formatDuration(song.duration) : null

  return (
    <div
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer group"
      onClick={() => onPlay(song)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onPlay(song)
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Play ${song.title} by ${song.artist}`}
    >
      {/* Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-primary-600 to-primary-800">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={`${song.artist} - ${song.title}`}
            fill
            className="object-cover"
            onError={(e) => {
              // Fallback to gradient if image fails
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Music className="w-16 h-16 text-white opacity-50" />
          </div>
        )}
        
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
          <div className="bg-primary-600 rounded-full p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="w-8 h-8 text-white fill-white" />
          </div>
        </div>

        {/* Type badge */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded text-xs font-semibold ${
            song.type === 'youtube' 
              ? 'bg-red-600 text-white' 
              : 'bg-blue-600 text-white'
          }`}>
            {song.type === 'youtube' ? 'YouTube' : 'Local'}
          </span>
        </div>

        {/* Duration */}
        {duration && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs text-white">
            {duration}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
          {song.title}
        </h3>
        <p className="text-sm text-gray-400 mb-2 line-clamp-1">
          {song.artist}
        </p>
        
        {/* Metadata */}
        <div className="flex flex-wrap gap-2 text-xs">
          {song.language && (
            <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded">
              {song.language.toUpperCase()}
            </span>
          )}
          {song.duet && (
            <span className="px-2 py-1 bg-purple-600 text-white rounded">
              Duet
            </span>
          )}
          {song.key && (
            <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded">
              Key: {song.key}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}


