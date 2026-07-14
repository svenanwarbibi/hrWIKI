export interface ChatSource {
  documentId: string;
  title: string;
  sourceUrl: string;
  chunkExcerpt: string;
  score: number;
}

export interface ExecutiveSummary {
  updatedAt: string;
  headline: string;
  body: string;
  highlights: string[];
}

export interface Kpi {
  id: string;
  label: string;
  value: number;
  unit: string;
  trend: "up" | "down" | "flat";
  changePct: number;
  period: string;
  target?: number;
}

export interface KpiResponse {
  updatedAt: string;
  kpis: Kpi[];
}

interface ContactBase {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface InternalContact extends ContactBase {
  type: "internal";
  department: string;
  photoUrl?: string;
}

export interface ExternalContact extends ContactBase {
  type: "external";
  company: string;
  category: string;
}

export type Contact = InternalContact | ExternalContact;

export interface ContactsResponse {
  updatedAt: string;
  contacts: Contact[];
}

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}
