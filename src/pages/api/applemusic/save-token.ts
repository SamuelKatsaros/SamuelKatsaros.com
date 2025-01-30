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

    // Use the same origin for token endpoint
    const developerTokenResponse = await fetch(`${request.url.split('/save-token')[0]}/token`)
    if (!developerTokenResponse.ok) {
      throw new Error('Failed to get developer token')
    }
    const { token: developerToken } = await developerTokenResponse.json()

    const validateResponse = await fetch('https://api.music.apple.com/v1/me/recent/played/tracks', {
      headers: {
        'Authorization': `Bearer ${developerToken}`,
        'Music-User-Token': token
      }
    })

    if (!validateResponse.ok) {
      throw new Error('Invalid user token')
    }

    // If validation succeeds, store the token
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