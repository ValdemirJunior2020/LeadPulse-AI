import { Card, CardDescription, CardTitle } from '../components/ui/Card';
import { StatusPill } from '../components/ui/StatusPill';

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-950">Settings</h1>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle>Workspace roles</CardTitle>
          <CardDescription>Owner/Admin, Client/User, and Team Member are enforced by server middleware.</CardDescription>
          <div className="mt-4 flex flex-wrap gap-2">
            <StatusPill tone="good">Owner/Admin</StatusPill>
            <StatusPill tone="info">Client/User</StatusPill>
            <StatusPill tone="warn">Team Member</StatusPill>
          </div>
        </Card>
        <Card>
          <CardTitle>Production credentials</CardTitle>
          <CardDescription>Add Clerk, Firebase, OpenAI, Meta, CallRail, and Google credentials using the documented env file.</CardDescription>
        </Card>
      </div>
    </div>
  );
}
