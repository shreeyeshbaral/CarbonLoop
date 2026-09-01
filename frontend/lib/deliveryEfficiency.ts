// ===================================================
// CARBONLOOP — Delivery Efficiency & Execution Engine
// ===================================================

import {
  DeliveryRun,
  DeliveryStopExecution,
  DeliveryEfficiencyMetrics,
  DeliveryEfficiencyScoreBreakdown,
} from "@/types";
import { MOCK_DEPARTMENTS } from "./mockData";

// CarbonLoop Standard Institutional Electric Van Transport Emission Factor (kg CO2e / km)
export const TRANSPORT_CO2_FACTOR_KG_PER_KM = 0.24;

/**
 * Calculates deterministic Delivery Efficiency Metrics and Carbon Impact
 */
export function calculateDeliveryMetrics(params: {
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
}): DeliveryEfficiencyMetrics {
  const {
    baselineDistanceKm,
    plannedDistanceKm,
    actualDistanceKm,
    baselineDurationMinutes,
    plannedDurationMinutes,
    actualDurationMinutes,
    plannedAssetsCount,
    deliveredAssetsCount,
    failedAssetsCount,
    plannedStopsCount,
    actualStopsCount,
    unplannedStopsCount,
    onTimeStopsCount,
    vehicleCapacityKg,
    actualLoadKg,
  } = params;

  // 1. Distance Calculations
  const distanceSavedByOptimizationKm = Number(
    Math.max(0, baselineDistanceKm - plannedDistanceKm).toFixed(2)
  );
  const distanceDeviationPercent =
    plannedDistanceKm > 0
      ? Number((((actualDistanceKm - plannedDistanceKm) / plannedDistanceKm) * 100).toFixed(1))
      : 0;
  const optimizationDistanceImprovementPercent =
    baselineDistanceKm > 0
      ? Number((((baselineDistanceKm - plannedDistanceKm) / baselineDistanceKm) * 100).toFixed(1))
      : 0;

  // 2. Time Calculations
  const timeDeviationPercent =
    plannedDurationMinutes > 0
      ? Number((((actualDurationMinutes - plannedDurationMinutes) / plannedDurationMinutes) * 100).toFixed(1))
      : 0;
  const optimizationTimeImprovementPercent =
    baselineDurationMinutes > 0
      ? Number((((baselineDurationMinutes - plannedDurationMinutes) / baselineDurationMinutes) * 100).toFixed(1))
      : 0;

  // 3. Asset Throughput & Punctuality
  const deliveryCompletionRatePercent =
    plannedAssetsCount > 0
      ? Number(((deliveredAssetsCount / plannedAssetsCount) * 100).toFixed(1))
      : 0;

  const totalEffectiveStops = Math.max(actualStopsCount, plannedStopsCount);
  const onTimeDeliveryRatePercent =
    totalEffectiveStops > 0
      ? Number(((onTimeStopsCount / totalEffectiveStops) * 100).toFixed(1))
      : 0;

  // 4. Vehicle Utilization
  const vehicleUtilizationPercent =
    vehicleCapacityKg > 0
      ? Number(((actualLoadKg / vehicleCapacityKg) * 100).toFixed(1))
      : 0;

  // 5. CO2e Transportation Footprint
  const baselineCo2Kg = Number((baselineDistanceKm * TRANSPORT_CO2_FACTOR_KG_PER_KM).toFixed(2));
  const plannedCo2Kg = Number((plannedDistanceKm * TRANSPORT_CO2_FACTOR_KG_PER_KM).toFixed(2));
  const actualCo2Kg = Number((actualDistanceKm * TRANSPORT_CO2_FACTOR_KG_PER_KM).toFixed(2));
  const co2SavedByOptimizationKg = Number(
    Math.max(0, baselineCo2Kg - plannedCo2Kg).toFixed(2)
  );
  const co2ExecutionDeviationPercent =
    plannedCo2Kg > 0
      ? Number((((actualCo2Kg - plannedCo2Kg) / plannedCo2Kg) * 100).toFixed(1))
      : 0;

  // 6. Explainable CarbonLoop Delivery Efficiency Score (0 - 100)
  // Distance Score (Penalize if actual > planned, reward if actual <= planned)
  const distRatio = plannedDistanceKm > 0 ? actualDistanceKm / plannedDistanceKm : 1;
  const distanceEfficiency = Math.round(
    Math.max(0, Math.min(100, distRatio <= 1 ? 100 : 100 - (distRatio - 1) * 100))
  );

  // Time Score
  const timeRatio = plannedDurationMinutes > 0 ? actualDurationMinutes / plannedDurationMinutes : 1;
  const timeEfficiency = Math.round(
    Math.max(0, Math.min(100, timeRatio <= 1 ? 100 : 100 - (timeRatio - 1) * 100))
  );

  // Completion Score
  const completionRate = Math.round(Math.min(100, deliveryCompletionRatePercent));

  // On-Time Score
  const onTimePerformance = Math.round(Math.min(100, onTimeDeliveryRatePercent));

  // Vehicle Utilization Score (Optimal around 70-90%)
  let vehicleUtilScore = 100;
  if (vehicleUtilizationPercent < 50) {
    vehicleUtilScore = Math.round(vehicleUtilizationPercent * 1.5);
  } else if (vehicleUtilizationPercent > 95) {
    vehicleUtilScore = 90; // minor strain deduction
  } else {
    vehicleUtilScore = Math.round(75 + (vehicleUtilizationPercent - 50) * 0.5);
  }

  // Weighted Composite Formula (Transparent and Configurable):
  // 25% Distance + 25% Time + 25% Completion + 15% On-Time + 10% Vehicle Utilization
  const overallScore = Math.round(
    0.25 * distanceEfficiency +
    0.25 * timeEfficiency +
    0.25 * completionRate +
    0.15 * onTimePerformance +
    0.10 * vehicleUtilScore
  );

  const scoreBreakdown: DeliveryEfficiencyScoreBreakdown = {
    distanceEfficiency,
    timeEfficiency,
    completionRate,
    onTimePerformance,
    vehicleUtilization: vehicleUtilScore,
    overallScore,
  };

  return {
    baselineDistanceKm,
    plannedDistanceKm,
    actualDistanceKm,
    distanceSavedByOptimizationKm,
    distanceDeviationPercent,
    optimizationDistanceImprovementPercent,
    baselineDurationMinutes,
    plannedDurationMinutes,
    actualDurationMinutes,
    timeDeviationPercent,
    optimizationTimeImprovementPercent,
    plannedAssetsCount,
    deliveredAssetsCount,
    failedAssetsCount,
    deliveryCompletionRatePercent,
    plannedStopsCount,
    actualStopsCount,
    unplannedStopsCount,
    onTimeDeliveryRatePercent,
    vehicleCapacityKg,
    actualLoadKg,
    vehicleUtilizationPercent,
    baselineCo2Kg,
    plannedCo2Kg,
    actualCo2Kg,
    co2SavedByOptimizationKg,
    co2ExecutionDeviationPercent,
    scoreBreakdown,
  };
}

