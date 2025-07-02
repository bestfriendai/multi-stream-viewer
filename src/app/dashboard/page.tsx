'use client';

import { useUser, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold">Dashboard Access Required</h1>
          <p className="text-muted-foreground">Please sign in to access your dashboard.</p>
          <SignInButton mode="redirect">
            <Button>Sign In</Button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="bg-card rounded-lg p-6 shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user?.firstName || user?.username || 'User'}!</h2>
          <div className="space-y-2">
            <p className="text-muted-foreground">Email: {user?.primaryEmailAddress?.emailAddress}</p>
            <p className="text-muted-foreground">User ID: {user?.id}</p>
            <p className="text-muted-foreground">Created: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}