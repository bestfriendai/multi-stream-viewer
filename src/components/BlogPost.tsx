'use client'

import { useState, useEffect } from 'react'
import BlogHeader from '@/components/BlogHeader'
import Footer from '@/components/Footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Calendar, Clock, User, Share2, Twitter, Facebook, Link as LinkIcon, Heart, Eye, BookOpen, ChevronRight, Copy, Check, Bookmark, MessageSquare, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import { motion, useScroll, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

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
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  useEffect(() => {
    const updateReadingProgress = () => {
      const scrolled = window.scrollY
      const height = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrolled / height) * 100
      setReadingProgress(Math.min(100, Math.max(0, progress)))
    }

    window.addEventListener('scroll', updateReadingProgress)
    return () => window.removeEventListener('scroll', updateReadingProgress)
  }, [])

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

  // Mock data for related articles
  const relatedArticles = [
    {
      title: 'Best Cameras for Streaming in 2025',
      category: 'Equipment',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
      slug: 'best-cameras-for-streaming-2025'
    },
    {
      title: 'Ultimate Streaming Setup Guide',
      category: 'Setup Guide',
      image: 'https://images.unsplash.com/photo-1593152167544-085d3b9c4938?w=400&h=300&fit=crop',
      slug: 'streaming-setup-ultimate-guide'
    },
    {
      title: 'Grow Your Stream: Proven Strategies',
      category: 'Growth',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop',
      slug: 'grow-your-stream-proven-strategies'
    }
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <BlogHeader />
      
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-16 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX }}
      />
      
      <main className="flex-1">
        <article className="relative">
          {/* Hero Section with Parallax */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative h-[500px] md:h-[600px] overflow-hidden"
          >
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="container mx-auto max-w-5xl">
                <Link href="/blog">
                  <Button variant="ghost" size="sm" className="mb-6 gap-2 text-white/80 hover:text-white">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Blog
                  </Button>
                </Link>
                
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Badge className="mb-4 text-base px-4 py-1">{category}</Badge>
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    {title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-6 text-white/90">
                    <div className="flex items-center gap-3">
                      <Image
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop"
                        alt={author}
                        width={50}
                        height={50}
                        className="rounded-full border-2 border-white/20"
                      />
                      <div>
                        <p className="font-medium">{author}</p>
                        <p className="text-sm text-white/70">Content Creator</p>
                      </div>
                    </div>
                    
                    <Separator orientation="vertical" className="h-8 bg-white/20" />
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm">
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
                      <span className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        24.5K views
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <div className="container mx-auto max-w-5xl px-4 py-12">
            <div className="grid lg:grid-cols-[1fr,350px] gap-12">
              {/* Main Content */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="prose prose-lg dark:prose-invert max-w-none"
              >
                <ReactMarkdown
                  components={{
                    img: ({ node, ...props }) => (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="my-8 rounded-xl overflow-hidden shadow-2xl"
                      >
                        <Image
                          src={typeof props.src === 'string' ? props.src : ''}
                          alt={props.alt || ''}
                          width={1200}
                          height={600}
                          className="w-full h-auto"
                        />
                      </motion.div>
                    ),
                    iframe: ({ node, ...props }) => (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative aspect-video my-8 rounded-xl overflow-hidden shadow-2xl bg-black"
                      >
                        <iframe
                          {...props}
                          className="absolute inset-0 w-full h-full"
                          allowFullScreen
                        />
                      </motion.div>
                    ),
                    h2: ({ node, children, ...props }) => (
                      <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl md:text-4xl font-bold mt-16 mb-6 text-foreground flex items-center gap-3"
                        id={props.id}
                      >
                        <span className="w-1 h-8 bg-primary rounded-full" />
                        {children}
                      </motion.h2>
                    ),
                    h3: ({ node, children, ...props }) => (
                      <motion.h3
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-2xl md:text-3xl font-semibold mt-12 mb-4 text-foreground"
                        id={props.id}
                      >
                        {children}
                      </motion.h3>
                    ),
                    p: ({ node, children, ...props }) => (
                      <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="leading-relaxed mb-6 text-muted-foreground text-lg"
                      >
                        {children}
                      </motion.p>
                    ),
                    ul: ({ node, children, ...props }) => (
                      <motion.ul
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-3 mb-6 ml-4"
                      >
                        {children}
                      </motion.ul>
                    ),
                    ol: ({ node, children, ...props }) => (
                      <motion.ol
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-3 mb-6 ml-4"
                      >
                        {children}
                      </motion.ol>
                    ),
                    li: ({ node, children, ...props }) => (
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>{children}</span>
                      </li>
                    ),
                    blockquote: ({ node, children, ...props }) => (
                      <motion.blockquote
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="border-l-4 border-primary pl-6 italic my-8 text-xl text-muted-foreground bg-muted/30 py-4 pr-4 rounded-r-lg"
                      >
                        {children}
                      </motion.blockquote>
                    ),
                    a: ({ node, children, ...props }) => (
                      <a href={props.href} className="text-primary hover:underline font-medium" target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    ),
                    code: ({ node, children, className, ...props }: any) => (
                      className?.includes('language-') ? 
                        <pre className="bg-muted/50 border border-border rounded-lg p-4 overflow-x-auto my-6">
                          <code className="text-sm font-mono">
                            {children}
                          </code>
                        </pre> :
                        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                          {children}
                        </code>
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>
              </motion.div>

              {/* Sidebar */}
              <aside className="space-y-8 lg:sticky lg:top-24 lg:h-fit">
                {/* Share Section */}
                <Card className="p-6 border-2">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Share this article
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare('twitter')}
                      className="gap-2 flex-1"
                    >
                      <Twitter className="w-4 h-4" />
                      Twitter
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare('facebook')}
                      className="gap-2 flex-1"
                    >
                      <Facebook className="w-4 h-4" />
                      Facebook
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyLink}
                      className="gap-2 flex-1"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="flex gap-2">
                    <Button
                      variant={liked ? "default" : "outline"}
                      className="flex-1 gap-2"
                      onClick={() => setLiked(!liked)}
                    >
                      <Heart className={cn("w-4 h-4", liked && "fill-current")} />
                      {liked ? '1,234' : '1,233'}
                    </Button>
                    <Button
                      variant={saved ? "default" : "outline"}
                      className="flex-1 gap-2"
                      onClick={() => setSaved(!saved)}
                    >
                      <Bookmark className={cn("w-4 h-4", saved && "fill-current")} />
                      Save
                    </Button>
                  </div>
                </Card>

                {/* Reading Progress */}
                <Card className="p-6 border-2">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Reading Progress
                  </h3>
                  <Progress value={readingProgress} className="mb-2" />
                  <p className="text-sm text-muted-foreground">{Math.round(readingProgress)}% complete</p>
                </Card>

                {/* Newsletter CTA */}
                <Card className="p-6 bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20 border-2">
                  <h3 className="font-semibold mb-2">Get Streaming Tips</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Join our newsletter for the latest streaming guides and platform updates.
                  </p>
                  <Button className="w-full" size="sm">
                    Subscribe
                  </Button>
                </Card>

                {/* Table of Contents */}
                <Card className="p-6 border-2">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    In This Article
                  </h3>
                  <nav className="space-y-2">
                    {[
                      'Getting Started',
                      'Essential Equipment',
                      'Platform Selection',
                      'Growing Your Audience',
                      'Monetization Strategies',
                      'Common Mistakes',
                      'Future Trends'
                    ].map((item, index) => (
                      <a
                        key={index}
                        href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1 pl-4 border-l-2 border-border hover:border-primary"
                      >
                        {item}
                      </a>
                    ))}
                  </nav>
                </Card>
              </aside>
            </div>
          </div>

          {/* Related Articles */}
          <section className="py-16 bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto max-w-5xl px-4">
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <MessageSquare className="w-8 h-8" />
                Related Articles
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedArticles.map((article, index) => (
                  <motion.div
                    key={article.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={`/blog/${article.slug}`}>
                      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                        <div className="aspect-video relative overflow-hidden">
                          <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <Badge className="absolute bottom-4 left-4 bg-background/90">
                            {article.category}
                          </Badge>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                            {article.title}
                          </h3>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-24 bg-gradient-to-b from-muted/20 to-background relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
            </div>
            <div className="container mx-auto max-w-4xl px-4 text-center relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <Badge className="mb-4 px-4 py-1.5" variant="outline">
                  <Share2 className="w-3 h-3 mr-1" />
                  Start Streaming
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Ready to Start Multi-Streaming?
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Watch and learn from multiple streamers simultaneously with STREAMYYY
                </p>
                <Link href="/">
                  <Button size="lg" className="gap-2">
                    Try STREAMYYY Free
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  )
}