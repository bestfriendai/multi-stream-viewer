import { useState } from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Monitor } from 'lucide-react'
import FeatureTab from './FeatureTab'
import FeatureContent from './FeatureContent'
import { features } from './features'

const FeaturesSection = () => {
  const [activeFeature, setActiveFeature] = useState(0)

  return (
    <section id="features" className="py-24 px-6 relative">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            className="text-5xl md:text-6xl font-normal mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Powerful{" "}
            <span className="text-gradient font-medium">Features</span>
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Everything you need to create the ultimate multi-stream viewing experience
          </motion.p>
        </div>

        {/* Gradient blur effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-blue-400/5 to-blue-300/5 blur-3xl" />
        
        {/* Features Grid */}
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Feature Tabs */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {features.map((feature, index) => (
              <FeatureTab
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                isActive={activeFeature === index}
                onClick={() => setActiveFeature(index)}
              />
            ))}
          </motion.div>

          {/* Feature Content */}
          <motion.div
            className="lg:sticky lg:top-24"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <FeatureContent
              key={activeFeature}
              title={features[activeFeature]?.title || ''}
              description={features[activeFeature]?.description || ''}
              icon={features[activeFeature]?.icon || Monitor}
              image={features[activeFeature]?.image || ''}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection