'use client'

import React from 'react'
import Link from 'next/link'
import { Shield, Mail, FileText, AlertTriangle, Calendar, Clock, Gavel, Send } from 'lucide-react'

export default function DMCAPolicyPage() {
  const lastUpdated = "January 1, 2025"
  const effectiveDate = "January 1, 2025"

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">DMCA Copyright Policy</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Streamyyy respects intellectual property rights and complies with the Digital Millennium Copyright Act (DMCA). 
            This policy outlines our procedures for handling copyright infringement claims.
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

        {/* Quick Actions */}
        <div className="mb-12 grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-3 mb-4">
              <Send className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-semibold text-red-800 dark:text-red-200">File DMCA Notice</h2>
            </div>
            <p className="text-red-700 dark:text-red-300 mb-4">
              If you believe your copyrighted work has been infringed, file a takedown notice.
            </p>
            <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Submit DMCA Takedown Notice
            </button>
          </div>
          
          <div className="p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200">File Counter-Notice</h2>
            </div>
            <p className="text-blue-700 dark:text-blue-300 mb-4">
              If your content was removed in error, you can file a counter-notification.
            </p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Submit Counter-Notification
            </button>
          </div>
        </div>

        {/* Emergency Notice */}
        <div className="mb-12 p-6 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Important Legal Notice</h3>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Filing false DMCA notices or counter-notifications may result in legal liability. Consult with an attorney 
                if you are unsure about your rights. This policy is for informational purposes and does not constitute legal advice.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-gray dark:prose-invert max-w-none">
          
          {/* Overview */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">DMCA Overview</h2>
            <p className="mb-4">
              The Digital Millennium Copyright Act (DMCA) provides a framework for addressing copyright infringement 
              on online platforms. As a service that enables users to view streams from various platforms, Streamyyy 
              is committed to respecting intellectual property rights and responding appropriately to valid copyright claims.
            </p>
            <p className="mb-4">
              This policy explains our procedures for:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Receiving and processing DMCA takedown notices</li>
              <li>Handling counter-notifications</li>
              <li>Protecting the rights of both copyright owners and users</li>
              <li>Maintaining compliance with applicable copyright laws</li>
            </ul>
          </section>

          {/* Our Role */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Streamyyy&apos;s Role and Limitations</h2>
            <p className="mb-4">
              <strong>Important:</strong> Streamyyy is a multi-stream viewing platform that aggregates and displays 
              publicly available streams from third-party platforms such as Twitch, YouTube, and others.
            </p>
            
            <h3 className="text-xl font-medium mt-6 mb-3">What We Do</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide a interface for viewing multiple streams simultaneously</li>
              <li>Respond to valid DMCA notices regarding our platform</li>
              <li>Remove infringing content that we host or control</li>
              <li>Implement repeat infringer policies</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">What We Don&apos;t Control</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Content hosted on third-party streaming platforms</li>
              <li>Streams broadcasted by individual streamers</li>
              <li>Copyright policies of other platforms</li>
            </ul>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-l-4 border-blue-500 mt-6">
              <p className="text-sm mb-0">
                <strong>Note:</strong> For content hosted on other platforms (Twitch, YouTube, etc.), you should 
                file DMCA notices directly with those platforms using their respective copyright procedures.
              </p>
            </div>
          </section>

          {/* Filing a DMCA Notice */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Gavel className="w-6 h-6" />
              Filing a DMCA Takedown Notice
            </h2>
            
            <p className="mb-4">
              If you believe that content on our platform infringes your copyright, you may file a DMCA takedown notice. 
              Your notice must include all of the following information:
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">Required Information</h3>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">1. Your Signature</h4>
                <p className="text-sm text-muted-foreground">
                  A physical or electronic signature of the copyright owner or person authorized to act on their behalf.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">2. Identification of Copyrighted Work</h4>
                <p className="text-sm text-muted-foreground">
                  A description of the copyrighted work that you claim has been infringed, including:
                </p>
                <ul className="list-disc pl-6 text-sm text-muted-foreground mt-2">
                  <li>Title of the work</li>
                  <li>Copyright registration number (if applicable)</li>
                  <li>Description of the work if no title exists</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">3. Identification of Infringing Material</h4>
                <p className="text-sm text-muted-foreground">
                  A description of the material claimed to be infringing, including:
                </p>
                <ul className="list-disc pl-6 text-sm text-muted-foreground mt-2">
                  <li>URL or specific location of the infringing material</li>
                  <li>Screenshot or description of the infringing content</li>
                  <li>Sufficient information to locate the material</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">4. Your Contact Information</h4>
                <p className="text-sm text-muted-foreground">
                  Your name, address, telephone number, and email address.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">5. Good Faith Statement</h4>
                <p className="text-sm text-muted-foreground">
                  A statement that you have a good faith belief that the use of the material is not authorized 
                  by the copyright owner, its agent, or the law.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">6. Accuracy Statement</h4>
                <p className="text-sm text-muted-foreground">
                  A statement that the information in your notice is accurate and, under penalty of perjury, 
                  that you are the copyright owner or authorized to act on behalf of the copyright owner.
                </p>
              </div>
            </div>

            <h3 className="text-xl font-medium mt-6 mb-3">How to Submit</h3>
            <p className="mb-4">Send your complete DMCA notice to our designated copyright agent:</p>
            
            <div className="p-6 bg-muted/50 rounded-lg border">
              <h4 className="font-medium mb-3">DMCA Designated Agent</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> <a href="mailto:dmca@streamyyy.com" className="text-primary hover:underline">dmca@streamyyy.com</a></p>
                <p><strong>Subject Line:</strong> DMCA Takedown Notice</p>
                <p><strong>Mailing Address:</strong><br />
                   Streamyyy DMCA Agent<br />
                   [Company Address]<br />
                   [City, State, ZIP Code]<br />
                   [Country]
                </p>
                <p><strong>Phone:</strong> [Phone Number]</p>
              </div>
            </div>
          </section>

          {/* Counter-Notification */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Filing a Counter-Notification</h2>
            <p className="mb-4">
              If you believe that your content was removed or disabled as a result of a mistake or misidentification, 
              you may file a counter-notification.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">Required Information for Counter-Notification</h3>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">1. Your Signature</h4>
                <p className="text-sm text-muted-foreground">
                  Your physical or electronic signature.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">2. Identification of Removed Material</h4>
                <p className="text-sm text-muted-foreground">
                  Identification of the material that was removed and the location where it appeared before removal.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">3. Good Faith Statement</h4>
                <p className="text-sm text-muted-foreground">
                  A statement under penalty of perjury that you have a good faith belief that the material was 
                  removed as a result of mistake or misidentification.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">4. Consent to Jurisdiction</h4>
                <p className="text-sm text-muted-foreground">
                  Your name, address, phone number, and a statement that you consent to the jurisdiction of 
                  the federal district court for your address.
                </p>
              </div>
            </div>

            <h3 className="text-xl font-medium mt-6 mb-3">Counter-Notification Process</h3>
            <ol className="list-decimal pl-6 mb-4">
              <li>We will provide your counter-notification to the original complainant</li>
              <li>If the complainant does not file a court action within 10-14 business days, we may restore the content</li>
              <li>We are not obligated to restore content and may use our discretion</li>
            </ol>
          </section>

          {/* Our Response Process */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Response Process</h2>
            
            <h3 className="text-xl font-medium mt-6 mb-3">Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-sm font-medium">1</div>
                <span><strong>Within 24 hours:</strong> Initial review of DMCA notice</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-sm font-medium">2</div>
                <span><strong>Within 48 hours:</strong> Response to valid notices (removal or explanation)</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-sm font-medium">3</div>
                <span><strong>Within 72 hours:</strong> Notification to affected users (if applicable)</span>
              </div>
            </div>

            <h3 className="text-xl font-medium mt-6 mb-3">Actions We May Take</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Remove or disable access to allegedly infringing content</li>
              <li>Notify the user who posted the content</li>
              <li>Document the infringement for repeat infringer tracking</li>
              <li>Terminate accounts of repeat infringers</li>
              <li>Cooperate with legal proceedings when required</li>
            </ul>
          </section>

          {/* Repeat Infringer Policy */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Repeat Infringer Policy</h2>
            <p className="mb-4">
              Streamyyy has adopted a policy of terminating, in appropriate circumstances, users who are 
              deemed to be repeat infringers.
            </p>
            
            <h3 className="text-xl font-medium mt-6 mb-3">Definition of Repeat Infringer</h3>
            <p className="mb-4">
              A repeat infringer is a user who has been subject to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Multiple valid DMCA takedown notices</li>
              <li>Court orders finding copyright infringement</li>
              <li>Other clear evidence of repeated copyright violations</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">Enforcement</h3>
            <p className="mb-4">
              We may terminate user accounts based on our assessment of the circumstances, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Number and frequency of infringement claims</li>
              <li>Validity of the claims</li>
              <li>User&apos;s response to previous notices</li>
              <li>Overall pattern of behavior</li>
            </ul>
          </section>

          {/* False Claims */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">False Claims and Misrepresentation</h2>
            
            <div className="p-6 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
              <h3 className="font-semibold text-red-800 dark:text-red-200 mb-3">⚠️ Warning About False Claims</h3>
              <p className="text-red-700 dark:text-red-300 mb-3">
                Under Section 512(f) of the DMCA, any person who knowingly materially misrepresents that 
                material is infringing may be subject to liability for damages.
              </p>
              <p className="text-red-700 dark:text-red-300">
                This includes both false takedown notices and false counter-notifications.
              </p>
            </div>

            <h3 className="text-xl font-medium mt-6 mb-3">Potential Consequences</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Legal liability for damages including costs and attorney&apos;s fees</li>
              <li>Suspension or termination of your account</li>
              <li>Referral to appropriate legal authorities</li>
              <li>Permanent ban from our services</li>
            </ul>
          </section>

          {/* Safe Harbor Compliance */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Safe Harbor Compliance</h2>
            <p className="mb-4">
              Streamyyy operates in compliance with the DMCA&apos;s safe harbor provisions under Section 512. 
              We have implemented policies and procedures to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Designate an agent to receive infringement notifications</li>
              <li>Expeditiously remove allegedly infringing material</li>
              <li>Implement a repeat infringer policy</li>
              <li>Accommodate standard technical measures</li>
            </ul>
          </section>

          {/* International Considerations */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">International Copyright</h2>
            <p className="mb-4">
              While this policy primarily addresses U.S. copyright law under the DMCA, we respect copyright 
              laws worldwide. We may respond to valid copyright claims from other jurisdictions following 
              similar procedures where appropriate.
            </p>
            <p className="mb-4">
              For international copyright issues, please include information about the applicable copyright 
              law and jurisdiction in your notice.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Mail className="w-6 h-6" />
              Contact Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-3">DMCA Takedown Notices</h3>
                <div className="text-sm space-y-1">
                  <p><strong>Email:</strong> <a href="mailto:dmca@streamyyy.com" className="text-primary hover:underline">dmca@streamyyy.com</a></p>
                  <p><strong>Subject:</strong> DMCA Takedown Notice</p>
                  <p><strong>Response Time:</strong> Within 48 hours</p>
                </div>
              </div>
              
              <div className="p-6 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-3">Counter-Notifications</h3>
                <div className="text-sm space-y-1">
                  <p><strong>Email:</strong> <a href="mailto:dmca@streamyyy.com" className="text-primary hover:underline">dmca@streamyyy.com</a></p>
                  <p><strong>Subject:</strong> DMCA Counter-Notification</p>
                  <p><strong>Response Time:</strong> Within 72 hours</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-6 border rounded-lg">
              <h3 className="font-medium mb-3">Mailing Address</h3>
              <div className="text-sm text-muted-foreground">
                <p>Streamyyy DMCA Agent</p>
                <p>[Company Legal Name]</p>
                <p>[Street Address]</p>
                <p>[City, State, ZIP Code]</p>
                <p>[Country]</p>
                <p>Phone: [Phone Number]</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm mb-0">
                <strong>Note:</strong> Our DMCA agent information is also registered with the U.S. Copyright Office 
                as required by the DMCA. Please allow 48-72 hours for response to properly formatted notices.
              </p>
            </div>
          </section>

          {/* Resources */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Additional Resources</h2>
            <p className="mb-4">For more information about copyright law and the DMCA:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><a href="https://www.copyright.gov/dmca/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">U.S. Copyright Office DMCA Information</a></li>
              <li><a href="https://www.eff.org/issues/dmca" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Electronic Frontier Foundation DMCA Guide</a></li>
              <li><Link href="/privacy-policy" className="text-primary hover:underline">Our Privacy Policy</Link></li>
              <li><Link href="/terms-conditions" className="text-primary hover:underline">Our Terms & Conditions</Link></li>
            </ul>
          </section>

          {/* Policy Updates */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Policy Updates</h2>
            <p className="mb-4">
              We may update this DMCA policy from time to time to reflect changes in law or our procedures. 
              Material changes will be posted on this page with an updated &quot;Last Updated&quot; date.
            </p>
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