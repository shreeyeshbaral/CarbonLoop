import { Request, Response } from "express";

// CarbonLoop Delivery Factor (kg CO2e / km)
const TRANSPORT_CO2_FACTOR = 0.24;

interface DeliveryMetricsParams {
  baselineDistanceKm: number;
  plannedDistanceKm: number;
  actualDistanceKm: number;
  baselineDurationMinutes: number;
  plannedDurationMinutes: number;
  actualDurationMinutes: number;
  plannedAssetsCount: number;
  deliveredAssetsCount: number;
  failedAssetsCount: number;
  plannedStopsCount: number;
  actualStopsCount: number;
  unplannedStopsCount: number;
  onTimeStopsCount: number;
  vehicleCapacityKg: number;
  actualLoadKg: number;
}

function calculateMetrics(p: DeliveryMetricsParams) {
  const distanceSavedKm = Number(Math.max(0, p.baselineDistanceKm - p.plannedDistanceKm).toFixed(2));
  const distanceDeviationPercent =
    p.plannedDistanceKm > 0
      ? Number((((p.actualDistanceKm - p.plannedDistanceKm) / p.plannedDistanceKm) * 100).toFixed(1))
      : 0;
  const optimizationDistanceImprovementPercent =
    p.baselineDistanceKm > 0
      ? Number((((p.baselineDistanceKm - p.plannedDistanceKm) / p.baselineDistanceKm) * 100).toFixed(1))
      : 0;

  const timeDeviationPercent =
    p.plannedDurationMinutes > 0
      ? Number((((p.actualDurationMinutes - p.plannedDurationMinutes) / p.plannedDurationMinutes) * 100).toFixed(1))
      : 0;
  const optimizationTimeImprovementPercent =
    p.baselineDurationMinutes > 0
      ? Number((((p.baselineDurationMinutes - p.plannedDurationMinutes) / p.baselineDurationMinutes) * 100).toFixed(1))
      : 0;

  const deliveryCompletionRatePercent =
    p.plannedAssetsCount > 0
      ? Number(((p.deliveredAssetsCount / p.plannedAssetsCount) * 100).toFixed(1))
      : 0;

  const totalEffectiveStops = Math.max(p.actualStopsCount, p.plannedStopsCount);
  const onTimeDeliveryRatePercent =
    totalEffectiveStops > 0
      ? Number(((p.onTimeStopsCount / totalEffectiveStops) * 100).toFixed(1))
      : 0;

  const vehicleUtilizationPercent =
    p.vehicleCapacityKg > 0
      ? Number(((p.actualLoadKg / p.vehicleCapacityKg) * 100).toFixed(1))
      : 0;

  const baselineCo2Kg = Number((p.baselineDistanceKm * TRANSPORT_CO2_FACTOR).toFixed(2));
  const plannedCo2Kg = Number((p.plannedDistanceKm * TRANSPORT_CO2_FACTOR).toFixed(2));
  const actualCo2Kg = Number((p.actualDistanceKm * TRANSPORT_CO2_FACTOR).toFixed(2));
  const co2SavedByOptimizationKg = Number(Math.max(0, baselineCo2Kg - plannedCo2Kg).toFixed(2));

  // Score
  const distRatio = p.plannedDistanceKm > 0 ? p.actualDistanceKm / p.plannedDistanceKm : 1;
  const distanceEfficiency = Math.round(Math.max(0, Math.min(100, distRatio <= 1 ? 100 : 100 - (distRatio - 1) * 100)));

  const timeRatio = p.plannedDurationMinutes > 0 ? p.actualDurationMinutes / p.plannedDurationMinutes : 1;
  const timeEfficiency = Math.round(Math.max(0, Math.min(100, timeRatio <= 1 ? 100 : 100 - (timeRatio - 1) * 100)));

  const completionRate = Math.round(Math.min(100, deliveryCompletionRatePercent));
  const onTimePerformance = Math.round(Math.min(100, onTimeDeliveryRatePercent));

  let vehicleUtilScore = 100;
  if (vehicleUtilizationPercent < 50) {
    vehicleUtilScore = Math.round(vehicleUtilizationPercent * 1.5);
  } else if (vehicleUtilizationPercent > 95) {
    vehicleUtilScore = 90;
  } else {
    vehicleUtilScore = Math.round(75 + (vehicleUtilizationPercent - 50) * 0.5);
  }

  const overallScore = Math.round(
    0.25 * distanceEfficiency +
    0.25 * timeEfficiency +
    0.25 * completionRate +
    0.15 * onTimePerformance +
    0.10 * vehicleUtilScore
  );

  return {
    baselineDistanceKm: p.baselineDistanceKm,
    plannedDistanceKm: p.plannedDistanceKm,
    actualDistanceKm: p.actualDistanceKm,
    distanceSavedByOptimizationKm: distanceSavedKm,
    distanceDeviationPercent,
    optimizationDistanceImprovementPercent,
    baselineDurationMinutes: p.baselineDurationMinutes,
    plannedDurationMinutes: p.plannedDurationMinutes,
    actualDurationMinutes: p.actualDurationMinutes,
    timeDeviationPercent,
    optimizationTimeImprovementPercent,
    plannedAssetsCount: p.plannedAssetsCount,
    deliveredAssetsCount: p.deliveredAssetsCount,
    failedAssetsCount: p.failedAssetsCount,
    deliveryCompletionRatePercent,
    plannedStopsCount: p.plannedStopsCount,
    actualStopsCount: p.actualStopsCount,
    unplannedStopsCount: p.unplannedStopsCount,
    onTimeDeliveryRatePercent,
    vehicleCapacityKg: p.vehicleCapacityKg,
    actualLoadKg: p.actualLoadKg,
    vehicleUtilizationPercent,
    baselineCo2Kg,
    plannedCo2Kg,
    actualCo2Kg,
    co2SavedByOptimizationKg,
    scoreBreakdown: {
      distanceEfficiency,
      timeEfficiency,
      completionRate,
      onTimePerformance,
      vehicleUtilization: vehicleUtilScore,
      overallScore,
    },
  };
}

