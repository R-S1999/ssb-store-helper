import type {
  AttributeKey,
  Capability,
  CustomerNeed,
  DisplaySlot,
  InventoryMetric,
  MarketProfile,
  PricingMetric,
  ProblemSku,
  Recommendation,
  SlotTone,
  Source,
  StoreRecord,
} from "@/lib/types";

export const DEFAULT_STORE_ID = "plano";

export const CLUSTER_BENCHMARKS = {
  overallCluster: 74,
  overallTop: 91,
  attributes: {
    salesAssociate: { cluster: 72, top: 88 },
    customerAlignment: { cluster: 74, top: 89 },
    displayAssortment: { cluster: 71, top: 86 },
    pricingPromotion: { cluster: 70, top: 84 },
    inventoryFulfillment: { cluster: 69, top: 87 },
  },
};

export const CLUSTER = {
  id: "suburban-growth-midsize",
  name: "Suburban Growth – Mid-Size Full-Line Retailer",
  description:
    "Independent full-line mattress retailers in growing suburban trade areas with 20–40 display slots and mid-premium price positioning.",
  peerCount: 18,
  methodology: {
    inputs: [
      "Trade-area type and drive-time household base",
      "Selling space and mattress display-slot count",
      "Price-band positioning and brand mix",
      "Store format (full-line independent vs. specialty boutique)",
    ],
    note: "Performance scores are never used to create the peer group. Clustering uses structural and market characteristics only, so stores are compared with genuine lookalikes.",
    period: "Trailing 12 months ending Aug 2026",
    refreshed: "8 Sep 2026",
    confidence: "Medium" as const,
  },
};

export const ATTRIBUTE_META: Record<
  AttributeKey,
  { label: string; href: string; icon: string; question: string; blurb: string; profileInsight: string }
> = {
  salesAssociate: {
    label: "Sales Associate Effectiveness",
    href: "/store-performance/sales-associate",
    icon: "users",
    question: "What behaviors separate my sales associates from high-performing stores?",
    blurb: "Knowledge, selling quality and customer discovery",
    profileInsight:
      "Associates know the products, but top stores perform better in needs discovery and objection handling.",
  },
  customerAlignment: {
    label: "Customer Alignment",
    href: "/store-performance/customer-alignment",
    icon: "target",
    question: "Does the assortment reflect what shoppers in this market actually need?",
    blurb: "How well your assortment matches local customer needs",
    profileInsight: "Your assortment closely matches the dominant customer needs in your market.",
  },
  displayAssortment: {
    label: "Display & Assortment",
    href: "/store-performance/display-assortment",
    icon: "layout",
    question: "Are scarce showroom positions occupied by the right products?",
    blurb: "Display productivity, assortment mix and showroom execution",
    profileInsight:
      "Several display slots are underproductive and some high-demand needs are underrepresented.",
  },
  pricingPromotion: {
    label: "Pricing & Promotion",
    href: "/store-performance/pricing-promotion",
    icon: "tag",
    question: "Are we creating enough customer value while protecting revenue and margin?",
    blurb: "Price positioning, promotions and value realization",
    profileInsight: "Promotional participation is strong, but premium step-up conversion can improve.",
  },
  inventoryFulfillment: {
    label: "Inventory & Fulfillment",
    href: "/store-performance/inventory-fulfillment",
    icon: "truck",
    question: "Can the store deliver what the shopper wants, when the shopper wants it?",
    blurb: "Availability, stock flow and delivery readiness",
    profileInsight: "Frequent stock-outs and slower delivery times are limiting demand capture.",
  },
};

export const COMPETITOR_SOURCES: Source[] = [
  {
    label: "Mattress Firm BedEd",
    href: "https://www.mattressfirm.com/beded",
    kind: "competitor",
  },
  {
    label: "Tempur-Pedic Stores",
    href: "https://www.tempurpedic.com/tempur-pedic-stores/",
    kind: "competitor",
  },
  {
    label: "Mattress Firm Delivery Tracking",
    href: "https://www.mattressfirm.com/track",
    kind: "competitor",
  },
];

const identityBase = {
  storeType: "Full-Line Furniture + Mattress",
  tradeArea: "Suburban Growth",
  sellingSpaceSqFt: 9800,
  mattressSellingSpaceSqFt: 3400,
  displaySlots: 31,
  pricePosition: "Mid-Premium",
  brands: ["Serta", "Beautyrest", "Tempur", "Private label", "Hybrid Co.", "CoolSleep", "ValueRest"],
  ssbModels: 12,
};

