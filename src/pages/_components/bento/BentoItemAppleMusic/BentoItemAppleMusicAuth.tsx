import React, { useEffect, useState } from 'react'

declare global {
  interface Window {
    MusicKit: any
  }
}

function BentoItemAppleMusicAuth() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://js-cdn.music.apple.com/musickit/v3/musickit.js'
    script.async = true

    script.onload = async () => {
      try {
        const baseUrl = window.location.origin
        const response = await fetch(`${baseUrl}/api/applemusic/token`)
        if (!response.ok) {
          throw new Error('Failed to fetch token')
        }
        const { token: developerToken } = await response.json()
        
        if (!window.MusicKit) {
          throw new Error('MusicKit not found')
        }

        // Simplified configuration
        const configuration = {
          developerToken,
          app: {
            name: 'Samuel Katsaros',
            build: '1.0.0',
            id: 'media.com.samuelkatsaros'
          }
        }

        await window.MusicKit.configure(configuration)
        console.log('MusicKit configured successfully')
        setIsLoaded(true)
      } catch (error) {
        console.error('Setup failed:', error)
        setError(error instanceof Error ? error.message : 'Failed to setup MusicKit')
      }
    }

    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleAuth = async () => {
    try {
      const music = window.MusicKit.getInstance()
      console.log('MusicKit instance:', music)
      
      const token = await music.authorize()
      console.log('User Music Token:', token)

      // Get the full URL using window.location
      const baseUrl = window.location.origin
      const response = await fetch(`${baseUrl}/api/applemusic/save-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save token')
      }

      window.location.reload()
    } catch (error) {
      console.error('Authorization failed:', error)
      setError(error instanceof Error ? error.message : 'Authorization failed')
    }
  }

  if (error) {
    return <p className="text-red-500">{error}</p>
  }

  return (
    <button
      onClick={handleAuth}
      disabled={!isLoaded}
      className="px-4 py-2 bg-black text-white rounded-lg disabled:opacity-50"
    >
      Connect Apple Music
    </button>
  )
}

export default BentoItemAppleMusicAuth