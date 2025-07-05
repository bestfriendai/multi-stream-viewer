import Link from 'next/link'
import { ArrowLeft, Shield, Globe, Scale, FileCheck } from 'lucide-react'

export default function CompliancePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Streamyyy
      </Link>
      
      <h1 className="text-4xl font-bold mb-8">Legal Compliance & Regulatory Information</h1>
      
      <div className="prose prose-invert max-w-none space-y-6">
        <p className="text-muted-foreground">
          Last Updated: January 7, 2025
        </p>

        <div className="bg-blue-900/20 border border-blue-900/50 p-4 rounded-lg mb-8">
          <p className="font-semibold text-blue-200">Compliance Commitment</p>
          <p className="text-sm">
            Streamyyy.com is committed to full compliance with all applicable laws, regulations, and industry standards 
            across all jurisdictions where our service is accessible.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6" />
            1. Data Protection Compliance
          </h2>
          
          <h3 className="text-xl font-semibold mt-4 mb-2">GDPR (General Data Protection Regulation)</h3>
          <div className="bg-gray-900/50 p-4 rounded-lg mb-4">
            <p className="font-semibold text-green-200">✓ Fully Compliant</p>
            <ul className="list-disc pl-6 space-y-1 mt-2 text-sm">
              <li>Lawful basis for all data processing activities</li>
              <li>Privacy by design and default implementation</li>
              <li>Data Protection Impact Assessments (DPIA) conducted</li>
              <li>Data Processing Agreements with all processors</li>
              <li>EU representative designation</li>
              <li>72-hour breach notification procedures</li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold mt-4 mb-2">CCPA/CPRA (California Consumer Privacy Act)</h3>
          <div className="bg-gray-900/50 p-4 rounded-lg mb-4">
            <p className="font-semibold text-green-200">✓ Fully Compliant</p>
            <ul className="list-disc pl-6 space-y-1 mt-2 text-sm">
              <li>Consumer rights request mechanisms in place</li>
              <li>Do Not Sell My Personal Information compliance</li>
              <li>Annual data handling training for personnel</li>
              <li>Service provider agreements updated</li>
              <li>Privacy rights metrics tracking</li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold mt-4 mb-2">Other Privacy Regulations</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>LGPD (Brazil):</strong> Lei Geral de Proteção de Dados compliance</li>
            <li><strong>PIPEDA (Canada):</strong> Personal Information Protection compliance</li>
            <li><strong>UK GDPR:</strong> Post-Brexit UK data protection compliance</li>
            <li><strong>COPPA:</strong> Children's Online Privacy Protection Act compliance</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-6 h-6" />
            2. International Compliance
          </h2>
          
          <h3 className="text-xl font-semibold mt-4 mb-2">Content Regulations</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>EU DSA (Digital Services Act):</strong> Transparency reporting and content moderation</li>
            <li><strong>UK Online Safety Bill:</strong> Age verification and harmful content prevention</li>
            <li><strong>German NetzDG:</strong> Illegal content reporting mechanisms</li>
            <li><strong>French LCEN:</strong> Content hosting liability provisions</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">Accessibility Standards</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>WCAG 2.1 Level AA:</strong> Web Content Accessibility Guidelines compliance</li>
            <li><strong>ADA (Americans with Disabilities Act):</strong> Digital accessibility</li>
            <li><strong>EN 301 549:</strong> European accessibility standard</li>
            <li><strong>Section 508:</strong> US federal accessibility requirements</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Scale className="w-6 h-6" />
            3. Legal Framework
          </h2>
          
          <h3 className="text-xl font-semibold mt-4 mb-2">Liability Limitations</h3>
          <div className="bg-yellow-900/20 border border-yellow-900/50 p-4 rounded-lg">
            <p className="font-semibold text-yellow-200 mb-2">Important Legal Protections</p>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Section 230 of the Communications Decency Act (US) protections</li>
              <li>E-Commerce Directive 2000/31/EC (EU) hosting exemptions</li>
              <li>DMCA Safe Harbor provisions (17 U.S.C. § 512)</li>
              <li>Platform liability exemptions under DSA</li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold mt-4 mb-2">Jurisdictional Considerations</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Choice of Law:</strong> Delaware, United States</li>
            <li><strong>Dispute Resolution:</strong> Binding arbitration (AAA rules)</li>
            <li><strong>Class Action Waiver:</strong> Individual claims only</li>
            <li><strong>Forum Selection:</strong> Delaware courts for non-arbitrable disputes</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FileCheck className="w-6 h-6" />
            4. Industry Standards & Best Practices
          </h2>
          
          <h3 className="text-xl font-semibold mt-4 mb-2">Security Standards</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>TLS 1.3:</strong> Latest encryption protocols</li>
            <li><strong>OWASP Top 10:</strong> Security vulnerability prevention</li>
            <li><strong>ISO 27001 Principles:</strong> Information security management</li>
            <li><strong>SOC 2 Type II:</strong> Security controls (via providers)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">Advertising Standards</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>IAB Standards:</strong> Interactive Advertising Bureau compliance</li>
            <li><strong>NAI Principles:</strong> Network Advertising Initiative adherence</li>
            <li><strong>DAA Self-Regulatory Program:</strong> Digital advertising practices</li>
            <li><strong>Google Ad Policies:</strong> AdSense compliance</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Compliance Monitoring & Auditing</h2>
          <p>We maintain ongoing compliance through:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Quarterly internal compliance audits</li>
            <li>Annual third-party privacy assessments</li>
            <li>Continuous legal monitoring for regulatory changes</li>
            <li>Regular staff training on compliance requirements</li>
            <li>Automated compliance monitoring tools</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Transparency Reports</h2>
          <p>In the interest of transparency, we commit to publishing:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Annual transparency reports on content moderation</li>
            <li>Government data request statistics</li>
            <li>DMCA takedown request summaries</li>
            <li>Privacy rights request metrics</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Contact Information for Compliance</h2>
          <div className="bg-gray-900/50 p-4 rounded-lg">
            <p className="font-semibold mb-2">Compliance Team</p>
            <ul className="space-y-2 text-sm">
              <li><strong>General Compliance:</strong> <a href="mailto:compliance@streamyyy.com" className="text-primary hover:underline">compliance@streamyyy.com</a></li>
              <li><strong>Privacy/GDPR:</strong> <a href="mailto:dpo@streamyyy.com" className="text-primary hover:underline">dpo@streamyyy.com</a></li>
              <li><strong>Legal Notices:</strong> <a href="mailto:legal@streamyyy.com" className="text-primary hover:underline">legal@streamyyy.com</a></li>
              <li><strong>Abuse Reports:</strong> <a href="mailto:abuse@streamyyy.com" className="text-primary hover:underline">abuse@streamyyy.com</a></li>
            </ul>
          </div>
        </section>

        <section className="bg-green-900/20 border border-green-900/50 p-4 rounded-lg mt-8">
          <h3 className="text-lg font-semibold text-green-200 mb-2">Compliance Status Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-center">
            <div>
              <div className="text-2xl mb-1">✓</div>
              <p className="text-sm font-semibold">GDPR</p>
            </div>
            <div>
              <div className="text-2xl mb-1">✓</div>
              <p className="text-sm font-semibold">CCPA</p>
            </div>
            <div>
              <div className="text-2xl mb-1">✓</div>
              <p className="text-sm font-semibold">DMCA</p>
            </div>
            <div>
              <div className="text-2xl mb-1">✓</div>
              <p className="text-sm font-semibold">COPPA</p>
            </div>
          </div>
        </section>

        <section className="mt-8 p-4 border border-gray-700 rounded-lg">
          <h3 className="font-semibold mb-2">Legal Disclaimer</h3>
          <p className="text-sm text-muted-foreground">
            This compliance page is provided for informational purposes only and does not constitute legal advice. 
            Compliance status is subject to ongoing review and may change based on regulatory updates. For specific 
            legal questions, please consult with qualified legal counsel.
          </p>
        </section>
      </div>
    </div>
  )
}