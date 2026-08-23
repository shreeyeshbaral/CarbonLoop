import { Asset, ShortageRequest, MatchOpportunity, Department, AssetCondition } from "@/types";

/**
 * Calculates the great-circle distance between two GPS points using the Haversine formula (in kilometers).
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

const CONDITION_RANKS: Record<AssetCondition, number> = {
  EXCELLENT: 4,
  GOOD: 3,
  FAIR: 2,
  POOR: 1,
  FOR_PARTS: 0,
};

/**
 * Deterministic multi-factor match scoring algorithm
 * Compatibility (40) + Condition (25) + Proximity (20) + Urgency (15) = 100
 */
export function scoreMatch(
  asset: Asset,
  request: ShortageRequest,
  sourceDept: Department,
  targetDept: Department
): {
  matchScore: number;
  scoreBreakdown: MatchOpportunity["scoreBreakdown"];
  distanceKm: number;
  procurementAvoided: number;
  co2AvoidedKg: number;
  reasons: string[];
} {
  const reasons: string[] = [];

  // 1. Compatibility Score (Max 40)
  let compatibility = 0;
  if (asset.category === request.category) {
    compatibility = 40;
    reasons.push(`Exact category match (${asset.category.toLowerCase()})`);
  } else {
    compatibility = 15;
    reasons.push(`Partial category compatibility`);
  }

  // 2. Condition Score (Max 25)
  let conditionScore = 0;
  const assetRank = CONDITION_RANKS[asset.condition] || 1;
  const reqRank = CONDITION_RANKS[request.minimumCondition] || 1;

  if (assetRank >= reqRank) {
    conditionScore = 25;
    reasons.push(`Condition (${asset.condition}) meets/exceeds requirement (${request.minimumCondition})`);
  } else if (assetRank === reqRank - 1) {
    conditionScore = 15;
    reasons.push(`Condition is slightly below target but repairable`);
  } else {
    conditionScore = 5;
  }

  // 3. Proximity Score (Max 20)
  const distanceKm = calculateHaversineDistance(
    sourceDept.coordinates.lat,
    sourceDept.coordinates.lng,
    targetDept.coordinates.lat,
    targetDept.coordinates.lng
  );

  let proximity = 0;
  if (distanceKm <= 0.4) {
    proximity = 20;
    reasons.push(`Immediate proximity (${distanceKm} km between ${sourceDept.code} & ${targetDept.code})`);
  } else if (distanceKm <= 1.0) {
    proximity = 16;
    reasons.push(`Short intra-campus transit distance (${distanceKm} km)`);
  } else {
    proximity = 10;
    reasons.push(`Cross-campus transfer required (${distanceKm} km)`);
  }

  // 4. Urgency Score (Max 15)
  let urgencyScore = 0;
  switch (request.urgency) {
    case "CRITICAL":
      urgencyScore = 15;
      reasons.push(`High priority: Fulfills critical department shortage`);
      break;
    case "HIGH":
      urgencyScore = 12;
      reasons.push(`Prioritized for high-urgency operational requirement`);
      break;
    case "MEDIUM":
      urgencyScore = 8;
      break;
    case "LOW":
      urgencyScore = 5;
      break;
  }

  const matchScore = compatibility + conditionScore + proximity + urgencyScore;
  const procurementAvoided = asset.estimatedValue;
  const co2AvoidedKg = Math.round(asset.estimatedValue * 0.005) + 40;

  return {
    matchScore,
    scoreBreakdown: {
      compatibility,
      condition: conditionScore,
      proximity,
      urgency: urgencyScore,
    },
    distanceKm,
    procurementAvoided,
    co2AvoidedKg,
    reasons,
  };
}
