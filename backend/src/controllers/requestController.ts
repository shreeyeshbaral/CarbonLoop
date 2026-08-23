import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { asyncHandler } from "../middleware/errorHandler";
import { CreateShortageRequestSchema } from "../validators/schemas";

/**
 * GET /api/requests
 * Fetch all department shortage requests
 */
export const getRequests = asyncHandler(async (req: Request, res: Response) => {
  const { department, status, category } = req.query;

  const whereClause: any = {};
  if (status && status !== "ALL") whereClause.status = status;
  if (category && category !== "ALL") whereClause.category = category;
  if (department && department !== "ALL") whereClause.department = { code: String(department) };

  const requests = await prisma.shortageRequest.findMany({
    where: whereClause,
    include: {
      department: true,
      matchOpportunities: {
        include: {
          asset: true,
          sourceDepartment: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return res.status(200).json({
    status: "success",
    count: requests.length,
    data: requests,
  });
});

/**
 * POST /api/requests
 * Create new department shortage request
 */
export const createRequest = asyncHandler(async (req: Request, res: Response) => {
  const validated = CreateShortageRequestSchema.parse(req.body);

  const request = await prisma.shortageRequest.create({
    data: {
      departmentId: validated.departmentId,
      category: validated.category,
      quantityRequested: validated.quantityRequested,
      urgency: validated.urgency,
      minimumCondition: validated.minimumCondition,
      requestedBy: validated.requestedBy,
      reason: validated.reason,
      status: "OPEN",
    },
    include: {
      department: true,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorName: validated.requestedBy,
      actorRole: "REQUESTER",
      actionType: "SHORTAGE_REQUEST_CREATED",
      entityType: "REQUEST",
      entityId: request.id,
      details: { category: request.category, quantity: request.quantityRequested, urgency: request.urgency },
    },
  });

  return res.status(201).json({
    status: "success",
    message: "Shortage request submitted successfully",
    data: request,
  });
});
