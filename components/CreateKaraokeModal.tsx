'use client'

import { useState, useEffect } from 'react'
import { X, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface CreateKaraokeModalProps {
  onClose: () => void
  onSongAdded: () => void
}

interface JobStatus {
  job_id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  message: string
  result_url?: string
  error?: string
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

export default function CreateKaraokeModal({ onClose, onSongAdded }: CreateKaraokeModalProps) {
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [lyrics, setLyrics] = useState('')
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [jobId, setJobId] = useState<string | null>(null)
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null)

  // Poll job status
  useEffect(() => {
    if (!jobId) return

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/job/${jobId}`)
        const status: JobStatus = await response.json()
        setJobStatus(status)

        if (status.status === 'completed' || status.status === 'failed') {
          clearInterval(interval)
          setLoading(false)

          if (status.status === 'completed' && status.result_url) {
            // Auto-add to library
            await addToLibrary(status.result_url, title, artist)
          }
        }
      } catch (err: any) {
        console.error('Error checking job status:', err)
      }
    }, 2000) // Poll every 2 seconds

    return () => clearInterval(interval)
  }, [jobId, title, artist])

  const addToLibrary = async (videoUrl: string, songTitle: string, songArtist: string) => {
    try {
      const { error: insertError } = await supabase
        .from('songs')
        .insert([
          {
            title: songTitle || 'Karaoke Song',
            artist: songArtist || 'Unknown',
            language: 'en',
            type: 'youtube',
            source_url: videoUrl,
            duet: false,
          },
        ])

      if (insertError) throw insertError
      onSongAdded()
      onClose()
    } catch (err: any) {
      setError(`Failed to add to library: ${err.message}`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${BACKEND_URL}/api/create-karaoke`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          youtube_url: youtubeUrl,
          lyrics: lyrics || undefined,
          title: title || undefined,
          artist: artist || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to start karaoke creation')
      }

      const job: JobStatus = await response.json()
      setJobId(job.job_id)
      setJobStatus(job)
    } catch (err: any) {
      setError(err.message || 'Failed to create karaoke')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Create Karaoke Video</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {jobStatus && (
            <div className="bg-blue-900 border border-blue-700 text-blue-200 px-4 py-3 rounded">
              <div className="flex items-center gap-2 mb-2">
                {jobStatus.status === 'processing' && (
                  <Loader2 className="w-5 h-5 animate-spin" />
                )}
                {jobStatus.status === 'completed' && (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                )}
                {jobStatus.status === 'failed' && (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
                <span className="font-semibold">{jobStatus.message}</span>
              </div>
              {jobStatus.status === 'processing' && (
                <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-primary-600 h-2.5 rounded-full transition-all"
                    style={{ width: `${jobStatus.progress}%` }}
                  />
                </div>
              )}
              {jobStatus.error && (
                <p className="text-sm mt-2 text-red-300">{jobStatus.error}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              YouTube URL *
            </label>
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
              required
              disabled={loading}
            />
            <p className="mt-1 text-xs text-gray-400">
              Paste the YouTube URL of the song you want to convert to karaoke
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title (optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Song title"
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Artist (optional)
              </label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Artist name"
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Lyrics (optional)
            </label>
            <textarea
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              rows={6}
              placeholder="Paste lyrics here, or leave empty for automatic transcription..."
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
              disabled={loading}
            />
            <p className="mt-1 text-xs text-gray-400">
              Leave empty to automatically transcribe lyrics from audio
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || jobStatus?.status === 'processing'}
              className="flex-1 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading || jobStatus?.status === 'processing' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Karaoke'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

