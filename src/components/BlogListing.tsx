'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Calendar, Clock, User, TrendingUp, Camera, Video, Mic, Monitor, DollarSign, Sparkles, Filter, Search, ChevronRight, Eye, BookOpen, Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const blogPosts = [
  {
    slug: 'twitch-ad-blocker-not-working-2025',
    title: 'Twitch Ad Blocker Not Working? Best Solutions for 2025',
    excerpt: 'Twitch ad blockers stopped working? Learn why uBlock Origin, AdBlock Plus fail and discover the best ad-free Twitch alternatives that actually work in 2025.',
    category: 'Ad Blocking',
    readTime: '12 min read',
    date: '2025-01-15',
    author: 'Streamyyy Team',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop',
    icon: Monitor,
    featured: true,
    views: '28.4K',
    rating: 4.9
  },
  {
    slug: 'watch-multiple-twitch-streams-mobile',
    title: 'How to Watch Multiple Twitch Streams on Mobile: Complete 2025 Guide',
    excerpt: 'Complete guide to watching multiple Twitch streams on mobile devices. Best mobile multi-stream apps, tips for iOS/Android, and optimization techniques.',
    category: 'Mobile Guide',
    readTime: '10 min read',
    date: '2025-01-14',
    author: 'Streamyyy Team',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop',
    icon: Monitor,
    featured: true,
    views: '19.7K',
    rating: 4.8
  },
  {
    slug: 'streaming-monetization-complete-guide-2025',
    title: 'Streaming Monetization Guide 2025: How I Made $3,200/Month Streaming',
    excerpt: 'Complete guide to streaming monetization in 2025. Real revenue breakdowns, platform comparisons, and strategies that actually work for growing streamers.',
    category: 'Monetization',
    readTime: '18 min read',
    date: '2025-01-15',
    author: 'Streamyyy Team',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=400&fit=crop',
    icon: DollarSign,
    featured: true,
    views: '34.2K',
    rating: 4.9
  },
  {
    slug: 'best-streaming-platforms-2025-complete-comparison',
    title: 'Best Streaming Platforms 2025: Complete Comparison (YouTube vs Twitch vs Kick vs TikTok)',
    excerpt: 'Complete comparison of streaming platforms in 2025. Real market data, revenue splits, and authentic experiences across YouTube Live, Twitch, Kick, and TikTok Live.',
    category: 'Platform Guide',
    readTime: '16 min read',
    date: '2025-01-16',
    author: 'Streamyyy Team',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    icon: TrendingUp,
    featured: true,
    views: '41.7K',
    rating: 4.8
  },
  {
    slug: 'complete-streaming-setup-guide-2025',
    title: 'Complete Streaming Setup Guide 2025: Budget to Professional ($200-$5,000)',
    excerpt: 'Complete streaming setup guide for 2025. Real equipment recommendations, software setups, and step-by-step instructions for every budget level.',
    category: 'Setup Guide',
    readTime: '22 min read',
    date: '2025-01-16',
    author: 'Streamyyy Team',
    authorAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1593152167544-085d3b9c4938?w=800&h=400&fit=crop',
    icon: Monitor,
    featured: false,
    views: '38.9K',
    rating: 4.9
  },
  {
    slug: 'grow-your-stream-2025-proven-strategies',
    title: 'How to Grow Your Stream in 2025: 10 Proven Strategies That Actually Work',
    excerpt: 'Real growth strategies for streamers in 2025. Proven tactics that grew streams from 0 to 10K followers, with current algorithm insights and authentic case studies.',
    category: 'Growth',
    readTime: '19 min read',
    date: '2025-01-16',
    author: 'Streamyyy Team',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop',
    icon: TrendingUp,
    featured: false,
    views: '45.3K',
    rating: 4.8
  },
  {
    slug: 'multitwitch-vs-streamyyy-comparison',
    title: 'Multitwitch vs Streamyyy: The Ultimate Multi-Stream Viewer Comparison',
    excerpt: 'Complete comparison of Multitwitch.tv vs Streamyyy. Features, performance, mobile support, and which multi-stream viewer is best for watching multiple Twitch streams.',
    category: 'Comparison',
    readTime: '15 min read',
    date: '2025-01-13',
    author: 'Streamyyy Team',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    icon: Monitor,
    featured: false,
    views: '22.1K',
    rating: 4.8
  },
  {
    slug: 'how-to-watch-multiple-streams',
    title: 'How to Watch Multiple Streams at Once: The Ultimate MultiStream Guide',
    excerpt: 'Learn how to watch multiple Twitch and YouTube streams simultaneously. STREAMYYY makes multistream viewing simple and powerful.',
    category: 'Tutorials',
    readTime: '8 min read',
    date: '2025-07-01',
    author: 'STREAMYYY Team',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop',
    icon: Monitor,
    featured: false,
    views: '15.2K',
    rating: 4.9
  },
  {
    slug: 'how-to-start-streaming-2025',
    title: 'How to Start Streaming in 2025: Complete Beginner\'s Guide',
    excerpt: 'Everything you need to know to start your streaming journey in 2025. From choosing platforms to building your first audience.',
    category: 'Getting Started',
    readTime: '12 min read',
    date: '2025-07-01',
    author: 'STREAMYYY Team',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&h=400&fit=crop',
    icon: TrendingUp,
    featured: false,
    views: '23.8K',
    rating: 4.8
  },
  {
    slug: 'best-cameras-for-streaming-2025',
    title: 'Best Cameras for Streaming in 2025: Pro Streamer Recommendations',
    excerpt: 'Discover the top cameras for streaming, from budget-friendly webcams to professional DSLR setups. Complete buying guide with real testing results.',
    category: 'Equipment',
    readTime: '15 min read',
    date: '2025-01-15',
    author: 'STREAMYYY Team',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=400&fit=crop',
    icon: Camera,
    featured: false,
    views: '29.1K',
    rating: 4.7
  }
]

