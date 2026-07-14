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

export type ProjectStatus = "in_progress" | "completed" | "planned";

export interface ProjectSummary {
  id: string;
  slug: string;
  title: string;
  client: string;
  category: string;
  status: ProjectStatus;
  thumbnailUrl?: string;
}

export interface ProjectListResponse {
  updatedAt: string;
  projects: ProjectSummary[];
}

export interface ProjectExecutiveSummary {
  aufgabe: string;
  herausforderungen: string;
  ergebnis: string;
}

export interface ProjectBudget {
  currency: string;
  plan: number;
  actual: number | null;
}

export interface ExternalProvider {
  id: string;
  name: string;
  category: string;
  address: string;
}

export interface InternalStaffMember {
  id: string;
  name: string;
  role: string;
}

export interface ProjectKpis {
  client: string;
  startDate: string;
  endDate: string;
  budget: ProjectBudget;
  externalProviders: ExternalProvider[];
  internalStaff: InternalStaffMember[];
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  updatedAt: string;
  executiveSummary: ProjectExecutiveSummary;
  kpis: ProjectKpis;
}
