import Link from 'next/link'
import { ArrowLeft, Users, Eye, TrendingUp, BarChart, Target, Zap, Globe, Mail } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function AdvertisePage() {
  const adFormats = [
    {
      name: "Display Ads",
      description: "Premium banner placements throughout the platform",
      features: ["Above/below streams", "Sidebar placements", "Responsive design", "Mobile optimized"],
      icon: Target,
      popular: false
    },
    {
      name: "Sponsored Streams",
      description: "Featured stream placements in premium positions",
      features: ["Top placement in grid", "Featured badge", "Higher visibility", "Performance tracking"],
      icon: TrendingUp,
      popular: true
    },
    {
      name: "Native Integration",
      description: "Seamlessly integrated promotional content",
      features: ["In-feed promotion", "Contextual placement", "Non-intrusive format", "Higher engagement"],
      icon: Zap,
      popular: false
    }
  ]

  const metrics = [
    { value: "50K+", label: "Active Users", description: "Daily active streamers and viewers" },
    { value: "1M+", label: "Streams Viewed", description: "Monthly stream impressions" },
    { value: "15min", label: "Avg. Session", description: "High engagement duration" },
    { value: "85%", label: "Return Rate", description: "Users who return weekly" }
  ]

  const benefits = [
    {
      title: "Targeted Audience",
      description: "Reach engaged streaming enthusiasts across multiple platforms",
      icon: Users
    },
    {
      title: "High Visibility",
      description: "Premium placements ensure your content gets noticed",
      icon: Eye
    },
    {
      title: "Performance Tracking",
      description: "Detailed analytics and reporting for campaign optimization",
      icon: BarChart
    },
    {
      title: "Global Reach",
      description: "Access to international streaming communities",
      icon: Globe
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Streamyyy
      </Link>
      
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Advertise on Streamyyy</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Connect with millions of engaged viewers and streamers. Promote your brand, 
          product, or stream to our highly targeted audience of streaming enthusiasts.
        </p>
      </div>

      {/* Key Metrics */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-8">Platform Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{metric.value}</div>
              <div className="font-semibold mb-1">{metric.label}</div>
              <div className="text-sm text-muted-foreground">{metric.description}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Ad Formats */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-8">Advertising Options</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {adFormats.map((format, index) => (
            <Card key={index} className="p-6 relative hover:shadow-lg transition-shadow">
              {format.popular && (
                <Badge className="absolute -top-3 right-4 bg-gradient-to-r from-purple-500 to-pink-500">
                  Most Popular
                </Badge>
              )}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <format.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{format.name}</h3>
              </div>
              <p className="text-muted-foreground mb-4">{format.description}</p>
              <ul className="space-y-2">
                {format.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-8">Why Advertise With Us</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex gap-4">
              <div className="p-3 rounded-lg bg-primary/10 h-fit">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Audience Demographics */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-8">Our Audience</h2>
        <Card className="p-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Demographics</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 18-34 years: 68%</li>
                <li>• 35-44 years: 22%</li>
                <li>• Gaming enthusiasts: 75%</li>
                <li>• Content creators: 45%</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Interests</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Gaming & Esports</li>
                <li>• Live Entertainment</li>
                <li>• Technology</li>
                <li>• Content Creation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Platform Usage</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Daily users: 65%</li>
                <li>• Mobile users: 40%</li>
                <li>• Multi-platform viewers: 80%</li>
                <li>• Premium subscribers: 25%</li>
              </ul>
            </div>
          </div>
        </Card>
      </section>

      {/* Pricing */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-8">Flexible Pricing</h2>
        <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4">Custom Campaigns</h3>
            <p className="text-muted-foreground mb-6">
              We offer flexible pricing models to suit your advertising goals and budget. 
              From CPM-based display ads to performance-based campaigns, we'll work with 
              you to create the perfect advertising solution.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Badge variant="secondary">CPM Pricing</Badge>
              <Badge variant="secondary">CPC Options</Badge>
              <Badge variant="secondary">Sponsored Content</Badge>
              <Badge variant="secondary">Custom Packages</Badge>
            </div>
          </div>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="text-center py-12 bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-2xl">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join leading brands and creators who are already reaching their target audience on Streamyyy.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="gap-2">
            <Mail className="w-5 h-5" />
            Contact Sales
          </Button>
          <span className="text-muted-foreground">or email us at</span>
          <a href="mailto:advertise@streamyyy.com" className="text-primary hover:underline font-semibold">
            advertise@streamyyy.com
          </a>
        </div>
      </section>

      {/* Additional Info */}
      <section className="mt-12 text-center text-sm text-muted-foreground">
        <p>
          Streamyyy maintains high standards for advertising content. All advertisements are subject to review 
          and must comply with our advertising guidelines and community standards.
        </p>
      </section>
    </div>
  )
}