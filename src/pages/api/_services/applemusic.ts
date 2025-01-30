export default async function getAppleMusicData() {
  try {
    // Use the full URL for the token endpoint
    const tokenResponse = await fetch('https://samuelkatsaros.com/api/applemusic/token')
    if (!tokenResponse.ok) {
      throw new Error('Failed to get developer token')
    }
    const { token: developerToken } = await tokenResponse.json()

    const response = await fetch('https://api.music.apple.com/v1/me/recent/played/tracks', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${developerToken}`,
        'Music-User-Token': process.env.APPLE_MUSIC_USER_TOKEN || ''
      }
    })
    
    const data = await response.json()
    const track = data.data[0]

    return {
      track: {
        name: track.attributes.name,
        artist: track.attributes.artistName,
        albumArt: track.attributes.artwork.url,
        url: track.attributes.url
      }
    }
  } catch (error) {
    console.error('Apple Music service error:', error)
    throw new Error('Failed to fetch Apple Music data')
  }
} 