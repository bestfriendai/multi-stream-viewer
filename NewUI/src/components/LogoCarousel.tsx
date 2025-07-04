import { motion } from 'framer-motion'
import { Monitor, Youtube, Twitch, Gamepad2 } from 'lucide-react'

const platforms = [
  { name: 'Twitch', icon: Twitch, color: 'text-blue-500' },
  { name: 'YouTube', icon: Youtube, color: 'text-red-500' },
  { name: 'Kick', icon: Gamepad2, color: 'text-green-500' },
  { name: 'More Platforms', icon: Monitor, color: 'text-blue-500' }
]

const LogoCarousel = () => {
  return (
    <section className="py-16 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-semibold text-foreground mb-4">
            Supported Platforms
          </h3>
          <p className="text-muted-foreground">
            Watch streams from all your favorite platforms in one place
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {platforms.map((platform, index) => {
            const Icon = platform.icon
            return (
              <motion.div
                key={platform.name}
                className="flex flex-col items-center space-y-4 p-6 rounded-lg bg-card/50 border border-border hover:bg-card/80 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <div className={`p-4 rounded-full bg-background/50 ${platform.color}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {platform.name}
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default LogoCarousel