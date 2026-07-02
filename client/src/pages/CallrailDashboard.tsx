import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PhoneCall } from 'lucide-react';
import { Card, CardDescription, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusPill } from '../components/ui/StatusPill';
import { apiFetch } from '../lib/api';
import { useToast } from '../components/ui/Toast';

type CallsResponse = { calls: Array<{ id: string; sourceName?: string; customerPhone?: string; duration: number; answered: boolean; leadStatus?: string }> };

export function CallrailDashboard() {
  const queryClient = useQueryClient();
  const { pushToast } = useToast();
  const calls = useQuery({ queryKey: ['calls'], queryFn: () => apiFetch<CallsResponse>('/callrail/calls') });
  const sync = useMutation({
    mutationFn: () => apiFetch('/callrail/sync', { method: 'POST', body: JSON.stringify({ clientId: 'client_demo' }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calls'] });
      pushToast({ title: 'CallRail sync complete', message: 'Sample recording/audio URLs were discarded before storage.' });
    },
  });
  const total = calls.data?.calls.length ?? 0;
  const answered = calls.data?.calls.filter((call) => call.answered).length ?? 0;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <PhoneCall className="h-8 w-8 text-pulseGreen" />
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Call Logs</h1>
          <p className="mt-2 text-slate-500">Metadata only. Recording URLs are discarded at the sanitization layer.</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardDescription>Total</CardDescription><p className="mt-2 text-3xl font-black">{total}</p></Card>
        <Card><CardDescription>Answered</CardDescription><p className="mt-2 text-3xl font-black">{answered}</p></Card>
        <Card><CardDescription>Missed</CardDescription><p className="mt-2 text-3xl font-black">{total - answered}</p></Card>
        <Card><CardDescription>First-time</CardDescription><p className="mt-2 text-3xl font-black">0</p></Card>
      </div>
      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Recent calls</CardTitle>
            <CardDescription>Filters are ready for date, client, campaign, source, answered/missed, and lead status.</CardDescription>
          </div>
          <Button onClick={() => sync.mutate()} disabled={sync.isPending}>Import mock CallRail calls</Button>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500"><tr><th className="py-2">Caller</th><th>Source</th><th>Duration</th><th>Status</th></tr></thead>
            <tbody className="divide-y divide-slate-200">
              {calls.data?.calls.map((call) => (
                <tr key={call.id}>
                  <td className="py-3 font-medium">{call.customerPhone ?? 'Unknown'}</td>
                  <td>{call.sourceName ?? 'Unknown'}</td>
                  <td>{call.duration}s</td>
                  <td><StatusPill tone={call.answered ? 'good' : 'warn'}>{call.answered ? 'Answered' : 'Missed'}</StatusPill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
