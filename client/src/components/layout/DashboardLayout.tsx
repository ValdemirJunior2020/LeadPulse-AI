import { Outlet } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { clerkEnabled } from './AuthGate';
import { StatusPill } from '../ui/StatusPill';

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <button className="rounded-lg p-2 text-slate-500 lg:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
            <StatusPill tone="info">Mock-safe integrations</StatusPill>
          </div>
          {clerkEnabled ? <UserButton /> : <StatusPill tone="warn">Demo auth mode</StatusPill>}
        </header>
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
