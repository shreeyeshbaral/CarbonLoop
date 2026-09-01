import { Router } from "express";
import { getDepartments } from "../controllers/departmentController";
import { getAssets, getAssetById, createAsset } from "../controllers/assetController";
import { getRequests, createRequest } from "../controllers/requestController";
import { getImpactSummary } from "../controllers/impactController";
import {
  getDeliveryRuns,
  getDeliveryRunById,
  getDeliveryEfficiencySummary,
} from "../controllers/deliveryController";

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

// Delivery Execution & Efficiency Metrics
router.get("/delivery/runs", getDeliveryRuns);
router.get("/delivery/runs/:id", getDeliveryRunById);
router.get("/delivery/efficiency/summary", getDeliveryEfficiencySummary);

export default router;

