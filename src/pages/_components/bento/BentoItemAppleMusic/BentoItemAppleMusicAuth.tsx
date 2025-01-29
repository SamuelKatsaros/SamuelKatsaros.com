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
    const setupMusicKit = async () => {
      try {
        // Fetch your developer token from your API route
        const response = await fetch('/api/applemusic/token')
        if (!response.ok) {
          throw new Error('Failed to fetch token')
        }

        const data = await response.json()
        if (!data.token) {
          throw new Error('No token received')
        }

        // Dynamically load the MusicKit script
        const script = document.createElement('script')
        script.src = 'https://js-cdn.music.apple.com/musickit/v3/musickit.js'
        script.async = true

        script.onload = async () => {
          // Verify MusicKit is available
          if (window.MusicKit) {
            try {
              await window.MusicKit.configure({
                developerToken: data.token,
                app: {
                  name: 'Samuel Katsaros',
                  build: '1.0.0',
                  // Use the same bundle ID you configured in Developer Portal
                  id: 'media.com.samuelkatsaros'
                }
              })
              console.log('MusicKit configured successfully')
              setIsLoaded(true)
            } catch (configError) {
              console.error('Failed to configure MusicKit:', configError)
              setError('Failed to configure MusicKit')
            }
          } else {
            setError('MusicKit not found')
          }
        }

        document.body.appendChild(script)
      } catch (fetchError) {
        console.error('Setup failed:', fetchError)
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : 'Failed to setup MusicKit'
        )
      }
    }

    // Initialize MusicKit on mount
    setupMusicKit()

    // Cleanup script on unmount (optional, but keeps things tidy)
    return () => {
      const existingScript = document.querySelector('script[src*="musickit.js"]')
      if (existingScript) {
        document.body.removeChild(existingScript)
      }
    }
  }, [])

  const handleAuth = async () => {
    try {
      const music = window.MusicKit.getInstance()
      const token = await music.authorize()

      // Save the user's Music-User-Token to your backend
      const response = await fetch('/api/applemusic/save-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      })

      if (!response.ok) {
        throw new Error('Failed to save token')
      }

      // Reload the page to show updated data
      window.location.reload()
    } catch (authError) {
      console.error('Authorization failed:', authError)
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