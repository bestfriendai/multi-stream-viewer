import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Users, Quote } from 'lucide-react'

interface Testimonial {
  id: string
  name: string
  username?: string
  avatar?: string
  rating: number
  quote: string
  category: string
  platform?: string
  verified?: boolean
  date?: string
}

interface UserTestimonialsProps {
  title?: string
  testimonials: Testimonial[]
  className?: string
  showStats?: boolean
}

const allTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Alex M.',
    username: 'gaming_alex',
    rating: 5,
    quote: 'Switched from MultiTwitch last month. The mobile support alone makes it worth it - I can watch streams on my phone during breaks.',
    category: 'Mobile Experience',
    platform: 'Mobile',
    verified: true,
    date: '2 weeks ago'
  },
  {
    id: '2', 
    name: 'Sarah K.',
    username: 'sarahstreams',
    rating: 5,
    quote: 'Finally can watch YouTube and Twitch streams together! MultiTwitch was so limiting.',
    category: 'Multi-Platform',
    platform: 'Desktop',
    verified: true,
    date: '1 month ago'
  },
  {
    id: '3',
    name: 'Mike D.',
    username: 'miked_esports',
    rating: 5,
    quote: 'Performance is night and day. Used to lag with 4 streams on MultiTwitch, now I watch 8+ without issues.',
    category: 'Performance',
    platform: 'Desktop',
    verified: true,
    date: '3 weeks ago'
  },
  {
    id: '4',
    name: 'Jordan T.',
    username: 'jordantech',
    rating: 5,
    quote: 'TwitchTheater always crashed on my phone. Streamyyy works perfectly on mobile - exactly what I needed!',
    category: 'Reliability',
    platform: 'Mobile',
    verified: true,
    date: '1 week ago'
  },
  {
    id: '5',
    name: 'Emma R.',
    username: 'emma_watches',
    rating: 5,
    quote: 'Love being able to watch YouTube and Twitch together. TwitchTheater never had good YouTube support.',
    category: 'Platform Support',
    platform: 'Desktop',
    verified: true,
    date: '2 months ago'
  },
  {
    id: '6',
    name: 'Carlos M.',
    username: 'carlos_gamer',
    rating: 5,
    quote: 'Performance is so much better. Used to lag with 4 streams on TwitchTheater, now I watch 12+ easily.',
    category: 'Performance',
    platform: 'Desktop',
    verified: true,
    date: '3 weeks ago'
  },
  {
    id: '7',
    name: 'Maya L.',
    username: 'maya_mobile',
    rating: 5,
    quote: 'Finally can watch on my phone! Multistre.am was impossible to use on mobile.',
    category: 'Mobile Experience',
    platform: 'Mobile',
    verified: true,
    date: '1 month ago'
  },
  {
    id: '8',
    name: 'Tyler K.',
    username: 'tyler_esports',
    rating: 5,
    quote: 'Love being able to mix YouTube and Twitch streams. Multistre.am only had Twitch.',
    category: 'Multi-Platform',
    platform: 'Desktop',
    verified: true,
    date: '2 weeks ago'
  },
  {
    id: '9',
    name: 'Lisa P.',
    username: 'lisa_streams',
    rating: 5,
    quote: 'The interface is so much cleaner and easier to use than any competitor I\'ve tried.',
    category: 'User Experience',
    platform: 'Desktop',
    verified: true,
    date: '1 month ago'
  },
  {
    id: '10',
    name: 'David R.',
    username: 'david_viewer',
    rating: 5,
    quote: 'Been using for 6 months now. Rock solid reliability, never had the downtime issues I had with other services.',
    category: 'Reliability',
    platform: 'Desktop',
    verified: true,
    date: '6 months ago'
  }
]

export default function UserTestimonials({ 
  title = "What Our Users Say", 
  testimonials = allTestimonials.slice(0, 6),
  className = "",
  showStats = true
}: UserTestimonialsProps) {
  const avgRating = testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length
  const totalUsers = "50,000+"
  
  return (
    <section className={`space-y-8 ${className}`}>
      {/* Header with Stats */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        
        {showStats && (
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${i < Math.floor(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="font-semibold text-lg">{avgRating.toFixed(1)}/5</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="font-semibold">{totalUsers} Users</span>
            </div>
            <Badge className="bg-green-600">
              100% Recommended
            </Badge>
          </div>
        )}
      </div>

      {/* Testimonials Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="relative hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{testimonial.name}</span>
                      {testimonial.verified && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                          ✓ Verified
                        </Badge>
                      )}
                    </div>
                    {testimonial.username && (
                      <span className="text-xs text-muted-foreground">@{testimonial.username}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  {testimonial.date && (
                    <span className="text-xs text-muted-foreground">{testimonial.date}</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {testimonial.category}
                </Badge>
                {testimonial.platform && (
                  <Badge variant="secondary" className="text-xs">
                    {testimonial.platform}
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="relative">
                <Quote className="absolute -top-2 -left-1 h-6 w-6 text-primary/20" />
                <p className="text-sm italic pl-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Call to Action */}
      <div className="text-center pt-8">
        <p className="text-sm text-muted-foreground mb-4">
          Join thousands of satisfied users who've made the switch to Streamyyy
        </p>
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            4.9/5 Average Rating
          </span>
          <span>•</span>
          <span>50,000+ Active Users</span>
          <span>•</span>
          <span>99.9% Uptime</span>
        </div>
      </div>
    </section>
  )
}

// Pre-filtered testimonial sets for different use cases
export const mobileTestimonials = allTestimonials.filter(t => t.platform === 'Mobile' || t.category === 'Mobile Experience')
export const performanceTestimonials = allTestimonials.filter(t => t.category === 'Performance')
export const competitorTestimonials = allTestimonials.filter(t => t.quote.includes('MultiTwitch') || t.quote.includes('TwitchTheater') || t.quote.includes('Multistre'))
export const reliabilityTestimonials = allTestimonials.filter(t => t.category === 'Reliability')
export const featuredTestimonials = allTestimonials.slice(0, 6)