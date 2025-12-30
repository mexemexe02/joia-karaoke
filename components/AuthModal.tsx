'use client'

import { useEffect } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabase'
import { X } from 'lucide-react'

interface AuthModalProps {
  show: boolean
  onClose: () => void
}

export default function AuthModal({ show, onClose }: AuthModalProps) {
  useEffect(() => {
    // Listen for successful auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        onClose()
      }
    })

    return () => subscription.unsubscribe()
  }, [onClose])

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            Sign In to Joia Karaoke
          </h2>
          <p className="text-gray-400 mb-6 text-center">
            Sign in to access and manage your shared karaoke library
          </p>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#ef4444',
                    brandAccent: '#dc2626',
                  },
                },
              },
            }}
            providers={['email']}
            magicLink={true}
          />
        </div>
      </div>
    </div>
  )
}


