import { FormEvent, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, MousePointerClick, Sparkles } from 'lucide-react';
import {
  campaignTypeSchema,
  campaignWizardInputSchema,
  type CampaignWizardInput,
  type MetaPublisherPlatform,
} from '@leadpulse/shared';
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
  metaPublisherPlatforms: ['facebook', 'instagram'],
  tone: 'Friendly and professional',
};

const fields: Array<{ key: keyof CampaignWizardInput; label: string; type?: string; full?: boolean }> = [
  { key: 'businessName', label: 'Business name' },
  { key: 'industry', label: 'Industry' },
  { key: 'offer', label: 'Offer' },
  { key: 'location', label: 'Location' },
  { key: 'audience', label: 'Audience' },
  { key: 'budget', label: 'Budget' },
  { key: 'serviceArea', label: 'Service area' },
  { key: 'landingPage', label: 'Landing page', type: 'url' },
  { key: 'phoneOrTrackingNumber', label: 'Phone/tracking number' },
  { key: 'goal', label: 'Goal', full: true },
  { key: 'tone', label: 'Tone' },
];

const platformOptions: Array<{ value: MetaPublisherPlatform; label: string; description: string }> = [
  {
    value: 'facebook',
    label: 'Facebook',
    description: 'Feeds, Reels, Stories, Marketplace, and other Facebook placements supported by the ad set.',
  },
  {
    value: 'instagram',
    label: 'Instagram',
    description: 'Instagram feed, Stories, Reels, Explore, and profile placements supported by the ad set.',
  },
];

type AiGenerationResult = {
  output: unknown;
  cached: boolean;
  generationId: string;
};

type DraftResponse = {
  draft: {
    id: string;
  };
};

function togglePlatform(
  current: MetaPublisherPlatform[],
  value: MetaPublisherPlatform,
  checked: boolean,
): MetaPublisherPlatform[] {
  if (checked) {
    return Array.from(new Set([...current, value]));
  }

  const next = current.filter((item) => item !== value);
  return next.length ? next : current;
}

