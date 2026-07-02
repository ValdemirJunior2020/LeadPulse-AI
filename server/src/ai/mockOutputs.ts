import type {
  AdCopyOutput,
  AudienceOutput,
  CampaignStrategyOutput,
  ComplianceOutput,
  LandingPageOutput,
  OfferOutput,
} from '@leadpulse/shared';
import type { CampaignWizardInput } from '@leadpulse/shared';

export function mockStrategy(input: CampaignWizardInput): CampaignStrategyOutput {
  return {
    objective: `Generate measurable calls and booked appointments for ${input.businessName}.`,
    positioning: `${input.businessName} helps ${input.audience} in ${input.serviceArea} solve ${input.goal} with a clear local offer.`,
    funnel: ['Ad click or call button', 'Landing page proof and offer', 'Tracked call', 'Lead status follow-up'],
    kpis: ['Qualified calls', 'Answered call rate', 'Cost per booked appointment', 'First-time caller volume'],
    risks: ['Avoid guaranteed outcomes', 'Avoid misleading urgency', 'Confirm Meta category requirements before publishing'],
    nextSteps: ['Approve copy', 'Connect Meta', 'Run compliance review', 'Publish paused campaign'],
  };
}

export function mockAudience(input: CampaignWizardInput): AudienceOutput {
  return {
    coreAudience: `${input.audience} near ${input.location} needing ${input.industry} services.`,
    locations: [input.location, input.serviceArea],
    exclusions: ['Existing unqualified leads', 'Outside service area'],
    interests: ['Home services', 'Local business', 'Appointments', input.industry],
    notes: ['Keep targeting broad enough for Meta delivery', 'Do not target sensitive personal attributes'],
  };
}

export function mockAdCopy(input: CampaignWizardInput): AdCopyOutput {
  const primaryText = Array.from({ length: 10 }, (_, index) =>
    `${input.businessName} can help with ${input.offer}. Call today to discuss options in ${input.serviceArea}. Option ${index + 1}.`,
  );
  const headlines = Array.from({ length: 10 }, (_, index) =>
    `${input.offer} in ${input.location} ${index + 1}`,
  );
  return {
    primaryText,
    headlines,
    descriptions: [
      'Clear local help when customers are ready to call.',
      'Track every call and appointment opportunity.',
      'Simple offer, simple next step.',
      'Built for local service demand.',
      'Measure calls, leads, and bookings.',
    ],
    ctas: ['Call Now', 'Book Now', 'Learn More', 'Get Quote', 'Contact Us'],
    hooks: ['Need help today?', 'Local service made simple.', 'Turn interest into calls.'],
    emotionalAngles: ['Peace of mind', 'Fast local response', 'Confidence before booking'],
    logicalAngles: ['Trackable calls', 'Clear service area', 'Budget-aligned campaign'],
  };
}

export function mockOffer(input: CampaignWizardInput): OfferOutput {
  return {
    offerName: input.offer,
    valueProposition: `A clear ${input.industry} offer for ${input.audience} in ${input.serviceArea}.`,
    incentiveIdeas: ['Free consultation', 'Same-week availability note', 'Transparent quote request'],
    terms: ['Subject to availability', 'Final pricing depends on service details', 'No guaranteed outcomes'],
    urgencyWithoutFakeScarcity: ['Schedule this week', 'Get a quick estimate', 'Talk with a local specialist'],
  };
}

export function mockCompliance(input: CampaignWizardInput): ComplianceOutput {
  const special = /credit|housing|employment|insurance|politic/i.test(input.industry + input.offer);
  return {
    approvedForDrafting: !special,
    riskyClaims: [],
    prohibitedCategoryConcerns: [],
    specialAdCategoryConcerns: special ? ['Review Meta Special Ad Category rules before publishing.'] : [],
    requiredEdits: special ? ['Confirm category before Meta publishing.'] : [],
    summary: special
      ? 'Draft can be edited, but publishing should wait until special category requirements are confirmed.'
      : 'No obvious compliance blockers found in the provided business input.',
  };
}

export function mockLandingPage(input: CampaignWizardInput): LandingPageOutput {
  return {
    heroHeadline: `${input.offer} for ${input.location}`,
    heroSubheadline: `Call ${input.businessName} for local help focused on ${input.goal}.`,
    sections: [
      { title: 'Why customers call', body: `People choose ${input.businessName} for clear next steps and local service.` },
      { title: 'What to expect', body: 'A simple call, a clear answer, and a tracked lead process.' },
      { title: 'Service area', body: `Serving ${input.serviceArea}.` },
    ],
    trustSignals: ['Local service team', 'Call tracking enabled', 'Clear offer details'],
    callToAction: `Call ${input.phoneOrTrackingNumber} or request an appointment today.`,
  };
}
