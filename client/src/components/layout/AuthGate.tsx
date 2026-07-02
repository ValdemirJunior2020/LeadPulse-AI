import { SignInButton, SignedIn, SignedOut, useAuth } from '@clerk/clerk-react';
import { Button } from '../ui/Button';

export const clerkEnabled = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

function ClerkGate({ children }: { children: React.ReactNode }) {
  const { isLoaded } = useAuth();
  if (!isLoaded) return <div className="p-8 text-slate-500">Loading secure session...</div>;
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <main className="flex min-h-screen items-center justify-center bg-command-center p-6">
          <div className="max-w-md rounded-3xl border border-white/10 bg-white/95 p-8 shadow-glow">
            <h1 className="text-2xl font-bold text-slate-950">Sign in to LeadPulse AI</h1>
            <p className="mt-3 text-sm text-slate-600">Protected campaign, Meta, and CallRail workspaces require Clerk authentication.</p>
            <SignInButton mode="modal">
              <Button className="mt-6 w-full">Sign in / Sign up</Button>
            </SignInButton>
          </div>
        </main>
      </SignedOut>
    </>
  );
}

function DemoGate({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  return clerkEnabled ? <ClerkGate>{children}</ClerkGate> : <DemoGate>{children}</DemoGate>;
}
