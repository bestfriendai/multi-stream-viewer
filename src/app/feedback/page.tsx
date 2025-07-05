'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  MessageCircle, 
  Star, 
  ThumbsUp, 
  ThumbsDown,
  Heart,
  Lightbulb
} from 'lucide-react'

const feedbackTypes = [
  {
    id: 'love',
    icon: Heart,
    title: 'Love it!',
    description: 'Share what you love about Streamyyy',
    color: 'text-red-500 border-red-200 hover:bg-red-50'
  },
  {
    id: 'suggestion',
    icon: Lightbulb,
    title: 'Suggestion',
    description: 'Ideas to make Streamyyy even better',
    color: 'text-yellow-500 border-yellow-200 hover:bg-yellow-50'
  },
  {
    id: 'issue',
    icon: ThumbsDown,
    title: 'Issue',
    description: 'Something not working as expected?',
    color: 'text-red-500 border-red-200 hover:bg-red-50'
  },
  {
    id: 'general',
    icon: MessageCircle,
    title: 'General',
    description: 'Any other feedback or thoughts',
    color: 'text-blue-500 border-blue-200 hover:bg-blue-50'
  }
]

const ratings = [1, 2, 3, 4, 5]

export default function FeedbackPage() {
  const [selectedType, setSelectedType] = useState('')
  const [rating, setRating] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedback: ''
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
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">We'd Love Your Feedback!</h1>
          <p className="text-xl text-muted-foreground">
            Help us improve Streamyyy by sharing your thoughts and experiences
          </p>
        </div>

        {submitted ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ThumbsUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Thank You!</h3>
              <p className="text-muted-foreground mb-4">
                Your feedback has been submitted successfully. We really appreciate you taking the time to help us improve!
              </p>
              <Button 
                onClick={() => {
                  setSubmitted(false)
                  setFormData({ name: '', email: '', feedback: '' })
                  setSelectedType('')
                  setRating(0)
                }}
              >
                Submit More Feedback
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Share Your Experience</CardTitle>
              <CardDescription>
                Your feedback helps us make Streamyyy better for everyone
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rating */}
                <div>
                  <Label className="text-base font-medium">How would you rate Streamyyy?</Label>
                  <div className="flex items-center gap-2 mt-2">
                    {ratings.map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-1 rounded transition-colors ${
                          star <= rating ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'
                        }`}
                      >
                        <Star className={`w-8 h-8 ${star <= rating ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                    {rating > 0 && (
                      <span className="ml-2 text-sm text-muted-foreground">
                        {rating} of 5 stars
                      </span>
                    )}
                  </div>
                </div>

                {/* Feedback Type */}
                <div>
                  <Label className="text-base font-medium">What type of feedback is this?</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {feedbackTypes.map((type) => {
                      const Icon = type.icon
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setSelectedType(type.id)}
                          className={`p-4 border rounded-lg text-left transition-all ${
                            selectedType === type.id 
                              ? 'border-primary bg-primary/5' 
                              : `border-gray-200 ${type.color}`
                          }`}
                        >
                          <Icon className="w-6 h-6 mb-2" />
                          <h3 className="font-medium">{type.title}</h3>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name (optional)</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email (optional)</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {/* Feedback Text */}
                <div>
                  <Label htmlFor="feedback">Your Feedback</Label>
                  <Textarea
                    id="feedback"
                    name="feedback"
                    value={formData.feedback}
                    onChange={handleInputChange}
                    rows={6}
                    placeholder="Tell us about your experience with Streamyyy..."
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting || !formData.feedback.trim()} 
                  className="w-full"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 text-center">
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
          >
            Back to Streams
          </Button>
        </div>
      </div>
    </div>
  )
}