function associates(
  names: { name: string; tenureYears: number; trainingComplete: boolean; trainingPct?: number }[],
): StoreRecord["identity"]["associates"] {
  return names.map((n) => ({
    ...n,
    role: "Sales Associate",
    trainingPct: n.trainingPct ?? (n.trainingComplete ? 100 : 70),
    initials: n.name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .replace(".", ""),
  }));
}

export const STORES: StoreRecord[] = [
  {
    id: "s01",
    alias: "Peer 01",
    name: "Restwell Gallery",
    city: "Frisco",
    state: "TX",
    revealName: false,
    overallScore: 91,
    attributes: {
      salesAssociate: 90,
      customerAlignment: 89,
      displayAssortment: 88,
      pricingPromotion: 86,
      inventoryFulfillment: 90,
    },
    identity: {
      ...identityBase,
      householdBase: 51200,
      medianIncome: 118000,
      associates: associates([
        { name: "Alex P.", tenureYears: 6.1, trainingComplete: true },
        { name: "Priya K.", tenureYears: 4.2, trainingComplete: true },
        { name: "Noah B.", tenureYears: 3.8, trainingComplete: true },
        { name: "Elena V.", tenureYears: 2.4, trainingComplete: true },
        { name: "Chris T.", tenureYears: 5.0, trainingComplete: true },
      ]),
    },
  },
  {
    id: "s02",
    alias: "Peer 02",
    name: "Summit Sleep Co.",
    city: "McKinney",
    state: "TX",
    revealName: false,
    overallScore: 88,
    attributes: {
      salesAssociate: 87,
      customerAlignment: 88,
      displayAssortment: 86,
      pricingPromotion: 84,
      inventoryFulfillment: 88,
    },
    identity: {
      ...identityBase,
      householdBase: 49800,
      medianIncome: 112000,
      associates: associates([
        { name: "Jordan L.", tenureYears: 7.0, trainingComplete: true },
        { name: "Maya S.", tenureYears: 3.1, trainingComplete: true },
        { name: "Owen R.", tenureYears: 2.0, trainingComplete: true },
        { name: "Ivy C.", tenureYears: 4.6, trainingComplete: true },
        { name: "Luke H.", tenureYears: 1.8, trainingComplete: true },
      ]),
    },
  },
  {
    id: "s03",
    alias: "Peer 03",
    name: "Northstar Bedding",
    city: "Allen",
    state: "TX",
    revealName: false,
    overallScore: 85,
    attributes: {
      salesAssociate: 84,
      customerAlignment: 86,
      displayAssortment: 83,
      pricingPromotion: 82,
      inventoryFulfillment: 85,
    },
    identity: {
      ...identityBase,
      displaySlots: 34,
      householdBase: 47600,
      medianIncome: 108000,
      associates: associates([
        { name: "Harper D.", tenureYears: 5.5, trainingComplete: true },
        { name: "Theo M.", tenureYears: 2.7, trainingComplete: true },
        { name: "Nina F.", tenureYears: 3.3, trainingComplete: true },
        { name: "Ryan Q.", tenureYears: 1.4, trainingComplete: false },
        { name: "Sofia W.", tenureYears: 4.1, trainingComplete: true },
      ]),
    },
  },
  {
    id: "s04",
    alias: "Peer 04",
    name: "Lakeside Mattress",
    city: "The Colony",
    state: "TX",
    revealName: false,
    overallScore: 81,
    attributes: {
      salesAssociate: 78,
      customerAlignment: 84,
      displayAssortment: 80,
      pricingPromotion: 80,
      inventoryFulfillment: 79,
    },
    identity: {
      ...identityBase,
      householdBase: 45200,
      medianIncome: 101000,
      associates: associates([
        { name: "Ben A.", tenureYears: 4.0, trainingComplete: true },
        { name: "Clara J.", tenureYears: 2.2, trainingComplete: true },
        { name: "Diego N.", tenureYears: 6.4, trainingComplete: true },
        { name: "Emma G.", tenureYears: 1.1, trainingComplete: false },
        { name: "Finn K.", tenureYears: 3.6, trainingComplete: true },
      ]),
    },
  },
  {
    id: "s05",
    alias: "Peer 05",
    name: "Parkway Sleep Studio",
    city: "Lewisville",
    state: "TX",
    revealName: false,
    overallScore: 78,
    attributes: {
      salesAssociate: 74,
      customerAlignment: 81,
      displayAssortment: 76,
      pricingPromotion: 79,
      inventoryFulfillment: 75,
    },
    identity: {
      ...identityBase,
      householdBase: 44100,
      medianIncome: 99000,
      associates: associates([
        { name: "Grace O.", tenureYears: 3.9, trainingComplete: true },
        { name: "Henry P.", tenureYears: 2.5, trainingComplete: true },
        { name: "Isla R.", tenureYears: 1.7, trainingComplete: true },
        { name: "Jack S.", tenureYears: 5.2, trainingComplete: true },
        { name: "Kate U.", tenureYears: 0.9, trainingComplete: false },
      ]),
    },
  },
  {
    id: "s06",
    alias: "Peer 06",
    name: "Cedar Home Sleep",
    city: "Little Elm",
    state: "TX",
    revealName: false,
    overallScore: 75,
    attributes: {
      salesAssociate: 70,
      customerAlignment: 79,
      displayAssortment: 73,
      pricingPromotion: 77,
      inventoryFulfillment: 71,
    },
    identity: {
      ...identityBase,
      householdBase: 42800,
      medianIncome: 97000,
      associates: associates([
        { name: "Liam V.", tenureYears: 4.4, trainingComplete: true },
        { name: "Mia W.", tenureYears: 2.8, trainingComplete: true },
        { name: "Nate X.", tenureYears: 1.5, trainingComplete: false },
        { name: "Olive Y.", tenureYears: 3.2, trainingComplete: true },
        { name: "Paul Z.", tenureYears: 6.0, trainingComplete: true },
      ]),
    },
  },
  {
    id: "plano",
    alias: "Your Store",
    name: "Mattress World",
    city: "Plano",
    state: "TX",
    revealName: true,
    overallScore: 72,
    attributes: {
      salesAssociate: 64,
      customerAlignment: 82,
      displayAssortment: 68,
      pricingPromotion: 76,
      inventoryFulfillment: 61,
    },
    identity: {
      ...identityBase,
      householdBase: 48200,
      medianIncome: 96000,
      associates: associates([
        { name: "Sarah M.", tenureYears: 2.5, trainingComplete: true, trainingPct: 100 },
        { name: "John D.", tenureYears: 1.8, trainingComplete: true, trainingPct: 80 },
        { name: "Maria R.", tenureYears: 4.2, trainingComplete: true, trainingPct: 100 },
        { name: "David L.", tenureYears: 1.1, trainingComplete: false, trainingPct: 60 },
        { name: "Amy P.", tenureYears: 3.0, trainingComplete: true, trainingPct: 80 },
      ]),
    },
  },
  {
    id: "s08",
    alias: "Peer 08",
    name: "Hometown Mattress",
    city: "Richardson",
    state: "TX",
    revealName: false,
    overallScore: 70,
    attributes: {
      salesAssociate: 66,
      customerAlignment: 76,
      displayAssortment: 69,
      pricingPromotion: 72,
      inventoryFulfillment: 67,
    },
    identity: {
      ...identityBase,
      householdBase: 46900,
      medianIncome: 94000,
      associates: associates([
        { name: "Quinn A.", tenureYears: 2.9, trainingComplete: true },
        { name: "Rita B.", tenureYears: 4.7, trainingComplete: true },
        { name: "Sam C.", tenureYears: 1.0, trainingComplete: false },
        { name: "Tess D.", tenureYears: 3.5, trainingComplete: true },
        { name: "Uri E.", tenureYears: 6.2, trainingComplete: true },
      ]),
    },
  },
  {
    id: "s09",
    alias: "Peer 09",
    name: "Prairie Sleep Shop",
    city: "Wylie",
    state: "TX",
    revealName: false,
    overallScore: 68,
    attributes: {
      salesAssociate: 63,
      customerAlignment: 74,
      displayAssortment: 66,
      pricingPromotion: 71,
      inventoryFulfillment: 65,
    },
    identity: {
      ...identityBase,
      displaySlots: 28,
      householdBase: 40100,
      medianIncome: 91000,
      associates: associates([
        { name: "Vera F.", tenureYears: 3.0, trainingComplete: true },
        { name: "Will G.", tenureYears: 2.4, trainingComplete: true },
        { name: "Xena H.", tenureYears: 5.1, trainingComplete: true },
        { name: "Yves I.", tenureYears: 1.6, trainingComplete: false },
        { name: "Zoe J.", tenureYears: 4.8, trainingComplete: true },
      ]),
    },
  },
  {
    id: "s10",
    alias: "Peer 10",
    name: "Bluebonnet Bedding",
    city: "Murphy",
    state: "TX",
    revealName: false,
    overallScore: 66,
    attributes: {
      salesAssociate: 62,
      customerAlignment: 72,
      displayAssortment: 64,
      pricingPromotion: 69,
      inventoryFulfillment: 63,
    },
    identity: {
      ...identityBase,
      householdBase: 38800,
      medianIncome: 102000,
      associates: associates([
        { name: "Ava K.", tenureYears: 2.6, trainingComplete: true },
        { name: "Blake L.", tenureYears: 3.8, trainingComplete: true },
        { name: "Cora M.", tenureYears: 1.2, trainingComplete: false },
        { name: "Drew N.", tenureYears: 4.9, trainingComplete: true },
        { name: "Eve O.", tenureYears: 2.0, trainingComplete: true },
      ]),
    },
  },
  {
    id: "s11",
    alias: "Peer 11",
    name: "Crossroads Comfort",
    city: "Garland",
    state: "TX",
    revealName: false,
    overallScore: 64,
    attributes: {
      salesAssociate: 60,
      customerAlignment: 70,
      displayAssortment: 63,
      pricingPromotion: 67,
      inventoryFulfillment: 62,
    },
    identity: {
      ...identityBase,
      householdBase: 52000,
      medianIncome: 78000,
      associates: associates([
        { name: "Felix P.", tenureYears: 5.3, trainingComplete: true },
        { name: "Gia Q.", tenureYears: 2.3, trainingComplete: true },
        { name: "Hugo R.", tenureYears: 0.8, trainingComplete: false },
        { name: "Iris S.", tenureYears: 3.7, trainingComplete: true },
        { name: "Joel T.", tenureYears: 4.2, trainingComplete: true },
      ]),
    },
  },
  {
    id: "s12",
    alias: "Peer 12",
    name: "Fairview Sleep House",
    city: "Fairview",
    state: "TX",
    revealName: false,
    overallScore: 63,
    attributes: {
      salesAssociate: 59,
      customerAlignment: 71,
      displayAssortment: 61,
      pricingPromotion: 66,
      inventoryFulfillment: 60,
    },
    identity: {
      ...identityBase,
      householdBase: 35600,
      medianIncome: 115000,
      associates: associates([
        { name: "Kira U.", tenureYears: 3.1, trainingComplete: true },
        { name: "Leo V.", tenureYears: 1.9, trainingComplete: true },
        { name: "Mira W.", tenureYears: 6.6, trainingComplete: true },
        { name: "Nico X.", tenureYears: 2.7, trainingComplete: true },
        { name: "Opal Y.", tenureYears: 1.0, trainingComplete: false },
      ]),
    },
  },
  {
    id: "s13",
    alias: "Peer 13",
    name: "Midway Mattress",
    city: "Carrollton",
    state: "TX",
    revealName: false,
    overallScore: 61,
    attributes: {
      salesAssociate: 57,
      customerAlignment: 68,
      displayAssortment: 60,
      pricingPromotion: 64,
      inventoryFulfillment: 58,
    },
    identity: {
      ...identityBase,
      householdBase: 43400,
      medianIncome: 88000,
      associates: associates([
        { name: "Pia Z.", tenureYears: 4.1, trainingComplete: true },
        { name: "Quinn B.", tenureYears: 2.2, trainingComplete: false },
        { name: "Rosa C.", tenureYears: 3.4, trainingComplete: true },
        { name: "Seth D.", tenureYears: 5.7, trainingComplete: true },
        { name: "Tia E.", tenureYears: 1.4, trainingComplete: true },
      ]),
    },
  },
  {
    id: "s14",
    alias: "Peer 14",
    name: "Oakmont Sleep",
    city: "Flower Mound",
    state: "TX",
    revealName: false,
    overallScore: 59,
    attributes: {
      salesAssociate: 55,
      customerAlignment: 66,
      displayAssortment: 58,
      pricingPromotion: 62,
      inventoryFulfillment: 56,
    },
    identity: {
      ...identityBase,
      householdBase: 41200,
      medianIncome: 121000,
      associates: associates([
        { name: "Uma F.", tenureYears: 2.8, trainingComplete: true },
        { name: "Vince G.", tenureYears: 3.6, trainingComplete: true },
        { name: "Willa H.", tenureYears: 1.1, trainingComplete: false },
        { name: "Xander I.", tenureYears: 4.5, trainingComplete: true },
        { name: "Yara J.", tenureYears: 6.1, trainingComplete: true },
      ]),
    },
  },
  {
    id: "s15",
    alias: "Peer 15",
    name: "Ridgeview Rest",
    city: "Prosper",
    state: "TX",
    revealName: false,
    overallScore: 58,
    attributes: {
      salesAssociate: 54,
      customerAlignment: 65,
      displayAssortment: 57,
      pricingPromotion: 60,
      inventoryFulfillment: 55,
    },
    identity: {
      ...identityBase,
      householdBase: 37200,
      medianIncome: 132000,
      associates: associates([
        { name: "Zane K.", tenureYears: 3.3, trainingComplete: true },
        { name: "Ada L.", tenureYears: 2.0, trainingComplete: true },
        { name: "Beau M.", tenureYears: 5.4, trainingComplete: true },
        { name: "Cleo N.", tenureYears: 0.7, trainingComplete: false },
        { name: "Dex O.", tenureYears: 4.0, trainingComplete: true },
      ]),
    },
  },
  {
    id: "s16",
    alias: "Peer 16",
    name: "Town Square Bedding",
    city: "Celina",
    state: "TX",
    revealName: false,
    overallScore: 57,
    attributes: {
      salesAssociate: 53,
      customerAlignment: 64,
      displayAssortment: 56,
      pricingPromotion: 59,
      inventoryFulfillment: 54,
    },
    identity: {
      ...identityBase,
      displaySlots: 26,
      householdBase: 33400,
      medianIncome: 109000,
      associates: associates([
        { name: "Eden P.", tenureYears: 2.5, trainingComplete: true },
        { name: "Ford Q.", tenureYears: 3.9, trainingComplete: true },
        { name: "Gwen R.", tenureYears: 1.8, trainingComplete: false },
        { name: "Hank S.", tenureYears: 4.3, trainingComplete: true },
        { name: "Ivy T.", tenureYears: 5.6, trainingComplete: true },
      ]),
    },
  },
  {
    id: "s17",
    alias: "Peer 17",
    name: "Eastgate Mattress",
    city: "Rowlett",
    state: "TX",
    revealName: false,
    overallScore: 55,
    attributes: {
      salesAssociate: 51,
      customerAlignment: 62,
      displayAssortment: 54,
      pricingPromotion: 57,
      inventoryFulfillment: 52,
    },
    identity: {
      ...identityBase,
      householdBase: 39800,
      medianIncome: 86000,
      associates: associates([
        { name: "Jules U.", tenureYears: 3.7, trainingComplete: true },
        { name: "Kara V.", tenureYears: 1.5, trainingComplete: false },
        { name: "Lars W.", tenureYears: 4.8, trainingComplete: true },
        { name: "Mona X.", tenureYears: 2.9, trainingComplete: true },
        { name: "Ned Y.", tenureYears: 6.3, trainingComplete: true },
      ]),
    },
  },
  {
    id: "s18",
    alias: "Peer 18",
    name: "Southfork Sleep",
    city: "Sachse",
    state: "TX",
    revealName: false,
    overallScore: 54,
    attributes: {
      salesAssociate: 50,
      customerAlignment: 61,
      displayAssortment: 53,
      pricingPromotion: 56,
      inventoryFulfillment: 51,
    },
    identity: {
      ...identityBase,
      householdBase: 34100,
      medianIncome: 99000,
      associates: associates([
        { name: "Ora Z.", tenureYears: 2.1, trainingComplete: true },
        { name: "Pete A.", tenureYears: 3.2, trainingComplete: true },
        { name: "Quincy B.", tenureYears: 1.3, trainingComplete: false },
        { name: "Rae C.", tenureYears: 5.0, trainingComplete: true },
        { name: "Sid D.", tenureYears: 4.4, trainingComplete: true },
      ]),
    },
  },
];

