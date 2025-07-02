import type { Metadata } from 'next'
import Link from 'next/link'
import { 
  Mail, 
  MessageSquare, 
  Shield, 
  HelpCircle,
  Bug,
  Lightbulb,
  FileText,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Contact Us - Streamyyy',
  description: 'Get in touch with the Streamyyy team. Contact us for support, feedback, business inquiries, or report issues.',
}

export default function ContactPage() {
  const contactReasons = [
    {
      icon: HelpCircle,
      title: 'General Support',
      description: 'Need help using Streamyyy? We\'re here to assist you.',
      email: 'support@streamyyy.com',
      responseTime: '24-48 hours'
    },
    {
      icon: Bug,
      title: 'Report a Bug',
      description: 'Found something that\'s not working right? Let us know.',
      email: 'bugs@streamyyy.com',
      responseTime: '24 hours'
    },
    {
      icon: Lightbulb,
      title: 'Feature Requests',
      description: 'Have an idea to make Streamyyy better? We\'d love to hear it.',
      email: 'feedback@streamyyy.com',
      responseTime: '3-5 business days'
    },
    {
      icon: Shield,
      title: 'Privacy & Legal',
      description: 'Questions about privacy, data protection, or legal matters.',
      email: 'privacy@streamyyy.com',
      responseTime: '24 hours'
    },
    {
      icon: FileText,
      title: 'DMCA/Copyright',
      description: 'Report copyright infringement or DMCA related issues.',
      email: 'dmca@streamyyy.com',
      responseTime: '24 hours'
    },
    {
      icon: MessageSquare,
      title: 'Business Inquiries',
      description: 'Interested in partnerships or business opportunities?',
      email: 'business@streamyyy.com',
      responseTime: '2-3 business days'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Streamyyy
          </Link>
          <h1 className="text-3xl font-bold">Contact Us</h1>
          <p className="text-muted-foreground mt-2">
            We're here to help and would love to hear from you
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Quick Info */}
        <div className="mb-12 p-6 bg-primary/5 rounded-lg border">
          <h2 className="text-xl font-semibold mb-3">Before You Contact Us</h2>
          <p className="mb-4">
            Many common questions are answered in our help resources:
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/faq">
              <Button variant="outline" size="sm">
                <HelpCircle className="w-4 h-4 mr-2" />
                FAQ
              </Button>
            </Link>
            <Link href="/privacy-policy">
              <Button variant="outline" size="sm">
                <Shield className="w-4 h-4 mr-2" />
                Privacy Policy
              </Button>
            </Link>
            <Link href="/terms-conditions">
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Terms of Service
              </Button>
            </Link>
          </div>
        </div>

        {/* Contact Options */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {contactReasons.map((reason) => (
            <Card key={reason.title} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <reason.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{reason.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {reason.description}
                  </p>
                  <a 
                    href={`mailto:${reason.email}`}
                    className="text-primary hover:underline font-medium text-sm"
                  >
                    {reason.email}
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">
                    Response time: {reason.responseTime}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Information */}
        <div className="space-y-8">
          {/* Office Address */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Mailing Address</h2>
            <Card className="p-6">
              <p className="font-medium mb-2">Streamyyy.com</p>
              <p className="text-muted-foreground">
                123 Streaming Boulevard<br />
                Suite 456<br />
                Los Angeles, CA 90028<br />
                United States
              </p>
            </Card>
          </section>

          {/* Social Media */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Connect With Us</h2>
            <p className="mb-4">Follow us on social media for updates and announcements:</p>
            <div className="flex gap-4">
              <a 
                href="https://twitter.com/streamyyy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Twitter/X
              </a>
              <a 
                href="https://discord.gg/streamyyy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Discord
              </a>
              <a 
                href="https://reddit.com/r/streamyyy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Reddit
              </a>
            </div>
          </section>

          {/* Important Notice */}
          <div className="p-6 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border-l-4 border-yellow-500">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-semibold mb-2">Important Notice</p>
                <p className="text-sm">
                  For urgent matters requiring immediate attention, especially those related to 
                  security vulnerabilities or legal issues, please email us directly at the 
                  appropriate address listed above. We take all reports seriously and will 
                  respond as quickly as possible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}