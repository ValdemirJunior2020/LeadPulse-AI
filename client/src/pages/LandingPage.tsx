import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Megaphone, PhoneCall } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import logo from '../assets/logo.svg';

export function LandingPage() {
  return (
    <main className="min-h-screen bg-command-center text-white">
      <section className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-8 lg:min-h-screen lg:flex-row lg:items-center lg:py-0">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <img src={logo} alt="LeadPulse AI" className="h-12 w-12 rounded-2xl" />
            <span className="text-lg font-bold">LeadPulse AI</span>
          </div>
          <h1 className="mt-10 text-5xl font-black tracking-tight lg:text-7xl">
            Build campaigns, publish paused, track every call.
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            A client-facing SaaS dashboard for local service businesses that connects AI campaign drafts, Meta ad workflows, and CallRail metadata without storing recordings.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/dashboard">
              <Button className="gap-2">Open dashboard <ArrowRight className="h-4 w-4" /></Button>
            </Link>
            <a href="#features">
              <Button variant="secondary">View features</Button>
            </a>
          </div>
        </div>
        <Card className="border-white/10 bg-white/10 text-white shadow-glow backdrop-blur" id="features">
          <div className="grid gap-4">
            {[
              { icon: Bot, title: 'AI Campaign Wizard', body: 'Generate structured strategy, audience, offers, ad copy, compliance, and landing page copy.' },
              { icon: Megaphone, title: 'Meta Safe Publishing', body: 'Mock mode first. Every campaign, ad set, and ad is created as PAUSED with a server-side activation gate.' },
              { icon: PhoneCall, title: 'CallRail Metadata', body: 'Track source, duration, UTM tags, status, and caller metadata. Recording/audio references are discarded.' },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="rounded-2xl border border-white/10 bg-white/10 p-5">
                  <Icon className="h-7 w-7 text-pulseGreen" />
                  <h2 className="mt-4 font-bold">{feature.title}</h2>
                  <p className="mt-2 text-sm text-slate-300">{feature.body}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </section>
    </main>
  );
}
