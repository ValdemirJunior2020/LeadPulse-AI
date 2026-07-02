import { Link } from 'react-router-dom';
import { SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import { ArrowRight, Bot, Check, Megaphone, PhoneCall } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { AsSeenOnFooter } from '../components/marketing/AsSeenOnFooter';
import { SignupActivityPopup } from '../components/marketing/SignupActivityPopup';
import { clerkEnabled } from '../components/layout/AuthGate';
import logo from '../assets/logo.svg';

const paypalPlans = [
  {
    name: 'Starter',
    price: '$99/mo',
    description: 'For one local business getting started with AI campaign drafts.',
    href: import.meta.env.VITE_PAYPAL_STARTER_URL || 'https://www.paypal.com/buttons/',
    features: ['1 business workspace', '100 AI generations/month', 'CallRail metadata dashboard'],
  },
  {
    name: 'Pro',
    price: '$199/mo',
    description: 'For growing teams managing more campaigns and call tracking.',
    href: import.meta.env.VITE_PAYPAL_PRO_URL || 'https://www.paypal.com/buttons/',
    features: ['Up to 5 clients', '500 AI generations/month', 'Meta mock/live workflow'],
  },
  {
    name: 'Agency',
    price: '$399/mo',
    description: 'For agencies managing multiple local service clients.',
    href: import.meta.env.VITE_PAYPAL_AGENCY_URL || 'https://www.paypal.com/buttons/',
    features: ['Up to 20 clients', '2,000 AI generations/month', 'Team member access'],
  },
];

function AuthActions() {
  if (!clerkEnabled) {
    return (
      <Link
        to="/dashboard"
        className="inline-flex items-center justify-center rounded-xl bg-pulseBlue px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:bg-blue-700"
      >
        Open dashboard demo
      </Link>
    );
  }

  return (
    <>
      <SignedOut>
        <div className="flex flex-wrap items-center gap-3">
          <SignInButton mode="modal">
            <Button variant="secondary">Login</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button>Sign up free</Button>
          </SignUpButton>
        </div>
      </SignedOut>

      <SignedIn>
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center rounded-xl bg-pulseBlue px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:bg-blue-700"
        >
          Open dashboard
        </Link>
      </SignedIn>
    </>
  );
}

export function LandingPage() {
  return (
    <main className="min-h-screen bg-command-center text-white">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="LeadPulse AI" className="h-12 w-12 rounded-2xl" />
          <span className="text-lg font-bold">LeadPulse AI</span>
        </Link>
        <AuthActions />
      </header>

      <section className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-12 lg:min-h-[calc(100vh-96px)] lg:flex-row lg:items-center lg:py-0">
        <div className="max-w-2xl">
          <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-300 backdrop-blur">
            AI campaign creation + Facebook/Instagram + call tracking for local businesses
          </div>
          <h1 className="mt-8 text-5xl font-black tracking-tight lg:text-7xl">
            Build campaigns, publish paused, track every call.
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            A client-facing SaaS dashboard for local service businesses that connects AI campaign drafts,
            Meta ad workflows, PayPal subscriptions, and CallRail metadata without storing recordings.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <AuthActions />
            <a
              href="#pricing"
              className="inline-flex items-center justify-center rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
            >
              View pricing
            </a>
          </div>
        </div>

        <Card className="border-white/10 bg-white/10 text-white shadow-glow backdrop-blur" id="features">
          <div className="grid gap-4">
            {[
              {
                icon: Bot,
                title: 'AI Campaign Wizard',
                body: 'Generate structured strategy, audience, offers, ad copy, compliance, and landing page copy.',
              },
              {
                icon: Megaphone,
                title: 'Facebook + Instagram Selection',
                body: 'Choose Facebook, Instagram, or both before publishing. Mock mode is safe until App Review is approved.',
              },
              {
                icon: PhoneCall,
                title: 'CallRail Metadata',
                body: 'Track source, duration, UTM tags, status, and caller metadata. Recording/audio references are discarded.',
              },
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

      <section id="pricing" className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-pulseGreen">Pricing</p>
          <h2 className="mt-3 text-4xl font-black">PayPal subscription links are ready.</h2>
          <p className="mt-3 text-slate-300">
            Replace the PayPal URLs in <code>client/.env.local</code> with your real PayPal subscription/payment links.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {paypalPlans.map((plan) => (
            <div key={plan.name} className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
              <h3 className="text-2xl font-black">{plan.name}</h3>
              <p className="mt-2 text-4xl font-black text-pulseGreen">{plan.price}</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{plan.description}</p>

              <div className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-sm text-slate-200">
                    <Check className="h-4 w-4 text-pulseGreen" />
                    {feature}
                  </div>
                ))}
              </div>

              <a
                href={plan.href}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-pulseBlue px-4 py-3 text-sm font-bold text-white shadow-glow transition hover:bg-blue-700"
              >
                Subscribe with PayPal
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </section>

      <AsSeenOnFooter />
      <SignupActivityPopup />
    </main>
  );
}
