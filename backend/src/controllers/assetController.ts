import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { asyncHandler } from "../middleware/errorHandler";
import { CreateAssetSchema } from "../validators/schemas";

/**
 * GET /api/assets
 * Filterable and searchable asset list
 */
export const getAssets = asyncHandler(async (req: Request, res: Response) => {
  const { category, condition, department, status, action, search } = req.query;

  const whereClause: any = {};

  if (category && category !== "ALL") {
    whereClause.category = category;
  }
  if (condition && condition !== "ALL") {
    whereClause.condition = condition;
  }
  if (status && status !== "ALL") {
    whereClause.status = status;
  }
  if (action && action !== "ALL") {
    whereClause.recommendedAction = action;
  }
  if (department && department !== "ALL") {
    whereClause.department = { code: String(department) };
  }

  if (search) {
    const s = String(search).toLowerCase();
    whereClause.OR = [
      { name: { contains: s, mode: "insensitive" } },
      { assetTag: { contains: s, mode: "insensitive" } },
      { manufacturer: { contains: s, mode: "insensitive" } },
      { modelNumber: { contains: s, mode: "insensitive" } },
    ];
  }

  const assets = await prisma.asset.findMany({
    where: whereClause,
    include: {
      department: true,
      dataWipeAudit: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const formatted = assets.map((a) => ({
    ...a,
    location: {
      lat: a.lat,
      lng: a.lng,
      building: a.building,
      floor: a.floor,
      room: a.room,
    },
  }));

  return res.status(200).json({
    status: "success",
    count: formatted.length,
    data: formatted,
  });
});

/**
 * GET /api/assets/:id
 * Detailed asset lookup by ID or assetTag
 */
export const getAssetById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const asset = await prisma.asset.findFirst({
    where: {
      OR: [{ id }, { assetTag: id }],
    },
    include: {
      department: true,
      dataWipeAudit: true,
      matchOpportunities: {
        include: {
          targetDepartment: true,
        },
      },
    },
  });

  if (!asset) {
    return res.status(404).json({
      status: "fail",
      message: `Asset with identifier '${id}' not found.`,
    });
  }

  const formatted = {
    ...asset,
    location: {
      lat: asset.lat,
      lng: asset.lng,
      building: asset.building,
      floor: asset.floor,
      room: asset.room,
    },
  };

  return res.status(200).json({
    status: "success",
    data: formatted,
  });
});

/**
 * POST /api/assets
 * Register new surplus asset with Zod validation
 */
export const createAsset = asyncHandler(async (req: Request, res: Response) => {
  const validated = CreateAssetSchema.parse(req.body);

  // Generate unique asset tag
  const tagCount = await prisma.asset.count();
  const assetTag = `ASSET-${validated.category.slice(0, 3)}-${String(tagCount + 101).padStart(3, "0")}`;

  const estimatedValue =
    validated.estimatedValue ??
    Math.round(validated.originalPrice * (validated.condition === "EXCELLENT" ? 0.7 : validated.condition === "GOOD" ? 0.55 : 0.35));

  const newAsset = await prisma.asset.create({
    data: {
      assetTag,
      name: validated.name,
      category: validated.category,
      condition: validated.condition,
      departmentId: validated.departmentId,
      building: validated.building,
      floor: validated.floor,
      room: validated.room,
      lat: validated.lat,
      lng: validated.lng,
      ageYears: validated.ageYears,
      purchaseDate: validated.purchaseDate ? new Date(validated.purchaseDate) : null,
      originalPrice: validated.originalPrice,
      estimatedValue,
      estimatedRepairCost: validated.estimatedRepairCost,
      status: "AVAILABLE",
      dataWipeRequired: validated.dataWipeRequired,
      dataWipeCompleted: false,
      recommendedAction: validated.recommendedAction,
      actionConfidence: validated.actionConfidence,
      aiReasoning: validated.aiReasoning,
      serialNumber: validated.serialNumber,
      manufacturer: validated.manufacturer,
      modelNumber: validated.modelNumber,
      specifications: validated.specifications,
      tags: validated.tags,
    },
    include: {
      department: true,
    },
  });

  // Create audit log
  await prisma.auditLog.create({
    data: {
      actorName: "Department Custodian",
      actorRole: "DEPARTMENT_MANAGER",
      actionType: "SURPLUS_REGISTERED",
      entityType: "ASSET",
      entityId: newAsset.id,
      details: { assetTag: newAsset.assetTag, category: newAsset.category, value: newAsset.estimatedValue },
    },
  });

  return res.status(201).json({
    status: "success",
    message: "Surplus asset successfully registered",
    data: newAsset,
  });
});
