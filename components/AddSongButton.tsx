'use client'

import { useState } from 'react'
import { Plus, Sparkles } from 'lucide-react'
import AddSongModal from './AddSongModal'
import CreateKaraokeModal from './CreateKaraokeModal'

interface AddSongButtonProps {
  onSongAdded: () => void
}

export default function AddSongButton({ onSongAdded }: AddSongButtonProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  return (
    <>
      <div className="flex gap-3">
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors shadow-lg"
        >
          <Sparkles className="w-5 h-5" />
          Create Karaoke
        </button>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Song
        </button>
      </div>

      {showAddModal && (
        <AddSongModal
          onClose={() => setShowAddModal(false)}
          onSongAdded={() => {
            setShowAddModal(false)
            onSongAdded()
          }}
        />
      )}

      {showCreateModal && (
        <CreateKaraokeModal
          onClose={() => setShowCreateModal(false)}
          onSongAdded={() => {
            setShowCreateModal(false)
            onSongAdded()
          }}
        />
      )}
    </>
  )
}


