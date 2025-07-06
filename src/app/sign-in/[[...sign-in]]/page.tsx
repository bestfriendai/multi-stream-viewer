import { SignIn } from "@clerk/nextjs";

export default function SignInPage({ searchParams }: { searchParams: { redirect_url?: string } }) {
  const redirectUrl = searchParams.redirect_url || "/";
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
            card: "bg-background border border-border shadow-lg",
            headerTitle: "text-foreground",
            headerSubtitle: "text-muted-foreground",
            socialButtonsBlockButton: "bg-muted hover:bg-muted/80 text-foreground border-border",
            formFieldLabel: "text-foreground",
            formFieldInput: "bg-background border-input text-foreground",
            footerActionLink: "text-primary hover:text-primary/90",
            dividerLine: "bg-border",
            dividerText: "text-muted-foreground"
          }
        }}
        redirectUrl={redirectUrl}
        signUpUrl={`/sign-up${searchParams.redirect_url ? `?redirect_url=${encodeURIComponent(searchParams.redirect_url)}` : ''}`}
      />
    </div>
  );
}