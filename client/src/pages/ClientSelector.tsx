import { Card, CardDescription, CardTitle } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';

export function ClientSelector() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Client Selector</h1>
        <p className="mt-2 text-slate-500">Team Members only see clients assigned to them by Owner/Admin middleware.</p>
      </div>
      <Card>
        <CardTitle>Clients</CardTitle>
        <CardDescription>No clients have been added yet.</CardDescription>
        <div className="mt-6">
          <EmptyState title="Create your first client" message="Add a local business workspace before connecting Meta or CallRail." />
        </div>
        <Button className="mt-6">Add client</Button>
      </Card>
    </div>
  );
}
