'use client';

// Force dynamic rendering for this protected route
export const dynamic = 'force-dynamic';

import { useUser, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useTranslation } from '@/contexts/LanguageContext';

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { t } = useTranslation();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold">{t('dashboard.accessRequired')}</h1>
          <p className="text-muted-foreground">{t('dashboard.pleaseSignIn')}</p>
          <SignInButton mode="redirect">
            <Button>{t('auth.signIn')}</Button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{t('dashboard.title')}</h1>
        <div className="bg-card rounded-lg p-6 shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">{t('dashboard.welcome', { name: user?.firstName || user?.username || t('dashboard.user') })}</h2>
          <div className="space-y-2">
            <p className="text-muted-foreground">{t('dashboard.email')}: {user?.primaryEmailAddress?.emailAddress}</p>
            <p className="text-muted-foreground">{t('dashboard.userId')}: {user?.id}</p>
            <p className="text-muted-foreground">{t('dashboard.created')}: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : t('dashboard.na')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}