'use client'

import { useState } from 'react'
import BlogHeader from '@/components/BlogHeader'
import Footer from '@/components/Footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Calendar, Clock, User, Share2, Twitter, Facebook, Link as LinkIcon, Heart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import { motion } from 'framer-motion'

interface BlogPostProps {
  title: string
  author: string
  date: string
  readTime: string
  category: string
  image: string
  content: string
}

export default function BlogPost({ title, author, date, readTime, category, image, content }: BlogPostProps) {
  const [liked, setLiked] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedTitle = encodeURIComponent(title)
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    }
    
    window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <BlogHeader />
      
      <main className="flex-1">
        <article className="relative">
          {/* Hero Section */}
          <div className="relative h-[400px] md:h-[500px] overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="container mx-auto max-w-4xl">
                <Link href="/blog">
                  <Button variant="ghost" size="sm" className="mb-4 gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Blog
                  </Button>
                </Link>
                <Badge className="mb-4">{category}</Badge>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-white/80">
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {author}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(date).toLocaleDateString('en-US', { 
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {readTime}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="container mx-auto max-w-4xl px-4 py-12">
            <div className="grid md:grid-cols-[1fr,300px] gap-8">
              {/* Main Content */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-lg dark:prose-invert max-w-none"
              >
                <ReactMarkdown
                  components={{
                    img: ({ node, ...props }) => (
                      <Image
                        src={props.src || ''}
                        alt={props.alt || ''}
                        width={1200}
                        height={600}
                        className="rounded-lg my-6"
                      />
                    ),
                    iframe: ({ node, ...props }) => (
                      <div className="relative aspect-video my-6">
                        <iframe
                          {...props}
                          className="absolute inset-0 w-full h-full rounded-lg"
                          allowFullScreen
                        />
                      </div>
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 {...props} className="text-2xl md:text-3xl font-bold mt-12 mb-6" />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 {...props} className="text-xl md:text-2xl font-semibold mt-8 mb-4" />
                    ),
                    p: ({ node, ...props }) => (
                      <p {...props} className="leading-relaxed mb-6" />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul {...props} className="space-y-2 mb-6" />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol {...props} className="space-y-2 mb-6" />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote {...props} className="border-l-4 border-primary pl-6 italic my-8" />
                    ),
                    a: ({ node, ...props }) => (
                      <a {...props} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" />
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>
              </motion.div>

              {/* Sidebar */}
              <aside className="space-y-6">
                {/* Share Section */}
                <Card className="p-6 sticky top-4">
                  <h3 className="font-semibold mb-4">Share this article</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare('twitter')}
                      className="gap-2"
                    >
                      <Twitter className="w-4 h-4" />
                      Twitter
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare('facebook')}
                      className="gap-2"
                    >
                      <Facebook className="w-4 h-4" />
                      Facebook
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyLink}
                      className="gap-2"
                    >
                      <LinkIcon className="w-4 h-4" />
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t">
                    <Button
                      variant={liked ? "default" : "outline"}
                      className="w-full gap-2"
                      onClick={() => setLiked(!liked)}
                    >
                      <Heart className={liked ? "w-4 h-4 fill-current" : "w-4 h-4"} />
                      {liked ? 'Liked!' : 'Like this article'}
                    </Button>
                  </div>
                </Card>

                {/* Newsletter CTA */}
                <Card className="p-6 bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
                  <h3 className="font-semibold mb-2">Get Streaming Tips</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Join our newsletter for the latest streaming guides and platform updates.
                  </p>
                  <Button className="w-full" size="sm">
                    Subscribe
                  </Button>
                </Card>

                {/* Related Articles */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Related Articles</h3>
                  <div className="space-y-3">
                    <Link href="/blog/best-cameras-for-streaming-2025" className="block hover:text-primary transition-colors">
                      <p className="font-medium text-sm">Best Cameras for Streaming</p>
                      <p className="text-xs text-muted-foreground">Equipment Guide</p>
                    </Link>
                    <Link href="/blog/streaming-setup-ultimate-guide" className="block hover:text-primary transition-colors">
                      <p className="font-medium text-sm">Ultimate Streaming Setup</p>
                      <p className="text-xs text-muted-foreground">Setup Guide</p>
                    </Link>
                    <Link href="/blog/grow-your-stream-proven-strategies" className="block hover:text-primary transition-colors">
                      <p className="font-medium text-sm">Grow Your Stream</p>
                      <p className="text-xs text-muted-foreground">Growth Strategies</p>
                    </Link>
                  </div>
                </Card>
              </aside>
            </div>
          </div>

          {/* CTA Section */}
          <section className="py-16 bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto max-w-4xl px-4 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Multi-Streaming?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Watch and learn from multiple streamers simultaneously with STREAMYYY
              </p>
              <Link href="/">
                <Button size="lg" className="gap-2">
                  Try STREAMYYY Free
                  <Share2 className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  )
}