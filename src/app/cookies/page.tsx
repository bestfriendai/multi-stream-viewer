import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function CookiePolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Streamyyy
      </Link>
      
      <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
      
      <div className="prose prose-invert max-w-none space-y-6">
        <p className="text-muted-foreground">
          Effective Date: January 7, 2025
        </p>

        <div className="bg-purple-900/20 border border-purple-900/50 p-4 rounded-lg mb-8">
          <p className="font-semibold text-purple-200">Cookie Consent</p>
          <p className="text-sm">
            We use cookies to enhance your experience. By using Streamyyy, you consent to our use of cookies 
            as described in this policy. You can manage your cookie preferences at any time.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies?</h2>
          <p>
            Cookies are small text files placed on your device when you visit a website. They contain information 
            that helps websites remember your preferences, improve performance, and provide features.
          </p>
          
          <h3 className="text-xl font-semibold mt-4 mb-2">Types of Storage Technologies We Use:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Cookies:</strong> Small text files stored by your browser</li>
            <li><strong>Local Storage:</strong> Larger data storage in your browser</li>
            <li><strong>Session Storage:</strong> Temporary storage cleared when you close your browser</li>
            <li><strong>IndexedDB:</strong> Database storage for complex data structures</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Categories of Cookies We Use</h2>
          
          <h3 className="text-xl font-semibold mt-4 mb-2">Strictly Necessary Cookies</h3>
          <div className="bg-gray-900/50 p-4 rounded-lg mb-4">
            <p className="font-semibold text-green-200">Always Active</p>
            <p className="text-sm mt-2">These cookies are essential for the website to function properly.</p>
            <ul className="list-disc pl-6 space-y-1 mt-2 text-sm">
              <li><strong>Session Management:</strong> Maintain your session state</li>
              <li><strong>Security:</strong> CSRF tokens, authentication state</li>
              <li><strong>Load Balancing:</strong> Distribute traffic across servers</li>
              <li><strong>Cookie Consent:</strong> Remember your cookie preferences</li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold mt-4 mb-2">Functional Cookies</h3>
          <div className="bg-gray-900/50 p-4 rounded-lg mb-4">
            <p className="font-semibold text-blue-200">User Controlled</p>
            <p className="text-sm mt-2">These cookies enable personalized features and remember your choices.</p>
            <ul className="list-disc pl-6 space-y-1 mt-2 text-sm">
              <li><strong>Layout Preferences:</strong> Grid layout, stream positions</li>
              <li><strong>Theme Settings:</strong> Dark/light mode preference</li>
              <li><strong>Language:</strong> Your preferred language</li>
              <li><strong>Volume Settings:</strong> Default volume levels</li>
              <li><strong>Recent Streams:</strong> Your viewing history (local only)</li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold mt-4 mb-2">Performance Cookies</h3>
          <div className="bg-gray-900/50 p-4 rounded-lg mb-4">
            <p className="font-semibold text-yellow-200">Optional</p>
            <p className="text-sm mt-2">Help us understand website performance and user experience.</p>
            <ul className="list-disc pl-6 space-y-1 mt-2 text-sm">
              <li><strong>Error Tracking:</strong> Monitor JavaScript errors</li>
              <li><strong>Performance Metrics:</strong> Page load times, API response times</li>
              <li><strong>Feature Usage:</strong> Which features are most popular</li>
              <li><strong>Browser Information:</strong> Compatibility testing data</li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold mt-4 mb-2">Analytics Cookies</h3>
          <div className="bg-gray-900/50 p-4 rounded-lg mb-4">
            <p className="font-semibold text-purple-200">Requires Consent</p>
            <p className="text-sm mt-2">Help us analyze how users interact with our service.</p>
            <ul className="list-disc pl-6 space-y-1 mt-2 text-sm">
              <li><strong>Google Analytics:</strong> _ga, _gid, _gat (anonymized IP)</li>
              <li><strong>Usage Patterns:</strong> Pages visited, time on site</li>
              <li><strong>Traffic Sources:</strong> How you found our site</li>
              <li><strong>Demographics:</strong> General location (country/region level)</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Third-Party Cookies</h2>
          <p>
            When you interact with embedded content, third-party services may set their own cookies:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-purple-900/20 border border-purple-900/50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-200 mb-2">Twitch Embeds</h3>
              <ul className="text-sm space-y-1">
                <li>Authentication cookies</li>
                <li>Viewing preferences</li>
                <li>Analytics and advertising</li>
                <li><a href="https://www.twitch.tv/p/cookie-policy/" className="text-primary hover:underline text-xs" target="_blank" rel="noopener noreferrer">Twitch Cookie Policy</a></li>
              </ul>
            </div>
            
            <div className="bg-red-900/20 border border-red-900/50 p-4 rounded-lg">
              <h3 className="font-semibold text-red-200 mb-2">YouTube Embeds</h3>
              <ul className="text-sm space-y-1">
                <li>VISITOR_INFO1_LIVE</li>
                <li>YSC, PREF cookies</li>
                <li>Personalization data</li>
                <li><a href="https://policies.google.com/technologies/cookies" className="text-primary hover:underline text-xs" target="_blank" rel="noopener noreferrer">Google Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <p className="mt-4 text-sm text-yellow-200">
            ⚠️ We have no control over third-party cookies. Please review their respective policies for more information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Cookie Lifespan</h2>
          <table className="w-full mt-4 border border-gray-700">
            <thead>
              <tr className="bg-gray-900/50">
                <th className="p-2 text-left">Cookie Type</th>
                <th className="p-2 text-left">Duration</th>
                <th className="p-2 text-left">Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-700">
                <td className="p-2">Session Cookies</td>
                <td className="p-2">Browser session</td>
                <td className="p-2 text-sm">Deleted when browser closes</td>
              </tr>
              <tr className="border-t border-gray-700">
                <td className="p-2">Persistent Cookies</td>
                <td className="p-2">30 days - 2 years</td>
                <td className="p-2 text-sm">Remember preferences</td>
              </tr>
              <tr className="border-t border-gray-700">
                <td className="p-2">Analytics Cookies</td>
                <td className="p-2">26 months</td>
                <td className="p-2 text-sm">Google Analytics default</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Managing Your Cookie Preferences</h2>
          
          <h3 className="text-xl font-semibold mt-4 mb-2">Cookie Settings</h3>
          <p>You can manage your cookie preferences through:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li><strong>Cookie Banner:</strong> Click "Cookie Settings" when you first visit</li>
            <li><strong>Footer Link:</strong> Access cookie preferences from any page</li>
            <li><strong>Browser Settings:</strong> Control all cookies through your browser</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">Browser Controls</h3>
          <div className="bg-gray-900/50 p-4 rounded-lg">
            <p className="font-semibold mb-2">How to manage cookies in popular browsers:</p>
            <ul className="space-y-2 text-sm">
              <li>
                <strong>Chrome:</strong>{' '}
                <a href="https://support.google.com/chrome/answer/95647" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  Settings → Privacy and security → Cookies
                </a>
              </li>
              <li>
                <strong>Firefox:</strong>{' '}
                <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  Settings → Privacy & Security → Cookies
                </a>
              </li>
              <li>
                <strong>Safari:</strong>{' '}
                <a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  Preferences → Privacy → Manage Website Data
                </a>
              </li>
              <li>
                <strong>Edge:</strong>{' '}
                <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  Settings → Privacy, search, and services → Cookies
                </a>
              </li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold mt-4 mb-2">Opt-Out Options</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Google Analytics Opt-Out:</strong>{' '}
              <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                Download Browser Add-on
              </a>
            </li>
            <li>
              <strong>Do Not Track:</strong> We honor DNT browser signals
            </li>
            <li>
              <strong>Global Privacy Control:</strong> We recognize GPC signals
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Impact of Disabling Cookies</h2>
          <div className="bg-red-900/20 border border-red-900/50 p-4 rounded-lg">
            <p className="font-semibold text-red-200 mb-2">Important Notice</p>
            <p className="text-sm">Disabling certain cookies may impact functionality:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2 text-sm">
              <li>Layout preferences won't be saved</li>
              <li>You'll need to re-configure settings each visit</li>
              <li>Some features may not work properly</li>
              <li>Performance may be impacted</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Updates to This Policy</h2>
          <p>
            We may update this Cookie Policy to reflect changes in our practices or legal requirements. 
            Updates will be posted on this page with a new "Effective Date."
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
          <p>For questions about our Cookie Policy:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Email: <a href="mailto:privacy@streamyyy.com" className="text-primary hover:underline">privacy@streamyyy.com</a></li>
            <li>General: <a href="mailto:contact@streamyyy.com" className="text-primary hover:underline">contact@streamyyy.com</a></li>
          </ul>
        </section>

        <section className="bg-green-900/20 border border-green-900/50 p-4 rounded-lg mt-8">
          <h3 className="text-lg font-semibold text-green-200 mb-2">Your Privacy Choices</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            <button className="px-4 py-2 bg-green-700 hover:bg-green-600 rounded text-sm transition-colors">
              Accept All Cookies
            </button>
            <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors">
              Essential Only
            </button>
            <button className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded text-sm transition-colors">
              Customize Settings
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}