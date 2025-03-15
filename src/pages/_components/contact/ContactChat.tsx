import React, { useState, useRef, useEffect } from 'react'
import { Message } from '@/components/icons/Message'
import { Send } from '@/components/icons/Send'
import { Phone } from '@/components/icons/Phone'
import { Mail } from '@/components/icons/Mail'

interface ChatMessage {
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ContactFormData {
  name: string
  email: string
  message: string
  company?: string
  phone?: string
}

const ContactChat: React.FC = () => {
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      type: 'assistant',
      content: "Hey! I'm Sam's AI assistant. How can I help you today?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Contact form state
  const [activeTab, setActiveTab] = useState<'chat' | 'form' | 'schedule'>('chat')
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
    company: '',
    phone: ''
  })
  const [formErrors, setFormErrors] = useState<Partial<ContactFormData>>({})
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  
  // Calendar scheduling state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [schedulingTopic, setSchedulingTopic] = useState('')
  const [schedulingEmail, setSchedulingEmail] = useState('')
  const [schedulingErrors, setSchedulingErrors] = useState<{email?: string}>({})
  const [availableTimes, setAvailableTimes] = useState<string[]>([
    '9:00 AM', '10:00 AM', '11:00 AM', 
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ])
  const [calendarSubmitting, setCalendarSubmitting] = useState(false)
  const [calendarSubmitted, setCalendarSubmitted] = useState(false)

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

    // Check for contact-related keywords to provide helpful responses
    const lowerInput = input.toLowerCase()
    
    setTimeout(async () => {
      let responseMessage = ""
      
      if (lowerInput.includes('contact') || lowerInput.includes('reach') || lowerInput.includes('email') || lowerInput.includes('call')) {
        responseMessage = "You can reach Sam through the contact form or schedule a meeting using the tabs above. Would you like me to help you with that?"
        
        // Email Sam about someone asking to contact
        try {
          await fetch('/api/contact', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: 'Chat AI Assistant',
              email: 'ai@samuelkatsaros.com',
              message: `Someone is asking how to contact you. Their message: "${input}"`,
              company: '',
              phone: ''
            })
          })
        } catch (error) {
          console.error('Failed to send notification email:', error)
        }
      } else if (lowerInput.includes('schedule') || lowerInput.includes('meeting') || lowerInput.includes('call') || lowerInput.includes('talk')) {
        responseMessage = "You can schedule a meeting with Sam using the 'Schedule' tab. Would you like to do that now?"
        // Also switch to the scheduling tab
        setActiveTab('schedule')
      } else if (lowerInput.includes('form') || lowerInput.includes('message')) {
        responseMessage = "You can send a message through the 'Contact Form' tab. Would you like to fill out the form instead?"
        // Also switch to the form tab
        setActiveTab('form')
      } else if (lowerInput.includes('social') || lowerInput.includes('linkedin') || lowerInput.includes('github')) {
        responseMessage = "You can find Sam on LinkedIn at linkedin.com/in/samuel-katsaros or on GitHub at github.com/SamuelKatsaros. Would you like links to any other social profiles?"
      } else {
        responseMessage = "Thanks for your message! If you'd like to get in touch with Sam directly, you can use the 'Contact Form' or 'Schedule' tabs above."
      }
      
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: responseMessage,
        timestamp: new Date()
      }])
      
      setIsTyping(false)
    }, 1000)
  }

  const validateForm = (): boolean => {
    const errors: Partial<ContactFormData> = {}
    
    if (!formData.name.trim()) errors.name = 'Name is required'
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Email is invalid'
    }
    if (!formData.message.trim()) errors.message = 'Message is required'
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setFormSubmitting(true)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      setFormSubmitted(true)
      
      // Add a message to the chat about the form submission
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: `Thanks for reaching out, ${formData.name}! Sam will get back to you shortly at ${formData.email}.`,
        timestamp: new Date()
      }])
      
      // Reset form after submission
      setTimeout(() => {
        setFormSubmitted(false)
        setFormData({
          name: '',
          email: '',
          message: '',
          company: '',
          phone: ''
        })
        setActiveTab('chat')
      }, 3000)
    } catch (error) {
      console.error('Failed to send message:', error)
      alert('Failed to send message. Please try again later.')
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields including email
    const errors: {email?: string} = {}
    
    if (!selectedDate || !selectedTime || !schedulingTopic.trim()) {
      return
    }
    
    if (!schedulingEmail.trim()) {
      errors.email = 'Email is required'
    } else if (!/^\S+@\S+\.\S+$/.test(schedulingEmail)) {
      errors.email = 'Email is invalid'
    }
    
    if (Object.keys(errors).length > 0) {
      setSchedulingErrors(errors)
      return
    }
    
    setCalendarSubmitting(true)
    
    try {
      // Format date for the email
      const dateOptions: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric',
        month: 'long', 
        day: 'numeric' 
      }
      const formattedDate = selectedDate.toLocaleDateString('en-US', dateOptions)
      
      // Send email about the meeting request
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'Meeting Request',
          email: schedulingEmail, // Use the user's email
          message: `Meeting request for ${formattedDate} at ${selectedTime}\n\nTopic: ${schedulingTopic}\n\nPlease send calendar invite to: ${schedulingEmail}`,
          company: '',
          phone: ''
        })
      })

      if (!response.ok) {
        throw new Error('Failed to schedule meeting')
      }
      
      setCalendarSubmitted(true)
      
      // Add a message to the chat about the scheduling
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: `Your meeting has been scheduled for ${formattedDate} at ${selectedTime}. Topic: ${schedulingTopic}. Sam will send you a calendar invite shortly at ${schedulingEmail}.`,
        timestamp: new Date()
      }])
      
      // Reset form after submission
      setTimeout(() => {
        setCalendarSubmitted(false)
        setSelectedDate(null)
        setSelectedTime(null)
        setSchedulingTopic('')
        setSchedulingEmail('')
        setSchedulingErrors({})
        setActiveTab('chat')
      }, 3000)
    } catch (error) {
      console.error('Failed to schedule meeting:', error)
      alert('Failed to schedule meeting. Please try again later.')
    } finally {
      setCalendarSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user types
    if (formErrors[name as keyof ContactFormData]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  // Generate calendar days for scheduling
  const generateCalendarDays = () => {
    const days = []
    const today = new Date()
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue
      
      days.push(date)
    }
    
    return days
  }

  const calendarDays = generateCalendarDays()

  return (
    <div className="flex h-[500px] flex-col rounded-xl border border-zinc-200 bg-zinc-100 overflow-hidden contact-chat-component">
      {/* Tabs */}
      <div className="flex border-b border-zinc-200">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 p-3 text-sm font-medium ${
            activeTab === 'chat' 
              ? 'bg-white text-black border-b-2 border-black' 
              : 'text-zinc-600 hover:bg-zinc-50'
          }`}
          aria-label="Chat"
        >
          <div className="flex items-center justify-center gap-2">
            <Message className="size-4" />
            <span>Chat</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('form')}
          className={`flex-1 p-3 text-sm font-medium ${
            activeTab === 'form' 
              ? 'bg-white text-black border-b-2 border-black' 
              : 'text-zinc-600 hover:bg-zinc-50'
          }`}
          aria-label="Contact Form"
        >
          <div className="flex items-center justify-center gap-2">
            <Mail className="size-4" />
            <span>Contact Form</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex-1 p-3 text-sm font-medium ${
            activeTab === 'schedule' 
              ? 'bg-white text-black border-b-2 border-black' 
              : 'text-zinc-600 hover:bg-zinc-50'
          }`}
          aria-label="Schedule"
        >
          <div className="flex items-center justify-center gap-2">
            <Phone className="size-4" />
            <span>Schedule</span>
          </div>
        </button>
      </div>

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <>
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

          <div className="border-t border-zinc-200 p-4 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about contacting Sam..."
                className="flex-1 rounded-lg border border-zinc-200 px-4 py-2 text-zinc-900"
              />
              <button
                onClick={handleSend}
                className="rounded-lg bg-black px-4 py-2 text-white"
              >
                <Send className="size-5" />
              </button>
            </div>
            
            <div className="mt-3 text-xs text-zinc-500">
              Try asking: "How can I contact Sam?" or "I'd like to schedule a meeting"
            </div>
          </div>
        </>
      )}

      {/* Contact Form Tab */}
      {activeTab === 'form' && (
        <div className="flex-1 overflow-y-auto p-6">
          {formSubmitted ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-full bg-green-100 p-3">
                <svg className="size-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-zinc-900">Message Sent!</h3>
              <p className="mt-2 text-zinc-600">Sam will get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <h2 className="text-xl font-medium text-zinc-900 mb-4">Send a Message</h2>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700">
                  Your Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className={`w-full rounded-lg border ${
                    formErrors.name ? 'border-red-500' : 'border-zinc-300'
                  } px-4 py-2 text-zinc-900 focus:border-black focus:ring-1 focus:ring-black`}
                />
                {formErrors.name && (
                  <p className="text-xs text-red-500">{formErrors.name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700">
                  Email<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className={`w-full rounded-lg border ${
                    formErrors.email ? 'border-red-500' : 'border-zinc-300'
                  } px-4 py-2 text-zinc-900 focus:border-black focus:ring-1 focus:ring-black`}
                />
                {formErrors.email && (
                  <p className="text-xs text-red-500">{formErrors.email}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-700">
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Acme Inc."
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-zinc-900 focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-700">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (123) 456-7890"
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-zinc-900 focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700">
                  Message<span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Your message here..."
                  rows={4}
                  className={`w-full rounded-lg border ${
                    formErrors.message ? 'border-red-500' : 'border-zinc-300'
                  } px-4 py-2 text-zinc-900 focus:border-black focus:ring-1 focus:ring-black`}
                />
                {formErrors.message && (
                  <p className="text-xs text-red-500">{formErrors.message}</p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={formSubmitting}
                className="w-full rounded-lg bg-black px-4 py-3 font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-70"
              >
                {formSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin size-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <div className="flex-1 overflow-y-auto p-6">
          {calendarSubmitted ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-full bg-green-100 p-3">
                <svg className="size-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-zinc-900">Meeting Scheduled!</h3>
              <p className="mt-2 text-zinc-600">
                {selectedDate && selectedTime && (
                  <>
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })} at {selectedTime}
                  </>
                )}
              </p>
              <p className="mt-1 text-zinc-500">You'll receive a calendar invite soon at {schedulingEmail}.</p>
            </div>
          ) : (
            <form onSubmit={handleScheduleSubmit} className="space-y-6">
              <h2 className="text-xl font-medium text-zinc-900 mb-4">Schedule a Meeting</h2>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-zinc-700">
                  Select a Date
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {calendarDays.slice(0, 8).map((date, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedDate(date)}
                      className={`flex flex-col items-center rounded-lg p-2 text-center ${
                        selectedDate && selectedDate.toDateString() === date.toDateString()
                          ? 'bg-black text-white'
                          : 'bg-white text-zinc-900 hover:bg-zinc-50'
                      }`}
                    >
                      <span className="text-xs font-medium">
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                      <span className="text-lg font-semibold">{date.getDate()}</span>
                      <span className="text-xs">
                        {date.toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-zinc-700">
                  Select a Time
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`rounded-lg border px-3 py-2 text-sm ${
                        selectedTime === time
                          ? 'border-black bg-black text-white'
                          : 'border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700">
                  Email Address<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={schedulingEmail}
                  onChange={(e) => setSchedulingEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full rounded-lg border ${
                    schedulingErrors.email ? 'border-red-500' : 'border-zinc-300'
                  } px-4 py-2 text-zinc-900 focus:border-black focus:ring-1 focus:ring-black`}
                  required
                />
                {schedulingErrors.email && (
                  <p className="text-xs text-red-500">{schedulingErrors.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700">
                  Meeting Topic<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={schedulingTopic}
                  onChange={(e) => setSchedulingTopic(e.target.value)}
                  placeholder="Brief description of meeting purpose"
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-zinc-900 focus:border-black focus:ring-1 focus:ring-black"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={!selectedDate || !selectedTime || !schedulingTopic.trim() || !schedulingEmail.trim() || calendarSubmitting}
                className="w-full rounded-lg bg-black px-4 py-3 font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-70"
              >
                {calendarSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin size-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Scheduling...
                  </span>
                ) : (
                  'Schedule Meeting'
                )}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}

export default ContactChat 