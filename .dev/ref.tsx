/**
 * API Reference — all available admin endpoints.
 * This file is not routed; it exists as a developer reference only.
 *
 * All endpoints accept Bearer token auth via getAccessToken.
 * Date-filtered endpoints use: start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
 * Account-scoped endpoints use: law_firm_id=<id>
 *
 * Usage:
 *   import { api } from "@/lib/api";
 *   const data = await api("admin/analytics/summary?start_date=2026-01-01&end_date=2026-03-31", getAccessToken);
 */

import { api } from "@/lib/api";

type GetToken = () => string | null;

// ── Analytics ───────────────────────────────────────────────────────

/** GET /admin/analytics/summary?start_date=...&end_date=...&law_firm_id=... (optional) */
export interface AnalyticsSummaryResponse {
  summary: {
    visits: number;
    conversions: number;
    conversion_rate: number;
  };
  month_over_month: {
    previous_period_start: string;
    previous_period_end: string;
    current_period_start: string;
    current_period_end: string;
    previous_visits: number;
    previous_conversions: number;
    previous_conversion_rate: number;
    current_visits: number;
    current_conversions: number;
    current_conversion_rate: number;
    visits_change: number;
    conversions_change: number;
    conversion_rate_change: number;
  };
  series: {
    visits: number[];
    conversions: number[];
  };
}

export async function fetchAnalyticsSummary(getToken: GetToken, dateQuery: string, lawFirmId?: number) {
  const params = [dateQuery, lawFirmId != null ? `law_firm_id=${lawFirmId}` : ""].filter(Boolean).join("&");
  return api<AnalyticsSummaryResponse>(`admin/analytics/summary?${params}`, getToken);
}

/** GET /admin/analytics/chart/leads?start_date=...&end_date=...&law_firm_id=... (optional) */
export interface ChartLeadsResponse {
  totals: {
    visits: number;
    conversions: number;
  };
  series: {
    visits: number[];
    conversions: number[];
  };
  labels: string[];
}

export async function fetchChartLeads(getToken: GetToken, dateQuery: string, lawFirmId?: number) {
  const params = [dateQuery, lawFirmId != null ? `law_firm_id=${lawFirmId}` : ""].filter(Boolean).join("&");
  return api<ChartLeadsResponse>(`admin/analytics/chart/leads?${params}`, getToken);
}

// ── Accounts ────────────────────────────────────────────────────────

/** GET /admin/accounts?start_date=...&end_date=... */
export interface AccountListItem {
  name: string;
  website: string;
  employees: number | null;
  location: string | null;
  visits: number;
  conversions: number;
  conversion_rate: number;
  contract_term: string;
  activation_date: string;
  next_payment_date: string;
  status: "active" | "inactive";
  onboarding_health: "good" | "fair" | "poor";
  performance_health: "good" | "fair" | "poor";
  website_health: "good" | "fair" | "poor";
  practice_areas: string[] | null;
}

export interface AccountListResponse {
  data: AccountListItem[];
}

export async function fetchAccounts(getToken: GetToken, dateQuery: string) {
  return api<AccountListResponse>(`admin/accounts?${dateQuery}`, getToken);
}

/** GET /admin/account?law_firm_id=... */
export interface AccountDetailResponse {
  name: string;
  username: string;
  website: string;
  employees: number;
  location: string;
  marketing_agency: string;
  marketing_spend: number | null;
  contract_term: string;
  activation_date: string;
  next_payment_date: string;
  status: "active" | "inactive";
  onboarding_health: "good" | "fair" | "poor";
  performance_health: "good" | "fair" | "poor";
  website_health: "good" | "fair" | "poor";
  practice_areas: string[] | null;
  integrations: string[] | null;
  tech_stack: string[] | null;
  features: string[] | null;
}

export async function fetchAccountDetail(getToken: GetToken, lawFirmId: number) {
  return api<AccountDetailResponse>(`admin/account?law_firm_id=${lawFirmId}`, getToken);
}

/** GET /admin/account/users?law_firm_id=... */
export interface AccountUser {
  name: string;
  role: string;
  email: string;
  created_date: string;
}

export interface AccountUsersResponse {
  data: AccountUser[];
}

export async function fetchAccountUsers(getToken: GetToken, lawFirmId: number) {
  return api<AccountUsersResponse>(`admin/account/users?law_firm_id=${lawFirmId}`, getToken);
}

// ── Performance ─────────────────────────────────────────────────────

/** GET /admin/account/performance/chart?law_firm_id=...&start_date=...&end_date=... */
export interface PerformanceChartResponse {
  series: {
    current: number[];
    previous: number[];
  };
  labels: string[];
}

export async function fetchPerformanceChart(getToken: GetToken, lawFirmId: number, dateQuery: string) {
  return api<PerformanceChartResponse>(`admin/account/performance/chart?law_firm_id=${lawFirmId}&${dateQuery}`, getToken);
}

