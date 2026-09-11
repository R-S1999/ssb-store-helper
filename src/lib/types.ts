export type AttributeKey =
  | "salesAssociate"
  | "customerAlignment"
  | "displayAssortment"
  | "pricingPromotion"
  | "inventoryFulfillment";

export type StatusTone = "strong" | "above" | "opportunity" | "attention";

export type NeedStatus = "Covered" | "Watch" | "Gap";

export type SlotTone = "productive" | "expected" | "below" | "underproductive";

export type Priority = "High" | "Medium" | "Low";

export type SourceKind = "store" | "peer" | "competitor" | "method";

export type Source = {
  label: string;
  href?: string;
  kind: SourceKind;
};

export type Recommendation = {
  action: string;
  why: string;
  topPeer: string;
  competitor: string;
  whatToDo: string;
  priority: Priority;
  sources: Source[];
};

export type StoreIdentity = {
  storeType: string;
  tradeArea: string;
  sellingSpaceSqFt: number;
  mattressSellingSpaceSqFt: number;
  displaySlots: number;
  pricePosition: string;
  brands: string[];
  ssbModels: number;
  householdBase: number;
  medianIncome: number;
  associates: {
    name: string;
    role: string;
    tenureYears: number;
    trainingComplete: boolean;
  }[];
};

export type StoreRecord = {
  id: string;
  alias: string;
  name: string;
  city: string;
  state: string;
  revealName: boolean;
  overallScore: number;
  attributes: Record<AttributeKey, number>;
  identity: StoreIdentity;
};

export type Capability = {
  id: string;
  label: string;
  store: number;
  top: number;
  cluster: number;
  insight: string;
  checklist?: string[];
};

export type CustomerNeed = {
  id: string;
  label: string;
  demand: number;
  coverage: number;
  modelCount: number;
  displayCount: number;
  topPeerMedian: number;
  status: NeedStatus;
};

export type DisplaySlot = {
  id: string;
  row: number;
  col: number;
  product: string;
  need: string;
  monthlyRevenue: number;
  topPeerMedian: number;
  percentile: number;
  daysOnDisplay: number;
  trialRate: number;
  tone: SlotTone;
};

export type PricingMetric = {
  id: string;
  label: string;
  storeValue: string;
  storeNumeric: number;
  peerNumeric: number;
  topNumeric: number;
  format: "currency" | "percent" | "number";
};

export type InventoryMetric = {
  id: string;
  label: string;
  storeValue: string;
  storeNumeric: number;
  peerNumeric: number;
  topNumeric: number;
};

export type ProblemSku = {
  name: string;
  stockOuts: number;
};

export type MarketProfile = {
  annualOpportunity: number;
  currentShare: number;
  remainingOpportunity: number;
  households: number;
  medianIncome: number;
  avgHouseholdSize: number;
  medianAge: number;
  householdGrowth: number;
  newResidentialUnits: number;
  demandDrivers: { label: string; share: number }[];
  needProfile: { label: string; intensity: "High" | "Medium" | "Low" }[];
};