const categories = [
  { name: 'All Posts', count: blogPosts.length, icon: BookOpen },
  { name: 'Ad Blocking', count: 1, icon: Monitor },
  { name: 'Mobile Guide', count: 1, icon: Video },
  { name: 'Monetization', count: 1, icon: DollarSign },
  { name: 'Platform Guide', count: 1, icon: TrendingUp },
  { name: 'Setup Guide', count: 1, icon: Monitor },
  { name: 'Growth', count: 1, icon: TrendingUp },
  { name: 'Comparison', count: 1, icon: TrendingUp },
  { name: 'Tutorials', count: 1, icon: Video },
  { name: 'Getting Started', count: 1, icon: Sparkles },
  { name: 'Equipment', count: 1, icon: Camera }
]

export default function BlogListing() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Posts')
  const [hoveredPost, setHoveredPost] = useState<string | null>(null)

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All Posts' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="relative bg-gradient-to-b from-background via-background/95 to-muted/20">
      {/* Enhanced Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/10 to-pink-500/10 opacity-50" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-32" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">The Ultimate Streaming Resource</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x">
                Streaming Blog
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed">
              Master the art of streaming with expert guides, equipment reviews, and growth strategies.
              Join 50,000+ creators reading our blog.
            </p>

            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto relative"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-6 text-lg rounded-full border-2 border-border/50 focus:border-primary/50 transition-colors bg-background/50 backdrop-blur-sm"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="py-8 border-y bg-background/50 backdrop-blur-sm sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map((category, index) => (
              <motion.button
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedCategory(category.name)}
                className={cn(
                  "inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300",
                  selectedCategory === category.name
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                    : "bg-background hover:bg-muted border border-border/50"
                )}
              >
                <category.icon className="w-4 h-4" />
                <span>{category.name}</span>
                <Badge variant="secondary" className="ml-1">
                  {category.count}
                </Badge>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      {selectedCategory === 'All Posts' && (
        <section className="py-16 bg-gradient-to-b from-background to-muted/10">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <Star className="w-8 h-8 text-yellow-500 fill-current" />
                Featured Articles
              </h2>
              <Button variant="ghost" className="gap-2">
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {blogPosts.filter(post => post.featured).map((post, index) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredPost(post.slug)}
                  onMouseLeave={() => setHoveredPost(null)}
                >
                  <Link href={`/blog/${post.slug}`}>
                    <Card className="group overflow-hidden h-full hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/50">
                      <div className="aspect-[16/9] relative overflow-hidden">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        <Badge className="absolute top-4 left-4 bg-primary text-white border-0">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Featured
                        </Badge>
                        <div className="absolute bottom-4 left-4 right-4">
                          <Badge variant="secondary" className="mb-3">
                            {post.category}
                          </Badge>
                          <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2">
                            {post.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-white/80">
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {post.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {post.readTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-current" />
                              {post.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Image
                              src={post.authorAvatar}
                              alt={post.author}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                            <div>
                              <p className="text-sm font-medium">{post.author}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(post.date).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
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
      )}

      {/* All Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">No articles found matching your search.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                >
                  <Link href={`/blog/${post.slug}`}>
                    <Card className="group h-full hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <div className="aspect-video relative overflow-hidden">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                        <Badge className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm">
                          {post.category}
                        </Badge>
                      </div>
                      
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(post.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {post.views}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        
                        <p className="text-muted-foreground line-clamp-3">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-2">
                            <Image
                              src={post.authorAvatar}
                              alt={post.author}
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                            <span className="text-sm font-medium">{post.author}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {post.readTime}
                            </span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 bg-gradient-to-b from-muted/20 to-background relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="mb-4 px-4 py-1.5" variant="outline">
              <Sparkles className="w-3 h-3 mr-1" />
              Newsletter
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Get the Latest Streaming Tips
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join 10,000+ creators who receive our weekly newsletter packed with streaming insights, 
              equipment reviews, and growth strategies.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1"
              />
              <Button size="lg" className="gap-2">
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  )
}