export const PLANO_CAPABILITIES: Capability[] = [
  {
    id: "need-recognition",
    label: "Need Recognition",
    store: 58,
    cluster: 71,
    top: 91,
    insight: "Associates inconsistently ask about sleeping position, pain and temperature before recommending a product.",
    checklist: [
      "Current mattress problem",
      "Sleeping position",
      "Pain / pressure points",
      "Hot sleeping",
      "Partner disturbance",
      "Desired firmness / support",
      "Budget",
    ],
  },
  {
    id: "sleep-knowledge",
    label: "Sleep & Comfort Knowledge",
    store: 74,
    cluster: 80,
    top: 90,
    insight: "Comfort language is present, but cooling and pressure-relief coaching varies by associate.",
  },
  {
    id: "product-knowledge",
    label: "Product Knowledge",
    store: 84,
    cluster: 86,
    top: 93,
    insight: "Strongest capability. Associates can explain construction and brand differences with confidence.",
  },
  {
    id: "feature-benefit",
    label: "Feature → Benefit",
    store: 61,
    cluster: 73,
    top: 89,
    insight: "Features are listed more often than translated into the shopper's sleep outcome.",
  },
  {
    id: "objection-handling",
    label: "Objection Handling",
    store: 56,
    cluster: 70,
    top: 87,
    insight: "Price and 'I need to think about it' objections frequently end the consult without a next step.",
  },
  {
    id: "premium-step-up",
    label: "Premium Step-Up",
    store: 59,
    cluster: 68,
    top: 83,
    insight: "Customers often buy within the first tier shown rather than a need-matched Good / Better / Best path.",
  },
];

export const PLANO_NEEDS: CustomerNeed[] = [
  { id: "pressure", label: "Pressure / Pain Relief", demand: 88, coverage: 84, modelCount: 7, displayCount: 6, topPeerMedian: 90, status: "Covered" },
  { id: "cooling", label: "Cooling", demand: 86, coverage: 58, modelCount: 3, displayCount: 2, topPeerMedian: 82, status: "Gap" },
  { id: "couples", label: "Couples / Motion Isolation", demand: 74, coverage: 70, modelCount: 4, displayCount: 3, topPeerMedian: 78, status: "Watch" },
  { id: "value", label: "Value / Budget", demand: 81, coverage: 62, modelCount: 4, displayCount: 3, topPeerMedian: 76, status: "Gap" },
  { id: "premium", label: "Premium Comfort", demand: 69, coverage: 80, modelCount: 6, displayCount: 7, topPeerMedian: 77, status: "Covered" },
  { id: "adjustable", label: "Adjustable / Mobility", demand: 54, coverage: 61, modelCount: 3, displayCount: 3, topPeerMedian: 58, status: "Covered" },
];

const SLOT_PRODUCTS = [
  ["Beautyrest Black Series 3", "Pressure / Pain Relief"],
  ["Serta Perfect Sleeper Cooling", "Cooling"],
  ["Tempur-Adapt Medium", "Pressure / Pain Relief"],
  ["Serta iComfort Hybrid", "Premium Comfort"],
  ["Private Label Value Firm", "Value / Budget"],
  ["Beautyrest PressureSmart", "Pressure / Pain Relief"],
  ["Serta Pillow Top Plush", "Premium Comfort"],
  ["Hybrid CoolMax Queen", "Cooling"],
  ["Motion-Isolation Euro Top", "Couples / Motion Isolation"],
  ["Adjustable Base Demo 1", "Adjustable / Mobility"],
  ["Serta Perfect Day", "Value / Budget"],
  ["Beautyrest Silver Hybrid", "Premium Comfort"],
  ["Gel Memory Foam Firm", "Pressure / Pain Relief"],
  ["Serta Nightbed Copper", "Cooling"],
  ["Latex Hybrid Plush", "Premium Comfort"],
  ["Kids / Guest Firm", "Value / Budget"],
  ["Split-King Motion Set", "Couples / Motion Isolation"],
  ["Adjustable Base Demo 2", "Adjustable / Mobility"],
  ["Serta Pedic Hybrid", "Premium Comfort"],
  ["Beautyrest Harmony Lux", "Pressure / Pain Relief"],
  ["Budget Innerspring", "Value / Budget"],
  ["Cooling Graphene Hybrid", "Cooling"],
  ["Pillow Top Duplicate A", "Premium Comfort"],
  ["Pillow Top Duplicate B", "Premium Comfort"],
  ["Serta iSeries Firm", "Pressure / Pain Relief"],
  ["Hybrid Mid-Premium", "Premium Comfort"],
  ["Value Tight Top", "Value / Budget"],
  ["Couples Pocket Coil", "Couples / Motion Isolation"],
  ["Showroom Clearance Unit", "Value / Budget"],
  ["Aged Floor Model 14mo", "Premium Comfort"],
  ["Orphan King Display", "Premium Comfort"],
];

function slotTone(index: number): SlotTone {
  if ([22, 23, 28, 29, 30].includes(index)) return "underproductive";
  if ([7, 13, 21].includes(index)) return "below";
  if ([0, 1, 2, 5, 8].includes(index)) return "productive";
  return "expected";
}

export const PLANO_SLOTS: DisplaySlot[] = SLOT_PRODUCTS.map(([product, need], index) => {
  const tone = slotTone(index);
  const revenue =
    tone === "productive" ? 42000 - index * 400 :
    tone === "expected" ? 24800 - index * 180 :
    tone === "below" ? 16200 - index * 80 :
    7400 - index * 40;
  return {
    id: `slot-${index + 1}`,
    row: Math.floor(index / 7),
    col: index % 7,
    product,
    need,
    monthlyRevenue: Math.max(4200, revenue),
    topPeerMedian: 26800,
    percentile: tone === "productive" ? 82 : tone === "expected" ? 51 : tone === "below" ? 28 : 9,
    daysOnDisplay: tone === "underproductive" ? 280 + index : 60 + index * 4,
    trialRate: tone === "productive" ? 0.34 : tone === "underproductive" ? 0.07 : 0.18,
    tone,
  };
});

export const PLANO_PRICING: PricingMetric[] = [
  { id: "asp", label: "Average Selling Price", storeValue: "$1,640", storeNumeric: 1640, peerNumeric: 1580, topNumeric: 1890, format: "currency" },
  { id: "realization", label: "Price Realization", storeValue: "96%", storeNumeric: 96, peerNumeric: 94, topNumeric: 98, format: "percent" },
  { id: "discount", label: "Average Discount", storeValue: "18%", storeNumeric: 18, peerNumeric: 19, topNumeric: 16, format: "percent" },
  { id: "stepup", label: "Premium Step-Up", storeValue: "21%", storeNumeric: 21, peerNumeric: 28, topNumeric: 39, format: "percent" },
  { id: "financing", label: "Financing Utilization", storeValue: "17%", storeNumeric: 17, peerNumeric: 22, topNumeric: 31, format: "percent" },
];

