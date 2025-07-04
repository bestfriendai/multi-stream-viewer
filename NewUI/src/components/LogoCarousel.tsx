import { motion } from "framer-motion";

const platforms = [
  { name: "Twitch", logo: "🎮" },
  { name: "YouTube", logo: "📺" },
  { name: "Kick", logo: "⚡" },
  { name: "Rumble", logo: "🎯" },
  { name: "Discord", logo: "💬" },
  { name: "Facebook", logo: "📘" }
];

const LogoCarousel = () => {
  return (
    <section className="w-full py-16 bg-black/50">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h3 className="text-2xl font-semibold mb-4">Supported Platforms</h3>
          <p className="text-gray-400">Watch streams from all major platforms in one place</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center justify-center">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="flex flex-col items-center justify-center p-6 glass rounded-xl hover:glass-hover transition-all duration-300"
            >
              <div className="text-4xl mb-2">{platform.logo}</div>
              <span className="text-sm font-medium text-gray-300">{platform.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoCarousel;