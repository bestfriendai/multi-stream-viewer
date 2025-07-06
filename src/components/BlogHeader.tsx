import Link from 'next/link'
import StreamyyyLogo from './StreamyyyLogo'
import { ThemeToggle } from './theme-toggle'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'

export default function BlogHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <StreamyyyLogo size="lg" variant="gradient" useForHeader={true} iconOnly={true} />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/blog" className="text-sm font-medium transition-colors hover:text-primary">
              Blog
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Start Watching</span>
              <span className="sm:hidden">Watch</span>
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}