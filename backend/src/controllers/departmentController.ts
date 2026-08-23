import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { asyncHandler } from "../middleware/errorHandler";

/**
 * GET /api/departments
 * Fetch all departments with live surplus and shortage counts
 */
export const getDepartments = asyncHandler(async (req: Request, res: Response) => {
  const departments = await prisma.department.findMany({
    include: {
      _count: {
        select: {
          assets: { where: { status: "AVAILABLE" } },
          shortageRequests: { where: { status: "OPEN" } },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  const formatted = departments.map((d) => ({
    id: d.id,
    code: d.code,
    name: d.name,
    building: d.building,
    floor: d.floor,
    room: d.room,
    coordinates: {
      lat: d.lat,
      lng: d.lng,
      building: d.building,
      floor: d.floor,
      room: d.room,
    },
    contactEmail: d.contactEmail,
    managerName: d.managerName,
    surplusCount: d._count.assets,
    shortageCount: d._count.shortageRequests,
  }));

  return res.status(200).json({
    status: "success",
    count: formatted.length,
    data: formatted,
  });
});
