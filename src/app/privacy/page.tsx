import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Streamyyy
      </Link>
      
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-invert max-w-none space-y-6">
        <p className="text-muted-foreground">
          Effective Date: January 7, 2025
        </p>

        <div className="bg-blue-900/20 border border-blue-900/50 p-4 rounded-lg mb-8">
          <p className="font-semibold text-blue-200">Your Privacy Matters</p>
          <p className="text-sm">
            This Privacy Policy complies with GDPR, CCPA/CPRA, and other privacy regulations. 
            We are committed to protecting your personal information and being transparent about our data practices.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p>
            We collect and process the following categories of personal information:
          </p>
          
          <h3 className="text-xl font-semibold mt-4 mb-2">A. Information Collected Automatically</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Device Information:</strong> Browser type, operating system, device type, screen resolution, language preferences</li>
            <li><strong>Usage Data:</strong> Pages viewed, features used, time spent on pages, click data, scroll depth</li>
            <li><strong>Technical Data:</strong> IP address (anonymized), time zone, browser plugins, browser version</li>
            <li><strong>Performance Data:</strong> Load times, errors encountered, feature performance metrics</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">B. Information Stored Locally</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Preferences:</strong> Layout preferences, theme settings, stream configurations</li>
            <li><strong>Session Data:</strong> Temporary session identifiers, current viewing state</li>
            <li><strong>Cache Data:</strong> Cached resources for performance optimization</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">C. Third-Party Data Collection</h3>
          <p className="mt-2">
            When you view embedded streams, Third-Party Platforms (Twitch, YouTube, etc.) may collect data according to their own privacy policies:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Viewing history and watch time</li>
            <li>Interaction data (likes, comments, follows)</li>
            <li>Account information if logged into their services</li>
            <li>Device and browser information</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Legal Basis for Processing (GDPR)</h2>
          <p>We process your personal information under the following legal bases:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li><strong>Legitimate Interests:</strong> To provide and improve our service, ensure security, and prevent fraud</li>
            <li><strong>Consent:</strong> For analytics and optional features (you can withdraw consent at any time)</li>
            <li><strong>Legal Obligations:</strong> To comply with applicable laws and regulations</li>
            <li><strong>Vital Interests:</strong> To protect the vital interests of you or others</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Information</h2>
          <p>We use collected information for the following specific purposes:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li><strong>Service Provision:</strong> Enable multi-stream viewing functionality</li>
            <li><strong>Performance Optimization:</strong> Improve loading times and reduce bandwidth usage</li>
            <li><strong>Analytics:</strong> Understand usage patterns and popular features</li>
            <li><strong>Security:</strong> Detect and prevent abuse, fraud, and unauthorized access</li>
            <li><strong>Legal Compliance:</strong> Comply with legal obligations and respond to legal requests</li>
            <li><strong>Communication:</strong> Send important service updates (only when necessary)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Cookies and Tracking Technologies</h2>
          <p>We use the following types of cookies and similar technologies:</p>
          
          <h3 className="text-xl font-semibold mt-4 mb-2">Essential Cookies</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Session management and authentication</li>
            <li>Security features and fraud prevention</li>
            <li>Load balancing and service stability</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">Functional Cookies</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>User preferences (layout, theme, language)</li>
            <li>Feature settings and configurations</li>
            <li>Recently viewed streams</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">Analytics Cookies (With Consent)</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Google Analytics (anonymized IP addresses)</li>
            <li>Performance monitoring tools</li>
            <li>Error tracking and debugging</li>
          </ul>

          <p className="mt-4">
            For detailed information about cookies, see our <Link href="/cookies" className="text-primary hover:underline">Cookie Policy</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Data Sharing and Third-Party Services</h2>
          <p className="font-semibold">We do not sell, rent, or trade your personal information.</p>
          
          <h3 className="text-xl font-semibold mt-4 mb-2">Service Providers</h3>
          <p>We may share data with trusted service providers who assist us in operating our service:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li><strong>Analytics:</strong> Google Analytics (data processing agreement in place)</li>
            <li><strong>Infrastructure:</strong> Hosting and CDN providers</li>
            <li><strong>Security:</strong> DDoS protection and security monitoring services</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">Third-Party Platforms</h3>
          <p>When viewing embedded content, you interact directly with:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li><a href="https://www.twitch.tv/p/privacy-policy/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Twitch</a> - Live streaming platform</li>
            <li><a href="https://policies.google.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">YouTube</a> - Video streaming service</li>
            <li><a href="https://rumble.com/s/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Rumble</a> - Video platform</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">Legal Requirements</h3>
          <p>We may disclose information when required by law, including:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Response to valid legal requests (subpoenas, court orders)</li>
            <li>Protection of our rights, property, or safety</li>
            <li>Prevention of fraud or security issues</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
          <p>We implement industry-standard security measures:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li><strong>Encryption:</strong> TLS/SSL encryption for all data transmissions</li>
            <li><strong>Access Controls:</strong> Limited access to personal data on a need-to-know basis</li>
            <li><strong>Regular Audits:</strong> Security assessments and vulnerability testing</li>
            <li><strong>Incident Response:</strong> Procedures for detecting and responding to data breaches</li>
            <li><strong>Data Minimization:</strong> We only collect data necessary for service operation</li>
          </ul>
          <p className="mt-4">
            In the event of a data breach affecting your personal information, we will notify you within 72 hours 
            as required by GDPR.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
          <p>We retain personal information for the following periods:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li><strong>Analytics Data:</strong> Maximum 26 months (Google Analytics default)</li>
            <li><strong>Server Logs:</strong> 90 days for security and debugging</li>
            <li><strong>Session Data:</strong> Duration of your session plus 30 days</li>
            <li><strong>Local Storage:</strong> Until you clear your browser data</li>
          </ul>
          <p className="mt-4">
            After retention periods expire, data is either deleted or anonymized. You can request deletion 
            of your data at any time (see Your Rights section).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Your Privacy Rights</h2>
          
          <h3 className="text-xl font-semibold mt-4 mb-2">Under GDPR (European Users)</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
            <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
            <li><strong>Right to Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
            <li><strong>Right to Restrict Processing:</strong> Limit how we use your data</li>
            <li><strong>Right to Data Portability:</strong> Receive your data in a portable format</li>
            <li><strong>Right to Object:</strong> Object to certain processing activities</li>
            <li><strong>Rights Related to Automated Decision-Making:</strong> Not applicable as we don't use automated decision-making</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">Under CCPA/CPRA (California Users)</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Right to Know:</strong> Request disclosure of personal information collected</li>
            <li><strong>Right to Delete:</strong> Request deletion of personal information</li>
            <li><strong>Right to Opt-Out:</strong> Opt-out of the sale of personal information (we don't sell data)</li>
            <li><strong>Right to Non-Discrimination:</strong> Equal service regardless of exercising privacy rights</li>
            <li><strong>Right to Correct:</strong> Request correction of inaccurate information</li>
            <li><strong>Right to Limit Use:</strong> Limit use of sensitive personal information</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">How to Exercise Your Rights</h3>
          <p>To exercise any of these rights, contact us at:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Email: <a href="mailto:privacy@streamyyy.com" className="text-primary hover:underline">privacy@streamyyy.com</a></li>
            <li>Response time: Within 30 days (GDPR) or 45 days (CCPA)</li>
            <li>Verification: We may request information to verify your identity</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">9. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your own. 
            We ensure appropriate safeguards are in place:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Standard Contractual Clauses (SCCs) for transfers outside the EEA</li>
            <li>Privacy Shield replacement mechanisms where applicable</li>
            <li>Adequacy decisions by the European Commission</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">10. Children's Privacy</h2>
          <p>
            Our Service is not directed to children under 13. We do not knowingly collect personal 
            information from children under 13. If we become aware that we have collected personal 
            information from a child under 13, we will take steps to delete such information.
          </p>
          <p className="mt-2">
            For users between 13-16 in the EU, we rely on parental consent or comply with applicable 
            member state provisions for processing their data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">11. Do Not Track Signals</h2>
          <p>
            We respect Do Not Track (DNT) browser signals. When DNT is enabled, we disable analytics 
            tracking and limit data collection to essential service functionality only.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">12. California Shine the Light Law</h2>
          <p>
            California residents may request information about disclosure of personal information to 
            third parties for direct marketing purposes. We do not share personal information for 
            direct marketing.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">13. Changes to Privacy Policy</h2>
          <p>
            We may update this Privacy Policy to reflect changes in our practices or legal requirements. 
            Material changes will be notified through:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Prominent notice on our website</li>
            <li>Update to the "Effective Date" at the top</li>
            <li>Email notification for significant changes (if we have your email)</li>
          </ul>
          <p className="mt-2">
            Continued use of our Service after changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">14. Contact Information</h2>
          <p className="font-semibold">Data Controller:</p>
          <p>Streamyyy.com</p>
          
          <p className="mt-4 font-semibold">Contact Methods:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>General Inquiries: <a href="mailto:contact@streamyyy.com" className="text-primary hover:underline">contact@streamyyy.com</a></li>
            <li>Privacy Specific: <a href="mailto:privacy@streamyyy.com" className="text-primary hover:underline">privacy@streamyyy.com</a></li>
            <li>Data Protection Officer: <a href="mailto:dpo@streamyyy.com" className="text-primary hover:underline">dpo@streamyyy.com</a></li>
          </ul>

          <p className="mt-4 font-semibold">EU Representative:</p>
          <p>For GDPR inquiries from EU residents, contact our EU representative at the addresses above.</p>
        </section>

        <section className="bg-green-900/20 border border-green-900/50 p-4 rounded-lg mt-8">
          <h3 className="text-lg font-semibold text-green-200 mb-2">Privacy Compliance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold">✓ GDPR Compliant</p>
              <p className="text-muted-foreground">Full compliance with European data protection laws</p>
            </div>
            <div>
              <p className="font-semibold">✓ CCPA/CPRA Compliant</p>
              <p className="text-muted-foreground">California Consumer Privacy Act compliance</p>
            </div>
            <div>
              <p className="font-semibold">✓ COPPA Compliant</p>
              <p className="text-muted-foreground">Children's Online Privacy Protection</p>
            </div>
            <div>
              <p className="font-semibold">✓ Privacy by Design</p>
              <p className="text-muted-foreground">Data minimization and protection built-in</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}