import React, { useEffect, useState } from 'react'

declare global {
  interface Window {
    MusicKit: any
  }
}

const BentoItemAppleMusicAuth = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const setupMusicKit = async () => {
      try {
        const response = await fetch('/api/applemusic/token')
        if (!response.ok) {
          throw new Error('Failed to fetch token')
        }
        
        const data = await response.json()
        if (!data.token) {
          throw new Error('No token received')
        }

        const script = document.createElement('script')
        script.src = 'https://js-cdn.music.apple.com/musickit/v3/musickit.js'
        script.async = true
        
        script.onload = async () => {
          if (window.MusicKit) {
            try {
              await window.MusicKit.configure({
                developerToken: data.token,
                app: {
                  name: 'Samuel Katsaros',
                  build: '1.0.0',
                  id: 'media.com.samuelkatsaros'
                }
              })
              console.log('MusicKit configured successfully')
              setIsLoaded(true)
            } catch (error) {
              console.error('Failed to configure MusicKit:', error)
              setError('Failed to configure MusicKit')
            }
          } else {
            setError('MusicKit not found')
          }
        }
        
        document.body.appendChild(script)
      } catch (error) {
        console.error('Setup failed:', error)
        setError(error instanceof Error ? error.message : 'Failed to setup MusicKit')
      }
    }

    setupMusicKit()

    return () => {
      const script = document.querySelector('script[src*="musickit.js"]')
      if (script) {
        document.body.removeChild(script)
      }
    }
  }, [])

  const handleAuth = async () => {
    try {
      const music = window.MusicKit.getInstance()
      const token = await music.authorize()
      
      // Send token to our backend
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

      // Refresh the page to show the now playing content
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