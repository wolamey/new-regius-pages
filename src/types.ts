export type OfferCode =
  | "production_control"
  | "order_1c_automation"
  | "sales_intelligence"
  | "bitrix24_business_result";

export type PageKind = "production" | "orders" | "sales" | "bitrix";

export interface FaqItem {
  question: string;
  answer: string; 
}

export interface PageContent {
  kind: PageKind;
  offerCode: OfferCode;
  path: string;
  navLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  trustLine: string;
  problemLead: string;
  problems: Array<{ title: string; text: string }>;
  costLead: string;
  beforeAfter: Array<{ before: string; after: string }>;
  caseStudy: {
    label: string;
    title: string;
    summary: string;
    metrics: Array<{ value: string; label: string; note?: string }>;
    limitations: string;
  };
  firstStage: string;
  formSpecificFields: Array<{
    name: string;
    label: string;
    type?: "text" | "number" | "select";
    options?: string[];
    placeholder?: string;
  }>;
  faq: FaqItem[];
  seo: {
    title: string;
    description: string;
  };
}
