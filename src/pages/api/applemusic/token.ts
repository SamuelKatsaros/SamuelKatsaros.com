import { createPrivateKey, sign } from 'crypto'
import type { APIRoute } from 'astro'
import {
  APPLE_MUSIC_PRIVATE_KEY,
  APPLE_MUSIC_TEAM_ID,
  APPLE_MUSIC_KEY_ID
} from 'astro:env/server'

export const GET: APIRoute = async ({ url }) => {
  try {
    // More detailed debug logging
    console.log('Environment variables:', {
      privateKeyLength: APPLE_MUSIC_PRIVATE_KEY?.length || 0,
      teamIdPresent: !!APPLE_MUSIC_TEAM_ID,
      keyIdPresent: !!APPLE_MUSIC_KEY_ID,
      privateKeyStart: APPLE_MUSIC_PRIVATE_KEY?.substring(0, 20)
    })

    // Check if we need to fetch track data, or just return the developer token
    const params = new URLSearchParams(url.search)
    const shouldFetchData = params.get('fetchData') === 'true'

    if (!APPLE_MUSIC_PRIVATE_KEY || !APPLE_MUSIC_TEAM_ID || !APPLE_MUSIC_KEY_ID) {
      throw new Error('Missing required environment variables (private key, teamId, keyId).')
    }

    const header = {
      alg: 'ES256',
      kid: APPLE_MUSIC_KEY_ID
    }
    const payload = {
      iss: APPLE_MUSIC_TEAM_ID,
      exp: Math.floor(Date.now() / 1000) + 15552000, // 180 days
      iat: Math.floor(Date.now() / 1000)
    }
    const headerB64 = Buffer.from(JSON.stringify(header)).toString('base64url')
    const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url')
    const key = createPrivateKey({
      key: APPLE_MUSIC_PRIVATE_KEY.replace(/\\n/g, '\n'),
      format: 'pem',
      type: 'pkcs8'
    })
    const signature = sign('sha256', Buffer.from(`${headerB64}.${payloadB64}`), key)
    const developerToken = `${headerB64}.${payloadB64}.${signature.toString('base64url')}`

    // 2. Optionally fetch Apple Music data
    if (shouldFetchData) {
      const userToken = process.env.APPLE_MUSIC_USER_TOKEN
      if (!userToken) {
        throw new Error('Missing APPLE_MUSIC_USER_TOKEN for fetching user data.')
      }
      const response = await fetch('https://api.music.apple.com/v1/me/recent/played/tracks', {
        headers: {
          Authorization: `Bearer ${developerToken}`,
          'Music-User-Token': userToken
        }
      })
      if (!response.ok) {
        throw new Error(`Apple Music API responded with ${response.status}`)
      }
      const data = await response.json()
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Otherwise, just return the developer token
    return new Response(JSON.stringify({ token: developerToken }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Apple Music API error:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : String(error)
      }),
      { status: 500 }
    )
  }
}