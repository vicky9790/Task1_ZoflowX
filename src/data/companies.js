export const SIGNAL_TYPES = {
  FUNDING: "funding",
  HIRING: "hiring",
  PRODUCT_LAUNCH: "product_launch",
  EXPANSION: "expansion",
  PARTNERSHIP: "partnership",
  TECH_ADOPTION: "tech_adoption",
  LEADERSHIP_CHANGE: "leadership_change",
  MARKET_ENTRY: "market_entry",
};

export const companiesRaw = [
  {
    id: 1,
    name: "NexaHealth AI",
    industry: "HealthTech",
    location: "San Francisco, CA",
    size: "Series B",
    employees: 320,
    website: "nexahealth.ai",
    logo: "🏥",
    description: "AI-powered patient diagnostics and hospital workflow automation platform.",
    signals: [
      {
        type: SIGNAL_TYPES.FUNDING,
        detail: "Raised $45M Series B from Andreessen Horowitz",
        date: "2026-05-28",
        weight: 30,
        source: "TechCrunch",
      },
      {
        type: SIGNAL_TYPES.HIRING,
        detail: "18 open roles in Sales, Marketing, and Customer Success",
        date: "2026-05-30",
        weight: 20,
        source: "LinkedIn",
      },
      {
        type: SIGNAL_TYPES.EXPANSION,
        detail: "Expanding into APAC markets with a new Singapore office",
        date: "2026-05-25",
        weight: 15,
        source: "Company Blog",
      },
      {
        type: SIGNAL_TYPES.TECH_ADOPTION,
        detail: "Migrating entire data infrastructure to Snowflake",
        date: "2026-05-20",
        weight: 10,
        source: "G2 Reviews",
      },
    ],
    recommendedService: "Enterprise CRM & Sales Enablement Platform",
    businessPotential: "High",
  },
  {
    id: 2,
    name: "GreenLogix",
    industry: "Supply Chain",
    location: "Chicago, IL",
    size: "Series A",
    employees: 95,
    website: "greenlogix.io",
    logo: "🌿",
    description: "Sustainable logistics and carbon-neutral supply chain management for mid-market companies.",
    signals: [
      {
        type: SIGNAL_TYPES.PRODUCT_LAUNCH,
        detail: "Launched 'CarbonTrack Pro' — new SaaS product for ESG reporting",
        date: "2026-05-31",
        weight: 25,
        source: "Product Hunt",
      },
      {
        type: SIGNAL_TYPES.HIRING,
        detail: "Aggressively hiring 12 engineers and a VP of Engineering",
        date: "2026-06-01",
        weight: 20,
        source: "LinkedIn",
      },
      {
        type: SIGNAL_TYPES.PARTNERSHIP,
        detail: "Strategic partnership signed with DHL for last-mile delivery optimization",
        date: "2026-05-22",
        weight: 20,
        source: "PR Newswire",
      },
    ],
    recommendedService: "DevOps & Cloud Infrastructure Consulting",
    businessPotential: "High",
  },
  {
    id: 3,
    name: "FinoEdge",
    industry: "FinTech",
    location: "New York, NY",
    size: "Seed",
    employees: 42,
    website: "finoedge.com",
    logo: "💳",
    description: "B2B embedded finance platform enabling non-financial brands to offer banking products.",
    signals: [
      {
        type: SIGNAL_TYPES.FUNDING,
        detail: "Closed $8M seed round led by Sequoia Capital",
        date: "2026-05-15",
        weight: 25,
        source: "Crunchbase",
      },
      {
        type: SIGNAL_TYPES.TECH_ADOPTION,
        detail: "Adopting Stripe Treasury and Plaid APIs for embedded banking",
        date: "2026-05-10",
        weight: 10,
        source: "Tech Blog",
      },
      {
        type: SIGNAL_TYPES.HIRING,
        detail: "5 open roles in Compliance and Risk Management",
        date: "2026-05-28",
        weight: 15,
        source: "LinkedIn",
      },
    ],
    recommendedService: "Regulatory Compliance & Risk Management Software",
    businessPotential: "Medium",
  },
  {
    id: 4,
    name: "UrbanMesh",
    industry: "PropTech",
    location: "Austin, TX",
    size: "Series C",
    employees: 680,
    website: "urbanmesh.co",
    logo: "🏙️",
    description: "Smart city IoT infrastructure platform connecting building management systems.",
    signals: [
      {
        type: SIGNAL_TYPES.EXPANSION,
        detail: "Entering European market with offices in London and Berlin",
        date: "2026-06-01",
        weight: 20,
        source: "Reuters",
      },
      {
        type: SIGNAL_TYPES.FUNDING,
        detail: "Raised $120M Series C from SoftBank Vision Fund",
        date: "2026-05-18",
        weight: 30,
        source: "Bloomberg",
      },
      {
        type: SIGNAL_TYPES.LEADERSHIP_CHANGE,
        detail: "New CTO hired from Amazon Web Services",
        date: "2026-05-12",
        weight: 10,
        source: "LinkedIn",
      },
      {
        type: SIGNAL_TYPES.TECH_ADOPTION,
        detail: "Evaluating Azure IoT Hub vs. AWS IoT Core for platform rewrite",
        date: "2026-05-05",
        weight: 10,
        source: "G2",
      },
    ],
    recommendedService: "Cloud Migration & Multi-Cloud Architecture Services",
    businessPotential: "High",
  },
  {
    id: 5,
    name: "EduSpark",
    industry: "EdTech",
    location: "Boston, MA",
    size: "Series A",
    employees: 130,
    website: "eduspark.io",
    logo: "🎓",
    description: "Adaptive AI tutoring platform for K-12 and university students across STEM subjects.",
    signals: [
      {
        type: SIGNAL_TYPES.MARKET_ENTRY,
        detail: "Entering Southeast Asian education market (India, Vietnam, Thailand)",
        date: "2026-05-28",
        weight: 20,
        source: "EdSurge",
      },
      {
        type: SIGNAL_TYPES.HIRING,
        detail: "8 open roles in Content Localization and L10n Engineering",
        date: "2026-06-01",
        weight: 15,
        source: "LinkedIn",
      },
      {
        type: SIGNAL_TYPES.PARTNERSHIP,
        detail: "Partnership with Khan Academy to co-develop AI curriculum tools",
        date: "2026-05-20",
        weight: 15,
        source: "PR Newswire",
      },
    ],
    recommendedService: "Localization & Internationalization (i18n) Platform",
    businessPotential: "Medium",
  },
  {
    id: 6,
    name: "TrustLayer",
    industry: "CyberSecurity",
    location: "Seattle, WA",
    size: "Series B",
    employees: 210,
    website: "trustlayer.io",
    logo: "🔒",
    description: "Zero-trust identity verification and access management for enterprise environments.",
    signals: [
      {
        type: SIGNAL_TYPES.PRODUCT_LAUNCH,
        detail: "Launched 'SecureVault 3.0' with passwordless enterprise authentication",
        date: "2026-05-29",
        weight: 25,
        source: "Product Hunt",
      },
      {
        type: SIGNAL_TYPES.HIRING,
        detail: "22 open roles across Sales Engineering and Enterprise Account Executive",
        date: "2026-05-30",
        weight: 20,
        source: "LinkedIn",
      },
      {
        type: SIGNAL_TYPES.FUNDING,
        detail: "Closed $60M Series B from Bessemer Venture Partners",
        date: "2026-05-10",
        weight: 30,
        source: "Crunchbase",
      },
    ],
    recommendedService: "B2B SaaS Go-to-Market & Revenue Operations",
    businessPotential: "High",
  },
  {
    id: 7,
    name: "AgriVision",
    industry: "AgriTech",
    location: "Des Moines, IA",
    size: "Seed",
    employees: 28,
    website: "agrivision.farm",
    logo: "🌾",
    description: "Satellite and drone-based precision agriculture platform for crop yield optimization.",
    signals: [
      {
        type: SIGNAL_TYPES.FUNDING,
        detail: "Raised $3.5M pre-seed from AgFunder and USDA grants",
        date: "2026-05-01",
        weight: 15,
        source: "AgFunder News",
      },
      {
        type: SIGNAL_TYPES.TECH_ADOPTION,
        detail: "Adopting computer vision ML pipeline on Google Cloud Vertex AI",
        date: "2026-05-15",
        weight: 10,
        source: "Company Blog",
      },
    ],
    recommendedService: "ML Infrastructure & MLOps Consulting",
    businessPotential: "Low",
  },
  {
    id: 8,
    name: "RetailPulse",
    industry: "RetailTech",
    location: "Los Angeles, CA",
    size: "Series A",
    employees: 165,
    website: "retailpulse.ai",
    logo: "🛍️",
    description: "Real-time consumer behavior analytics and personalization engine for e-commerce.",
    signals: [
      {
        type: SIGNAL_TYPES.EXPANSION,
        detail: "Expanding from DTC brands to enterprise retail chains (Walmart, Target vendors)",
        date: "2026-05-27",
        weight: 20,
        source: "TechCrunch",
      },
      {
        type: SIGNAL_TYPES.HIRING,
        detail: "15 open roles in Enterprise Sales and Implementation Engineers",
        date: "2026-05-30",
        weight: 20,
        source: "LinkedIn",
      },
      {
        type: SIGNAL_TYPES.PRODUCT_LAUNCH,
        detail: "Launched B2B analytics suite with API-first architecture",
        date: "2026-05-22",
        weight: 20,
        source: "Product Hunt",
      },
    ],
    recommendedService: "Enterprise Data Integration & API Management Platform",
    businessPotential: "High",
  },
  {
    id: 9,
    name: "MobiFleet",
    industry: "Logistics",
    location: "Detroit, MI",
    size: "Growth",
    employees: 1200,
    website: "mobifleet.com",
    logo: "🚚",
    description: "AI-powered fleet management and route optimization for logistics and last-mile delivery.",
    signals: [
      {
        type: SIGNAL_TYPES.LEADERSHIP_CHANGE,
        detail: "Appointed new Chief Digital Officer from UPS",
        date: "2026-05-05",
        weight: 10,
        source: "LinkedIn",
      },
      {
        type: SIGNAL_TYPES.TECH_ADOPTION,
        detail: "Evaluating ERP replacement — SAP vs Oracle vs Microsoft Dynamics",
        date: "2026-05-20",
        weight: 15,
        source: "G2 Reviews",
      },
      {
        type: SIGNAL_TYPES.EXPANSION,
        detail: "Acquired regional carrier 'FastShip LLC' for $28M",
        date: "2026-05-14",
        weight: 15,
        source: "Bloomberg",
      },
    ],
    recommendedService: "ERP & Digital Transformation Consulting",
    businessPotential: "Medium",
  },
  {
    id: 10,
    name: "LegalMind",
    industry: "LegalTech",
    location: "Washington, DC",
    size: "Seed",
    employees: 55,
    website: "legalmind.ai",
    logo: "⚖️",
    description: "AI-assisted contract analysis and legal document automation for law firms and corporates.",
    signals: [
      {
        type: SIGNAL_TYPES.PRODUCT_LAUNCH,
        detail: "Beta launched 'ContractIQ' — GPT-4 powered contract review tool",
        date: "2026-06-01",
        weight: 25,
        source: "ProductHunt",
      },
      {
        type: SIGNAL_TYPES.PARTNERSHIP,
        detail: "Integration partnership with DocuSign and Salesforce",
        date: "2026-05-24",
        weight: 20,
        source: "PR Newswire",
      },
      {
        type: SIGNAL_TYPES.HIRING,
        detail: "6 open roles in Customer Success and Enterprise Onboarding",
        date: "2026-05-28",
        weight: 15,
        source: "LinkedIn",
      },
    ],
    recommendedService: "Customer Success & Onboarding Automation Platform",
    businessPotential: "Medium",
  },
];

