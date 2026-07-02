import { useQuery } from '@tanstack/react-query';
import { Megaphone } from 'lucide-react';
import { Card, CardDescription, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusPill } from '../components/ui/StatusPill';
import { apiFetch } from '../lib/api';

export function MetaIntegrationPage() {
  const accounts = useQuery({ queryKey: ['meta-ad-accounts'], queryFn: () => apiFetch<{ adAccounts: Array<{ id: string; name: string }> }>('/meta/ad-accounts') });
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Megaphone className="h-8 w-8 text-pulseBlue" />
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Meta Integration</h1>
          <p className="mt-2 text-slate-500">Mock mode simulates OAuth and paused publishing until App Review is approved.</p>
        </div>
      </div>
      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Publishing safety</CardTitle>
            <CardDescription>Server creates Campaign → Ad Set → Ad as PAUSED. Activation requires exact confirmation phrase.</CardDescription>
          </div>
          <StatusPill tone="warn">PAUSED only</StatusPill>
        </div>
        <Button className="mt-6">Start Meta OAuth</Button>
      </Card>
      <Card>
        <CardTitle>Ad accounts</CardTitle>
        <CardDescription>{accounts.isLoading ? 'Loading mock accounts...' : 'Available connected accounts.'}</CardDescription>
        <div className="mt-4 space-y-3">
          {accounts.data?.adAccounts.map((account) => (
            <div key={account.id} className="rounded-xl border border-slate-200 p-4">
              <p className="font-semibold text-slate-950">{account.name}</p>
              <p className="text-sm text-slate-500">{account.id}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
