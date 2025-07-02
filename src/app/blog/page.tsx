import type { Metadata } from 'next'
import BlogHeader from '@/components/BlogHeader'
import Footer from '@/components/Footer'
import BlogListing from '@/components/BlogListing'

export const metadata: Metadata = {
  title: 'Streaming Blog - Guides, Tips & News | STREAMYYY',
  description: 'Learn how to start streaming in 2025, discover the best streaming equipment, and get expert tips to grow your channel. Your complete guide to streaming success.',
  keywords: 'streaming blog, how to stream, streaming tips, streaming equipment, twitch streaming, youtube streaming, streaming guide 2025',
  openGraph: {
    title: 'Streaming Blog - Expert Guides & Tips | STREAMYYY',
    description: 'Master the art of streaming with our comprehensive guides, equipment reviews, and growth strategies.',
    type: 'website',
    images: ['/og-blog.png']
  }
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <BlogHeader />
      <main className="flex-1">
        <BlogListing />
      </main>
      <Footer />
    </div>
  )
}