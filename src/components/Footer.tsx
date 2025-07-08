'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocaleNavigation } from '@/lib/locale-navigation';
import { useTranslation } from '@/contexts/LanguageContext';
import StreamyyyLogo from './StreamyyyLogo';
import LanguageSelector from './LanguageSelector';
import { Github, Twitter, MessageCircle, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const { t, isLoaded: translationsLoaded } = useTranslation();

  const { createLocalePath } = useLocaleNavigation();

  // Don't render until translations are loaded
  if (!translationsLoaded) {
    return (
      <footer className="border-t border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="border-t border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <StreamyyyLogo size="lg" variant="gradient" className="mb-4" useForHeader={false} />
            <p className="text-muted-foreground mb-4 max-w-md">
              {t('footer.freeMultiStreamViewer')}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail size={16} />
              <a 
                href="mailto:contact@streamyyy.com" 
                className="hover:text-primary transition-colors"
              >
                contact@streamyyy.com
              </a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.legal.title')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href={createLocalePath('/terms')} className="hover:text-primary transition-colors">
                  {t('footer.termsOfService')}
                </Link>
              </li>
              <li>
                <Link href={createLocalePath('/privacy')} className="hover:text-primary transition-colors">
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link href={createLocalePath('/cookies')} className="hover:text-primary transition-colors">
                  {t('footer.cookiePolicy')}
                </Link>
              </li>
              <li>
                <Link href={createLocalePath('/dmca')} className="hover:text-primary transition-colors">
                  {t('footer.dmcaPolicy')}
                </Link>
              </li>
              <li>
                <Link href={createLocalePath('/compliance')} className="hover:text-primary transition-colors">
                  {t('footer.compliance')}
                </Link>
              </li>
              <li>
                <Link href={createLocalePath('/accessibility')} className="hover:text-primary transition-colors">
                  {t('footer.accessibility')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.company.title')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href={createLocalePath('/about')} className="hover:text-primary transition-colors">
                  {t('footer.aboutUs')}
                </Link>
              </li>
              <li>
                <Link href={createLocalePath('/contact')} className="hover:text-primary transition-colors">
                  {t('footer.contactUs')}
                </Link>
              </li>
              <li>
                <Link href={createLocalePath('/blog')} className="hover:text-primary transition-colors">
                  {t('footer.blog')}
                </Link>
              </li>
              <li>
                <Link href={createLocalePath('/advertise')} className="hover:text-primary transition-colors">
                  {t('footer.advertise')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/50 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-muted-foreground">
            <p>&copy; {currentYear} Streamyyy.com. {t('footer.allRightsReserved')}</p>
            <div className="flex space-x-4">
              <Link href="/terms" className="hover:text-primary transition-colors">
                {t('footer.legal.terms')}
              </Link>
              <Link href="/privacy" className="hover:text-primary transition-colors">
                {t('footer.legal.privacy')}
              </Link>
              <Link href="/cookies" className="hover:text-primary transition-colors">
                {t('footer.legal.cookies')}
              </Link>
              <Link href="/dmca" className="hover:text-primary transition-colors">
                {t('footer.legal.dmca')}
              </Link>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col md:flex-row items-center gap-4">
            <LanguageSelector />
            <div className="text-sm text-muted-foreground text-center md:text-right">
              <p className="mb-2">{t('footer.madeWithLove')}</p>
              <p className="text-xs">{t('footer.gdprCompliant')}</p>
            </div>
          </div>
        </div>

        {/* Platform Support */}
        <div className="mt-6 pt-6 border-t border-border/50">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">{t('footer.supportedPlatforms')}</p>
            <div className="flex justify-center items-center space-x-6 text-xs text-muted-foreground">
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Twitch</span>
              </span>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>{t('footer.platforms.youtube')}</span>
              </span>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Rumble</span>
              </span>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>{t('footer.moreComingSoon')}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
