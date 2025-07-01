'use client'

import React from 'react'
import Link from 'next/link'
import { FileText, Calendar, Clock, AlertTriangle, Shield, Scale, Globe, Gavel } from 'lucide-react'

export default function TermsConditionsPage() {
  const lastUpdated = "January 1, 2025"
  const effectiveDate = "January 1, 2025"

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Terms & Conditions</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            These terms govern your use of Streamyyy's multi-stream viewing platform and services. Please read them carefully.
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

        {/* Legal Compliance Badges */}
        <div className="mb-12 flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <Scale className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">DMCA Compliant</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">Privacy Protected</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <Globe className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">International Law</span>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="mb-12 p-6 bg-muted/50 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            <a href="#acceptance" className="text-primary hover:underline">Acceptance of Terms</a>
            <a href="#description" className="text-primary hover:underline">Service Description</a>
            <a href="#user-accounts" className="text-primary hover:underline">User Accounts</a>
            <a href="#acceptable-use" className="text-primary hover:underline">Acceptable Use</a>
            <a href="#intellectual-property" className="text-primary hover:underline">Intellectual Property</a>
            <a href="#dmca" className="text-primary hover:underline">DMCA Policy</a>
            <a href="#privacy" className="text-primary hover:underline">Privacy</a>
            <a href="#disclaimers" className="text-primary hover:underline">Disclaimers</a>
            <a href="#limitation-liability" className="text-primary hover:underline">Limitation of Liability</a>
            <a href="#termination" className="text-primary hover:underline">Termination</a>
            <a href="#governing-law" className="text-primary hover:underline">Governing Law</a>
            <a href="#contact" className="text-primary hover:underline">Contact Information</a>
          </div>
        </div>

        {/* Important Notice */}
        <div className="mb-12 p-6 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Important Legal Notice</h3>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                By accessing or using Streamyyy, you agree to be bound by these Terms & Conditions. If you do not agree 
                to these terms, please do not use our service. These terms include important information about your legal 
                rights, remedies, and obligations.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-gray dark:prose-invert max-w-none">
          
          {/* Acceptance of Terms */}
          <section id="acceptance" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              These Terms & Conditions ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") 
              and Streamyyy ("Company," "we," "us," or "our") regarding your use of the Streamyyy website (streamyyy.com) 
              and related services (collectively, the "Service").
            </p>
            <p className="mb-4">
              By accessing or using our Service, you acknowledge that you have read, understood, and agree to be bound by 
              these Terms and our Privacy Policy. If you do not agree to these Terms, you must not access or use our Service.
            </p>
            <p className="mb-4">
              These Terms apply to all visitors, users, and others who access or use the Service.
            </p>
          </section>

          {/* Service Description */}
          <section id="description" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="mb-4">
              Streamyyy is a free multi-stream viewing platform that allows users to watch multiple live streams 
              simultaneously from various streaming platforms including Twitch, YouTube, Kick, Rumble, and others.
            </p>
            
            <h3 className="text-xl font-medium mt-6 mb-3">2.1 Service Features</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Multi-stream grid layout viewing</li>
              <li>Integration with popular streaming platforms</li>
              <li>Customizable stream layouts and arrangements</li>
              <li>Chat integration from supported platforms</li>
              <li>Stream discovery and recommendation features</li>
              <li>Mobile-responsive design and controls</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">2.2 Service Availability</h3>
            <p className="mb-4">
              We strive to provide continuous service availability but do not guarantee that the Service will be 
              uninterrupted or error-free. We reserve the right to modify, suspend, or discontinue any part of 
              the Service at any time without notice.
            </p>
          </section>

          {/* User Accounts */}
          <section id="user-accounts" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            
            <h3 className="text-xl font-medium mt-6 mb-3">3.1 Account Creation</h3>
            <p className="mb-4">
              While our basic service does not require account registration, certain features may require you to 
              create an account. When creating an account, you must:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your account information</li>
              <li>Be at least 13 years of age (or the minimum age in your jurisdiction)</li>
              <li>Not create multiple accounts for the same individual</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">3.2 Account Security</h3>
            <p className="mb-4">
              You are responsible for maintaining the confidentiality of your account credentials and for all 
              activities that occur under your account. You agree to notify us immediately of any unauthorized 
              use of your account.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">3.3 Account Termination</h3>
            <p className="mb-4">
              You may delete your account at any time. We may suspend or terminate your account if you violate 
              these Terms or engage in conduct that we determine is inappropriate or harmful.
            </p>
          </section>

          {/* Acceptable Use */}
          <section id="acceptable-use" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use Policy</h2>
            
            <h3 className="text-xl font-medium mt-6 mb-3">4.1 Permitted Uses</h3>
            <p className="mb-4">You may use our Service for lawful purposes, including:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Viewing publicly available live streams</li>
              <li>Creating custom stream layouts for personal use</li>
              <li>Sharing stream configurations with others</li>
              <li>Participating in chat features where available</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">4.2 Prohibited Uses</h3>
            <p className="mb-4">You agree not to use the Service to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon intellectual property rights</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Distribute malware, viruses, or harmful code</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Use automated scripts or bots without permission</li>
              <li>Collect user information without consent</li>
              <li>Engage in commercial activities without authorization</li>
              <li>Circumvent content restrictions or access controls</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">4.3 Enforcement</h3>
            <p className="mb-4">
              We reserve the right to investigate and take appropriate action against users who violate this 
              Acceptable Use Policy, including but not limited to removing content, suspending accounts, 
              or reporting illegal activity to law enforcement.
            </p>
          </section>

          {/* Intellectual Property */}
          <section id="intellectual-property" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property Rights</h2>
            
            <h3 className="text-xl font-medium mt-6 mb-3">5.1 Our Intellectual Property</h3>
            <p className="mb-4">
              The Service and its original content, features, and functionality are owned by Streamyyy and are 
              protected by international copyright, trademark, patent, trade secret, and other intellectual 
              property laws.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">5.2 Third-Party Content</h3>
            <p className="mb-4">
              Our Service displays streams and content from third-party platforms. This content remains the 
              property of its respective owners. We do not claim ownership of any third-party content.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">5.3 User License</h3>
            <p className="mb-4">
              We grant you a limited, non-exclusive, non-transferable license to access and use the Service 
              for personal, non-commercial purposes, subject to these Terms.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">5.4 Feedback</h3>
            <p className="mb-4">
              If you provide feedback, suggestions, or ideas about our Service, you grant us a worldwide, 
              royalty-free license to use such feedback for any purpose without compensation or attribution.
            </p>
          </section>

          {/* DMCA Policy */}
          <section id="dmca" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Gavel className="w-6 h-6" />
              6. DMCA Copyright Policy
            </h2>
            
            <h3 className="text-xl font-medium mt-6 mb-3">6.1 Copyright Compliance</h3>
            <p className="mb-4">
              We respect intellectual property rights and comply with the Digital Millennium Copyright Act (DMCA). 
              We respond to valid copyright infringement notices and may remove infringing content.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">6.2 Reporting Copyright Infringement</h3>
            <p className="mb-4">
              If you believe your copyrighted work has been infringed, please provide our designated DMCA agent with:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>A physical or electronic signature of the copyright owner</li>
              <li>Identification of the copyrighted work claimed to be infringed</li>
              <li>Identification of the infringing material and its location</li>
              <li>Your contact information</li>
              <li>A statement of good faith belief that use is not authorized</li>
              <li>A statement of accuracy and authority to act</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">6.3 Counter-Notification</h3>
            <p className="mb-4">
              If you believe your content was removed in error, you may file a counter-notification with 
              the required information as specified in the DMCA.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">6.4 Repeat Infringer Policy</h3>
            <p className="mb-4">
              We may terminate accounts of users who are repeat copyright infringers in appropriate circumstances.
            </p>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-l-4 border-blue-500 mt-6">
              <p className="text-sm mb-0">
                <strong>DMCA Contact:</strong> For copyright matters, please see our 
                <Link href="/dmca-policy" className="text-primary hover:underline"> DMCA Policy page</Link> 
                for complete contact information and procedures.
              </p>
            </div>
          </section>

          {/* Privacy */}
          <section id="privacy" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">7. Privacy and Data Protection</h2>
            <p className="mb-4">
              Your privacy is important to us. Our collection and use of personal information is governed by 
              our Privacy Policy, which is incorporated into these Terms by reference.
            </p>
            <p className="mb-4">
              By using our Service, you consent to the collection and use of your information as described 
              in our <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>
            <p className="mb-4">
              We comply with applicable data protection laws including GDPR, CCPA, and PIPEDA.
            </p>
          </section>

          {/* Disclaimers */}
          <section id="disclaimers" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">8. Disclaimers</h2>
            
            <h3 className="text-xl font-medium mt-6 mb-3">8.1 Service "As Is"</h3>
            <p className="mb-4">
              THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. WE MAKE NO REPRESENTATIONS OR 
              WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, 
              FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">8.2 Third-Party Content</h3>
            <p className="mb-4">
              We do not control, endorse, or assume responsibility for third-party content, websites, or services 
              accessed through our platform. Users access such content at their own risk.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">8.3 Availability</h3>
            <p className="mb-4">
              We do not guarantee that the Service will be available at all times or that it will function 
              without interruption, delays, or errors.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section id="limitation-liability" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
            <p className="mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, STREAMYYY SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
              SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, 
              OR OTHER INTANGIBLE LOSSES.
            </p>
            <p className="mb-4">
              OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATING TO THE SERVICE SHALL NOT EXCEED 
              THE AMOUNT YOU PAID TO US IN THE TWELVE MONTHS PRECEDING THE CLAIM (OR $100 IF YOU HAVE NOT PAID 
              ANY FEES).
            </p>
            <p className="mb-4">
              Some jurisdictions do not allow the exclusion or limitation of liability for incidental or 
              consequential damages, so the above limitations may not apply to you.
            </p>
          </section>

          {/* Indemnification */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">10. Indemnification</h2>
            <p className="mb-4">
              You agree to defend, indemnify, and hold harmless Streamyyy and its officers, directors, employees, 
              and agents from and against any claims, liabilities, damages, judgments, awards, losses, costs, 
              expenses, or fees arising out of or relating to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Any content you submit or transmit through the Service</li>
            </ul>
          </section>

          {/* Termination */}
          <section id="termination" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">11. Termination</h2>
            
            <h3 className="text-xl font-medium mt-6 mb-3">11.1 Termination by You</h3>
            <p className="mb-4">
              You may stop using the Service at any time. If you have an account, you may delete it through 
              your account settings or by contacting us.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">11.2 Termination by Us</h3>
            <p className="mb-4">
              We may terminate or suspend your access to the Service immediately, without prior notice, for any 
              reason, including if you breach these Terms.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">11.3 Effect of Termination</h3>
            <p className="mb-4">
              Upon termination, your right to use the Service ceases immediately. Provisions that by their nature 
              should survive termination shall survive, including ownership provisions, disclaimers, indemnity, 
              and limitations of liability.
            </p>
          </section>

          {/* Governing Law */}
          <section id="governing-law" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">12. Governing Law and Jurisdiction</h2>
            <p className="mb-4">
              These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction], 
              without regard to its conflict of law provisions.
            </p>
            <p className="mb-4">
              Any disputes arising from or relating to these Terms or the Service shall be resolved through 
              binding arbitration or in the courts of [Jurisdiction], and you consent to personal jurisdiction therein.
            </p>
          </section>

          {/* General Provisions */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">13. General Provisions</h2>
            
            <h3 className="text-xl font-medium mt-6 mb-3">13.1 Entire Agreement</h3>
            <p className="mb-4">
              These Terms, together with our Privacy Policy and any other legal notices published on our Service, 
              constitute the entire agreement between you and Streamyyy.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">13.2 Severability</h3>
            <p className="mb-4">
              If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions 
              shall remain in full force and effect.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">13.3 Waiver</h3>
            <p className="mb-4">
              No waiver of any term or condition shall be deemed a further or continuing waiver of such term 
              or any other term.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">13.4 Assignment</h3>
            <p className="mb-4">
              We may assign our rights and obligations under these Terms without restriction. You may not assign 
              your rights under these Terms without our prior written consent.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">13.5 Updates to Terms</h3>
            <p className="mb-4">
              We reserve the right to modify these Terms at any time. We will notify users of material changes 
              by posting the updated Terms on our website and updating the "Last Updated" date.
            </p>
          </section>

          {/* Contact Information */}
          <section id="contact" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">14. Contact Information</h2>
            <p className="mb-4">
              If you have questions about these Terms & Conditions, please contact us:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">General Legal Inquiries</h3>
                <p className="text-sm text-muted-foreground mb-2">Email: <a href="mailto:legal@streamyyy.com" className="text-primary hover:underline">legal@streamyyy.com</a></p>
                <p className="text-sm text-muted-foreground">Response time: Within 5 business days</p>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">DMCA Notices</h3>
                <p className="text-sm text-muted-foreground mb-2">See our <Link href="/dmca-policy" className="text-primary hover:underline">DMCA Policy</Link></p>
                <p className="text-sm text-muted-foreground">Email: <a href="mailto:dmca@streamyyy.com" className="text-primary hover:underline">dmca@streamyyy.com</a></p>
              </div>
            </div>

            <div className="mt-6 p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Mailing Address</h3>
              <p className="text-sm text-muted-foreground">
                Streamyyy Legal Department<br />
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