/** GET /admin/account/performance/funnels?law_firm_id=...&start_date=...&end_date=... */
export interface PerformanceFunnel {
  name: string;
  visits: number;
  conversions: number;
  conversion_rate: number;
}

export interface PerformanceFunnelsResponse {
  data: PerformanceFunnel[];
}

export async function fetchPerformanceFunnels(getToken: GetToken, lawFirmId: number, dateQuery: string) {
  return api<PerformanceFunnelsResponse>(`admin/account/performance/funnels?law_firm_id=${lawFirmId}&${dateQuery}`, getToken);
}

// ── Website ─────────────────────────────────────────────────────────

/** GET /admin/account/website?law_firm_id=... */
export interface WebsiteStatusResponse {
  status: "live" | "down";
  source_attribution: "enabled" | "disabled";
  link_status: "up" | "down";
  ssl_status: "enabled" | "disabled";
  load_time: number;
  live_links: number;
  live_links_prev: number;
  live_links_change: number;
  integrations: string[] | null;
}

export async function fetchWebsiteStatus(getToken: GetToken, lawFirmId: number) {
  return api<WebsiteStatusResponse>(`admin/account/website?law_firm_id=${lawFirmId}`, getToken);
}

/** GET /admin/account/website/links?law_firm_id=... */
export interface WebsiteLink {
  website_url: string;
  lawbrokr_url: string | null;
  status: "active" | "review" | "broken";
}

export interface WebsiteLinksResponse {
  data: WebsiteLink[];
}

export async function fetchWebsiteLinks(getToken: GetToken, lawFirmId: number) {
  return api<WebsiteLinksResponse>(`admin/account/website/links?law_firm_id=${lawFirmId}`, getToken);
}

// ── Usage ───────────────────────────────────────────────────────────

/** GET /admin/account/usage?law_firm_id=... */
export interface UsageResponse {
  active: boolean;
  funnel_live: boolean;
  lawbrokr_url_live: boolean;
  integrations_active: number;
  users_added: number;
  status: "active" | "inactive";
  contract_term: string;
  activation_date: string;
  next_payment_date: string;
  live_funnels: number;
  live_workflows: number;
}

export async function fetchUsage(getToken: GetToken, lawFirmId: number) {
  return api<UsageResponse>(`admin/account/usage?law_firm_id=${lawFirmId}`, getToken);
}

/** GET /admin/account/usage/users?law_firm_id=... */
export interface UsageUser {
  name: string;
  role: string;
  email: string;
  phone: string;
  last_visit: number;
  latest_interactions: string[] | null;
  lead_notifications: boolean;
  integration_notifications: boolean;
  platform_notifications: boolean;
}

export interface UsageUsersResponse {
  data: UsageUser[];
}

export async function fetchUsageUsers(getToken: GetToken, lawFirmId: number) {
  return api<UsageUsersResponse>(`admin/account/usage/users?law_firm_id=${lawFirmId}`, getToken);
}

/** GET /admin/account/usage/details?law_firm_id=...&start_date=...&end_date=... */
export interface UsageDetailFunnel {
  name: string;
  url: string;
  visits: number;
  conversions: number;
  conversion_rate: number;
  workflows: number;
  created_at: number;
  status: "active" | "inactive";
}

export interface UsageDetailWorkflow {
  name: string;
  url: string;
  questions: number;
  visits: number;
  conversions: number;
  conversion_rate: number;
  completion_time: number;
  created_at: number;
  status: "active" | "inactive";
}

export interface UsageDetailLandingPage {
  name: string;
  url: string;
  visits: number;
  conversions: number;
  conversion_rate: number;
  created_at: number;
  status: "active" | "inactive";
}

export interface UsageDetailAdCampaign {
  name: string;
  url: string;
  impressions: number;
  clicks: number;
  conversions: number;
  click_through_rate: number;
  spend: number;
  created_at: number;
  status: "active" | "inactive";
}

export interface UsageDetailClip {
  name: string;
  clicks: number;
  conversions: number;
  conversion_rate: number;
  created_at: number;
  status: "active" | "inactive";
}

export interface UsageDetailAutomation {
  name: string;
  type: string;
  sent: number;
  open_rate: number;
  created_at: number;
  status: "active" | "inactive";
}

export interface UsageDetailsResponse {
  funnels: UsageDetailFunnel[];
  workflows: UsageDetailWorkflow[];
  landing_pages: UsageDetailLandingPage[];
  ad_campaigns: UsageDetailAdCampaign[];
  clips: UsageDetailClip[];
  automations: UsageDetailAutomation[];
}

export async function fetchUsageDetails(getToken: GetToken, lawFirmId: number, dateQuery: string) {
  return api<UsageDetailsResponse>(`admin/account/usage/details?law_firm_id=${lawFirmId}&${dateQuery}`, getToken);
}
