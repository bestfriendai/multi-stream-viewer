import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Clock, Users } from 'lucide-react'

interface RelatedArticle {
  title: string
  href: string
  description: string
  category: string
  readTime?: string
  popularity?: 'high' | 'medium' | 'low'
}

interface RelatedArticlesProps {
  title?: string
  articles: RelatedArticle[]
  className?: string
}

const popularityColors = {
  high: 'bg-green-600',
  medium: 'bg-yellow-600', 
  low: 'bg-blue-600'
}

const popularityLabels = {
  high: 'Popular',
  medium: 'Trending',
  low: 'New'
}

export default function RelatedArticles({ 
  title = "Related Articles", 
  articles, 
  className = "" 
}: RelatedArticlesProps) {
  if (articles.length === 0) return null

  return (
    <section className={`space-y-6 ${className}`}>
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Badge variant="outline" className="text-xs">
          {articles.length} articles
        </Badge>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article, index) => (
          <Card key={index} className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="text-xs">
                  {article.category}
                </Badge>
                {article.popularity && (
                  <Badge className={`text-xs ${popularityColors[article.popularity]}`}>
                    {popularityLabels[article.popularity]}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                <Link href={article.href} className="hover:underline">
                  {article.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {article.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {article.readTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.readTime}
                    </div>
                  )}
                </div>
                
                <Link 
                  href={article.href}
                  className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Read more
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

// Predefined article sets for different page types
export const multiStreamArticles: RelatedArticle[] = [
  {
    title: "How to Watch Multiple Twitch Streams on Mobile",
    href: "/blog/watch-multiple-twitch-streams-mobile",
    description: "Complete guide to using Streamyyy's mobile multi-stream viewer for the best mobile experience.",
    category: "Mobile Guide",
    readTime: "5 min read",
    popularity: "high"
  },
  {
    title: "Streamyyy vs MultiTwitch: Complete Comparison",
    href: "/vs/multitwitch", 
    description: "See why Streamyyy is the superior alternative to MultiTwitch with better features and performance.",
    category: "Comparison",
    readTime: "8 min read",
    popularity: "high"
  },
  {
    title: "Best Multi-Stream Layouts for Esports Viewing",
    href: "/guide/watching-multiple-streams",
    description: "Optimize your multi-stream setup for esports tournaments and competitive gaming events.",
    category: "Tutorial",
    readTime: "6 min read",
    popularity: "medium"
  },
  {
    title: "Ultimate Streaming Setup Guide",
    href: "/blog/streaming-setup-ultimate-guide",
    description: "Everything you need to know about setting up the perfect streaming environment.",
    category: "Setup Guide",
    readTime: "12 min read",
    popularity: "medium"
  }
]

export const competitorArticles: RelatedArticle[] = [
  {
    title: "Streamyyy vs TwitchTheater Comparison",
    href: "/vs/twitchtheater",
    description: "Compare Streamyyy with TwitchTheater to see which multi-stream viewer is better.",
    category: "Comparison",
    readTime: "7 min read",
    popularity: "high"
  },
  {
    title: "Streamyyy vs Multistre.am: Reliability Comparison", 
    href: "/vs/multistre-am",
    description: "Why Streamyyy offers better reliability and uptime than Multistre.am.",
    category: "Comparison",
    readTime: "6 min read",
    popularity: "medium"
  },
  {
    title: "All Multi-Stream Viewer Comparisons",
    href: "/vs",
    description: "Complete overview of how Streamyyy compares to all major competitors.",
    category: "Overview",
    readTime: "10 min read",
    popularity: "high"
  }
]

export const tutorialArticles: RelatedArticle[] = [
  {
    title: "Multi-Stream Viewer Complete Guide",
    href: "/multi-stream-viewer",
    description: "Everything you need to know about using Streamyyy's multi-stream viewer effectively.",
    category: "Complete Guide",
    readTime: "15 min read",
    popularity: "high"
  },
  {
    title: "How to Watch Multiple Streams",
    href: "/blog/how-to-watch-multiple-streams",
    description: "Step-by-step tutorial for watching multiple streams simultaneously.",
    category: "Tutorial",
    readTime: "8 min read",
    popularity: "high"
  },
  {
    title: "Advanced Multi-Stream Features",
    href: "/features",
    description: "Discover advanced features and pro tips for power users.",
    category: "Advanced",
    readTime: "10 min read",
    popularity: "medium"
  }
]