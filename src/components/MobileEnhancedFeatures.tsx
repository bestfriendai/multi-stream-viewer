'use client'

import { useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { 
  Monitor, 
  Zap, 
  MessageSquare, 
  Layout, 
  Smartphone, 
  Globe,
  PlayCircle,
  ArrowRight,
  Sparkles,
  Users,
  Eye,
  ChevronRight,
  Star,
  Trophy,
  TrendingUp,
  Rocket,
  Shield,
  Wifi,
  MousePointer,
  Command,
  Layers,
  BarChart3,
  Cpu,
  Headphones,
  Share2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTranslation } from '@/contexts/LanguageContext'
import { cn } from '@/lib/utils'

// Mobile-optimized features data
const getMobileFeatures = (t: any) => [
  {
    icon: Monitor,
    title: t('landing.enhanced.mobile.features.multiStream.title'),
    subtitle: t('landing.enhanced.mobile.features.multiStream.subtitle'),
    description: t('landing.enhanced.mobile.features.multiStream.description'),
    gradient: "from-blue-500 to-cyan-500",
    stats: t('landing.enhanced.mobile.features.multiStream.stats'),
    color: "blue"
  },
  {
    icon: Smartphone,
    title: t('landing.enhanced.mobile.features.touchFirst.title'),
    subtitle: t('landing.enhanced.mobile.features.touchFirst.subtitle'),
    description: t('landing.enhanced.mobile.features.touchFirst.description'),
    gradient: "from-green-500 to-emerald-500",
    stats: t('landing.enhanced.mobile.features.touchFirst.stats'),
    color: "green"
  },
  {
    icon: MessageSquare,
    title: t('landing.enhanced.mobile.features.unifiedChat.title'),
    subtitle: t('landing.enhanced.mobile.features.unifiedChat.subtitle'),
    description: t('landing.enhanced.mobile.features.unifiedChat.description'),
    gradient: "from-purple-500 to-indigo-500",
    stats: t('landing.enhanced.mobile.features.unifiedChat.stats'),
    color: "purple"
  },
  {
    icon: Zap,
    title: t('landing.enhanced.mobile.features.lightningFast.title'),
    subtitle: t('landing.enhanced.mobile.features.lightningFast.subtitle'),
    description: t('landing.enhanced.mobile.features.lightningFast.description'),
    gradient: "from-yellow-500 to-orange-500",
    stats: t('landing.enhanced.mobile.features.lightningFast.stats'),
    color: "yellow"
  },
  {
    icon: Globe,
    title: t('landing.enhanced.mobile.features.crossPlatform.title'),
    subtitle: t('landing.enhanced.mobile.features.crossPlatform.subtitle'),
    description: t('landing.enhanced.mobile.features.crossPlatform.description'),
    gradient: "from-pink-500 to-rose-500",
    stats: t('landing.enhanced.mobile.features.crossPlatform.stats'),
    color: "pink"
  },
  {
    icon: Layout,
    title: t('landing.enhanced.mobile.features.smartLayouts.title'),
    subtitle: t('landing.enhanced.mobile.features.smartLayouts.subtitle'),
    description: t('landing.enhanced.mobile.features.smartLayouts.description'),
    gradient: "from-indigo-500 to-blue-500",
    stats: t('landing.enhanced.mobile.features.smartLayouts.stats'),
    color: "indigo"
  }
]

// Mobile stats data
const getMobileStats = (t: any) => [
  { value: "2M+", label: t('landing.enhanced.mobile.mobileStats.users'), icon: Users, color: "blue" },
  { value: "50M+", label: t('landing.enhanced.mobile.mobileStats.hours'), icon: Eye, color: "green" },
  { value: "99.9%", label: t('landing.enhanced.mobile.mobileStats.uptime'), icon: TrendingUp, color: "purple" },
  { value: "16x", label: t('landing.enhanced.mobile.mobileStats.streams'), icon: Monitor, color: "orange" }
]

// Touch-optimized card component
const MobileFeatureCard = ({ feature, index }: { feature: any, index: number }) => {
  const [isPressed, setIsPressed] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="w-full"
    >
      <motion.div
        className={cn(
          "relative p-6 rounded-2xl backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 shadow-xl overflow-hidden",
          "touch-manipulation select-none"
        )}
        whileTap={{ scale: 0.98 }}
        onTapStart={() => setIsPressed(true)}
        onTap={() => {
          setIsPressed(false)
          setIsExpanded(!isExpanded)
        }}
        onTapCancel={() => setIsPressed(false)}
        animate={{
          scale: isPressed ? 0.98 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Background gradient */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-5 transition-opacity duration-500",
          feature.gradient,
          isExpanded && "opacity-10"
        )} />
        
        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              {/* Icon */}
              <motion.div
                className={cn(
                  "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
                  feature.gradient
                )}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </motion.div>
              
              {/* Title */}
              <div>
                <h3 className="text-lg font-bold leading-tight">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.subtitle}
                </p>
              </div>
            </div>
            
            {/* Stats badge */}
            <Badge className={cn(
              "bg-gradient-to-r text-white border-0 text-xs px-2 py-1",
              feature.gradient
            )}>
              {feature.stats}
            </Badge>
          </div>
          
          {/* Description */}
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            {feature.description}
          </p>
          
          {/* Expand indicator */}
          <motion.div
            className="flex items-center justify-center"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </motion.div>
          
          {/* Expanded content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-border/50"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className={cn(
                      "w-2 h-2 rounded-full bg-gradient-to-r",
                      feature.gradient
                    )} />
                    <span>Optimized for mobile performance</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className={cn(
                      "w-2 h-2 rounded-full bg-gradient-to-r",
                      feature.gradient
                    )} />
                    <span>Touch-friendly interface</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className={cn(
                      "w-2 h-2 rounded-full bg-gradient-to-r",
                      feature.gradient
                    )} />
                    <span>Works offline</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Touch ripple effect */}
        <AnimatePresence>
          {isPressed && (
            <motion.div
              className="absolute inset-0 bg-white/10 rounded-2xl"
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

// Mobile stats component
const MobileStatsGrid = ({ t }: { t: any }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {getMobileStats(t).map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.6 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-4 rounded-xl backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 shadow-lg text-center touch-manipulation"
        >
          {/* Icon */}
          <motion.div
            className={cn(
              "w-10 h-10 rounded-lg bg-gradient-to-r flex items-center justify-center mx-auto mb-3 shadow-lg",
              stat.color === 'blue' && "from-blue-500 to-cyan-500",
              stat.color === 'green' && "from-green-500 to-emerald-500",
              stat.color === 'purple' && "from-purple-500 to-indigo-500",
              stat.color === 'orange' && "from-orange-500 to-red-500"
            )}
            whileTap={{ scale: 0.9 }}
          >
            <stat.icon className="w-5 h-5 text-white" />
          </motion.div>
          
          {/* Value */}
          <motion.div
            className="text-2xl font-black mb-1 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
            initial={{ scale: 0.5 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 300 }}
          >
            {stat.value}
          </motion.div>
          
          {/* Label */}
          <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  )
}

// Touch-optimized CTA component
const MobileCTA = ({ onAddStream, t }: { onAddStream: () => void, t: any }) => {
  const [isPressed, setIsPressed] = useState(false)
  
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Primary CTA */}
      <motion.div
        whileTap={{ scale: 0.98 }}
        onTapStart={() => setIsPressed(true)}
        onTap={() => {
          setIsPressed(false)
          onAddStream()
        }}
        onTapCancel={() => setIsPressed(false)}
        className="touch-manipulation"
      >
        <Button
          size="lg"
          className={cn(
            "w-full h-14 text-lg font-semibold rounded-2xl shadow-2xl transition-all duration-300",
            "bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600",
            "hover:from-blue-700 hover:via-blue-600 hover:to-purple-700",
            "border-0 text-white relative overflow-hidden",
            isPressed && "scale-98"
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <PlayCircle className="w-6 h-6 mr-3" />
          <span>{t('landing.enhanced.mobile.cta.startWatching')}</span>
        </Button>
      </motion.div>
      
      {/* Secondary CTA */}
      <motion.div
        whileTap={{ scale: 0.98 }}
        className="touch-manipulation"
      >
        <Button
          size="lg"
          variant="outline"
          className="w-full h-12 text-base font-medium rounded-xl border-2 border-border/60 hover:border-primary/50 hover:bg-primary/5 backdrop-blur-sm"
          onClick={() => window.location.href = '/sign-up'}
        >
          <span>{t('landing.enhanced.mobile.cta.getStartedFree')}</span>
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>
      
      {/* Trust indicators */}
      <motion.div
        className="flex flex-wrap items-center justify-center gap-4 pt-4 text-xs text-muted-foreground"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span>{t('landing.enhanced.mobile.cta.trustIndicators.uptime')}</span>
        </div>
        <div className="flex items-center gap-1">
          <Shield className="w-3 h-3 text-blue-500" />
          <span>{t('landing.enhanced.mobile.cta.trustIndicators.secure')}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3 text-purple-500" />
          <span>{t('landing.enhanced.mobile.cta.trustIndicators.users')}</span>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function MobileEnhancedFeatures({ onAddStream }: { onAddStream: () => void }) {
  const { t } = useTranslation()
  
  return (
    <div className="space-y-8 px-4">
      {/* Features Grid */}
      <div className="space-y-4">
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-4 px-4 py-2 text-xs bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400">
            <Rocket className="w-3 h-3 mr-2" />
            {t('landing.enhanced.mobile.badge')}
          </Badge>
          <h2 className="text-2xl font-bold mb-3">
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {t('landing.enhanced.mobile.title')}
            </span>
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('landing.enhanced.mobile.subtitle')}
          </p>
        </motion.div>
        
        {getMobileFeatures(t).map((feature, index) => (
          <MobileFeatureCard key={index} feature={feature} index={index} />
        ))}
      </div>
      
      {/* Stats Section */}
      <motion.div
        className="py-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold mb-2">{t('landing.enhanced.mobile.statsSection.title')}</h3>
          <p className="text-sm text-muted-foreground">{t('landing.enhanced.mobile.statsSection.subtitle')}</p>
        </div>
        <MobileStatsGrid t={t} />
      </motion.div>
      
      {/* CTA Section */}
      <div className="py-8">
        <MobileCTA onAddStream={onAddStream} t={t} />
      </div>
    </div>
  )
}