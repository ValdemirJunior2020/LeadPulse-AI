import { FormEvent, useState } from 'react';
import { Card, CardDescription, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { apiFetch } from '../lib/api';

export function AdminPage() {
  const [name, setName] = useState('Weekly Report Writer');
  const [prompt, setPrompt] = useState('Write a concise weekly performance report from campaign and call metadata only.');
  const { pushToast } = useToast();
  async function submit(event: FormEvent) {
    event.preventDefault();
    try {
      await apiFetch('/admin/prompt-templates', { method: 'POST', body: JSON.stringify({ name, prompt, enabled: true }) });
      pushToast({ title: 'Prompt template saved', message: 'Owner/Admin-only route accepted the template.' });
    } catch (error) {
      pushToast({ title: 'Save failed', message: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-950">Admin</h1>
      <Card>
        <CardTitle>Prompt-template manager</CardTitle>
        <CardDescription>Owner/Admin only. Use this to control reusable AI prompts in production.</CardDescription>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Template name</span>
            <input className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Prompt</span>
            <textarea className="mt-1 min-h-36 w-full rounded-xl border border-slate-300 px-3 py-2" value={prompt} onChange={(event) => setPrompt(event.target.value)} />
          </label>
          <Button>Save template</Button>
        </form>
      </Card>
    </div>
  );
}
