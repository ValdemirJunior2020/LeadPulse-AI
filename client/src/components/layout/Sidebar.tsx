import { Link, NavLink } from 'react-router-dom';
import {
  BarChart3,
  Bot,
  FileText,
  Home,
  Megaphone,
  PhoneCall,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import logo from '../../assets/logo.svg';
import { cn } from '../../lib/utils';

const nav = [
  { to: '/dashboard', label: 'Home', icon: Home, hint: 'Overview' },
  { to: '/dashboard/clients', label: 'Clients', icon: Users, hint: 'Workspaces' },
  { to: '/dashboard/new-campaign', label: 'New Campaign', icon: Bot, hint: 'Start here' },
  { to: '/dashboard/drafts', label: 'Drafts', icon: FileText, hint: 'AI output' },
  { to: '/dashboard/meta', label: 'Meta', icon: Megaphone, hint: 'Publish paused' },
  { to: '/dashboard/calls', label: 'CallRail', icon: PhoneCall, hint: 'Call data' },
  { to: '/dashboard/reports', label: 'Reports', icon: BarChart3, hint: 'Metrics' },
  { to: '/dashboard/admin', label: 'Admin', icon: ShieldCheck, hint: 'Owner tools' },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings, hint: 'Account' },
];

type SidebarProps = {
  mobileOpen?: boolean;
  onClose?: () => void;
};

export function Sidebar({ mobileOpen = false, onClose }: SidebarProps) {
  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-30 flex-col border-r border-white/10 bg-[#050816] text-white shadow-2xl transition-transform duration-200 lg:flex lg:w-24',
        mobileOpen ? 'flex w-80 translate-x-0' : 'hidden -translate-x-full lg:translate-x-0',
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.45),transparent_32%),radial-gradient(circle_at_bottom,rgba(34,197,94,0.25),transparent_28%)]" />
      <div className="relative z-10 flex h-full flex-col">
        <Link
          to="/dashboard"
          className="mx-4 mt-5 flex items-center gap-3 rounded-3xl border border-white/10 bg-white/10 p-3 backdrop-blur transition hover:bg-white/15 lg:mx-auto lg:h-14 lg:w-14 lg:justify-center lg:p-0"
          onClick={onClose}
        >
          <img src={logo} alt="LeadPulse AI" className="h-10 w-10 rounded-2xl" />
          <div className="lg:hidden">
            <p className="text-base font-black">LeadPulse AI</p>
            <p className="text-xs text-slate-400">Marketing command center</p>
          </div>
        </Link>

        <div className="mx-4 mt-5 hidden rounded-3xl border border-white/10 bg-white/10 p-3 text-center backdrop-blur lg:block">
          <Sparkles className="mx-auto h-5 w-5 text-pulseGreen" />
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">AI Flow</p>
        </div>

        <nav className="relative mt-6 flex-1 space-y-2 px-4 lg:px-3">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition lg:h-14 lg:justify-center lg:px-0 lg:py-0',
                    isActive
                      ? 'bg-gradient-to-br from-pulseBlue to-cyan-400 text-white shadow-glow'
                      : 'text-slate-400 hover:bg-white/10 hover:text-white',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        'absolute left-0 top-1/2 hidden h-7 w-1 -translate-y-1/2 rounded-r-full bg-pulseGreen lg:block',
                        isActive ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="lg:hidden">{item.label}</span>
                    <span className="pointer-events-none absolute left-[4.6rem] z-40 hidden min-w-40 rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white opacity-0 shadow-2xl transition group-hover:translate-x-1 group-hover:opacity-100 lg:block">
                      <span className="block font-bold">{item.label}</span>
                      <span className="mt-0.5 block text-slate-400">{item.hint}</span>
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="relative mx-4 mb-5 rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur lg:mx-3 lg:p-3">
          <div className="flex items-center gap-3 lg:justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-pulseAmber via-pulseGreen to-pulseBlue text-sm font-black text-white">
              LP
            </div>
            <div className="lg:hidden">
              <p className="text-xs font-bold">Safe mode</p>
              <p className="text-[11px] text-slate-400">Campaigns publish paused.</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
