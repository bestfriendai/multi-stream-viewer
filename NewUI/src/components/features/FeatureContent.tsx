import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

interface FeatureContentProps {
  title: string
  description: string
  icon: LucideIcon
  image: string
}

const FeatureContent = ({ title, description, icon: Icon, image }: FeatureContentProps) => {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-4">
        <div className="p-3 rounded-lg bg-primary text-primary-foreground">
          <Icon className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-foreground">{title}</h3>
        </div>
      </div>
      
      <p className="text-lg text-muted-foreground leading-relaxed">
        {description}
      </p>
      
      <div className="relative overflow-hidden rounded-lg border border-border">
        <motion.div
          className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center space-y-4">
            <Icon className="w-16 h-16 mx-auto text-primary" />
            <div className="space-y-2">
              <h4 className="text-xl font-semibold text-foreground">{title}</h4>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Interactive demo coming soon
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default FeatureContent