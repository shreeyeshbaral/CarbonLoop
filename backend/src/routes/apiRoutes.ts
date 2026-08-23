import { Router } from "express";
import { getDepartments } from "../controllers/departmentController";
import { getAssets, getAssetById, createAsset } from "../controllers/assetController";
import { getRequests, createRequest } from "../controllers/requestController";
import { getImpactSummary } from "../controllers/impactController";

const router = Router();

// Health Check
router.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Department Routes
router.get("/departments", getDepartments);

// Asset Routes
router.get("/assets", getAssets);
router.get("/assets/:id", getAssetById);
router.post("/assets", createAsset);

// Request Routes
router.get("/requests", getRequests);
router.post("/requests", createRequest);

// Impact & ESG Metrics
router.get("/impact/summary", getImpactSummary);

export default router;
