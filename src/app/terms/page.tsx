import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Streamyyy
      </Link>
      
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      
      <div className="prose prose-invert max-w-none space-y-6">
        <p className="text-muted-foreground">
          Effective Date: January 7, 2025
        </p>

        <div className="bg-yellow-900/20 border border-yellow-900/50 p-4 rounded-lg mb-8">
          <p className="font-semibold text-yellow-200">IMPORTANT LEGAL NOTICE:</p>
          <p className="text-sm">
            THESE TERMS CONTAIN A BINDING ARBITRATION PROVISION AND CLASS ACTION WAIVER. 
            THEY AFFECT YOUR LEGAL RIGHTS. PLEASE READ CAREFULLY.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms and Eligibility</h2>
          <p>
            By accessing or using Streamyyy.com, any related websites, applications, or services (collectively, the "Service"), 
            you acknowledge that you have read, understood, and agree to be bound by these Terms of Service ("Terms") 
            and all applicable laws and regulations. If you do not agree, you are prohibited from using the Service.
          </p>
          <p className="mt-2">
            <strong>Age Requirement:</strong> You must be at least 13 years old to use this Service. If you are between 
            13 and 18 years old, you must have your parent or legal guardian's permission to use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Service Description and Limitations</h2>
          <p>
            Streamyyy is a stream aggregation platform that enables users to view multiple live streams simultaneously 
            from various third-party streaming services including, but not limited to, Twitch, YouTube, Rumble, and 
            other supported platforms ("Third-Party Platforms").
          </p>
          <p className="mt-2 font-semibold">Important Clarifications:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>We do not host, store, or control any streaming content</li>
            <li>We merely provide embedding and linking functionality to Third-Party Platforms</li>
            <li>All content is transmitted directly from Third-Party Platforms to your device</li>
            <li>We do not modify, edit, or alter any streaming content</li>
            <li>We are not responsible for the availability, quality, or legality of third-party streams</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. User Conduct and Prohibited Uses</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Use the Service for any unlawful purpose or in violation of any applicable laws</li>
            <li>Attempt to gain unauthorized access to any portion of the Service</li>
            <li>Interfere with or disrupt the Service or servers connected to the Service</li>
            <li>Use automated systems or software to extract data from the Service</li>
            <li>Circumvent, disable, or otherwise interfere with security features</li>
            <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
            <li>Use the Service to infringe on any copyright, trademark, or other intellectual property rights</li>
            <li>Engage in any activity that could damage, disable, or impair the Service</li>
            <li>Collect or harvest any personally identifiable information from the Service</li>
            <li>Use the Service for commercial purposes without our express written consent</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Third-Party Content and Services</h2>
          <p className="font-semibold">You expressly acknowledge and agree that:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>All streaming content is owned by and remains the property of the respective content creators and Third-Party Platforms</li>
            <li>Your use of embedded streams is subject to the terms of service of each Third-Party Platform</li>
            <li>We have no control over and assume no responsibility for third-party content</li>
            <li>We do not endorse, guarantee, or assume responsibility for any advertisements or content</li>
            <li>Third-Party Platforms may collect data about you according to their own privacy policies</li>
            <li>We are not liable for any offensive, illegal, or otherwise objectionable content</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property Rights</h2>
          <p>
            The Service and its original content (excluding third-party content), features, and functionality are 
            and will remain the exclusive property of Streamyyy.com and its licensors. The Service is protected by 
            copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with 
            any product or service without our prior written consent.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. DMCA Compliance and Copyright Policy</h2>
          <p>
            We respect intellectual property rights and expect users to do the same. We comply with the Digital 
            Millennium Copyright Act (DMCA) and maintain a policy for termination of repeat infringers. For detailed 
            information, please see our <Link href="/dmca" className="text-primary hover:underline">DMCA Policy</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Disclaimers and Warranties</h2>
          <p className="font-semibold uppercase">
            THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT ANY WARRANTIES OF ANY KIND, 
            EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>WARRANTIES OF MERCHANTABILITY</li>
            <li>FITNESS FOR A PARTICULAR PURPOSE</li>
            <li>NON-INFRINGEMENT</li>
            <li>ACCURACY, RELIABILITY, OR COMPLETENESS</li>
            <li>SECURITY OR ERROR-FREE OPERATION</li>
            <li>AVAILABILITY OR UPTIME</li>
          </ul>
          <p className="mt-4">
            We do not warrant that the Service will be uninterrupted, secure, or error-free. You use the Service 
            at your own risk.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
          <p className="font-semibold uppercase">
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL STREAMYYY.COM, ITS AFFILIATES, 
            DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES</li>
            <li>LOSS OF PROFITS, DATA, USE, OR GOODWILL</li>
            <li>SERVICE INTERRUPTION OR COMPUTER DAMAGE/SYSTEM FAILURE</li>
            <li>COST OF SUBSTITUTE SERVICES</li>
            <li>ANY DAMAGES RESULTING FROM THIRD-PARTY CONTENT OR SERVICES</li>
          </ul>
          <p className="mt-4 font-semibold">
            OUR TOTAL LIABILITY SHALL NOT EXCEED FIFTY DOLLARS ($50.00) IN AGGREGATE.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Indemnification</h2>
          <p>
            You agree to defend, indemnify, and hold harmless Streamyyy.com, its affiliates, and their respective 
            officers, directors, employees, and agents from and against any claims, liabilities, damages, judgments, 
            awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating 
            to your violation of these Terms or your use of the Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">10. Dispute Resolution and Arbitration</h2>
          <p className="font-semibold">PLEASE READ THIS SECTION CAREFULLY – IT AFFECTS YOUR RIGHTS.</p>
          <p className="mt-2">
            Any dispute arising from these Terms or your use of the Service shall be resolved through binding 
            arbitration in accordance with the American Arbitration Association's rules. The arbitration shall 
            be conducted in Delaware, and judgment may be entered in any court of competent jurisdiction.
          </p>
          <p className="mt-2 font-semibold">
            YOU WAIVE YOUR RIGHT TO A JURY TRIAL AND TO PARTICIPATE IN A CLASS ACTION.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">11. Termination</h2>
          <p>
            We may terminate or suspend your access to the Service immediately, without prior notice or liability, 
            for any reason, including breach of these Terms. Upon termination, your right to use the Service will 
            immediately cease.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">12. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of Delaware, United States, 
            without regard to its conflict of law provisions. You consent to the exclusive jurisdiction of the 
            courts located in Delaware.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">13. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. Material changes will be notified via the Service 
            or email. Your continued use after changes constitutes acceptance of the modified Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">14. Severability</h2>
          <p>
            If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited 
            or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force 
            and effect.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">15. Contact Information</h2>
          <p>
            For questions about these Terms, please contact us at:{' '}
            <a href="mailto:contact@streamyyy.com" className="text-primary hover:underline">
              contact@streamyyy.com
            </a>
          </p>
          <p className="mt-2">
            Legal notices should be sent to:{' '}
            <a href="mailto:legal@streamyyy.com" className="text-primary hover:underline">
              legal@streamyyy.com
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}