import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

interface FeatureTabProps {
  title: string
  description: string
  icon: LucideIcon
  isActive: boolean
  onClick: () => void
}

const FeatureTab = ({ title, description, icon: Icon, isActive, onClick }: FeatureTabProps) => {
  return (
    <motion.button
      className={`w-full text-left p-6 rounded-lg border transition-all duration-200 ${
        isActive 
          ? 'bg-primary/10 border-primary/30 shadow-lg' 
          : 'bg-card/50 border-border hover:bg-card/80 hover:border-border/60'
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-lg ${
          isActive 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted text-muted-foreground'
        }`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-semibold mb-2 ${
            isActive ? 'text-primary' : 'text-foreground'
          }`}>
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.button>
  )
}

export default FeatureTab