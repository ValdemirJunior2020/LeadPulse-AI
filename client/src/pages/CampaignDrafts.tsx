import { useQuery } from '@tanstack/react-query';
import { Card, CardDescription, CardTitle } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { apiFetch } from '../lib/api';

type DraftsResponse = { drafts: Array<{ id: string; input?: { businessName?: string; offer?: string }; status?: string }> };

export function CampaignDrafts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['campaignDrafts'],
    queryFn: () => apiFetch<DraftsResponse>('/campaign-drafts'),
  });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Campaign Drafts</h1>
        <p className="mt-2 text-slate-500">Edit AI output before it goes anywhere near Meta.</p>
      </div>
      <Card>
        <CardTitle>Draft library</CardTitle>
        <CardDescription>{isLoading ? 'Loading...' : error ? 'Could not load drafts.' : 'Zod-validated campaign drafts.'}</CardDescription>
        <div className="mt-6">
          {data?.drafts?.length ? (
            <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200">
              {data.drafts.map((draft) => (
                <div key={draft.id} className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-950">{draft.input?.businessName ?? 'Untitled draft'}</p>
                    <p className="text-sm text-slate-500">{draft.input?.offer ?? 'No offer'} · {draft.status ?? 'draft'}</p>
                  </div>
                  <Button variant="secondary">Open</Button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No drafts yet" message="Generate the first AI campaign draft from the campaign wizard." />
          )}
        </div>
      </Card>
    </div>
  );
}
