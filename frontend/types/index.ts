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
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  minimumCondition: AssetCondition;
  requestedBy: string;
  reason: string;
  status: 'OPEN' | 'MATCHED' | 'FULFILLED' | 'CANCELLED';
  createdAt: string;
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
