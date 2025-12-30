'use client'

import { Search } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-6 w-6 text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by artist or song title..."
        className="w-full pl-12 pr-4 py-4 text-lg bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
        autoFocus
      />
    </div>
  )
}


