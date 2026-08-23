import { z } from "zod";

// ===================================================
// CARBONLOOP — Zod Runtime Validation Schemas
// ===================================================

export const AssetCategoryEnum = z.enum([
  "LAPTOP",
  "MONITOR",
  "DESKTOP",
  "CHAIR",
  "DESK",
  "PROJECTOR",
  "PRINTER",
  "LAB_EQUIPMENT",
  "NETWORKING",
  "OTHER",
]);

export const AssetConditionEnum = z.enum([
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "POOR",
  "FOR_PARTS",
]);

export const AssetStatusEnum = z.enum([
  "AVAILABLE",
  "REQUESTED",
  "IN_REVIEW",
  "APPROVED",
  "DATA_WIPE_PENDING",
  "DATA_WIPED",
  "TRANSFER_SCHEDULED",
  "IN_TRANSIT",
  "TRANSFERRED",
  "RECYCLED",
]);

export const CircularActionEnum = z.enum([
  "REUSE",
  "REPAIR",
  "REDISTRIBUTE",
  "RECYCLE",
]);

export const UrgencyLevelEnum = z.enum([
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
]);

// ---------------------------------------------------
// ASSET CREATION SCHEMA
// ---------------------------------------------------
export const CreateAssetSchema = z.object({
  name: z.string().min(2, "Asset name must be at least 2 characters"),
  category: AssetCategoryEnum,
  condition: AssetConditionEnum,
  departmentId: z.string().min(1, "Department ID is required"),
  building: z.string().min(1, "Building name is required"),
  floor: z.string().optional(),
  room: z.string().optional(),
  lat: z.number().optional().default(12.9716),
  lng: z.number().optional().default(77.5946),
  ageYears: z.number().min(0).default(1.0),
  purchaseDate: z.string().optional(),
  originalPrice: z.number().positive("Original price must be positive"),
  estimatedValue: z.number().nonnegative().optional(),
  estimatedRepairCost: z.number().nonnegative().optional().default(0),
  dataWipeRequired: z.boolean().optional().default(false),
  recommendedAction: CircularActionEnum.optional().default("REUSE"),
  actionConfidence: z.number().min(0).max(1).optional().default(0.9),
  aiReasoning: z.string().optional(),
  serialNumber: z.string().optional(),
  manufacturer: z.string().optional(),
  modelNumber: z.string().optional(),
  specifications: z.record(z.any()).optional(),
  tags: z.array(z.string()).optional().default([]),
});

// ---------------------------------------------------
// SHORTAGE REQUEST SCHEMA
// ---------------------------------------------------
export const CreateShortageRequestSchema = z.object({
  departmentId: z.string().min(1, "Department ID is required"),
  category: AssetCategoryEnum,
  quantityRequested: z.number().int().positive().default(1),
  urgency: UrgencyLevelEnum.default("MEDIUM"),
  minimumCondition: AssetConditionEnum.default("GOOD"),
  requestedBy: z.string().min(2, "Requester name is required"),
  reason: z.string().min(5, "Reason must be at least 5 characters"),
});

// ---------------------------------------------------
// DATA-WIPE VERIFICATION SCHEMA
// ---------------------------------------------------
export const VerifyDataWipeSchema = z.object({
  officerName: z.string().min(2, "IT Officer name is required"),
  officerEmail: z.string().email("Valid officer email is required"),
  wipeMethod: z.string().default("NIST 800-88 Clear / Cryptographic Erase"),
  notes: z.string().optional(),
});
