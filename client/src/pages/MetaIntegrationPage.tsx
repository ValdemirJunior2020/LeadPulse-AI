import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, ExternalLink, Megaphone, MousePointerClick, ShieldCheck } from 'lucide-react';
import { Card, CardDescription, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusPill } from '../components/ui/StatusPill';
import { useToast } from '../components/ui/Toast';
import { apiFetch } from '../lib/api';

type AdAccount = { id: string; name: string; currency?: string };
type Page = { id: string; name: string };
type InstagramAccount = { id: string; username: string; pageId: string };
type CampaignDraft = {
  id: string;
  clientId?: string;
  input?: {
    businessName?: string;
    campaignType?: string;
    metaPublisherPlatforms?: Array<'facebook' | 'instagram'>;
  };
  status?: string;
};
type Campaign = {
  id: string;
  metaCampaignId?: string;
  status?: string;
  campaignDraftId?: string;
  adAccountId?: string;
  pageId?: string;
  instagramActorId?: string;
  metaPublisherPlatforms?: Array<'facebook' | 'instagram'>;
};

type PublishResponse = {
  result: {
    campaignId: string;
    metaCampaignId: string;
    adSetIds: string[];
    adIds: string[];
    status: 'PAUSED';
  };
  safety: string;
  metaDestination?: {
    adAccountId?: string;
    pageId?: string;
    instagramActorId?: string;
    publisherPlatforms: Array<'facebook' | 'instagram'>;
  };
};

const serverUrl = import.meta.env.VITE_SERVER_URL ?? 'http://localhost:8080';

function destinationLabel(platforms?: Array<'facebook' | 'instagram'>): string {
  if (!platforms?.length) return 'Not selected';
  if (platforms.includes('facebook') && platforms.includes('instagram')) return 'Facebook + Instagram';
  return platforms.includes('facebook') ? 'Facebook only' : 'Instagram only';
}