function selectedDestination(platforms: MetaPublisherPlatform[]): string {
  if (platforms.includes('facebook') && platforms.includes('instagram')) return 'Facebook + Instagram';
  return platforms.includes('facebook') ? 'Facebook only' : 'Instagram only';
}

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
        apiFetch<AiGenerationResult>('/ai/campaign-strategy', { method: 'POST', body: JSON.stringify({ input }) }),
        apiFetch<AiGenerationResult>('/ai/ad-copy', { method: 'POST', body: JSON.stringify({ input }) }),
        apiFetch<AiGenerationResult>('/ai/audience', { method: 'POST', body: JSON.stringify({ input }) }),
        apiFetch<AiGenerationResult>('/ai/offer', { method: 'POST', body: JSON.stringify({ input }) }),
        apiFetch<AiGenerationResult>('/ai/compliance-review', { method: 'POST', body: JSON.stringify({ input }) }),
        apiFetch<AiGenerationResult>('/ai/landing-page', { method: 'POST', body: JSON.stringify({ input }) }),
      ]);

      const draftResponse = await apiFetch<DraftResponse>('/campaign-drafts', {
        method: 'POST',
        body: JSON.stringify({ input, clientId: 'client_demo' }),
      });

      const complianceOutput = compliance.output as { approvedForDrafting?: boolean };
      const draftStatus = complianceOutput.approvedForDrafting === false ? 'ready_for_compliance' : 'ready_to_publish';

      await apiFetch(`/campaign-drafts/${draftResponse.draft.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          strategy: strategy.output,
          adCopy: adCopy.output,
          audience: audience.output,
          offer: offer.output,
          compliance: compliance.output,
          landingPage: landingPage.output,
          status: draftStatus,
        }),
      });

      setOutput({
        draftId: draftResponse.draft.id,
        nextStep: 'Click Meta in the sidebar, select this draft, then click Publish PAUSED.',
        metaPublisherPlatforms: input.metaPublisherPlatforms,
        strategy: strategy.output,
        adCopy: adCopy.output,
        audience: audience.output,
        offer: offer.output,
        compliance: compliance.output,
        landingPage: landingPage.output,
      });

      pushToast({
        title: 'AI draft generated and saved',
        message: 'Next: click Meta in the sidebar and publish the saved draft as PAUSED.',
      });
    } catch (error) {
      pushToast({ title: 'Generation failed', message: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white shadow-glow">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-pulseGreen">
              <Sparkles className="h-4 w-4" /> Guided path
            </div>
            <h1 className="mt-4 text-2xl font-black">Create the draft first. Publish it from Meta second.</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              Follow the cards below: choose Facebook/Instagram, confirm the business details, click Generate, then go to Meta to publish safely as PAUSED.
            </p>
          </div>

          <div className="grid gap-2 text-sm sm:grid-cols-2 lg:w-[520px]">
            {[
              '1. Select Facebook, Instagram, or both',
              '2. Fill the business offer and audience',
              '3. Click Generate AI campaign draft',
              '4. Go to Meta → select draft → Publish PAUSED',
            ].map((step) => (
              <div key={step} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 font-semibold text-slate-100">
                {step}
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_520px]">
        <Card>
          <CardTitle>New Campaign Wizard</CardTitle>
          <CardDescription>
            Start here. Your selected destination is currently: <strong>{selectedDestination(form.metaPublisherPlatforms)}</strong>.
          </CardDescription>

          <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={submit}>
            <label className="md:col-span-2">
              <span className="text-sm font-medium text-slate-700">Campaign type</span>
              <select
                value={form.campaignType}
                onChange={(event) => setForm({ ...form, campaignType: event.target.value as CampaignWizardInput['campaignType'] })}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
              >
                {campaignTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.replaceAll('_', ' ')}
                  </option>
                ))}
              </select>
            </label>

            <fieldset className="md:col-span-2 rounded-3xl border border-blue-200 bg-blue-50 p-4 ring-4 ring-blue-100/60">
              <legend className="px-1 text-sm font-black text-blue-950">Click here first: Where should this campaign run?</legend>
              <p className="mt-1 text-xs text-blue-700">
                Choose Facebook, Instagram, or both. This is saved into the draft and sent to the Meta publishing step.
              </p>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {platformOptions.map((platform) => (
                  <label
                    key={platform.value}
                    className="flex cursor-pointer gap-3 rounded-2xl border border-blue-200 bg-white p-4 transition hover:border-pulseBlue hover:shadow-sm"
                  >
                    <input
                      type="checkbox"
                      checked={form.metaPublisherPlatforms.includes(platform.value)}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          metaPublisherPlatforms: togglePlatform(
                            form.metaPublisherPlatforms,
                            platform.value,
                            event.target.checked,
                          ),
                        })
                      }
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-pulseBlue"
                    />
                    <span>
                      <span className="block font-bold text-slate-950">{platform.label}</span>
                      <span className="mt-1 block text-xs leading-5 text-slate-500">{platform.description}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {fields.map((field) => (
              <label key={field.key} className={field.full ? 'md:col-span-2' : undefined}>
                <span className="text-sm font-medium text-slate-700">{field.label}</span>
                <input
                  type={field.type ?? 'text'}
                  value={String(form[field.key])}
                  onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </label>
            ))}

            <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button disabled={loading}>
                <MousePointerClick className="mr-2 h-4 w-4" />
                {loading ? 'Generating and saving...' : 'Generate AI campaign draft'}
              </Button>
              <p className="text-xs text-slate-500">After this finishes, the draft appears on the Meta page.</p>
            </div>
          </form>
        </Card>

        <Card className="min-h-[520px] overflow-auto">
          <CardTitle>What happens next?</CardTitle>
          <CardDescription>Clear instructions appear here after the AI draft is saved.</CardDescription>

          {output ? (
            <div className="mt-6 rounded-3xl border border-green-200 bg-green-50 p-5 text-green-950">
              <div className="flex items-center gap-2 font-black">
                <CheckCircle2 className="h-5 w-5" /> Draft saved successfully
              </div>
              <p className="mt-2 text-sm leading-6">
                Now click <strong>Meta</strong> in the sidebar. On the Meta page, choose the ad account, Facebook Page, Instagram identity, select this draft, then click <strong>Publish PAUSED</strong>.
              </p>
              <Link
                to="/dashboard/meta"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-pulseBlue px-4 py-2 text-sm font-bold text-white shadow-glow hover:bg-blue-700"
              >
                Go to Meta now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : null}

          <pre className="mt-6 max-h-[720px] overflow-auto rounded-2xl bg-slate-950 p-4 text-xs leading-6 text-green-200">
            {output
              ? JSON.stringify(output, null, 2)
              : 'Step 1: choose Facebook/Instagram. Step 2: review business info. Step 3: click Generate AI campaign draft.'}
          </pre>
        </Card>
      </div>
    </div>
  );
}
