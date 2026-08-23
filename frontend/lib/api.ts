// ===================================================
// CARBONLOOP — Frontend API Client Service
// With resilient live-API + demo-fallback switching
// ===================================================

import { Asset, Department, ShortageRequest, ImpactMetrics } from "@/types";
import { MOCK_DEPARTMENTS, MOCK_IMPACT_METRICS } from "./mockData";
import { MOCK_ASSETS } from "./mockAssets";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

/**
 * Fetch all departments with live telemetry
 */
export async function fetchDepartments(): Promise<Department[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/departments`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch departments from backend");
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn("⚠️ [API Fallback]: Backend unreachable, using synthetic department dataset.", err);
    return MOCK_DEPARTMENTS;
  }
}

/**
 * Fetch assets with optional filters
 */
export async function fetchAssets(filters?: {
  category?: string;
  condition?: string;
  department?: string;
  status?: string;
  action?: string;
  search?: string;
}): Promise<Asset[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.category && filters.category !== "ALL") params.append("category", filters.category);
    if (filters?.condition && filters.condition !== "ALL") params.append("condition", filters.condition);
    if (filters?.department && filters.department !== "ALL") params.append("department", filters.department);
    if (filters?.status && filters.status !== "ALL") params.append("status", filters.status);
    if (filters?.action && filters.action !== "ALL") params.append("action", filters.action);
    if (filters?.search) params.append("search", filters.search);

    const res = await fetch(`${API_BASE_URL}/assets?${params.toString()}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch assets from backend");
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn("⚠️ [API Fallback]: Backend unreachable, using synthetic asset catalog.", err);
    return MOCK_ASSETS;
  }
}

/**
 * Fetch single asset by ID or Tag
 */
export async function fetchAssetById(id: string): Promise<Asset | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/assets/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Asset not found");
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn(`⚠️ [API Fallback]: Backend lookup failed for ${id}, searching local catalog.`);
    return MOCK_ASSETS.find((a) => a.id === id || a.assetTag === id) || null;
  }
}

/**
 * Fetch impact and ESG summary metrics
 */
export async function fetchImpactSummary(): Promise<ImpactMetrics> {
  try {
    const res = await fetch(`${API_BASE_URL}/impact/summary`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch impact summary");
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn("⚠️ [API Fallback]: Backend unreachable, using synthetic ESG baseline.", err);
    return MOCK_IMPACT_METRICS;
  }
}
