import { useMutation } from '@tanstack/react-query';
import { Card, CardDescription, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { apiFetch } from '../lib/api';
import { useToast } from '../components/ui/Toast';

const exportTypes = ['campaign_summary', 'ai_strategy', 'ad_copy', 'call_logs', 'weekly_metrics'] as const;

export function ReportsPage() {
  const { pushToast } = useToast();
  const exportMutation = useMutation({
    mutationFn: (exportType: (typeof exportTypes)[number]) =>
      apiFetch('/exports/google-sheets', { method: 'POST', body: JSON.stringify({ exportType }) }),
    onSuccess: () => pushToast({ title: 'Export queued', message: 'Google Sheets export job created with retry/backoff placeholder.' }),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-950">Reports & Exports</h1>
      <Card>
        <CardTitle>Google Sheets exports</CardTitle>
        <CardDescription>Campaign summary, AI strategy, ad copy, call logs, and weekly metrics.</CardDescription>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {exportTypes.map((type) => (
            <Button key={type} variant="secondary" onClick={() => exportMutation.mutate(type)}>
              {type.replaceAll('_', ' ')}
            </Button>
          ))}
        </div>
      </Card>
      <Card>
        <CardTitle>Remaining AI tools</CardTitle>
        <CardDescription>Call Tracking Setup Assistant, Weekly Report Writer, Missed Call Recovery Script Generator, and Lead Quality Analyzer are structured as metadata-only tools.</CardDescription>
      </Card>
    </div>
  );
}
