import type { APIRoute } from 'astro'

export const GET: APIRoute = async () => {
  try {
    const response = await fetch('https://api.music.apple.com/v1/me/recent/played/tracks', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.APPLE_MUSIC_TOKEN}`,
        'Music-User-Token': process.env.APPLE_MUSIC_USER_TOKEN || ''
      }
    })
    
    const data = await response.json()
    const track = data.data[0]

    return new Response(JSON.stringify({
      track: {
        name: track.attributes.name,
        artist: track.attributes.artistName,
        albumArt: track.attributes.artwork.url,
        url: track.attributes.url
      }
    }))
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), { status: 500 })
  }
}