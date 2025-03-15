import type { APIRoute } from 'astro'
import { Resend } from 'resend'

// Get API key from environment with fallback
const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_jn8bC61U_NHp18gZZCYoV74HmHWaVLcoL';

if (!RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is required. Please add it to your environment variables.');
}

// Initialize Resend with the API key
const resend = new Resend(RESEND_API_KEY);

console.log('Resend initialized with API key:', RESEND_API_KEY.substring(0, 8) + '...');

export const POST: APIRoute = async ({ request }) => {
  try {
    const { name, email, message, company, phone } = await request.json()

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Name, email and message are required' }), 
        { status: 400 }
      )
    }

    console.log('Sending email for:', name, email);

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Website Contact Form <contact@samuelkatsaros.com>',
      to: 'samuel@samuelkatsaros.com',
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      text: `
Name: ${name}
Email: ${email}
${company ? `Company: ${company}\n` : ''}
${phone ? `Phone: ${phone}\n` : ''}

Message:
${message}
      `,
      html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
<h3>Message:</h3>
<p>${message.replace(/\n/g, '<br>')}</p>
      `
    })

    if (error) {
      console.error('Resend API error:', error);
      throw error
    }

    console.log('Email sent successfully:', data?.id)

    return new Response(
      JSON.stringify({ success: true }), 
      { status: 200 }
    )
  } catch (error) {
    console.error('Failed to send email:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send message',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { status: 500 }
    )
  }
} 