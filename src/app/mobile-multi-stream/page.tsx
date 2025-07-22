import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Mobile Multi Stream - Watch Multiple Streams on Mobile | Streamyyy',
  description: 'Watch multiple Twitch, YouTube, and Kick streams simultaneously on your mobile device. Free mobile multi-stream viewer with touch controls and optimized performance.',
  keywords: 'mobile multi stream, watch multiple streams mobile, mobile multi stream viewer, multi stream app, mobile streaming, watch streams on phone',
  openGraph: {
    title: 'Mobile Multi Stream - Watch Multiple Streams on Mobile',
    description: 'Watch multiple Twitch, YouTube, and Kick streams simultaneously on your mobile device. Free mobile multi-stream viewer with touch controls.',
    type: 'website',
    images: [{
      url: '/og-mobile-multi-stream.png',
      width: 1200,
      height: 630,
      alt: 'Mobile Multi Stream - Streamyyy Mobile Multi-Stream Viewer'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mobile Multi Stream - Watch Multiple Streams on Mobile',
    description: 'Free mobile multi-stream viewer for Twitch, YouTube, and Kick. Touch-optimized controls.',
  }
}

export default function MobileMultiStream() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            Mobile Multi Stream
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Watch multiple streams simultaneously on your mobile device. 
            Touch-optimized controls, battery-efficient streaming, and seamless mobile experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              href="/"
              className="bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Start Mobile Multi-Streaming →
            </Link>
            <Link 
              href="#features"
              className="border border-primary text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/10 transition-colors"
            >
              Mobile Features
            </Link>
          </div>
          
          {/* Hero Image - Mobile Mockup */}
          <div className="relative w-full max-w-md mx-auto">
            <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl bg-black p-2">
              <div className="relative h-full rounded-2xl overflow-hidden">
                <Image
                  src="/mobile-multi-stream-hero.jpg"
                  alt="Mobile Multi Stream Interface - Streamyyy mobile app showing multiple streams"
                  fill
                  className="object-cover"
                  priority
                  sizes="400px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Features Section */}
      <section id="features" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Mobile Multi-Stream Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Designed specifically for mobile devices with touch-first controls and optimized performance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👆</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Touch Controls</h3>
              <p className="text-muted-foreground">
                Intuitive touch gestures for stream switching, zooming, and layout adjustments. Swipe, pinch, and tap controls.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔋</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Battery Optimized</h3>
              <p className="text-muted-foreground">
                Advanced power management ensures extended viewing sessions without draining your battery quickly.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Responsive Design</h3>
              <p className="text-muted-foreground">
                Perfect layouts for phones and tablets. Automatically adapts to your screen size and orientation.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📶</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Data Efficient</h3>
              <p className="text-muted-foreground">
                Smart data management with quality adjustment based on connection speed. Monitor your data usage.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Picture-in-Picture</h3>
              <p className="text-muted-foreground">
                Continue watching streams while using other apps. Mobile PiP support for uninterrupted viewing.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌙</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Dark Mode</h3>
              <p className="text-muted-foreground">
                OLED-friendly dark mode reduces eye strain and saves battery on devices with OLED screens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Layouts Section */}
      <section className="py-16 md:py-24 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Mobile-Optimized Layouts
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose from layouts specifically designed for mobile screens and touch interaction.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="text-center p-6 bg-background rounded-lg">
              <div className="w-20 h-32 bg-primary/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <div className="grid grid-cols-1 gap-1 w-12 h-20">
                  <div className="bg-primary rounded-sm"></div>
                </div>
              </div>
              <h3 className="font-semibold mb-2">Single Stream</h3>
              <p className="text-sm text-muted-foreground">Full-screen single stream with chat overlay</p>
            </div>

            <div className="text-center p-6 bg-background rounded-lg">
              <div className="w-20 h-32 bg-primary/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <div className="grid grid-cols-1 gap-1 w-12 h-20">
                  <div className="bg-primary rounded-sm h-12"></div>
                  <div className="bg-primary/60 rounded-sm h-6"></div>
                </div>
              </div>
              <h3 className="font-semibold mb-2">Picture-in-Picture</h3>
              <p className="text-sm text-muted-foreground">Main stream with floating secondary stream</p>
            </div>

            <div className="text-center p-6 bg-background rounded-lg">
              <div className="w-20 h-32 bg-primary/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-1 w-12 h-20">
                  <div className="bg-primary rounded-sm"></div>
                  <div className="bg-primary rounded-sm"></div>
                  <div className="bg-primary rounded-sm"></div>
                  <div className="bg-primary rounded-sm"></div>
                </div>
              </div>
              <h3 className="font-semibold mb-2">2x2 Grid</h3>
              <p className="text-sm text-muted-foreground">Four streams in equal-sized grid layout</p>
            </div>

            <div className="text-center p-6 bg-background rounded-lg">
              <div className="w-20 h-32 bg-primary/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <div className="grid grid-cols-1 gap-1 w-12 h-20">
                  <div className="bg-primary rounded-sm h-8"></div>
                  <div className="grid grid-cols-2 gap-1 h-10">
                    <div className="bg-primary/60 rounded-sm"></div>
                    <div className="bg-primary/60 rounded-sm"></div>
                  </div>
                </div>
              </div>
              <h3 className="font-semibold mb-2">Focus Mode</h3>
              <p className="text-sm text-muted-foreground">Main stream with thumbnail previews</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works on Mobile */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How Mobile Multi-Streaming Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started with mobile multi-stream viewing in three simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                📱
              </div>
              <h3 className="text-xl font-semibold mb-2">Open in Browser</h3>
              <p className="text-muted-foreground">
                No app download required. Simply visit Streamyyy.com in your mobile browser and start streaming.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                👆
              </div>
              <h3 className="text-xl font-semibold mb-2">Add Streams</h3>
              <p className="text-muted-foreground">
                Tap to search for streamers or paste URLs. Add multiple streams with simple touch controls.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                🎮
              </div>
              <h3 className="text-xl font-semibold mb-2">Watch & Interact</h3>
              <p className="text-muted-foreground">
                Enjoy multiple streams with touch gestures, chat integration, and mobile-optimized controls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Tips Section */}
      <section className="py-16 md:py-24 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Mobile Multi-Streaming Tips
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-background rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <span className="mr-2">🔋</span> Battery Optimization
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Enable low power mode for extended viewing</li>
                <li>• Reduce screen brightness when possible</li>
                <li>• Close unnecessary background apps</li>
                <li>• Use Wi-Fi instead of cellular when available</li>
              </ul>
            </div>

            <div className="bg-background rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <span className="mr-2">📶</span> Data Management
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Monitor data usage in settings</li>
                <li>• Adjust stream quality based on connection</li>
                <li>• Use Wi-Fi for high-quality streaming</li>
                <li>• Enable data saver mode on cellular</li>
              </ul>
            </div>

            <div className="bg-background rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <span className="mr-2">👆</span> Touch Controls
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Pinch to zoom on individual streams</li>
                <li>• Swipe to switch between layouts</li>
                <li>• Long press for stream options</li>
                <li>• Double tap to focus on a stream</li>
              </ul>
            </div>

            <div className="bg-background rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <span className="mr-2">🎧</span> Audio Management
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Use headphones for better audio quality</li>
                <li>• Mute secondary streams to focus audio</li>
                <li>• Adjust individual stream volumes</li>
                <li>• Enable audio focus for main stream</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Support */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Mobile Platform Support
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Watch streams from all major platforms on your mobile device.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <h3 className="font-semibold mb-2">Twitch Mobile</h3>
              <p className="text-sm text-muted-foreground">Full Twitch integration with mobile chat</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">Y</span>
              </div>
              <h3 className="font-semibold mb-2">YouTube Mobile</h3>
              <p className="text-sm text-muted-foreground">YouTube Gaming streams on mobile</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">K</span>
              </div>
              <h3 className="font-semibold mb-2">Kick Mobile</h3>
              <p className="text-sm text-muted-foreground">Kick streams with mobile optimization</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-secondary/10">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Mobile Multi-Stream FAQ
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-background rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Do I need to download an app for mobile multi-streaming?</h3>
              <p className="text-muted-foreground">
                No app download required! Streamyyy works directly in your mobile browser. Simply visit our website 
                and start watching multiple streams immediately.
              </p>
            </div>

            <div className="bg-background rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">How many streams can I watch on mobile?</h3>
              <p className="text-muted-foreground">
                You can watch up to 16 streams on mobile, though we recommend 2-4 streams for optimal performance 
                and battery life on most mobile devices.
              </p>
            </div>

            <div className="bg-background rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Does mobile multi-streaming use a lot of data?</h3>
              <p className="text-muted-foreground">
                Data usage depends on stream quality and number of streams. We provide data monitoring tools 
                and quality adjustment options to help you manage your data usage effectively.
              </p>
            </div>

            <div className="bg-background rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Can I use mobile multi-streaming with cellular data?</h3>
              <p className="text-muted-foreground">
                Yes, but we recommend Wi-Fi for the best experience. If using cellular, enable data saver mode 
                and monitor your usage to avoid overage charges.
              </p>
            </div>

            <div className="bg-background rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Does it work on both phones and tablets?</h3>
              <p className="text-muted-foreground">
                Absolutely! Our responsive design automatically adapts to your device size, whether you're using 
                a phone, tablet, or any mobile device.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Mobile Multi-Streaming Now
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Experience the freedom of mobile multi-stream viewing. Watch your favorite streamers anywhere, 
            anytime with touch-optimized controls and battery-efficient streaming.
          </p>
          <Link 
            href="/"
            className="bg-white text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Open Mobile Multi-Stream →
          </Link>
        </div>
      </section>

      {/* Related Pages */}
      <section className="py-12 border-t">
        <div className="container mx-auto px-4">
          <h3 className="text-xl font-bold mb-6 text-center">Related Multi-Stream Features</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link href="/16-stream-viewer" className="text-center p-4 hover:bg-secondary/10 rounded-lg transition-colors">
              <h4 className="font-semibold">16 Stream Viewer</h4>
              <p className="text-sm text-muted-foreground">Watch up to 16 streams simultaneously</p>
            </Link>
            <Link href="/free-multi-stream-viewer" className="text-center p-4 hover:bg-secondary/10 rounded-lg transition-colors">
              <h4 className="font-semibold">Free Multi-Stream Viewer</h4>
              <p className="text-sm text-muted-foreground">100% free multi-stream viewing</p>
            </Link>
            <Link href="/unified-chat-multi-stream" className="text-center p-4 hover:bg-secondary/10 rounded-lg transition-colors">
              <h4 className="font-semibold">Unified Chat</h4>
              <p className="text-sm text-muted-foreground">Chat with multiple communities</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
