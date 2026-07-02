import { FormEvent, useMemo, useState } from 'react';
import { campaignTypeSchema, campaignWizardInputSchema, type CampaignWizardInput } from '@leadpulse/shared';
import { Card, CardDescription, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { apiFetch } from '../lib/api';

const defaults: CampaignWizardInput = {
  campaignType: 'local_lead_generation',
  businessName: 'Demo Local Services',
  industry: 'Home services',
  offer: 'Free estimate',
  location: 'Lake Worth, FL',
  audience: 'Homeowners needing service help',
  budget: '$50/day',
  serviceArea: 'Palm Beach County',
  landingPage: 'https://example.com/free-estimate',
  phoneOrTrackingNumber: '+15555550101',
  goal: 'Generate qualified calls and booked appointments',
  tone: 'Friendly and professional',
};

const fields: Array<{ key: keyof CampaignWizardInput; label: string; type?: string }> = [
  { key: 'businessName', label: 'Business name' },
  { key: 'industry', label: 'Industry' },
  { key: 'offer', label: 'Offer' },
  { key: 'location', label: 'Location' },
  { key: 'audience', label: 'Audience' },
  { key: 'budget', label: 'Budget' },
  { key: 'serviceArea', label: 'Service area' },
  { key: 'landingPage', label: 'Landing page', type: 'url' },
  { key: 'phoneOrTrackingNumber', label: 'Phone/tracking number' },
  { key: 'goal', label: 'Goal' },
  { key: 'tone', label: 'Tone' },
];

export function CampaignWizard() {
  const [form, setForm] = useState<CampaignWizardInput>(defaults);
  const [output, setOutput] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const { pushToast } = useToast();
  const campaignTypes = useMemo(() => campaignTypeSchema.options, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setOutput(null);
    try {
      const input = campaignWizardInputSchema.parse(form);
      const [strategy, adCopy, audience, offer, compliance, landingPage] = await Promise.all([
        apiFetch('/ai/campaign-strategy', { method: 'POST', body: JSON.stringify({ input }) }),
        apiFetch('/ai/ad-copy', { method: 'POST', body: JSON.stringify({ input }) }),
        apiFetch('/ai/audience', { method: 'POST', body: JSON.stringify({ input }) }),
        apiFetch('/ai/offer', { method: 'POST', body: JSON.stringify({ input }) }),
        apiFetch('/ai/compliance-review', { method: 'POST', body: JSON.stringify({ input }) }),
        apiFetch('/ai/landing-page', { method: 'POST', body: JSON.stringify({ input }) }),
      ]);
      setOutput({ strategy, adCopy, audience, offer, compliance, landingPage });
      pushToast({ title: 'AI draft generated', message: 'The output is structured JSON and ready for editing.' });
    } catch (error) {
      pushToast({ title: 'Generation failed', message: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_520px]">
      <Card>
        <CardTitle>New Campaign Wizard</CardTitle>
        <CardDescription>Six campaign types plus business inputs used by every reusable AI prompt module.</CardDescription>
        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={submit}>
          <label className="md:col-span-2">
            <span className="text-sm font-medium text-slate-700">Campaign type</span>
            <select
              value={form.campaignType}
              onChange={(event) => setForm({ ...form, campaignType: event.target.value as CampaignWizardInput['campaignType'] })}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
            >
              {campaignTypes.map((type) => <option key={type} value={type}>{type.replaceAll('_', ' ')}</option>)}
            </select>
          </label>
          {fields.map((field) => (
            <label key={field.key} className={field.key === 'goal' ? 'md:col-span-2' : undefined}>
              <span className="text-sm font-medium text-slate-700">{field.label}</span>
              <input
                type={field.type ?? 'text'}
                value={String(form[field.key])}
                onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
              />
            </label>
          ))}
          <div className="md:col-span-2">
            <Button disabled={loading}>{loading ? 'Generating...' : 'Generate AI campaign draft'}</Button>
          </div>
        </form>
      </Card>
      <Card className="min-h-[520px] overflow-auto">
        <CardTitle>Structured Output</CardTitle>
        <CardDescription>Validated JSON response preview.</CardDescription>
        <pre className="mt-6 max-h-[720px] overflow-auto rounded-2xl bg-slate-950 p-4 text-xs leading-6 text-green-200">
          {output ? JSON.stringify(output, null, 2) : 'Run the wizard to generate strategy, audience, copy, offer, compliance, and landing page output.'}
        </pre>
      </Card>
    </div>
  );
}
