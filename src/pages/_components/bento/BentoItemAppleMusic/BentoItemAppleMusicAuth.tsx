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
        if (!response.ok) {
          throw new Error('Failed to fetch token')
        }
        const { token: developerToken } = await response.json()
        
        console.log('Developer Token:', developerToken) // Debug log

        if (window.MusicKit) {
          try {
            await window.MusicKit.configure({
              developerToken,
              app: {
                name: 'Samuel Katsaros',
                build: '1.0.0',
                id: 'com.samuelkatsaros.media'
              },
              storefrontId: 'us',
              suppressErrorDialog: false,
              declarativeMarkup: true,
              features: {
                autoplays: false,
                playbackDuration: false
              }
            })
            console.log('MusicKit configured successfully')
            setIsLoaded(true)
          } catch (configError) {
            console.error('MusicKit configuration failed:', configError)
            setError('Failed to initialize Apple Music')
          }
        } else {
          throw new Error('MusicKit not found')
        }
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
      console.log('MusicKit configuration:', music.configuration) // Debug log
      
      // Verify the developer token is present
      if (!music.configuration.developerToken) {
        throw new Error('Developer token is missing')
      }

      // Try to authorize with more options
      const token = await music.authorize({
        scope: ['musicKit', 'playlist-modify', 'library-modify']
      })
      
      console.log('Authorization successful, token:', token)

      const response = await fetch('/api/applemusic/save-token', {
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
      setError(
        error instanceof Error 
          ? `Authorization failed: ${error.message}` 
          : 'Authorization failed: Unknown error'
      )
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