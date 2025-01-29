import jwt from 'jsonwebtoken'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async () => {
  try {
    const privateKey = process.env.APPLE_MUSIC_PRIVATE_KEY
    const keyId = process.env.APPLE_MUSIC_KEY_ID
    const teamId = process.env.APPLE_MUSIC_TEAM_ID

    if (!privateKey || !keyId || !teamId) {
      throw new Error('Missing required environment variables')
    }

    const developerToken = jwt.sign(
      {},
      `-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----`,
      {
        algorithm: 'ES256',
        keyid: keyId,
        issuer: teamId,
        expiresIn: '180d',
      }
    )

    return new Response(JSON.stringify({ token: developerToken }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Token generation error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate token' }),
      { status: 500 }
    )
  }
}