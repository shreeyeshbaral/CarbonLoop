// ===================================================
// CARBONLOOP — ESG Analytics & Historical Data
// ===================================================

export interface MonthlyImpactData {
  month: string;
  procurementAvoidedInr: number;
  wasteDivertedKg: number;
  co2AvoidedKg: number;
  transfersCount: number;
}

export const MOCK_MONTHLY_IMPACT: MonthlyImpactData[] = [
  { month: "Jan", procurementAvoidedInr: 320000, wasteDivertedKg: 240, co2AvoidedKg: 620, transfersCount: 6 },
  { month: "Feb", procurementAvoidedInr: 450000, wasteDivertedKg: 310, co2AvoidedKg: 850, transfersCount: 9 },
  { month: "Mar", procurementAvoidedInr: 680000, wasteDivertedKg: 490, co2AvoidedKg: 1290, transfersCount: 14 },
  { month: "Apr", procurementAvoidedInr: 590000, wasteDivertedKg: 420, co2AvoidedKg: 1110, transfersCount: 11 },
  { month: "May", procurementAvoidedInr: 780000, wasteDivertedKg: 560, co2AvoidedKg: 1480, transfersCount: 16 },
  { month: "Jun", procurementAvoidedInr: 920000, wasteDivertedKg: 650, co2AvoidedKg: 1740, transfersCount: 19 },
  { month: "Jul", procurementAvoidedInr: 1125000, wasteDivertedKg: 750, co2AvoidedKg: 2060, transfersCount: 24 },
];

export interface DepartmentCircularityRanking {
  rank: number;
  code: string;
  name: string;
  circularityScore: number; // 0 - 100
  surplusShared: number;
  shortagesFulfilled: number;
  capitalSavedInr: number;
  co2AbatedKg: number;
  badge: "Gold Tier" | "Silver Tier" | "Bronze Tier" | "Developing";
}

export const MOCK_DEPARTMENT_RANKINGS: DepartmentCircularityRanking[] = [
  { rank: 1, code: "ADMIN", name: "Central Administration", circularityScore: 94, surplusShared: 65, shortagesFulfilled: 5, capitalSavedInr: 1420000, co2AbatedKg: 2850, badge: "Gold Tier" },
  { rank: 2, code: "LIBRARY", name: "Central Library", circularityScore: 89, surplusShared: 42, shortagesFulfilled: 8, capitalSavedInr: 980000, co2AbatedKg: 1920, badge: "Gold Tier" },
  { rank: 3, code: "CSE", name: "Computer Science", circularityScore: 85, surplusShared: 38, shortagesFulfilled: 12, capitalSavedInr: 890000, co2AbatedKg: 1740, badge: "Silver Tier" },
  { rank: 4, code: "ECE", name: "Electronics & Comm", circularityScore: 81, surplusShared: 29, shortagesFulfilled: 15, capitalSavedInr: 650000, co2AbatedKg: 1280, badge: "Silver Tier" },
  { rank: 5, code: "MECH", name: "Mechanical Engg", circularityScore: 74, surplusShared: 24, shortagesFulfilled: 19, capitalSavedInr: 460000, co2AbatedKg: 890, badge: "Bronze Tier" },
  { rank: 6, code: "CIVIL", name: "Civil Engineering", circularityScore: 68, surplusShared: 16, shortagesFulfilled: 22, capitalSavedInr: 280000, co2AbatedKg: 520, badge: "Bronze Tier" },
  { rank: 7, code: "DESIGN", name: "Design & Media", circularityScore: 64, surplusShared: 9, shortagesFulfilled: 28, capitalSavedInr: 185000, co2AbatedKg: 380, badge: "Developing" },
  { rank: 8, code: "RESEARCH", name: "Research Lab", circularityScore: 61, surplusShared: 14, shortagesFulfilled: 31, capitalSavedInr: 220000, co2AbatedKg: 430, badge: "Developing" },
];

export interface CategoryLifespanMetric {
  category: string;
  totalVolume: number;
  averageAgeYears: number;
  reuseRatePercent: number;
  carbonIntensityKg: number;
}

export const MOCK_CATEGORY_LIFESPAN: CategoryLifespanMetric[] = [
  { category: "Laptops", totalVolume: 64, averageAgeYears: 2.3, reuseRatePercent: 78, carbonIntensityKg: 240 },
  { category: "Monitors", totalVolume: 48, averageAgeYears: 2.8, reuseRatePercent: 88, carbonIntensityKg: 180 },
  { category: "Chairs", totalVolume: 36, averageAgeYears: 3.6, reuseRatePercent: 92, carbonIntensityKg: 45 },
  { category: "Desktops", totalVolume: 32, averageAgeYears: 3.1, reuseRatePercent: 72, carbonIntensityKg: 320 },
  { category: "Networking", totalVolume: 24, averageAgeYears: 2.1, reuseRatePercent: 84, carbonIntensityKg: 190 },
  { category: "Projectors", totalVolume: 18, averageAgeYears: 3.8, reuseRatePercent: 65, carbonIntensityKg: 160 },
  { category: "Printers", totalVolume: 16, averageAgeYears: 2.9, reuseRatePercent: 70, carbonIntensityKg: 210 },
  { category: "Lab Equipment", totalVolume: 12, averageAgeYears: 4.2, reuseRatePercent: 82, carbonIntensityKg: 450 },
];