// AI Scoring Engine
const SCORE_WEIGHTS = {
  [SIGNAL_TYPES.FUNDING]: 30,
  [SIGNAL_TYPES.HIRING]: 20,
  [SIGNAL_TYPES.PRODUCT_LAUNCH]: 25,
  [SIGNAL_TYPES.EXPANSION]: 20,
  [SIGNAL_TYPES.PARTNERSHIP]: 20,
  [SIGNAL_TYPES.TECH_ADOPTION]: 15,
  [SIGNAL_TYPES.LEADERSHIP_CHANGE]: 10,
  [SIGNAL_TYPES.MARKET_ENTRY]: 18,
};

const RECENCY_MULTIPLIER = (dateStr) => {
  const daysAgo = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
  if (daysAgo <= 7) return 1.0;
  if (daysAgo <= 14) return 0.85;
  if (daysAgo <= 30) return 0.70;
  return 0.5;
};

const SIGNAL_COUNT_BONUS = (count) => {
  if (count >= 4) return 10;
  if (count >= 3) return 6;
  if (count >= 2) return 3;
  return 0;
};

export const scoreCompany = (company) => {
  let rawScore = 0;
  company.signals.forEach((signal) => {
    rawScore += (signal.weight || 10);
  });
  return Math.min(100, rawScore);
};

