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
        const response = await fetch('/api/applemusic/token')
        const { token: developerToken } = await response.json()

        await window.MusicKit.configure({
          developerToken,
          app: {
            name: 'Samuel Katsaros',
            build: '1.0.0'
          }
        })
        setIsLoaded(true)
      } catch (error) {
        console.error('Setup failed:', error)
        setError('Failed to setup MusicKit')
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
      const token = await music.authorize()
      
      // Log token to console as suggested in the article
      console.log('Music User Token:', token)

      const response = await fetch('/api/applemusic/save-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })

      if (!response.ok) {
        throw new Error('Failed to save token')
      }

      window.location.reload()
    } catch (error) {
      console.error('Authorization failed:', error)
      setError('Authorization failed')
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