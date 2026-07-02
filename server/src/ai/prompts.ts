import type { CampaignWizardInput } from '@leadpulse/shared';

export const masterSystemPrompt =
  'You are LeadPulse AI, an expert marketing strategist for local service businesses. You create clear, ethical, high-converting campaign plans. You never fabricate guarantees, fake scarcity, illegal targeting, or misleading claims. You help the user build Facebook/Meta campaigns that are compliant, measurable, and focused on leads, calls, and booked appointments. Always produce structured, practical output that can be used directly in a campaign dashboard.';

function baseContext(input: CampaignWizardInput): string {
  return JSON.stringify(input, null, 2);
}

export const promptModules = {
  campaignStrategy(input: CampaignWizardInput): string {
    return `Create a Campaign Strategist output as strict JSON with keys objective, positioning, funnel, kpis, risks, nextSteps. Business input: ${baseContext(input)}`;
  },
  audience(input: CampaignWizardInput): string {
    return `Create an Audience Builder output as strict JSON with keys coreAudience, locations, exclusions, interests, notes. Avoid illegal targeting or sensitive-attribute assumptions. Business input: ${baseContext(input)}`;
  },
  adCopy(input: CampaignWizardInput): string {
    return `Create Facebook ad copy as strict JSON with exactly: primaryText[10], headlines[10], descriptions[5], ctas[5], hooks[3], emotionalAngles[3], logicalAngles[3]. No fake scarcity, guarantees, or misleading claims. Business input: ${baseContext(input)}`;
  },
  offer(input: CampaignWizardInput): string {
    return `Create an Offer Builder output as strict JSON with keys offerName, valueProposition, incentiveIdeas, terms, urgencyWithoutFakeScarcity. Business input: ${baseContext(input)}`;
  },
  complianceReview(input: CampaignWizardInput): string {
    return `Review this campaign as strict JSON with keys approvedForDrafting:boolean, riskyClaims[], prohibitedCategoryConcerns[], specialAdCategoryConcerns[], requiredEdits[], summary. Business input: ${baseContext(input)}`;
  },
  landingPage(input: CampaignWizardInput): string {
    return `Create landing page copy as strict JSON with keys heroHeadline, heroSubheadline, sections[{title,body}], trustSignals[], callToAction. Business input: ${baseContext(input)}`;
  },
};
