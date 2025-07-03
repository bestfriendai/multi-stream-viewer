'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import StreamyyyLogo from './StreamyyyLogo';
import { Github, Twitter, MessageCircle, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  
  // Hide footer on main stream viewer page to prevent scrolling interference
  const isMainStreamPage = pathname === '/';
  
  if (isMainStreamPage) {
    return null;
  }

  return (
    <footer className="border-t border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <StreamyyyLogo size="lg" variant="gradient" className="mb-4" />
            <p className="text-muted-foreground mb-4 max-w-md">
              The ultimate multi-stream viewing platform. Watch multiple live streams simultaneously 
              and discover new content across all your favorite streaming platforms.
            </p>
            <div className="flex space-x-4">
              <Link 
                href="https://twitter.com/streamyyy" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Follow us on Twitter"
              >
                <Twitter size={20} />
              </Link>
              <Link 
                href="https://github.com/streamyyy" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="View our GitHub"
              >
                <Github size={20} />
              </Link>
              <Link 
                href="https://discord.gg/streamyyy" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Join our Discord"
              >
                <MessageCircle size={20} />
              </Link>
              <Link 
                href="mailto:support@streamyyy.com" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Contact us via email"
              >
                <Mail size={20} />
              </Link>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/multi-view" className="hover:text-primary transition-colors">
                  Multi-Stream View
                </Link>
              </li>
              <li>
                <Link href="/browse" className="hover:text-primary transition-colors">
                  Stream Discovery
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="hover:text-primary transition-colors">
                  Favorites Management
                </Link>
              </li>
              <li>
                <Link href="/layouts" className="hover:text-primary transition-colors">
                  Custom Layouts
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-primary transition-colors">
                  Live Chat Integration
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary transition-colors">
                  Streaming Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/support" className="hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/api/docs" className="hover:text-primary transition-colors">
                  API Documentation
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="hover:text-primary transition-colors">
                  Send Feedback
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-primary transition-colors">
                  Service Status
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/50 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-muted-foreground">
            <p>&copy; {currentYear} Streamyyy.com. All rights reserved.</p>
            <div className="flex space-x-4">
              <Link href="/privacy-policy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-conditions" className="hover:text-primary transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/cookie-policy" className="hover:text-primary transition-colors">
                Cookie Policy
              </Link>
              <Link href="/dmca-policy" className="hover:text-primary transition-colors">
                DMCA Policy
              </Link>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 text-sm text-muted-foreground">
            <p className="mb-2">Made with ❤️ for the streaming community</p>
            <p className="text-xs">GDPR, CCPA & PIPEDA Compliant • We respect your privacy</p>
          </div>
        </div>

        {/* Platform Support */}
        <div className="mt-6 pt-6 border-t border-border/50">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Supported Platforms</p>
            <div className="flex justify-center items-center space-x-6 text-xs text-muted-foreground">
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Twitch</span>
              </span>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>YouTube Live</span>
              </span>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Rumble</span>
              </span>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>More coming soon</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
