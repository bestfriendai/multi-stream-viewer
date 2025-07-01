'use client'

import React from 'react'
import Link from 'next/link'
import { Cookie, Settings, Eye, BarChart3, Calendar, Clock } from 'lucide-react'

export default function CookiePolicyPage() {
  const lastUpdated = "January 1, 2025"
  const effectiveDate = "January 1, 2025"

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl flex items-center justify-center">
              <Cookie className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Cookie Policy</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            This Cookie Policy explains how Streamyyy uses cookies and similar technologies to enhance your experience on our platform.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Effective: {effectiveDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Last Updated: {lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* Cookie Control Panel */}
        <div className="mb-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Manage Your Cookie Preferences</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            You have control over the cookies we use. Adjust your preferences below or in your browser settings.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Cookie Settings
            </button>
            <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
              Accept All
            </button>
            <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
              Reject Non-Essential
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-gray dark:prose-invert max-w-none">
          
          {/* What Are Cookies */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">What Are Cookies?</h2>
            <p className="mb-4">
              Cookies are small text files that are stored on your device when you visit our website. They help us 
              provide you with a better experience by remembering your preferences, analyzing how you use our service, 
              and providing relevant content.
            </p>
            <p className="mb-4">
              Similar technologies include web beacons, pixels, and local storage, which serve similar purposes to cookies.
            </p>
          </section>

          {/* Types of Cookies */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>
            
            <div className="grid gap-6">
              {/* Essential Cookies */}
              <div className="p-6 border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                    <Cookie className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Essential Cookies</h3>
                    <span className="text-sm text-muted-foreground">Always Active</span>
                  </div>
                </div>
                <p className="text-muted-foreground mb-3">
                  These cookies are necessary for the website to function properly. They enable core functionality 
                  such as security, network management, and accessibility.
                </p>
                <div className="text-sm">
                  <strong>Examples:</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Session management cookies</li>
                    <li>Authentication cookies</li>
                    <li>Security cookies</li>
                    <li>Load balancing cookies</li>
                  </ul>
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="p-6 border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Settings className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Functional Cookies</h3>
                    <span className="text-sm text-green-600">Optional</span>
                  </div>
                </div>
                <p className="text-muted-foreground mb-3">
                  These cookies enable enhanced functionality and personalization. They remember your preferences 
                  and choices to provide a more personalized experience.
                </p>
                <div className="text-sm">
                  <strong>Examples:</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Stream layout preferences</li>
                    <li>Theme and display settings</li>
                    <li>Language preferences</li>
                    <li>Volume and quality settings</li>
                  </ul>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="p-6 border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Analytics Cookies</h3>
                    <span className="text-sm text-green-600">Optional</span>
                  </div>
                </div>
                <p className="text-muted-foreground mb-3">
                  These cookies help us understand how visitors interact with our website by collecting and 
                  reporting information anonymously. This helps us improve our service.
                </p>
                <div className="text-sm">
                  <strong>Examples:</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Google Analytics cookies (_ga, _gat, _gid)</li>
                    <li>Page view tracking</li>
                    <li>Feature usage statistics</li>
                    <li>Performance monitoring</li>
                  </ul>
                </div>
              </div>

              {/* Performance Cookies */}
              <div className="p-6 border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <Eye className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Performance Cookies</h3>
                    <span className="text-sm text-green-600">Optional</span>
                  </div>
                </div>
                <p className="text-muted-foreground mb-3">
                  These cookies collect information about how you use our website to help us improve performance 
                  and provide a better user experience.
                </p>
                <div className="text-sm">
                  <strong>Examples:</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Load time monitoring</li>
                    <li>Error tracking</li>
                    <li>Feature performance metrics</li>
                    <li>Browser compatibility data</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Third-Party Cookies */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Third-Party Cookies</h2>
            <p className="mb-4">
              Some cookies are set by third-party services that appear on our pages. We use these trusted 
              partners to provide specific functionality and improve our service.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-3 text-left">Service</th>
                    <th className="border border-border p-3 text-left">Purpose</th>
                    <th className="border border-border p-3 text-left">Cookie Names</th>
                    <th className="border border-border p-3 text-left">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-3 font-medium">Google Analytics</td>
                    <td className="border border-border p-3">Website analytics and performance monitoring</td>
                    <td className="border border-border p-3 text-sm">_ga, _gat, _gid</td>
                    <td className="border border-border p-3">2 years / 1 day</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-medium">Twitch</td>
                    <td className="border border-border p-3">Stream embedding and authentication</td>
                    <td className="border border-border p-3 text-sm">twilight-user, login</td>
                    <td className="border border-border p-3">Session / 1 year</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-medium">YouTube</td>
                    <td className="border border-border p-3">Video embedding and preferences</td>
                    <td className="border border-border p-3 text-sm">VISITOR_INFO1_LIVE, YSC</td>
                    <td className="border border-border p-3">Session / 6 months</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* How to Control Cookies */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">How to Control Cookies</h2>
            
            <h3 className="text-xl font-medium mt-6 mb-3">Browser Settings</h3>
            <p className="mb-4">
              Most web browsers allow you to control cookies through their settings. You can:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Block all cookies</li>
              <li>Block third-party cookies</li>
              <li>Delete existing cookies</li>
              <li>Receive notification when cookies are set</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">Browser-Specific Instructions</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Google Chrome</h4>
                <p className="text-sm text-muted-foreground">
                  Settings → Privacy and security → Cookies and other site data
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Mozilla Firefox</h4>
                <p className="text-sm text-muted-foreground">
                  Options → Privacy & Security → Cookies and Site Data
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Safari</h4>
                <p className="text-sm text-muted-foreground">
                  Preferences → Privacy → Manage Website Data
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Microsoft Edge</h4>
                <p className="text-sm text-muted-foreground">
                  Settings → Cookies and site permissions → Cookies and site data
                </p>
              </div>
            </div>

            <h3 className="text-xl font-medium mt-6 mb-3">Opt-Out Tools</h3>
            <p className="mb-4">You can also use these tools to opt out of specific tracking:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><a href="https://tools.google.com/dlpage/gaoptout" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a></li>
              <li><a href="http://optout.networkadvertising.org/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Network Advertising Initiative Opt-out</a></li>
              <li><a href="http://optout.aboutads.info/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Digital Advertising Alliance Opt-out</a></li>
            </ul>
          </section>

          {/* Impact of Disabling Cookies */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Impact of Disabling Cookies</h2>
            <p className="mb-4">
              While you can disable cookies, doing so may affect your experience on our website:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">Essential Cookies Disabled</h3>
                <ul className="text-sm text-red-700 dark:text-red-300 list-disc pl-4">
                  <li>Website may not function properly</li>
                  <li>Security features may be compromised</li>
                  <li>Session management issues</li>
                </ul>
              </div>
              
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Functional Cookies Disabled</h3>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 list-disc pl-4">
                  <li>Preferences won&apos;t be saved</li>
                  <li>Layout settings reset each visit</li>
                  <li>Reduced personalization</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cookie Retention */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Cookie Retention Periods</h2>
            <p className="mb-4">Different cookies have different retention periods:</p>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Session Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  Deleted when you close your browser session.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Persistent Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  Remain on your device for a specific period (from 24 hours to 2 years) or until manually deleted.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Security Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically expire after a short period for security purposes.
                </p>
              </div>
            </div>
          </section>

          {/* Updates to This Policy */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Updates to This Cookie Policy</h2>
            <p className="mb-4">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for 
              legal and regulatory reasons. When we make significant changes, we will:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Update the &quot;Last Updated&quot; date at the top of this policy</li>
              <li>Notify you through our website or by email</li>
              <li>Request renewed consent where required by law</li>
            </ul>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="mb-4">
              If you have questions about our use of cookies or this Cookie Policy, please contact us:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Privacy Team</h3>
                <p className="text-sm text-muted-foreground mb-2">Email: <a href="mailto:privacy@streamyyy.com" className="text-primary hover:underline">privacy@streamyyy.com</a></p>
                <p className="text-sm text-muted-foreground">Subject: Cookie Policy Inquiry</p>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Technical Support</h3>
                <p className="text-sm text-muted-foreground mb-2">Email: <a href="mailto:support@streamyyy.com" className="text-primary hover:underline">support@streamyyy.com</a></p>
                <p className="text-sm text-muted-foreground">For technical cookie issues</p>
              </div>
            </div>
          </section>

          {/* Related Policies */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Related Policies</h2>
            <p className="mb-4">
              For more information about how we protect your privacy, please review our related policies:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link> - How we collect and use your personal information</li>
              <li><Link href="/terms-conditions" className="text-primary hover:underline">Terms & Conditions</Link> - Legal terms governing your use of our service</li>
              <li><Link href="/dmca-policy" className="text-primary hover:underline">DMCA Policy</Link> - Our copyright infringement policy</li>
            </ul>
          </section>
        </div>

        {/* Back to top */}
        <div className="text-center mt-12">
          <Link 
            href="#top" 
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            Back to Top
          </Link>
        </div>
      </div>
    </div>
  )
}