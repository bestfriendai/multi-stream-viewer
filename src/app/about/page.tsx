'use client'

import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { useTranslation } from '@/contexts/LanguageContext'
import { 
  ArrowLeft, 
  Zap, 
  Users, 
  Eye, 
  Shield, 
  Smartphone, 
  Globe,
  Monitor,
  Shuffle,
  Brain,
  Sparkles,
  Heart
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function AboutPage() {
  const { isLoaded, isSignedIn } = useUser()
  const { t } = useTranslation()

  // Show loading state while authentication is being determined
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  const problems = [
    {
      icon: Eye,
      title: t('about.problems.multiStream.title'),
      problem: t('about.problems.multiStream.problem'),
      solution: t('about.problems.multiStream.solution'),
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Monitor,
      title: t('about.problems.multiMonitor.title'),
      problem: t('about.problems.multiMonitor.problem'),
      solution: t('about.problems.multiMonitor.solution'),
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: t('about.problems.tournament.title'),
      problem: t('about.problems.tournament.problem'),
      solution: t('about.problems.tournament.solution'),
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Smartphone,
      title: t('about.problems.mobile.title'),
      problem: t('about.problems.mobile.problem'),
      solution: t('about.problems.mobile.solution'),
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Globe,
      title: t('about.problems.platform.title'),
      problem: t('about.problems.platform.problem'),
      solution: t('about.problems.platform.solution'),
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Shuffle,
      title: t('about.problems.accessibility.title'),
      problem: t('about.problems.accessibility.problem'),
      solution: t('about.problems.accessibility.solution'),
      color: "from-yellow-500 to-orange-500"
    }
  ]

  const stats = [
    { number: "1M+", label: t('about.stats.streamsWatched'), icon: Eye },
    { number: "50K+", label: t('about.stats.activeUsers'), icon: Users },
    { number: t('about.stats.free'), label: t('about.stats.basicAccess'), icon: Heart },
    { number: "16", label: t('about.stats.maxStreams'), icon: Monitor }
  ]

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('common.back')}
        </Link>

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 text-transparent bg-clip-text">
              {t('about.hero.title')}
            </span>
            <br />
            <span className="text-2xl md:text-4xl text-muted-foreground">
              {t('about.hero.subtitle')}
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('about.hero.description')}
          </p>
        </motion.div>

        {/* Problems & Solutions Grid */}
        <div className="mb-20">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
          >
            {t('about.problems.title')}
          </motion.h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {problems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <Card className="h-full p-6 hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} bg-opacity-20`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                      <div className="space-y-3">
                        <div>
                          <Badge variant="destructive" className="mb-2">{t('about.problems.theProblem')}</Badge>
                          <p className="text-sm text-muted-foreground">{item.problem}</p>
                        </div>
                        <div>
                          <Badge variant="default" className="mb-2 bg-green-600">{t('about.problems.ourSolution')}</Badge>
                          <p className="text-sm">{item.solution}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Philosophy Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-20"
        >
          <Card className="p-8 md:p-12 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30">
            <h2 className="text-3xl font-bold mb-6 text-center">
              {t('about.philosophy.title')}: <span className="text-primary">{t('about.philosophy.subtitle')}</span>
            </h2>
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-start gap-4">
                <Brain className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2">{t('about.philosophy.noAccount.title')}</h3>
                  <p className="text-muted-foreground">
                    {t('about.philosophy.noAccount.description')}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Sparkles className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2">{t('about.philosophy.features.title')}</h3>
                  <p className="text-muted-foreground">
                    {t('about.philosophy.features.description')}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Heart className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2">{t('about.philosophy.built.title')}</h3>
                  <p className="text-muted-foreground">
                    {t('about.philosophy.built.description')}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12">{t('about.stats.title')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
              >
                <Card className="p-6 text-center hover:shadow-lg transition-all">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-purple-400 text-transparent bg-clip-text">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Why Different Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Why We're Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4"
                whileHover={{ rotate: 10 }}
                transition={{ duration: 0.3 }}
              >
                <Zap className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold mb-3">Blazing Fast</h3>
              <p className="text-muted-foreground">
                Optimized for speed with minimal overhead. Clean, efficient code that loads quickly 
                and runs smoothly across all devices.
              </p>
            </motion.div>
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4"
                whileHover={{ rotate: 10 }}
                transition={{ duration: 0.3 }}
              >
                <Shield className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold mb-3">Privacy Focused</h3>
              <p className="text-muted-foreground">
                We respect your privacy. We don't sell your data. No account required to start watching. 
                Transparent about our data practices.
              </p>
            </motion.div>
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4"
                whileHover={{ rotate: 10 }}
                transition={{ duration: 0.3 }}
              >
                <Users className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold mb-3">Community Driven</h3>
              <p className="text-muted-foreground">
                Built by the community, for the community. Every feature request is considered. 
                Every bug report is valued. This is your platform.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* The Future Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="mb-20"
        >
          <Card className="p-8 md:p-12 border-2 border-primary/30">
            <h2 className="text-3xl font-bold text-center mb-6">The Future is Multi-Stream</h2>
            <div className="max-w-3xl mx-auto space-y-4 text-center">
              <p className="text-lg">
                Streaming has evolved. Viewers have evolved. But the tools haven't. Until now.
              </p>
              <p className="text-muted-foreground">
                We're not just building a multi-stream viewer. We're building the future of how 
                people consume live content. Where watching one stream at a time becomes as 
                outdated as black and white TV.
              </p>
              <p className="text-muted-foreground">
                And we're doing it without venture capital, without selling out, without 
                compromising our values. Because some things are more important than money.
              </p>
              <p className="text-lg font-semibold text-primary mt-6">
                Welcome to the revolution. Welcome to Streamyyy.
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-6">Ready to Experience the Difference?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Stop juggling tabs. Stop missing moments. Stop paying for basic features.
            Start watching smarter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-4 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground rounded-xl font-bold text-lg transition-all transform hover:scale-105"
            >
              {t('about.cta.button')}
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 bg-card hover:bg-card/80 border-2 border-primary rounded-xl font-bold text-lg transition-all"
            >
              {t('common.contact')}
            </Link>
          </div>
        </motion.div>

        {/* Footer Quote */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2 }}
          className="text-center pb-8"
        >
          <p className="text-lg text-muted-foreground italic">
            "We didn't disrupt the industry. We just built what should have existed all along."
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            - The Streamyyy Team
          </p>
        </motion.div>
      </div>
    </div>
  )
}