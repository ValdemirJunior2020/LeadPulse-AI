import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Bot, Megaphone, PhoneCall, ShieldCheck } from 'lucide-react';
import { Card, CardDescription, CardTitle } from '../components/ui/Card';
import { StatusPill } from '../components/ui/StatusPill';

const data = [
  { name: 'Drafts', value: 0 },
  { name: 'Paused', value: 0 },
  { name: 'Calls', value: 0 },
  { name: 'Exports', value: 0 },
];

export function DashboardHome() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Dashboard Home</h1>
          <p className="mt-2 text-slate-500">Foundation shell with safe empty states and ready-to-connect integrations.</p>
        </div>
        <StatusPill tone="good">Phase-ready build</StatusPill>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { title: 'AI Drafts', value: '0', icon: Bot, tone: 'info' as const },
          { title: 'Paused Meta Campaigns', value: '0', icon: Megaphone, tone: 'warn' as const },
          { title: 'Tracked Calls', value: '0', icon: PhoneCall, tone: 'good' as const },
          { title: 'Compliance Blocks', value: '0', icon: ShieldCheck, tone: 'neutral' as const },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription>{card.title}</CardDescription>
                  <p className="mt-2 text-3xl font-black text-slate-950">{card.value}</p>
                </div>
                <div className="rounded-2xl bg-slate-100 p-3">
                  <Icon className="h-6 w-6 text-pulseBlue" />
                </div>
              </div>
              <div className="mt-4"><StatusPill tone={card.tone}>Empty state</StatusPill></div>
            </Card>
          );
        })}
      </div>
      <Card>
        <CardTitle>Command center activity</CardTitle>
        <CardDescription>Chart placeholder ready for real Firestore-backed metrics.</CardDescription>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