const DELIVERY_RUNS = [
  {
    id: "DLV-001",
    title: "Morning Inter-Department Surplus Loop",
    status: "COMPLETED",
    date: "Today, 09:30 AM",
    driverName: "Ramesh Kumar (Logistics Officer)",
    vehicleName: "Campus Electric Utility Van #1 (Tata Ace EV)",
    vehicleRegNo: "OD-02-CL-8812",
    vehicleCapacityKg: 500,
    isDemoData: true,
    metrics: calculateMetrics({
      baselineDistanceKm: 58.4,
      plannedDistanceKm: 42.6,
      actualDistanceKm: 46.2,
      baselineDurationMinutes: 98,
      plannedDurationMinutes: 71,
      actualDurationMinutes: 77,
      plannedAssetsCount: 12,
      deliveredAssetsCount: 11,
      failedAssetsCount: 1,
      plannedStopsCount: 8,
      actualStopsCount: 9,
      unplannedStopsCount: 1,
      onTimeStopsCount: 7,
      vehicleCapacityKg: 500,
      actualLoadKg: 380,
    }),
  },
  {
    id: "DLV-002",
    title: "Critical Lab Hardware Express Dispatch",
    status: "COMPLETED",
    date: "Yesterday, 02:15 PM",
    driverName: "Sanjay Panda",
    vehicleName: "Campus Electric Utility Van #2",
    vehicleRegNo: "OD-02-CL-8814",
    vehicleCapacityKg: 500,
    isDemoData: true,
    metrics: calculateMetrics({
      baselineDistanceKm: 32.8,
      plannedDistanceKm: 19.4,
      actualDistanceKm: 19.1,
      baselineDurationMinutes: 62,
      plannedDurationMinutes: 45,
      actualDurationMinutes: 43,
      plannedAssetsCount: 8,
      deliveredAssetsCount: 8,
      failedAssetsCount: 0,
      plannedStopsCount: 4,
      actualStopsCount: 4,
      unplannedStopsCount: 0,
      onTimeStopsCount: 4,
      vehicleCapacityKg: 500,
      actualLoadKg: 210,
    }),
  },
];

/**
 * GET /api/delivery/runs
 */
export async function getDeliveryRuns(req: Request, res: Response) {
  try {
    return res.status(200).json({
      status: "success",
      count: DELIVERY_RUNS.length,
      data: DELIVERY_RUNS,
    });
  } catch (error: any) {
    return res.status(500).json({ status: "error", message: error.message });
  }
}

/**
 * GET /api/delivery/runs/:id
 */
export async function getDeliveryRunById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const run = DELIVERY_RUNS.find((r) => r.id === id);
    if (!run) {
      return res.status(404).json({ status: "error", message: `Delivery run ${id} not found` });
    }
    return res.status(200).json({
      status: "success",
      data: run,
    });
  } catch (error: any) {
    return res.status(500).json({ status: "error", message: error.message });
  }
}

/**
 * GET /api/delivery/efficiency/summary
 */
export async function getDeliveryEfficiencySummary(req: Request, res: Response) {
  try {
    const totalRuns = DELIVERY_RUNS.length;
    const avgScore = Math.round(
      DELIVERY_RUNS.reduce((acc, r) => acc + r.metrics.scoreBreakdown.overallScore, 0) / totalRuns
    );
    const totalKmSaved = Number(
      DELIVERY_RUNS.reduce((acc, r) => acc + r.metrics.distanceSavedByOptimizationKm, 0).toFixed(2)
    );
    const totalCo2Saved = Number(
      DELIVERY_RUNS.reduce((acc, r) => acc + r.metrics.co2SavedByOptimizationKg, 0).toFixed(2)
    );

    return res.status(200).json({
      status: "success",
      data: {
        totalDeliveryRuns: totalRuns,
        fleetAverageEfficiencyScore: avgScore,
        totalKmSavedByOptimization: totalKmSaved,
        totalTransportCo2AbatedKg: totalCo2Saved,
        activeElectricFleetCount: 2,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ status: "error", message: error.message });
  }
}
