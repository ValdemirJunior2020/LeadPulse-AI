import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { Menu, X } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { clerkEnabled } from './AuthGate';
import { StatusPill } from '../ui/StatusPill';
import { AsSeenOnFooter } from '../marketing/AsSeenOnFooter';

export function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {mobileOpen ? (
        <button
          className="fixed inset-0 z-20 bg-slate-950/50 lg:hidden"
          aria-label="Close menu overlay"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <div className="lg:pl-24">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg p-2 text-slate-500 lg:hidden"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen((value) => !value)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <StatusPill tone="info">Mock-safe integrations</StatusPill>
          </div>
          {clerkEnabled ? <UserButton /> : <StatusPill tone="warn">Demo auth mode</StatusPill>}
        </header>
        <main className="min-h-[calc(100vh-4rem)] p-4 lg:p-8">
          <Outlet />
        </main>
        <AsSeenOnFooter compact />
      </div>
    </div>
  );
}