/**
 * Deterministically generates meaningful operational insights from actual delivery metrics
 */
export function generateDeliveryInsights(run: DeliveryRun): string[] {
  const { metrics, stops } = run;
  const insights: string[] = [];

  // 1. Distance Deviation Insight
  if (metrics.distanceDeviationPercent > 0) {
    const extraKm = (metrics.actualDistanceKm - metrics.plannedDistanceKm).toFixed(1);
    insights.push(
      `Actual travel was ${metrics.distanceDeviationPercent}% (+${extraKm} km) above the optimized plan, primarily due to ${
        metrics.unplannedStopsCount > 0
          ? `${metrics.unplannedStopsCount} unplanned route detour`
          : "inter-block traffic congestion"
      }.`
    );
  } else if (metrics.distanceDeviationPercent < 0) {
    insights.push(
      `Actual travel was ${Math.abs(metrics.distanceDeviationPercent)}% shorter than planned due to expedited direct corridor access.`
    );
  } else {
    insights.push(`Delivery execution adhered 100% to the planned shortest path with zero detour.`);
  }

  // 2. Completion Throughput Insight
  if (metrics.deliveredAssetsCount === metrics.plannedAssetsCount) {
    insights.push(
      `100% completion rate: All ${metrics.plannedAssetsCount} planned institutional hardware assets were successfully delivered and digitally signed.`
    );
  } else {
    insights.push(
      `${metrics.deliveredAssetsCount} of ${metrics.plannedAssetsCount} planned assets (${metrics.deliveryCompletionRatePercent}%) were successfully delivered. ${metrics.failedAssetsCount} item was held for re-inspection.`
    );
  }

  // 3. Punctuality & Time Insight
  if (metrics.onTimeDeliveryRatePercent >= 90) {
    insights.push(
      `Exceptional punctuality: ${metrics.onTimeDeliveryRatePercent}% of stops were completed within their designated 10-minute delivery time windows.`
    );
  } else {
    insights.push(
      `Punctuality was ${metrics.onTimeDeliveryRatePercent}%, with ${
        metrics.actualDurationMinutes - metrics.plannedDurationMinutes
      } mins of accumulated dwell time across high-traffic faculty labs.`
    );
  }

  // 4. Vehicle Capacity Insight
  insights.push(
    `Electric Utility Van payload utilization reached ${metrics.vehicleUtilizationPercent}% (${metrics.actualLoadKg} kg of ${metrics.vehicleCapacityKg} kg max rating), optimizing battery range.`
  );

  // 5. Environmental Savings Insight
  insights.push(
    `OR-Tools VRP optimization abated ${metrics.co2SavedByOptimizationKg} kg CO₂e transportation emissions compared to naive sequential point-to-point dispatch.`
  );

  return insights;
}

