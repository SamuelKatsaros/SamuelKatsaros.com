import type { APIRoute } from 'astro'
import { OpenAI } from 'openai'
import { OPENAI_API_KEY } from 'astro:env/server'

if (!OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is required')
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
})

const SYSTEM_PROMPT = `You are an AI assistant for Samuel Katsaros. Be friendly and helpful.
Some key information about Sam:
- Currently studying for GMAT
- Working on various tech projects
- Based in EST timezone
- Available Mon-Fri 9AM-5PM EST
- Interested in MBA programs
- Full stack developer with expertise in React, TypeScript, and Node.js

If someone asks about contacting Sam directly, suggest they can leave their phone number for a callback.`

export const POST: APIRoute = async ({ request }) => {
  try {
    const { message } = await request.json()
    
    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }), 
        { status: 400 }
      )
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message }
      ],
      max_tokens: 150,
      temperature: 0.7,
    })

    return new Response(
      JSON.stringify({ 
        message: completion.choices[0].message.content 
      }),
      { status: 200 }
    )
  } catch (error: any) {
    console.error('OpenAI error:', error)
    
    // Handle rate limits specifically
    if (error?.error?.type === 'insufficient_quota') {
      return new Response(
        JSON.stringify({ 
          error: 'The AI service is temporarily unavailable. Please try again later.' 
        }), 
        { status: 429 }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Failed to process message' }), 
      { status: 500 }
    )
  }
} 