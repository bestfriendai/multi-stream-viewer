'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  HelpCircle, 
  MessageCircle, 
  Bug, 
  Lightbulb, 
  Mail, 
  ExternalLink,
  BookOpen,
  Zap
} from 'lucide-react'

const faqs = [
  {
    question: "How many streams can I watch at once?",
    answer: "You can watch up to 16 streams simultaneously with Streamyyy. The layout automatically adjusts based on the number of streams you add."
  },
  {
    question: "Is Streamyyy free to use?",
    answer: "Yes! Streamyyy is completely free to use. No registration, subscription, or hidden fees required."
  },
  {
    question: "Can I watch Twitch and YouTube streams together?",
    answer: "Absolutely! You can mix streams from Twitch, YouTube, Rumble and other supported platforms in the same viewer."
  },
  {
    question: "Does it work on mobile devices?",
    answer: "Yes, Streamyyy is fully responsive and optimized for phones, tablets, and desktop computers."
  },
  {
    question: "How do I save my favorite layouts?",
    answer: "Use the layout manager to save custom arrangements. Your layouts are stored locally in your browser."
  },
  {
    question: "Can I sync audio from multiple streams?",
    answer: "For the best experience, we recommend muting all but one stream to avoid audio conflicts. Audio mixing features are coming soon!"
  }
]

const supportTypes = [
  {
    icon: Bug,
    title: "Bug Report",
    description: "Found a problem? Let us know!",
    color: "text-red-500"
  },
  {
    icon: Lightbulb,
    title: "Feature Request",
    description: "Have an idea to improve Streamyyy?",
    color: "text-yellow-500"
  },
  {
    icon: HelpCircle,
    title: "General Help",
    description: "Need assistance with anything?",
    color: "text-blue-500"
  },
  {
    icon: MessageCircle,
    title: "Feedback",
    description: "Share your thoughts with us",
    color: "text-green-500"
  }
]

export default function SupportPage() {
  const [selectedType, setSelectedType] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSubmitted(true)
    setIsSubmitting(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Support Center</h1>
          <p className="text-xl text-muted-foreground">
            We're here to help you get the most out of Streamyyy
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
            <BookOpen className="w-6 h-6" />
            <span className="text-sm">Documentation</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
            <Zap className="w-6 h-6" />
            <span className="text-sm">Quick Start</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
            <ExternalLink className="w-6 h-6" />
            <span className="text-sm">GitHub</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
            <Mail className="w-6 h-6" />
            <span className="text-sm">Email Us</span>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* FAQ Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Contact Support</h2>
            
            {submitted ? (
              <Card>
                <CardContent className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground">
                    We'll get back to you as soon as possible.
                  </p>
                  <Button 
                    onClick={() => {
                      setSubmitted(false)
                      setFormData({ name: '', email: '', subject: '', message: '' })
                      setSelectedType('')
                    }}
                    className="mt-4"
                  >
                    Send Another Message
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {supportTypes.map((type) => {
                    const Icon = type.icon
                    return (
                      <Card 
                        key={type.title}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedType === type.title ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedType(type.title)}
                      >
                        <CardContent className="p-4 text-center">
                          <Icon className={`w-8 h-8 mx-auto mb-2 ${type.color}`} />
                          <h3 className="font-semibold text-sm">{type.title}</h3>
                          <p className="text-xs text-muted-foreground">{type.description}</p>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Send us a message</CardTitle>
                    <CardDescription>
                      {selectedType && (
                        <Badge variant="outline">{selectedType}</Badge>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder={selectedType ? `${selectedType}: ` : ''}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={5}
                          required
                        />
                      </div>
                      <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}