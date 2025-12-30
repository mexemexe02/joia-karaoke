'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { supabase, extractYouTubeId } from '@/lib/supabase'
import YouTubeSearch from './YouTubeSearch'

interface AddSongModalProps {
  onClose: () => void
  onSongAdded: () => void
}

export default function AddSongModal({ onClose, onSongAdded }: AddSongModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    language: 'en',
    type: 'youtube' as 'youtube' | 'local',
    source_url: '',
    duration: '',
    key: '',
    tempo: '',
    duet: false,
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchMode, setSearchMode] = useState<'manual' | 'search'>('search')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate YouTube URL if type is youtube
      if (formData.type === 'youtube') {
        const videoId = extractYouTubeId(formData.source_url)
        if (!videoId) {
          throw new Error('Invalid YouTube URL. Please provide a valid YouTube link.')
        }
      }

      // Validate required fields
      if (!formData.title || !formData.artist || !formData.source_url) {
        throw new Error('Please fill in all required fields (Title, Artist, Source URL)')
      }

      const { error: insertError } = await supabase
        .from('songs')
        .insert([
          {
            title: formData.title,
            artist: formData.artist,
            language: formData.language,
            type: formData.type,
            source_url: formData.source_url,
            duration: formData.duration ? parseInt(formData.duration) : null,
            key: formData.key || null,
            tempo: formData.tempo ? parseInt(formData.tempo) : null,
            duet: formData.duet,
            notes: formData.notes || null,
          },
        ])

      if (insertError) throw insertError

      onSongAdded()
    } catch (err: any) {
      setError(err.message || 'Failed to add song')
    } finally {
      setLoading(false)
    }
  }

  const handleVideoSelect = (video: { url: string; title: string; artist: string }) => {
    setFormData({
      ...formData,
      source_url: video.url,
      title: video.title,
      artist: video.artist,
    })
    setSearchMode('manual') // Switch to manual mode to show filled form
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Add New Song</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Mode Toggle */}
          <div className="flex gap-2 border-b border-gray-700 pb-4">
            <button
              type="button"
              onClick={() => setSearchMode('search')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                searchMode === 'search'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🔍 Search YouTube
            </button>
            <button
              type="button"
              onClick={() => setSearchMode('manual')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                searchMode === 'manual'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              ✏️ Manual Entry
            </button>
          </div>

          {searchMode === 'search' ? (
            <YouTubeSearch onSelectVideo={handleVideoSelect} />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded">
                  {error}
                </div>
              )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Artist *
              </label>
              <input
                type="text"
                value={formData.artist}
                onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Source Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'youtube' | 'local' })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
            >
              <option value="youtube">YouTube</option>
              <option value="local">Local (Jellyfin/Local URL)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {formData.type === 'youtube' ? 'YouTube URL *' : 'Source URL *'}
            </label>
            <input
              type="url"
              value={formData.source_url}
              onChange={(e) => {
                const url = e.target.value
                setFormData({ ...formData, source_url: url })
                
                // If it's a YouTube URL and title/artist are empty, try to extract from URL
                if (formData.type === 'youtube' && url && !formData.title && !formData.artist) {
                  const videoId = extractYouTubeId(url)
                  if (videoId) {
                    // YouTube URLs don't contain title/artist, but we can at least validate
                    // User will need to fill in title/artist manually or use search
                  }
                }
              }}
              onPaste={(e) => {
                // When pasting a YouTube URL, switch to manual mode if in search mode
                const pastedText = e.clipboardData.getData('text')
                if (pastedText.includes('youtube.com') || pastedText.includes('youtu.be')) {
                  setTimeout(() => setSearchMode('manual'), 100)
                }
              }}
              placeholder={formData.type === 'youtube' ? 'Paste YouTube URL here or search above...' : 'http://your-jellyfin-server/...'}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
              required
            />
            {formData.type === 'youtube' && (
              <p className="mt-1 text-xs text-gray-400">
                Paste any YouTube karaoke video URL or your unlisted custom karaoke video
              </p>
            )}
            {formData.type === 'local' && (
              <p className="mt-1 text-xs text-gray-400">
                For Phase B: Paste your Jellyfin playback URL or local file path
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Language
              </label>
              <input
                type="text"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                placeholder="en"
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Duration (seconds)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="180"
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Key
              </label>
              <input
                type="text"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                placeholder="C, Am, F#m"
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tempo (BPM)
              </label>
              <input
                type="number"
                value={formData.tempo}
                onChange={(e) => setFormData({ ...formData, tempo: e.target.value })}
                placeholder="120"
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
              />
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.duet}
                  onChange={(e) => setFormData({ ...formData, duet: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-primary-600 focus:ring-primary-500"
                />
                <span>Duet</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
              placeholder="Any additional notes about this song..."
            />
          </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding...' : 'Add Song'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}


