import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request }) => {
  try {
    const { token } = await request.json()
    
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'No token provided' }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Get the base URL from the request
    const url = new URL(request.url)
    const baseUrl = `${url.protocol}//${url.host}`
    
    const developerTokenResponse = await fetch(`${baseUrl}/api/applemusic/token`)
    if (!developerTokenResponse.ok) {
      throw new Error('Failed to get developer token')
    }
    const { token: developerToken } = await developerTokenResponse.json()

    // Validate the token with Apple Music API
    const validateResponse = await fetch('https://api.music.apple.com/v1/me/recent/played/tracks', {
      headers: {
        'Authorization': `Bearer ${developerToken}`,
        'Music-User-Token': token
      }
    })

    if (!validateResponse.ok) {
      const errorText = await validateResponse.text()
      console.error('Validation response:', errorText)
      throw new Error('Invalid user token')
    }

    // Store token in environment variable
    process.env.APPLE_MUSIC_USER_TOKEN = token

    return new Response(
      JSON.stringify({ success: true }), 
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Failed to save Apple Music token:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to save token' 
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
} 