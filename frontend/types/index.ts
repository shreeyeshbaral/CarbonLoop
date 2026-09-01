// ===================================================
// CARBONLOOP — Domain Types & Data Contracts
// ===================================================

export type AssetCategory =
  | 'LAPTOP'
  | 'MONITOR'
  | 'DESKTOP'
  | 'CHAIR'
  | 'DESK'
  | 'PROJECTOR'
  | 'PRINTER'
  | 'LAB_EQUIPMENT'
  | 'NETWORKING'
  | 'OTHER';

export type AssetCondition =
  | 'EXCELLENT'
  | 'GOOD'
  | 'FAIR'
  | 'POOR'
  | 'FOR_PARTS';

export type AssetStatus =
  | 'AVAILABLE'
  | 'REQUESTED'
  | 'IN_REVIEW'
  | 'APPROVED'
  | 'DATA_WIPE_PENDING'
  | 'DATA_WIPED'
  | 'TRANSFER_SCHEDULED'
  | 'IN_TRANSIT'
  | 'TRANSFERRED'
  | 'RECYCLED';

export type CircularAction =
  | 'REUSE'
  | 'REPAIR'
  | 'REDISTRIBUTE'
  | 'RECYCLE';

export type UrgencyLevel =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL';

export type DepartmentCode =
  | 'CSE'
  | 'MECH'
  | 'ECE'
  | 'CIVIL'
  | 'DESIGN'
  | 'LIBRARY'
  | 'ADMIN'
  | 'RESEARCH';

export type UserRole =
  | 'ADMIN'
  | 'DEPARTMENT_MANAGER'
  | 'IT_OFFICER'
  | 'REQUESTER';

export interface LocationCoordinates {
  lat: number;
  lng: number;
  building: string;
  floor?: string;
  room?: string;
}

export interface Department {
  id: string;
  code: DepartmentCode;
  name: string;
  building: string;
  coordinates: LocationCoordinates;
  contactEmail: string;
  managerName: string;
  surplusCount?: number;
  shortageCount?: number;
}

