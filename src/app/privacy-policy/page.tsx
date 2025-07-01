'use client'

import React from 'react'
import Link from 'next/link'
import { Shield, Mail, Calendar, Clock, Database, Lock, Users, Globe } from 'lucide-react'

export default function PrivacyPolicyPage() {
  const lastUpdated = "January 1, 2025"
  const effectiveDate = "January 1, 2025"

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Privacy Policy</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We are committed to protecting your privacy and ensuring transparency about how we collect, use, and protect your personal information.
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

        {/* Compliance Badges */}
        <div className="mb-12 flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <Globe className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">GDPR Compliant</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <Users className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">CCPA Compliant</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <Lock className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">PIPEDA Compliant</span>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="mb-12 p-6 bg-muted/50 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            <a href="#information-we-collect" className="text-primary hover:underline">Information We Collect</a>
            <a href="#how-we-use-information" className="text-primary hover:underline">How We Use Information</a>
            <a href="#information-sharing" className="text-primary hover:underline">Information Sharing</a>
            <a href="#data-retention" className="text-primary hover:underline">Data Retention</a>
            <a href="#your-rights" className="text-primary hover:underline">Your Rights</a>
            <a href="#security" className="text-primary hover:underline">Security Measures</a>
            <a href="#cookies" className="text-primary hover:underline">Cookies & Tracking</a>
            <a href="#international-transfers" className="text-primary hover:underline">International Transfers</a>
            <a href="#children" className="text-primary hover:underline">Children&apos;s Privacy</a>
            <a href="#contact" className="text-primary hover:underline">Contact Us</a>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-gray dark:prose-invert max-w-none">
          
          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p className="mb-4">
              Streamyyy (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates the website streamyyy.com and provides multi-stream viewing services. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our 
              website or use our services.
            </p>
            <p className="mb-4">
              We are committed to complying with applicable privacy laws including the European Union&apos;s General Data Protection 
              Regulation (GDPR), the California Consumer Privacy Act (CCPA), and Canada&apos;s Personal Information Protection and 
              Electronic Documents Act (PIPEDA).
            </p>
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm mb-0">
                <strong>Important:</strong> By using our service, you agree to the collection and use of information in accordance with this policy.
              </p>
            </div>
          </section>

          {/* Information We Collect */}
          <section id="information-we-collect" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Database className="w-6 h-6" />
              Information We Collect
            </h2>
            
            <h3 className="text-xl font-medium mt-6 mb-3">1. Information You Provide Directly</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Account information (if you create an account): email address, username, profile information</li>
              <li>Stream preferences and saved layouts</li>
              <li>Support requests and communications with us</li>
              <li>Feedback and survey responses</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">2. Information Collected Automatically</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Usage Data:</strong> Pages visited, streams watched, time spent on service, interaction patterns</li>
              <li><strong>Device Information:</strong> Browser type, operating system, device identifiers, screen resolution</li>
              <li><strong>Log Information:</strong> IP address, timestamps, referrer URLs, access times</li>
              <li><strong>Performance Data:</strong> Load times, error reports, feature usage statistics</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">3. Third-Party Information</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Public streaming platform data (when you add streams to our viewer)</li>
              <li>Analytics data from Google Analytics and similar services</li>
              <li>Social media integration data (if you choose to connect social accounts)</li>
            </ul>
          </section>

          {/* How We Use Information */}
          <section id="how-we-use-information" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            
            <h3 className="text-xl font-medium mt-6 mb-3">Service Provision</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide and maintain our multi-stream viewing service</li>
              <li>Process your requests and preferences</li>
              <li>Remember your stream selections and layout preferences</li>
              <li>Provide customer support and respond to inquiries</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">Service Improvement</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Analyze usage patterns to improve our service</li>
              <li>Develop new features and functionality</li>
              <li>Optimize performance and user experience</li>
              <li>Conduct research and analytics</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">Legal Compliance</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Comply with legal obligations and regulations</li>
              <li>Protect against fraud, abuse, and security threats</li>
              <li>Enforce our terms of service and policies</li>
              <li>Respond to legal requests and court orders</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section id="information-sharing" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Information Sharing and Disclosure</h2>
            <p className="mb-4">
              <strong>We do not sell your personal information.</strong> We may share your information in the following circumstances:
            </p>
            
            <h3 className="text-xl font-medium mt-6 mb-3">Service Providers</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Analytics providers (Google Analytics) - for service improvement</li>
              <li>Hosting and infrastructure providers - for service operation</li>
              <li>Customer support tools - for user assistance</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">Legal Requirements</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>To comply with applicable laws and regulations</li>
              <li>To respond to subpoenas, court orders, or legal process</li>
              <li>To protect our rights, property, or safety</li>
              <li>To prevent fraud or security threats</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">Business Transfers</h3>
            <p className="mb-4">
              In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
            </p>
          </section>

          {/* Data Retention */}
          <section id="data-retention" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
            <p className="mb-4">We retain your information only as long as necessary for the purposes outlined in this policy:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Account Data:</strong> Retained until you delete your account or request deletion</li>
              <li><strong>Usage Analytics:</strong> Aggregated data retained for up to 3 years for service improvement</li>
              <li><strong>Log Data:</strong> Retained for up to 1 year for security and debugging purposes</li>
              <li><strong>Support Communications:</strong> Retained for up to 3 years for quality assurance</li>
            </ul>
            <p className="mb-4">
              You may request deletion of your personal information at any time by contacting us at 
              <a href="mailto:privacy@streamyyy.com" className="text-primary hover:underline"> privacy@streamyyy.com</a>.
            </p>
          </section>

          {/* Your Rights */}
          <section id="your-rights" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Your Privacy Rights</h2>
            <p className="mb-4">Depending on your location, you may have the following rights:</p>
            
            <h3 className="text-xl font-medium mt-6 mb-3">GDPR Rights (EU Residents)</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
              <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
              <li><strong>Right to Restrict Processing:</strong> Limit how we use your data</li>
              <li><strong>Right to Data Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for data processing</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">CCPA Rights (California Residents)</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Right to Know:</strong> Information about data collection and use</li>
              <li><strong>Right to Delete:</strong> Request deletion of personal information</li>
              <li><strong>Right to Opt-Out:</strong> Opt out of the sale of personal information</li>
              <li><strong>Right to Non-Discrimination:</strong> Equal service regardless of privacy choices</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">PIPEDA Rights (Canadian Residents)</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Right to Access:</strong> Access your personal information we hold</li>
              <li><strong>Right to Correction:</strong> Correct inaccurate personal information</li>
              <li><strong>Right to Complaint:</strong> File complaints with the Privacy Commissioner</li>
            </ul>

            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border-l-4 border-green-500 mt-6">
              <p className="text-sm mb-2">
                <strong>How to Exercise Your Rights:</strong>
              </p>
              <p className="text-sm mb-0">
                To exercise any of these rights, please contact us at 
                <a href="mailto:privacy@streamyyy.com" className="text-primary hover:underline"> privacy@streamyyy.com</a> 
                or use our <Link href="/privacy-request" className="text-primary hover:underline">Privacy Request Form</Link>.
              </p>
            </div>
          </section>

          {/* Security */}
          <section id="security" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6" />
              Security Measures
            </h2>
            <p className="mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Encryption:</strong> All data transmitted is encrypted using SSL/TLS protocols</li>
              <li><strong>Access Controls:</strong> Limited access to personal data on a need-to-know basis</li>
              <li><strong>Regular Audits:</strong> Regular security assessments and vulnerability testing</li>
              <li><strong>Incident Response:</strong> Procedures for detecting and responding to security incidents</li>
              <li><strong>Data Minimization:</strong> We collect only necessary information for our services</li>
            </ul>
            <p className="mb-4">
              While we strive to protect your information, no method of transmission over the internet is 100% secure. 
              We cannot guarantee absolute security but will notify you of any material security breaches as required by law.
            </p>
          </section>

          {/* Cookies */}
          <section id="cookies" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking Technologies</h2>
            <p className="mb-4">We use cookies and similar technologies to enhance your experience:</p>
            
            <h3 className="text-xl font-medium mt-6 mb-3">Types of Cookies We Use</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and choices</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how you use our service</li>
              <li><strong>Performance Cookies:</strong> Improve site performance and user experience</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">Managing Cookies</h3>
            <p className="mb-4">
              You can control cookies through your browser settings. However, disabling certain cookies may affect 
              your ability to use some features of our service.
            </p>
            <p className="mb-4">
              For more detailed information about our cookie practices, please see our 
              <Link href="/cookie-policy" className="text-primary hover:underline"> Cookie Policy</Link>.
            </p>
          </section>

          {/* International Transfers */}
          <section id="international-transfers" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">International Data Transfers</h2>
            <p className="mb-4">
              Our services are hosted in the United States. If you are accessing our service from outside the US, 
              your information may be transferred to, stored, and processed in the US or other countries.
            </p>
            <p className="mb-4">
              We ensure appropriate safeguards are in place for international data transfers, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Standard Contractual Clauses approved by the European Commission</li>
              <li>Adequacy decisions where applicable</li>
              <li>Your explicit consent where required</li>
            </ul>
          </section>

          {/* Children's Privacy */}
          <section id="children" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Children&apos;s Privacy</h2>
            <p className="mb-4">
              Our service is not intended for children under 13 years of age. We do not knowingly collect personal 
              information from children under 13. If you become aware that a child has provided us with personal 
              information, please contact us, and we will take steps to remove such information.
            </p>
            <p className="mb-4">
              For users between 13 and 18, we recommend that parents or guardians review this Privacy Policy and 
              supervise their use of our service.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Posting the updated policy on this page</li>
              <li>Updating the &quot;Last Updated&quot; date</li>
              <li>Sending email notifications for significant changes (if you have an account)</li>
              <li>Displaying prominent notices on our website</li>
            </ul>
            <p className="mb-4">
              Your continued use of our service after any changes constitutes acceptance of the updated Privacy Policy.
            </p>
          </section>

          {/* Contact Information */}
          <section id="contact" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Mail className="w-6 h-6" />
              Contact Information
            </h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">General Privacy Inquiries</h3>
                <p className="text-sm text-muted-foreground mb-2">Email: <a href="mailto:privacy@streamyyy.com" className="text-primary hover:underline">privacy@streamyyy.com</a></p>
                <p className="text-sm text-muted-foreground">Response time: Within 30 days</p>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Data Subject Requests</h3>
                <p className="text-sm text-muted-foreground mb-2">Use our <Link href="/privacy-request" className="text-primary hover:underline">Privacy Request Form</Link></p>
                <p className="text-sm text-muted-foreground">Or email: <a href="mailto:privacy@streamyyy.com" className="text-primary hover:underline">privacy@streamyyy.com</a></p>
              </div>
            </div>

            <div className="mt-6 p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Mailing Address</h3>
              <p className="text-sm text-muted-foreground">
                Streamyyy Privacy Officer<br />
                [Company Address]<br />
                [City, State, ZIP Code]<br />
                [Country]
              </p>
            </div>
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