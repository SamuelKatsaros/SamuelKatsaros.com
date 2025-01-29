import React, { useState, useRef, useEffect } from 'react'
import { Message } from '@/components/icons/Message'
import { Send } from '@/components/icons/Send'
import { Phone } from '@/components/icons/Phone'

interface ChatMessage {
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const ContactChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      type: 'assistant',
      content: "Hey! I'm Sam's AI assistant. You can chat with me, or if you'd like Sam to text you back, just share your number.",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [showPhoneInput, setShowPhoneInput] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    // Only scroll if we're not at the bottom already
    const container = messagesEndRef.current?.parentElement
    if (container) {
      const isAtBottom = container.scrollHeight - container.scrollTop === container.clientHeight
      if (!isAtBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  useEffect(() => {
    // Only scroll on new messages, not initial render
    if (messages.length > 1) {
      scrollToBottom()
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const newMessage: ChatMessage = {
      type: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setInput('')
    setIsTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response')
      }

      setMessages(prev => [...prev, {
        type: 'assistant',
        content: data.message,
        timestamp: new Date()
      }])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: "I'm sorry, I'm having trouble responding right now. Please try again later.",
        timestamp: new Date()
      }])
    } finally {
      setIsTyping(false)
    }
  }

  const handlePhoneSubmit = async () => {
    if (!phoneNumber.match(/^\+?[1-9]\d{1,14}$/)) {
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: "That doesn't look like a valid phone number. Please try again with a number like +1234567890",
        timestamp: new Date()
      }])
      return
    }

    try {
      const response = await fetch('/api/sms/request-callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      })

      if (response.ok) {
        setMessages(prev => [...prev, {
          type: 'assistant',
          content: "Great! Sam will text you back soon. In the meantime, feel free to keep chatting with me!",
          timestamp: new Date()
        }])
        setShowPhoneInput(false)
        setPhoneNumber('')
      }
    } catch (error) {
      console.error('SMS request error:', error)
    }
  }

  return (
    <div className="flex h-[600px] flex-col rounded-xl border border-zinc-200 bg-zinc-100">
      <div className="flex items-center gap-3 border-b border-zinc-200 p-4">
        <div className="relative size-3">
          <div className="absolute size-full animate-ping rounded-full bg-green-300 opacity-65"></div>
          <div className="size-full rounded-full bg-green-400"></div>
        </div>
        <h2 className="font-medium text-zinc-900">Chat with Sam's Assistant</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                msg.type === 'user' 
                  ? 'bg-black text-white' 
                  : 'bg-white text-zinc-900'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg px-4 py-2">
              <span className="animate-pulse">...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-zinc-200 p-4">
        {showPhoneInput ? (
          <div className="flex gap-2">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1234567890"
              className="flex-1 rounded-lg border border-zinc-200 px-4 py-2 text-zinc-900"
            />
            <button
              onClick={handlePhoneSubmit}
              className="rounded-lg bg-black px-4 py-2 text-white"
            >
              <Phone className="size-5" />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 rounded-lg border border-zinc-200 px-4 py-2 text-zinc-900"
            />
            <button
              onClick={() => setShowPhoneInput(true)}
              className="rounded-lg border border-zinc-200 bg-white px-4 py-2"
            >
              <Phone className="size-5" />
            </button>
            <button
              onClick={handleSend}
              className="rounded-lg bg-black px-4 py-2 text-white"
            >
              <Send className="size-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ContactChat 