export const generateReason = (company) => {
  const signalTypes = company.signals.map((s) => s.type);
  const reasons = [];

  if (signalTypes.includes(SIGNAL_TYPES.FUNDING)) {
    const funding = company.signals.find((s) => s.type === SIGNAL_TYPES.FUNDING);
    reasons.push(`Recent funding (${funding.detail}) indicates budget availability and growth phase.`);
  }
  if (signalTypes.includes(SIGNAL_TYPES.HIRING)) {
    const hiring = company.signals.find((s) => s.type === SIGNAL_TYPES.HIRING);
    reasons.push(`Active hiring (${hiring.detail}) signals scaling needs and operational investment.`);
  }
  if (signalTypes.includes(SIGNAL_TYPES.PRODUCT_LAUNCH)) {
    reasons.push(`New product launch creates demand for go-to-market tooling and customer acquisition.`);
  }
  if (signalTypes.includes(SIGNAL_TYPES.EXPANSION)) {
    reasons.push(`Geographic or market expansion drives need for new vendor partnerships.`);
  }
  if (signalTypes.includes(SIGNAL_TYPES.TECH_ADOPTION)) {
    reasons.push(`Active technology adoption phase creates integration and consulting opportunities.`);
  }
  if (signalTypes.includes(SIGNAL_TYPES.PARTNERSHIP)) {
    reasons.push(`Partnership activity indicates openness to third-party integrations.`);
  }
  if (signalTypes.includes(SIGNAL_TYPES.LEADERSHIP_CHANGE)) {
    reasons.push(`New leadership often drives vendor evaluation and technology stack changes.`);
  }

  return reasons.join(" ");
};

export const generateAction = (score, company) => {
  if (score >= 70) {
    return `🔥 Immediate outreach — schedule a discovery call this week. Highlight ROI for ${company.recommendedService}.`;
  } else if (score >= 50) {
    return `📬 Add to nurture sequence — send personalized case study. Target ${company.industry} pain points.`;
  } else {
    return `👁️ Monitor signals — set alert for next funding round or hiring wave. Revisit in 30 days.`;
  }
};

export const processCompanies = () => {
  return companiesRaw
    .map((company) => {
      const score = scoreCompany(company);
      const reason = generateReason(company);
      const action = generateAction(score, company);
      return {
        ...company,
        opportunityScore: score,
        reason,
        recommendedAction: action,
      };
    })
    .sort((a, b) => b.opportunityScore - a.opportunityScore);
};
