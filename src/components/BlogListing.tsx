'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Calendar, Clock, User, TrendingUp, Camera, Video, Mic, Monitor, DollarSign } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const blogPosts = [
  {
    slug: 'how-to-watch-multiple-streams',
    title: 'How to Watch Multiple Streams at Once: The Ultimate MultiStream Guide',
    excerpt: 'Learn how to watch multiple Twitch and YouTube streams simultaneously. STREAMYYY makes multistream viewing simple and powerful.',
    category: 'Tutorials',
    readTime: '8 min read',
    date: '2025-01-02',
    author: 'STREAMYYY Team',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop',
    icon: Monitor,
    featured: true
  },
  {
    slug: 'how-to-start-streaming-2025',
    title: 'How to Start Streaming in 2025: Complete Beginner\'s Guide',
    excerpt: 'Everything you need to know to start your streaming journey in 2025. From choosing platforms to building your first audience.',
    category: 'Getting Started',
    readTime: '12 min read',
    date: '2025-01-02',
    author: 'STREAMYYY Team',
    image: 'https://images.unsplash.com/photo-1598550487031-0898b4852123?w=800&h=400&fit=crop',
    icon: TrendingUp,
    featured: true
  },
  {
    slug: 'best-cameras-for-streaming-2025',
    title: 'Best Cameras for Streaming in 2025: Pro Streamer Recommendations',
    excerpt: 'Discover the top cameras for streaming, from budget-friendly webcams to professional DSLR setups. Complete buying guide included.',
    category: 'Equipment',
    readTime: '15 min read',
    date: '2025-01-01',
    author: 'STREAMYYY Team',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=400&fit=crop',
    icon: Camera,
    featured: true
  },
  {
    slug: 'streaming-setup-ultimate-guide',
    title: 'The Ultimate Streaming Setup Guide: Build Your Dream Studio',
    excerpt: 'Build the perfect streaming setup on any budget. Covers everything from PCs to lighting, audio equipment, and room acoustics.',
    category: 'Setup Guide',
    readTime: '20 min read',
    date: '2024-12-30',
    author: 'STREAMYYY Team',
    image: 'https://images.unsplash.com/photo-1598743400863-0201c7e1445b?w=800&h=400&fit=crop',
    icon: Monitor
  },
  {
    slug: 'grow-your-stream-proven-strategies',
    title: 'How to Grow Your Stream: 10 Proven Strategies for 2025',
    excerpt: 'Learn the strategies top streamers use to grow their channels. From content planning to community building and monetization.',
    category: 'Growth',
    readTime: '10 min read',
    date: '2024-12-28',
    author: 'STREAMYYY Team',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop',
    icon: TrendingUp
  },
  {
    slug: 'streaming-monetization-guide',
    title: 'Streaming Monetization: Turn Your Passion into Profit',
    excerpt: 'Comprehensive guide to making money from streaming. Covers donations, subscriptions, sponsorships, and alternative revenue streams.',
    category: 'Monetization',
    readTime: '18 min read',
    date: '2024-12-25',
    author: 'STREAMYYY Team',
    image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&h=400&fit=crop',
    icon: DollarSign
  }
]

const categories = [
  { name: 'All Posts', count: blogPosts.length },
  { name: 'Tutorials', count: 1 },
  { name: 'Getting Started', count: 1 },
  { name: 'Equipment', count: 1 },
  { name: 'Setup Guide', count: 1 },
  { name: 'Growth', count: 1 },
  { name: 'Monetization', count: 1 }
]

export default function BlogListing() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-32" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4 px-4 py-1.5" variant="outline">
              <Video className="w-3 h-3 mr-1" />
              Streaming Blog
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Master the Art of
              <span className="block mt-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Live Streaming
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Expert guides, equipment reviews, and growth strategies to help you succeed in streaming.
              Join thousands of streamers who trust STREAMYYY for their streaming journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Featured Articles</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {blogPosts.filter(post => post.featured).map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group h-full">
                    <div className="aspect-video relative overflow-hidden bg-muted">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <Badge className="absolute top-4 left-4 bg-primary text-white border-0">
                        Featured
                      </Badge>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(post.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readTime}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{post.category}</Badge>
                        <Button variant="ghost" size="sm" className="gap-2 group-hover:gap-3 transition-all">
                          Read More
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <aside className="md:w-64 space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.name}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors flex items-center justify-between"
                    >
                      <span>{category.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-lg border">
                <h3 className="font-semibold mb-2">Newsletter</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get the latest streaming tips and updates delivered to your inbox.
                </p>
                <Button className="w-full" size="sm">
                  Subscribe
                </Button>
              </div>
            </aside>

            {/* Posts Grid */}
            <div className="flex-1">
              <div className="grid gap-6">
                {blogPosts.map((post, index) => (
                  <motion.div
                    key={post.slug}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/blog/${post.slug}`}>
                      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-72 aspect-video md:aspect-[4/3] relative overflow-hidden bg-muted">
                            <Image
                              src={post.image}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 p-6">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                              <span className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {post.author}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(post.date).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {post.readTime}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-muted-foreground mb-4">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline">{post.category}</Badge>
                              <Button variant="ghost" size="sm" className="gap-2 group-hover:gap-3 transition-all">
                                Read Article
                                <ArrowRight className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}