export interface Asset {
  id: string;
  assetTag: string;
  name: string;
  category: AssetCategory;
  condition: AssetCondition;
  departmentId: string;
  department?: Department;
  location: LocationCoordinates;
  ageYears: number;
  purchaseDate: string;
  originalPrice: number;
  estimatedValue: number;
  estimatedRepairCost: number;
  status: AssetStatus;
  dataWipeRequired: boolean;
  dataWipeCompleted: boolean;
  recommendedAction: CircularAction;
  actionConfidence: number;
  aiReasoning?: string;
  serialNumber?: string;
  manufacturer?: string;
  modelNumber?: string;
  specifications?: Record<string, any>;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ShortageRequest {
  id: string;
  departmentId: string;
  department?: Department;
  category: AssetCategory;
  quantityRequested: number;
  quantityFulfilled: number;
  urgency: UrgencyLevel;
  minimumCondition: AssetCondition;
  requestedBy: string;
  reason: string;
  status: 'OPEN' | 'MATCHED' | 'FULFILLED' | 'CANCELLED';
  createdAt: string;
  updatedAt?: string;
}

export interface MatchOpportunity {
  id: string;
  assetId: string;
  asset: Asset;
  requestId: string;
  request: ShortageRequest;
  sourceDepartment: Department;
  targetDepartment: Department;
  matchScore: number; // 0 - 100
  scoreBreakdown: {
    compatibility: number; // 0 - 40
    condition: number;     // 0 - 25
    proximity: number;     // 0 - 20
    urgency: number;       // 0 - 15
  };
  distanceKm: number;
  procurementAvoided: number;
  co2AvoidedKg: number;
  reasons: string[];
  status: 'PROPOSED' | 'REQUESTED' | 'APPROVED' | 'REJECTED';
}

export interface Transfer {
  id: string;
  assetId: string;
  asset?: Asset;
  sourceDepartmentId: string;
  sourceDepartment?: Department;
  targetDepartmentId: string;
  targetDepartment?: Department;
  status: AssetStatus;
  approvedBy?: string;
  approvedAt?: string;
  dataWipeVerifiedBy?: string;
  dataWipeCertificateId?: string;
  dataWipedAt?: string;
  scheduledPickup?: string;
  completedAt?: string;
  notes?: string;
}

export interface ImpactMetrics {
  totalAssetsManaged: number;
  surplusAssets: number;
  shortagesActive: number;
  activeTransfers: number;
  reusedCount: number;
  repairedCount: number;
  redistributedCount: number;
  recycledCount: number;
  procurementAvoidedInr: number;
  wasteDivertedKg: number;
  co2AvoidedKg: number;
  logisticsKmOptimized: number;
}

// ---------------------------------------------------
// DELIVERY EFFICIENCY & EXECUTION TYPES
// ---------------------------------------------------

export type DeliveryRunStatus = 'SCHEDULED' | 'IN_TRANSIT' | 'COMPLETED' | 'DELAYED' | 'CANCELLED';
export type DeliveryStopStatus = 'COMPLETED' | 'FAILED' | 'PENDING' | 'UNPLANNED';

export interface DeliveryStopExecution {
  id: string;
  sequence: number;
  name: string;
  departmentCode: string;
  building: string;
  lat: number;
  lng: number;
  type: 'DEPOT' | 'PICKUP' | 'DELIVERY';
  status: DeliveryStopStatus;
  plannedArrivalTime: string;
  actualArrivalTime?: string;
  plannedDwellMinutes: number;
  actualDwellMinutes?: number;
  isOnTime: boolean;
  assetName?: string;
  assetQuantity: number;
  deliveredQuantity: number;
  failureReason?: string;
  notes?: string;
}

export interface DeliveryEfficiencyScoreBreakdown {
  distanceEfficiency: number;   // 0 - 100
  timeEfficiency: number;       // 0 - 100
  completionRate: number;       // 0 - 100
  onTimePerformance: number;    // 0 - 100
  vehicleUtilization: number;   // 0 - 100
  overallScore: number;         // 0 - 100
}

export interface DeliveryEfficiencyMetrics {
  // Distance
  baselineDistanceKm: number;
  plannedDistanceKm: number;
  actualDistanceKm: number;
  distanceSavedByOptimizationKm: number;
  distanceDeviationPercent: number; // ((actual - planned) / planned) * 100
  optimizationDistanceImprovementPercent: number; // ((baseline - planned) / baseline) * 100

  // Time
  baselineDurationMinutes: number;
  plannedDurationMinutes: number;
  actualDurationMinutes: number;
  timeDeviationPercent: number; // ((actual - planned) / planned) * 100
  optimizationTimeImprovementPercent: number;

  // Asset Throughput
  plannedAssetsCount: number;
  deliveredAssetsCount: number;
  failedAssetsCount: number;
  deliveryCompletionRatePercent: number; // (delivered / planned) * 100

  // Punctuality & Stops
  plannedStopsCount: number;
  actualStopsCount: number;
  unplannedStopsCount: number;
  onTimeDeliveryRatePercent: number;

  // Vehicle Capacity
  vehicleCapacityKg: number;
  actualLoadKg: number;
  vehicleUtilizationPercent: number; // (actualLoad / capacity) * 100

  // Carbon Transport Footprint (0.24 kg CO2e / km)
  baselineCo2Kg: number;
  plannedCo2Kg: number;
  actualCo2Kg: number;
  co2SavedByOptimizationKg: number;
  co2ExecutionDeviationPercent: number;

  // Overall Explainable Score
  scoreBreakdown: DeliveryEfficiencyScoreBreakdown;
}

export interface DeliveryRun {
  id: string;                      // e.g. "DLV-001"
  title: string;                   // e.g. "Morning Inter-Department Surplus Loop"
  status: DeliveryRunStatus;
  date: string;
  driverName: string;
  driverContact: string;
  vehicleName: string;             // e.g. "Electric Utility Van #1 (Tata Ace EV)"
  vehicleRegNo: string;
  vehicleCapacityKg: number;
  isDemoData: boolean;
  notes?: string;
  stops: DeliveryStopExecution[];
  metrics: DeliveryEfficiencyMetrics;
  baselinePolylineCoordinates: [number, number][];
  optimizedPolylineCoordinates: [number, number][];
  actualPolylineCoordinates: [number, number][];
}

