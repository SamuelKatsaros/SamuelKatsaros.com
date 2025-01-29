import type { APIRoute } from 'astro'
import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export const POST: APIRoute = async ({ request }) => {
  try {
    const { phoneNumber } = await request.json()

    // Validate phone number format
    if (!phoneNumber.match(/^\+?[1-9]\d{1,14}$/)) {
      return new Response(
        JSON.stringify({ error: 'Invalid phone number format' }), 
        { status: 400 }
      )
    }

    // Send SMS to Sam
    await client.messages.create({
      body: `New contact request from website. Callback number: ${phoneNumber}`,
      to: process.env.ADMIN_PHONE_NUMBER!,
      from: process.env.TWILIO_PHONE_NUMBER
    })

    // Send confirmation SMS to user
    await client.messages.create({
      body: "Thanks for reaching out! Sam will get back to you soon.",
      to: phoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER
    })

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('SMS error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process SMS request' }), 
      { status: 500 }
    )
  }
} 