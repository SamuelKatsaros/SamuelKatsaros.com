import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request }) => {
  try {
    const { token } = await request.json()
    
    // In production, you'd want to store this securely
    // For now, we'll use environment variables
    process.env.APPLE_MUSIC_USER_TOKEN = token
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to save token' }),
      { status: 500 }
    )
  }
} 