export const PLANO_INVENTORY: InventoryMetric[] = [
  { id: "instock", label: "In-Stock Rate", storeValue: "89%", storeNumeric: 89, peerNumeric: 94, topNumeric: 98 },
  { id: "stockout", label: "Stock-Out Rate", storeValue: "11%", storeNumeric: 11, peerNumeric: 6, topNumeric: 2 },
  { id: "fill", label: "Order Fill Rate", storeValue: "91%", storeNumeric: 91, peerNumeric: 96, topNumeric: 99 },
  { id: "lead", label: "Delivery Lead Time", storeValue: "4.8 days", storeNumeric: 4.8, peerNumeric: 3.1, topNumeric: 1.8 },
  { id: "turns", label: "Inventory Turns", storeValue: "3.8x", storeNumeric: 3.8, peerNumeric: 4.4, topNumeric: 5.2 },
  { id: "slow", label: "Slow Movers", storeValue: "17%", storeNumeric: 17, peerNumeric: 12, topNumeric: 6 },
];

export const PLANO_SKUS: ProblemSku[] = [
  { name: "Beautyrest X", stockOuts: 8, lostSalesShare: 32 },
  { name: "Serta Y", stockOuts: 6, lostSalesShare: 24 },
  { name: "Serta Z", stockOuts: 5, lostSalesShare: 19 },
];