// ===================================================
// SYNTHETIC DETERMINISTIC DEMO DELIVERY RUNS
// (Clearly marked as Synthetic Benchmark Data for Demonstration)
// ===================================================

export const MOCK_DELIVERY_RUNS: DeliveryRun[] = [
  // RUN 1: Morning Inter-Department Surplus Loop
  {
    id: "DLV-001",
    title: "Morning Inter-Department Surplus Loop",
    status: "COMPLETED",
    date: "Today, 09:30 AM",
    driverName: "Ramesh Kumar (Logistics Officer)",
    driverContact: "+91 94370 12891",
    vehicleName: "Campus Electric Utility Van #1 (Tata Ace EV)",
    vehicleRegNo: "OD-02-CL-8812",
    vehicleCapacityKg: 500,
    isDemoData: true,
    notes: "Batch transfer of computing assets and ergonomic furniture between CSE, Design, Library and Civil.",
    baselinePolylineCoordinates: [
      [20.2510, 85.8003], // Admin
      [20.2494, 85.8008], // C-block (CSE)
      [20.2510, 85.8003], // Return Admin
      [20.2499, 85.8016], // Bansuri Guru (Design)
      [20.2510, 85.8003], // Return Admin
      [20.2486, 85.7997], // Central Library
      [20.2510, 85.8003], // Return Admin
      [20.2505, 85.7997], // A-Block (Civil)
      [20.2510, 85.8003], // Return Admin
    ],
    optimizedPolylineCoordinates: [
      [20.2510, 85.8003], // Admin (Depot)
      [20.2505, 85.7997], // A-Block (Civil)
      [20.2495, 85.8000], // D-block (ECE)
      [20.2494, 85.8008], // C-block (CSE)
      [20.2499, 85.8016], // Bansuri Guru (Design)
      [20.2486, 85.8009], // S-Block (Research)
      [20.2485, 85.8018], // F/G Block (Mech)
      [20.2486, 85.7997], // Central Library
      [20.2510, 85.8003], // Admin (Depot Return)
    ],
    actualPolylineCoordinates: [
      [20.2510, 85.8003], // Admin (Depot)
      [20.2505, 85.7997], // A-Block (Civil)
      [20.2495, 85.8000], // D-block (ECE)
      [20.2494, 85.8008], // C-block (CSE)
      [20.2499, 85.8016], // Bansuri Guru (Design)
      [20.2490, 85.8022], // UNPLANNED DETOUR: E-Waste Temporary Hold Bay
      [20.2486, 85.8009], // S-Block (Research)
      [20.2485, 85.8018], // F/G Block (Mech)
      [20.2486, 85.7997], // Central Library
      [20.2510, 85.8003], // Admin (Depot Return)
    ],
    stops: [
      {
        id: "stp-01",
        sequence: 1,
        name: "ITER Administrative Block & Central Stores",
        departmentCode: "ADMIN",
        building: "ITER Administrative Block (North Complex)",
        lat: 20.2510,
        lng: 85.8003,
        type: "DEPOT",
        status: "COMPLETED",
        plannedArrivalTime: "09:30 AM",
        actualArrivalTime: "09:30 AM",
        plannedDwellMinutes: 10,
        actualDwellMinutes: 10,
        isOnTime: true,
        assetQuantity: 0,
        deliveredQuantity: 0,
        notes: "Depot departure with initial inventory manifest.",
      },
      {
        id: "stp-02",
        sequence: 2,
        name: "Civil Engineering (A-Block)",
        departmentCode: "CIVIL",
        building: "A-Block (Structural Materials Wing)",
        lat: 20.2505,
        lng: 85.7997,
        type: "DELIVERY",
        status: "COMPLETED",
        plannedArrivalTime: "09:44 AM",
        actualArrivalTime: "09:45 AM",
        plannedDwellMinutes: 8,
        actualDwellMinutes: 7,
        isOnTime: true,
        assetName: "1x Epson Interactive Projector",
        assetQuantity: 1,
        deliveredQuantity: 1,
        notes: "Signed by Prof. Nandini Rao.",
      },
      {
        id: "stp-03",
        sequence: 3,
        name: "Electronics & Communication (D-block)",
        departmentCode: "ECE",
        building: "D-block (VLSI & Embedded Systems)",
        lat: 20.2495,
        lng: 85.8000,
        type: "PICKUP",
        status: "COMPLETED",
        plannedArrivalTime: "09:58 AM",
        actualArrivalTime: "10:00 AM",
        plannedDwellMinutes: 10,
        actualDwellMinutes: 12,
        isOnTime: true,
        assetName: "2x BenQ 4K Color Monitors",
        assetQuantity: 2,
        deliveredQuantity: 2,
        notes: "Loaded securely in padded flight case.",
      },
      {
        id: "stp-04",
        sequence: 4,
        name: "Computer Science & Centre for Data Science (C-block)",
        departmentCode: "CSE",
        building: "C-block (Centre for Data Science)",
        lat: 20.2494,
        lng: 85.8008,
        type: "PICKUP",
        status: "COMPLETED",
        plannedArrivalTime: "10:16 AM",
        actualArrivalTime: "10:18 AM",
        plannedDwellMinutes: 12,
        actualDwellMinutes: 11,
        isOnTime: true,
        assetName: "4x Dell Latitude 5420 Laptops",
        assetQuantity: 4,
        deliveredQuantity: 4,
        notes: "NIST 800-88 cryptographic wipe verified.",
      },
      {
        id: "stp-05",
        sequence: 5,
        name: "Design & Innovation Studio (Bansuri Guru Auditorium)",
        departmentCode: "DESIGN",
        building: "Bansuri Guru Auditorium & Media Wing",
        lat: 20.2499,
        lng: 85.8016,
        type: "DELIVERY",
        status: "COMPLETED",
        plannedArrivalTime: "10:34 AM",
        actualArrivalTime: "10:36 AM",
        plannedDwellMinutes: 15,
        actualDwellMinutes: 14,
        isOnTime: true,
        assetName: "4x Dell Laptops + 2x BenQ Monitors",
        assetQuantity: 6,
        deliveredQuantity: 6,
        notes: "Fulfilled high-urgency animation lab shortage.",
      },
      {
        id: "stp-06",
        sequence: 6,
        name: "UNPLANNED: E-Waste Sorting Hub",
        departmentCode: "STAGING",
        building: "East Corridor Utility Dock",
        lat: 20.2490,
        lng: 85.8022,
        type: "PICKUP",
        status: "UNPLANNED",
        plannedArrivalTime: "N/A",
        actualArrivalTime: "10:52 AM",
        plannedDwellMinutes: 0,
        actualDwellMinutes: 8,
        isOnTime: false,
        assetName: "1x Defective Server PSU",
        assetQuantity: 1,
        deliveredQuantity: 0,
        notes: "Unplanned stop: Picked up broken power supply for recycling bay.",
      },
      {
        id: "stp-07",
        sequence: 7,
        name: "Advanced Research & Sports Complex (S-Block)",
        departmentCode: "RESEARCH",
        building: "S-Block (Sports Complex & Discovery Center)",
        lat: 20.2486,
        lng: 85.8009,
        type: "DELIVERY",
        status: "FAILED",
        plannedArrivalTime: "11:05 AM",
        actualArrivalTime: "11:12 AM",
        plannedDwellMinutes: 10,
        actualDwellMinutes: 6,
        isOnTime: false,
        assetName: "1x High-Precision Spectrometer Cable",
        assetQuantity: 1,
        deliveredQuantity: 0,
        failureReason: "Recipient lab closed for seminar; rescheduled to 3 PM.",
        notes: "Returned to van for afternoon transfer.",
      },
      {
        id: "stp-08",
        sequence: 8,
        name: "ITER Central Library",
        departmentCode: "LIBRARY",
        building: "Central Library Building",
        lat: 20.2486,
        lng: 85.7997,
        type: "PICKUP",
        status: "COMPLETED",
        plannedArrivalTime: "11:20 AM",
        actualArrivalTime: "11:24 AM",
        plannedDwellMinutes: 10,
        actualDwellMinutes: 9,
        isOnTime: true,
        assetName: "6x Ergonomic Aeron Chairs",
        assetQuantity: 6,
        deliveredQuantity: 6,
        notes: "Direct redistribution surplus from 2nd floor.",
      },
      {
        id: "stp-09",
        sequence: 9,
        name: "ITER Administrative Block & Central Stores",
        departmentCode: "ADMIN",
        building: "ITER Administrative Block (North Complex)",
        lat: 20.2510,
        lng: 85.8003,
        type: "DEPOT",
        status: "COMPLETED",
        plannedArrivalTime: "11:41 AM",
        actualArrivalTime: "11:47 AM",
        plannedDwellMinutes: 5,
        actualDwellMinutes: 5,
        isOnTime: true,
        assetQuantity: 0,
        deliveredQuantity: 0,
        notes: "Completed run; vehicle plugged in for solar charging.",
      },
    ],
    metrics: calculateDeliveryMetrics({
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

  // RUN 2: Lab Hardware Express Dispatch
  {
    id: "DLV-002",
    title: "Critical Lab Hardware Express Dispatch",
    status: "COMPLETED",
    date: "Yesterday, 02:15 PM",
    driverName: "Sanjay Panda",
    driverContact: "+91 98610 55432",
    vehicleName: "Campus Electric Utility Van #2",
    vehicleRegNo: "OD-02-CL-8814",
    vehicleCapacityKg: 500,
    isDemoData: true,
    notes: "High-priority express transfer for semester examinations setup.",
    baselinePolylineCoordinates: [
      [20.2510, 85.8003],
      [20.2494, 85.8008],
      [20.2510, 85.8003],
      [20.2485, 85.8018],
      [20.2510, 85.8003],
    ],
    optimizedPolylineCoordinates: [
      [20.2510, 85.8003],
      [20.2494, 85.8008],
      [20.2485, 85.8018],
      [20.2510, 85.8003],
    ],
    actualPolylineCoordinates: [
      [20.2510, 85.8003],
      [20.2494, 85.8008],
      [20.2485, 85.8018],
      [20.2510, 85.8003],
    ],
    stops: [
      {
        id: "stp-201",
        sequence: 1,
        name: "ITER Admin Depot",
        departmentCode: "ADMIN",
        building: "North Complex",
        lat: 20.2510,
        lng: 85.8003,
        type: "DEPOT",
        status: "COMPLETED",
        plannedArrivalTime: "02:15 PM",
        actualArrivalTime: "02:15 PM",
        plannedDwellMinutes: 5,
        actualDwellMinutes: 5,
        isOnTime: true,
        assetQuantity: 0,
        deliveredQuantity: 0,
      },
      {
        id: "stp-202",
        sequence: 2,
        name: "C-block (CSE)",
        departmentCode: "CSE",
        building: "Centre for Data Science",
        lat: 20.2494,
        lng: 85.8008,
        type: "PICKUP",
        status: "COMPLETED",
        plannedArrivalTime: "02:26 PM",
        actualArrivalTime: "02:25 PM",
        plannedDwellMinutes: 10,
        actualDwellMinutes: 9,
        isOnTime: true,
        assetName: "8x Cisco 24-Port Gigabit Switches",
        assetQuantity: 8,
        deliveredQuantity: 8,
      },
      {
        id: "stp-203",
        sequence: 3,
        name: "Mechanical Engineering (F/G-Block)",
        departmentCode: "MECH",
        building: "F-Block CAD Lab",
        lat: 20.2485,
        lng: 85.8018,
        type: "DELIVERY",
        status: "COMPLETED",
        plannedArrivalTime: "02:45 PM",
        actualArrivalTime: "02:44 PM",
        plannedDwellMinutes: 10,
        actualDwellMinutes: 10,
        isOnTime: true,
        assetName: "8x Cisco Switches",
        assetQuantity: 8,
        deliveredQuantity: 8,
      },
      {
        id: "stp-204",
        sequence: 4,
        name: "ITER Admin Depot Return",
        departmentCode: "ADMIN",
        building: "North Complex",
        lat: 20.2510,
        lng: 85.8003,
        type: "DEPOT",
        status: "COMPLETED",
        plannedArrivalTime: "03:00 PM",
        actualArrivalTime: "02:58 PM",
        plannedDwellMinutes: 5,
        actualDwellMinutes: 5,
        isOnTime: true,
        assetQuantity: 0,
        deliveredQuantity: 0,
      },
    ],
    metrics: calculateDeliveryMetrics({
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

  // RUN 3: Library & E-Waste Consolidation (Live In Transit)
  {
    id: "DLV-003",
    title: "Library & E-Waste Consolidation Loop",
    status: "IN_TRANSIT",
    date: "Active Right Now",
    driverName: "Bikash Mohanty",
    driverContact: "+91 94380 99120",
    vehicleName: "Campus Electric Utility Van #1",
    vehicleRegNo: "OD-02-CL-8812",
    vehicleCapacityKg: 500,
    isDemoData: true,
    notes: "Consolidation of outdated computer equipment for e-waste certification and parts recovery.",
    baselinePolylineCoordinates: [
      [20.2510, 85.8003],
      [20.2486, 85.7997],
      [20.2510, 85.8003],
      [20.2495, 85.8000],
      [20.2510, 85.8003],
    ],
    optimizedPolylineCoordinates: [
      [20.2510, 85.8003],
      [20.2486, 85.7997],
      [20.2495, 85.8000],
      [20.2510, 85.8003],
    ],
    actualPolylineCoordinates: [
      [20.2510, 85.8003],
      [20.2486, 85.7997],
      [20.2495, 85.8000],
    ],
    stops: [
      {
        id: "stp-301",
        sequence: 1,
        name: "ITER Admin Depot",
        departmentCode: "ADMIN",
        building: "North Complex",
        lat: 20.2510,
        lng: 85.8003,
        type: "DEPOT",
        status: "COMPLETED",
        plannedArrivalTime: "11:00 AM",
        actualArrivalTime: "11:00 AM",
        plannedDwellMinutes: 5,
        actualDwellMinutes: 5,
        isOnTime: true,
        assetQuantity: 0,
        deliveredQuantity: 0,
      },
      {
        id: "stp-302",
        sequence: 2,
        name: "ITER Central Library",
        departmentCode: "LIBRARY",
        building: "Central Library Building",
        lat: 20.2486,
        lng: 85.7997,
        type: "PICKUP",
        status: "COMPLETED",
        plannedArrivalTime: "11:15 AM",
        actualArrivalTime: "11:18 AM",
        plannedDwellMinutes: 15,
        actualDwellMinutes: 16,
        isOnTime: true,
        assetName: "10x HP Desktop Towers (Defective for E-Waste)",
        assetQuantity: 10,
        deliveredQuantity: 10,
      },
      {
        id: "stp-303",
        sequence: 3,
        name: "D-block (ECE)",
        departmentCode: "ECE",
        building: "Embedded Systems Bay",
        lat: 20.2495,
        lng: 85.8000,
        type: "PICKUP",
        status: "PENDING",
        plannedArrivalTime: "11:40 AM",
        plannedDwellMinutes: 10,
        isOnTime: true,
        assetName: "5x CRT Monitors for Demanufacturing",
        assetQuantity: 5,
        deliveredQuantity: 0,
      },
      {
        id: "stp-304",
        sequence: 4,
        name: "ITER Admin Central Depot",
        departmentCode: "ADMIN",
        building: "Certified E-Waste Containment Dock",
        lat: 20.2510,
        lng: 85.8003,
        type: "DEPOT",
        status: "PENDING",
        plannedArrivalTime: "12:05 PM",
        plannedDwellMinutes: 10,
        isOnTime: true,
        assetQuantity: 0,
        deliveredQuantity: 0,
      },
    ],
    metrics: calculateDeliveryMetrics({
      baselineDistanceKm: 38.6,
      plannedDistanceKm: 24.2,
      actualDistanceKm: 25.0,
      baselineDurationMinutes: 75,
      plannedDurationMinutes: 52,
      actualDurationMinutes: 55,
      plannedAssetsCount: 15,
      deliveredAssetsCount: 10,
      failedAssetsCount: 0,
      plannedStopsCount: 4,
      actualStopsCount: 4,
      unplannedStopsCount: 0,
      onTimeStopsCount: 3,
      vehicleCapacityKg: 500,
      actualLoadKg: 420,
    }),
  },
];
