import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function DMCAPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Streamyyy
      </Link>
      
      <h1 className="text-4xl font-bold mb-8">DMCA Policy & Copyright Compliance</h1>
      
      <div className="prose prose-invert max-w-none space-y-6">
        <p className="text-muted-foreground">
          Effective Date: January 7, 2025
        </p>

        <div className="bg-red-900/20 border border-red-900/50 p-4 rounded-lg mb-8">
          <p className="font-semibold text-red-200">DMCA Safe Harbor Compliance</p>
          <p className="text-sm">
            Streamyyy.com qualifies for DMCA Safe Harbor protection under 17 U.S.C. § 512. 
            We comply with all requirements for Online Service Providers and maintain a strict repeat infringer policy.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Our Commitment to Copyright Protection</h2>
          <p>
            Streamyyy.com ("we," "us," or "Service") respects the intellectual property rights of others and expects 
            our users to do the same. We comply with the Digital Millennium Copyright Act ("DMCA"), 17 U.S.C. § 512, 
            and have implemented procedures to respond to copyright infringement notices.
          </p>
          <p className="mt-2 font-semibold">
            As an Online Service Provider under the DMCA, we maintain Safe Harbor protection by:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Not having actual knowledge of infringing material</li>
            <li>Not receiving financial benefit directly attributable to infringing activity</li>
            <li>Expeditiously removing or disabling access upon proper notification</li>
            <li>Adopting and implementing a repeat infringer termination policy</li>
            <li>Accommodating standard technical measures</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Nature of Our Service - Critical Information</h2>
          <div className="bg-blue-900/20 border border-blue-900/50 p-4 rounded-lg">
            <p className="font-semibold text-blue-200 mb-2">Streamyyy is a Stream Aggregator</p>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>We do not host, store, upload, or control any streaming content</li>
              <li>All streams are embedded directly from third-party platforms using their official embed codes</li>
              <li>Content is transmitted directly from Third-Party Platforms to users' devices</li>
              <li>We function as a "mere conduit" under DMCA § 512(a)</li>
              <li>We also qualify for "information location tools" protection under § 512(d)</li>
            </ul>
          </div>
          <p className="mt-4">
            Given our role as an aggregator, copyright complaints about stream content should be directed to the 
            platforms hosting the content. However, we maintain this DMCA policy to ensure full compliance with the law.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Designated DMCA Agent</h2>
          <p>Our designated agent for DMCA notices is:</p>
          <div className="bg-gray-900/50 p-4 rounded-lg mt-2">
            <p><strong>DMCA Agent</strong></p>
            <p>Streamyyy.com Legal Department</p>
            <p>Email: <a href="mailto:dmca@streamyyy.com" className="text-primary hover:underline">dmca@streamyyy.com</a></p>
            <p>Secondary: <a href="mailto:legal@streamyyy.com" className="text-primary hover:underline">legal@streamyyy.com</a></p>
          </div>
          <p className="mt-4 text-sm text-yellow-200">
            Note: This contact is ONLY for DMCA notices. All other inquiries will be ignored.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. How to File a DMCA Takedown Notice</h2>
          <p>
            To file a valid DMCA takedown notice, you must provide a written communication that includes 
            ALL of the following elements:
          </p>
          <ol className="list-decimal pl-6 space-y-2 mt-2">
            <li>
              <strong>Physical or Electronic Signature:</strong> A signature of the copyright owner or 
              authorized representative
            </li>
            <li>
              <strong>Identification of Copyrighted Work:</strong> Clear identification of the copyrighted 
              work claimed to be infringed
            </li>
            <li>
              <strong>Identification of Infringing Material:</strong> Identification of the material claimed 
              to be infringing, including:
              <ul className="list-disc pl-6 mt-2">
                <li>The specific URL on Streamyyy.com</li>
                <li>The platform hosting the stream (Twitch, YouTube, etc.)</li>
                <li>Channel name or stream identifier</li>
                <li>Time stamps if applicable</li>
              </ul>
            </li>
            <li>
              <strong>Contact Information:</strong> Your complete contact information including:
              <ul className="list-disc pl-6 mt-2">
                <li>Full legal name</li>
                <li>Address</li>
                <li>Telephone number</li>
                <li>Email address</li>
              </ul>
            </li>
            <li>
              <strong>Good Faith Statement:</strong> A statement that you have a good faith belief that the 
              use is not authorized by the copyright owner, its agent, or the law
            </li>
            <li>
              <strong>Accuracy Statement:</strong> A statement made under penalty of perjury that the information 
              in your notice is accurate and that you are the copyright owner or authorized to act on their behalf
            </li>
          </ol>
          
          <div className="bg-yellow-900/20 border border-yellow-900/50 p-4 rounded-lg mt-4">
            <p className="font-semibold text-yellow-200">⚠️ Warning</p>
            <p className="text-sm">
              Under 17 U.S.C. § 512(f), you may be liable for damages, including costs and attorneys' fees, 
              if you knowingly materially misrepresent that material is infringing.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Direct Platform Reporting (Recommended)</h2>
          <p>
            Since we embed content from third-party platforms, the most effective way to address copyright 
            concerns is to report directly to the hosting platform:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-purple-900/20 border border-purple-900/50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-200 mb-2">Twitch</h3>
              <ul className="text-sm space-y-1">
                <li><a href="https://www.twitch.tv/p/legal/dmca-guidelines/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">DMCA Guidelines</a></li>
                <li><a href="https://www.twitch.tv/p/legal/dmca-notifications/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">File a Notification</a></li>
                <li>Email: dmca@twitch.tv</li>
              </ul>
            </div>
            <div className="bg-red-900/20 border border-red-900/50 p-4 rounded-lg">
              <h3 className="font-semibold text-red-200 mb-2">YouTube</h3>
              <ul className="text-sm space-y-1">
                <li><a href="https://support.google.com/youtube/answer/2807622" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Copyright Center</a></li>
                <li><a href="https://www.youtube.com/copyright_complaint_form" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Complaint Form</a></li>
                <li>Content ID System Available</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Counter-Notification Procedures</h2>
          <p>
            If you believe content was removed in error or misidentification, you may file a counter-notification. 
            <strong>Note:</strong> Counter-notifications are legal documents with legal consequences.
          </p>
          
          <h3 className="text-xl font-semibold mt-4 mb-2">Required Elements for Counter-Notice:</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              <strong>Physical or Electronic Signature:</strong> Your signature
            </li>
            <li>
              <strong>Identification of Removed Material:</strong> Description of the material and its location 
              before removal
            </li>
            <li>
              <strong>Statement Under Penalty of Perjury:</strong> A statement that you have a good faith belief 
              that the material was removed as a result of mistake or misidentification
            </li>
            <li>
              <strong>Contact Information:</strong>
              <ul className="list-disc pl-6 mt-2">
                <li>Your full legal name</li>
                <li>Address</li>
                <li>Telephone number</li>
                <li>Email address</li>
              </ul>
            </li>
            <li>
              <strong>Consent to Jurisdiction:</strong> A statement that you consent to the jurisdiction of the 
              Federal District Court for the district in which your address is located (or Delaware if outside 
              the United States)
            </li>
            <li>
              <strong>Service Acceptance:</strong> Agreement to accept service of process from the complainant
            </li>
          </ol>

          <h3 className="text-xl font-semibold mt-4 mb-2">Counter-Notice Process:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>We will forward valid counter-notices to the original complainant</li>
            <li>If the complainant does not file a lawsuit within 10-14 business days, we may restore the content</li>
            <li>The decision to restore content remains at our sole discretion</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Repeat Infringer Policy</h2>
          <p>
            In accordance with the DMCA and other applicable laws, we have adopted a policy of terminating, 
            in appropriate circumstances, users who are deemed to be repeat infringers.
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>First Offense: Warning and content removal (if applicable)</li>
            <li>Second Offense: Temporary suspension of access</li>
            <li>Third Offense: Permanent termination of access</li>
          </ul>
          <p className="mt-4">
            We may also terminate access of users who, in our sole discretion, are believed to be infringers 
            regardless of the number of offenses.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Modifications to Policy</h2>
          <p>
            We reserve the right to modify this policy at any time. Changes will be effective immediately 
            upon posting to this page. Your continued use of the Service after changes constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">9. No Duty to Monitor</h2>
          <p>
            We are under no obligation to monitor content for infringement. We rely on copyright owners and 
            their agents to notify us of alleged infringements.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">10. Additional Legal Information</h2>
          <div className="bg-gray-900/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">False Claims Warning</h3>
            <p className="text-sm">
              Any person who knowingly materially misrepresents that material or activity is infringing, 
              or that material was removed by mistake, may be subject to liability under Section 512(f) of the DMCA.
            </p>
          </div>
          
          <div className="bg-gray-900/50 p-4 rounded-lg mt-4">
            <h3 className="font-semibold mb-2">Preservation of Other Rights</h3>
            <p className="text-sm">
              This DMCA Policy does not limit or waive any other rights or remedies we may have under 
              applicable law. We reserve all rights not expressly granted.
            </p>
          </div>
        </section>

        <section className="bg-green-900/20 border border-green-900/50 p-4 rounded-lg mt-8">
          <h3 className="text-lg font-semibold text-green-200 mb-2">Summary of Our DMCA Safe Harbor Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold">✓ Section 512(a) - Transitory Communications</p>
              <p className="text-muted-foreground">We transmit content at users' direction without modification</p>
            </div>
            <div>
              <p className="font-semibold">✓ Section 512(b) - System Caching</p>
              <p className="text-muted-foreground">Temporary storage for performance optimization</p>
            </div>
            <div>
              <p className="font-semibold">✓ Section 512(c) - User Storage</p>
              <p className="text-muted-foreground">We don't store user content but maintain compliance</p>
            </div>
            <div>
              <p className="font-semibold">✓ Section 512(d) - Information Location Tools</p>
              <p className="text-muted-foreground">Linking/embedding third-party streams</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}