export function MetaIntegrationPage() {
  const { pushToast } = useToast();
  const [selectedAdAccountId, setSelectedAdAccountId] = useState('');
  const [selectedPageId, setSelectedPageId] = useState('');
  const [selectedInstagramId, setSelectedInstagramId] = useState('');
  const [selectedDraftId, setSelectedDraftId] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<PublishResponse | null>(null);

  const accounts = useQuery({
    queryKey: ['meta-ad-accounts'],
    queryFn: () => apiFetch<{ adAccounts: AdAccount[] }>('/meta/ad-accounts'),
  });

  const pages = useQuery({
    queryKey: ['meta-pages'],
    queryFn: () => apiFetch<{ pages: Page[] }>('/meta/pages'),
  });

  const instagramAccounts = useQuery({
    queryKey: ['meta-instagram-accounts'],
    queryFn: () => apiFetch<{ instagramAccounts: InstagramAccount[] }>('/meta/instagram-accounts'),
  });

  const drafts = useQuery({
    queryKey: ['campaign-drafts-for-meta'],
    queryFn: () => apiFetch<{ drafts: CampaignDraft[] }>('/campaign-drafts'),
  });

  const campaigns = useQuery({
    queryKey: ['meta-campaigns'],
    queryFn: () => apiFetch<{ campaigns: Campaign[] }>('/meta/campaigns'),
  });

  const selectedDraft = drafts.data?.drafts.find((draft) => draft.id === selectedDraftId);
  const selectedPlatforms = selectedDraft?.input?.metaPublisherPlatforms ?? ['facebook', 'instagram'];

  async function startOAuth() {
    try {
      const result = await apiFetch<{ url: string; mock: boolean }>('/meta/oauth/start');
      const targetUrl = result.url.startsWith('/') ? `${serverUrl}${result.url}` : result.url;
      window.location.href = targetUrl;
    } catch (error) {
      pushToast({ title: 'Meta OAuth failed', message: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async function publishPaused() {
    if (!selectedDraftId) {
      pushToast({ title: 'Select a draft first', message: 'Generate a campaign draft, then choose it here.' });
      return;
    }

    setPublishing(true);
    setPublishResult(null);

    try {
      const result = await apiFetch<PublishResponse>('/meta/campaigns/publish-paused', {
        method: 'POST',
        body: JSON.stringify({
          campaignDraftId: selectedDraftId,
          clientId: selectedDraft?.clientId ?? 'client_demo',
          adAccountId: selectedAdAccountId,
          pageId: selectedPageId,
          instagramActorId: selectedInstagramId,
        }),
      });

      setPublishResult(result);
      await campaigns.refetch();
      pushToast({ title: 'Published as PAUSED', message: 'Meta Campaign, Ad Set, and Ad were created with PAUSED status.' });
    } catch (error) {
      pushToast({ title: 'Paused publish failed', message: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Megaphone className="h-8 w-8 text-pulseBlue" />
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Meta Integration</h1>
          <p className="mt-2 text-slate-500">
            This is the second part of the campaign flow. Select the draft, then publish it safely as PAUSED.
          </p>
        </div>
      </div>

      <Card className="border-0 bg-gradient-to-br from-blue-950 via-slate-950 to-slate-900 text-white shadow-glow">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-pulseGreen">
              <MousePointerClick className="h-4 w-4" /> What do I click now?
            </div>
            <h2 className="mt-4 text-2xl font-black">Publish the saved draft in 5 clicks.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              In mock mode this does not spend money and does not create live ads. It only proves the Facebook/Instagram publishing flow.
            </p>
          </div>

          <div className="grid gap-2 text-sm sm:grid-cols-2 lg:w-[620px]">
            {[
              '1. Click Start Meta OAuth',
              '2. Choose the ad account',
              '3. Choose the Facebook Page',
              '4. Choose Instagram if draft uses Instagram',
              '5. Select draft → Publish PAUSED',
            ].map((step, index) => (
              <div key={step} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 font-semibold text-slate-100">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pulseBlue text-xs font-black">{index + 1}</span>
                {step}
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Step 1 — Connect Meta</CardTitle>
            <CardDescription>
              Mock mode simulates OAuth until Meta App Review is approved. Live mode uses Facebook Login and approved Marketing API permissions.
            </CardDescription>
          </div>
          <StatusPill tone="warn">PAUSED only</StatusPill>
        </div>

        <Button className="mt-6" onClick={startOAuth}>
          Start Meta OAuth <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </Card>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <CardTitle>Step 2 — Ad account</CardTitle>
          <CardDescription>{accounts.isLoading ? 'Loading accounts...' : 'Choose where the ad spend belongs.'}</CardDescription>
          <select
            value={selectedAdAccountId}
            onChange={(event) => setSelectedAdAccountId(event.target.value)}
            className="mt-4 w-full rounded-xl border border-slate-300 px-3 py-2"
          >
            <option value="">Select ad account</option>
            {accounts.data?.adAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name} — {account.id}
              </option>
            ))}
          </select>
        </Card>

        <Card>
          <CardTitle>Step 3 — Facebook Page</CardTitle>
          <CardDescription>The Page is used as the visible advertiser identity for the ad creative.</CardDescription>
          <select
            value={selectedPageId}
            onChange={(event) => setSelectedPageId(event.target.value)}
            className="mt-4 w-full rounded-xl border border-slate-300 px-3 py-2"
          >
            <option value="">Select page</option>
            {pages.data?.pages.map((page) => (
              <option key={page.id} value={page.id}>
                {page.name} — {page.id}
              </option>
            ))}
          </select>
        </Card>

        <Card>
          <CardTitle>Step 4 — Instagram identity</CardTitle>
          <CardDescription>Needed when the selected draft includes Instagram placements.</CardDescription>
          <select
            value={selectedInstagramId}
            onChange={(event) => setSelectedInstagramId(event.target.value)}
            className="mt-4 w-full rounded-xl border border-slate-300 px-3 py-2"
          >
            <option value="">Select Instagram account</option>
            {instagramAccounts.data?.instagramAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                @{account.username} — {account.id}
              </option>
            ))}
          </select>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Step 5 — Select draft and publish paused</CardTitle>
            <CardDescription>
              Facebook/Instagram destination comes from the draft. Change it on the New Campaign page before publishing.
            </CardDescription>
          </div>
          <StatusPill tone="info">{destinationLabel(selectedPlatforms)}</StatusPill>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
          <select
            value={selectedDraftId}
            onChange={(event) => setSelectedDraftId(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2"
          >
            <option value="">Select campaign draft</option>
            {drafts.data?.drafts.map((draft) => (
              <option key={draft.id} value={draft.id}>
                {draft.input?.businessName ?? 'Untitled draft'} — {destinationLabel(draft.input?.metaPublisherPlatforms)} — {draft.status}
              </option>
            ))}
          </select>

          <Button disabled={publishing || !selectedDraftId} onClick={publishPaused}>
            {publishing ? 'Publishing paused...' : 'Publish PAUSED'}
          </Button>
        </div>

        {publishResult ? (
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-900">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="h-5 w-5" />
              Published safely as PAUSED
            </div>
            <pre className="mt-3 overflow-auto text-xs leading-6">{JSON.stringify(publishResult, null, 2)}</pre>
          </div>
        ) : null}
      </Card>

      <Card>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-pulseGreen" />
          <CardTitle>Published campaigns</CardTitle>
        </div>
        <CardDescription>Campaigns stored after paused publish. Activation still requires a separate server-side confirmation phrase.</CardDescription>

        <div className="mt-4 space-y-3">
          {campaigns.data?.campaigns.map((campaign) => (
            <div key={campaign.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-slate-950">{campaign.metaCampaignId ?? campaign.id}</p>
                  <p className="text-sm text-slate-500">Draft: {campaign.campaignDraftId}</p>
                  <p className="text-sm text-slate-500">Destination: {destinationLabel(campaign.metaPublisherPlatforms)}</p>
                </div>
                <StatusPill tone="warn">{campaign.status ?? 'PAUSED'}</StatusPill>
              </div>
            </div>
          ))}

          {!campaigns.data?.campaigns.length ? (
            <p className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
              No paused Meta campaigns yet. Generate a draft, select it above, then publish paused.
            </p>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
