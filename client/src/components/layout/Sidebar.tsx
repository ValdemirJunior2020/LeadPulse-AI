import { Link, NavLink } from 'react-router-dom';
import { BarChart3, Bot, FileText, Home, Megaphone, PhoneCall, Settings, ShieldCheck, Users } from 'lucide-react';
import logo from '../../assets/logo.svg';
import { cn } from '../../lib/utils';

const nav = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/dashboard/clients', label: 'Clients', icon: Users },
  { to: '/dashboard/new-campaign', label: 'New Campaign', icon: Bot },
  { to: '/dashboard/drafts', label: 'Drafts', icon: FileText },
  { to: '/dashboard/meta', label: 'Meta', icon: Megaphone },
  { to: '/dashboard/calls', label: 'CallRail', icon: PhoneCall },
  { to: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
  { to: '/dashboard/admin', label: 'Admin', icon: ShieldCheck },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col bg-navy text-white lg:flex">
      <Link to="/dashboard" className="flex items-center gap-3 px-6 py-6">
        <img src={logo} alt="LeadPulse AI" className="h-10 w-10 rounded-xl" />
        <div>
          <p className="text-lg font-bold">LeadPulse AI</p>
          <p className="text-xs text-slate-400">Marketing command center</p>
        </div>
      </Link>
      <nav className="space-y-1 px-4">
        {nav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition',
                  isActive ? 'bg-white text-navy' : 'text-slate-300 hover:bg-white/10 hover:text-white',
                )
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="mt-auto p-6 text-xs text-slate-400">
        Meta campaigns publish paused by default. CallRail stores metadata only.
      </div>
    </aside>
  );
}