export const PLANO_MARKET: MarketProfile = {
  annualOpportunity: 21_400_000,
  currentShare: 0.087,
  remainingOpportunity: 19_500_000,
  households: 48200,
  medianIncome: 96000,
  avgHouseholdSize: 2.7,
  medianAge: 42,
  householdGrowth: 0.068,
  newResidentialUnits: 1240,
  demandDrivers: [
    { label: "Existing household replacement", share: 68 },
    { label: "New households", share: 17 },
    { label: "Recent movers", share: 10 },
    { label: "Other drivers", share: 5 },
  ],
  needProfile: [
    { label: "Cooling", intensity: "High" },
    { label: "Pressure Relief", intensity: "High" },
    { label: "Value", intensity: "High" },
    { label: "Couples", intensity: "Medium" },
    { label: "Premium", intensity: "Medium" },
  ],
};

export const RECOMMENDATIONS: Record<AttributeKey | "market", Recommendation> = {
  salesAssociate: {
    action: "Introduce a structured five-question sleep-needs discovery routine",
    why: "Need Recognition is 58 vs. 91 for top peer stores, and mystery shopping shows inconsistent discovery of sleeping position, pain and temperature.",
    topPeer: "Top peer stores consistently identify more sleep needs before recommending product, then match Good / Better / Best options to those needs.",
    competitor:
      "Mattress Firm BedEd positions trained Sleep Experts around mattress type, features and sleep preferences. Tempur-Pedic flagship stores sell a guided, one-on-one complete sleep-system consultation.",
    whatToDo:
      "Require every consult to capture five needs: current problem, sleeping position, pain/pressure, temperature, and budget — before walking a customer to a bed.",
    priority: "High",
    sources: [
      { label: "Mystery Shop", kind: "store" },
      { label: "Associate Assessment", kind: "store" },
      { label: "POS Conversion", kind: "store" },
      { label: "Top Peers", kind: "peer" },
      ...COMPETITOR_SOURCES.slice(0, 2),
    ],
  },
  customerAlignment: {
    action: "Expand Cooling coverage in the mid-premium $1,500–$2,500 band",
    why: "Cooling demand is high in this trade area while assortment coverage sits at 58 vs. a top-peer median of 82.",
    topPeer: "Top stores carry and display more cooling options across price bands, not only at the premium end.",
    competitor:
      "Leading retailers merchandise cooling, pressure relief and motion separation as guided sleep benefits rather than construction features.",
    whatToDo:
      "Add two cooling models in the mid-premium range and give one high-traffic display slot to a differentiated cooling proposition for 60 days.",
    priority: "High",
    sources: [
      { label: "Customer Survey", kind: "store" },
      { label: "Local Search / Site Behavior", kind: "store" },
      { label: "Sales + Product Master", kind: "store" },
      { label: "Top Peers", kind: "peer" },
      COMPETITOR_SOURCES[1],
    ],
  },
  displayAssortment: {
    action: "Replace Display 14 with a Differentiated Cooling Proposition",
    why: "Cooling is a high-demand need in your market and this display is significantly below top-peer productivity.",
    topPeer: "Top stores feature cooling-focused models in 80% of similar display positions.",
    competitor:
      "Leading mattress retailers use showroom space to clearly differentiate sleep benefits and encourage guided in-store trial.",
    whatToDo:
      "Replace with a differentiated cooling mattress. Add clear benefit messaging. Enable associate guided trial.",
    priority: "High",
    sources: [
      { label: "Display Productivity", kind: "store" },
      { label: "Merchandising Audit", kind: "store" },
      { label: "Sales History", kind: "store" },
      { label: "Customer Need Map", kind: "store" },
    ],
  },
  pricingPromotion: {
    action: "Standardize a Good / Better / Best demonstration linked to the customer's identified need",
    why: "Premium step-up is 21% vs. 39% for top stores, while discounting is already in line with peers.",
    topPeer: "Top stores convert more customers into premium propositions without materially higher discounting.",
    competitor:
      "Tempur-Pedic and Mattress Firm Sleep Experts sell a complete sleep system and communicate financing as part of a guided consultation, not a last-minute close.",
    whatToDo:
      "After needs discovery, always show three need-matched options. Lead with the middle recommendation and present financing before discounting.",
    priority: "Medium",
    sources: [
      { label: "POS Mix", kind: "store" },
      { label: "Promotion Calendar", kind: "store" },
      { label: "Top Peers", kind: "peer" },
      ...COMPETITOR_SOURCES.slice(0, 2),
    ],
  },
  inventoryFulfillment: {
    action: "Protect Availability of Highest-Demand Models",
    why: "High-demand models drive a disproportionate share of traffic and sales when they are available.",
    topPeer: "Leading stores maintain 95%+ in-stock rates on key models and average 2–3 day delivery lead times.",
    competitor:
      "Leading mattress retailers make delivery and fulfillment part of the customer promise, including delivery visibility and white-glove service.",
    whatToDo:
      "Prioritize inventory for top demand models. Set in-stock alerts and replenishment rules. Improve delivery scheduling and visibility. Track and review stock-outs weekly.",
    priority: "High",
    sources: [
      { label: "Inventory", kind: "store" },
      { label: "Orders", kind: "store" },
      { label: "POS", kind: "store" },
      { label: "Delivery", kind: "store" },
    ],
  },
  market: {
    action: "Expand cooling in the $1,500–$2,500 band to capture unmet local demand",
    why: "Local demand for Cooling, Pressure Relief and Value is high, while current estimated share is only 8.7% of a $21.4M illustrative opportunity.",
    topPeer: "Comparable top stores convert more of the same suburban replacement and new-household demand by matching assortment and consultative selling to those needs.",
    competitor:
      "National leaders treat cooling and pressure relief as differentiated sleep benefits and support the sale with guided consultation plus visible fulfillment.",
    whatToDo:
      "Pair the cooling assortment expansion with the five-question discovery routine and protect in-stock on those hero models for the next two quarters.",
    priority: "High",
    sources: [
      { label: "Trade Area Demographics", kind: "method" },
      { label: "Store Performance", kind: "store" },
      { label: "Top Peers", kind: "peer" },
      ...COMPETITOR_SOURCES,
    ],
  },
};

export const DISPLAY_AUDIT = [
  { label: "Signage clarity", pass: false },
  { label: "Product differentiation", pass: false },
  { label: "Feature visibility", pass: true },
  { label: "Ability to touch / demo", pass: true },
  { label: "Bedroom-like presentation", pass: false },
  { label: "Cleanliness", pass: true },
];
