export default async function getAppleMusicData() {
  try {
    // Return placeholder data
    return {
      track: {
        name: "Cheese Cake",
        artist: 'Dexter Gordon',
        albumArt: 'https://i1.sndcdn.com/artworks-skijcrmHqyUO-0-t500x500.jpg',
        url: 'https://music.apple.com/us/album/cheese-cake/1459439436?i=1459439440'
      }
    }
  } catch (error) {
    console.error('Apple Music service error:', error)
    throw new Error('Failed to fetch Apple Music data')
  }
} 