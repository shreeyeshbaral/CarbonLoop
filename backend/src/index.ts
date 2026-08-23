import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./routes/apiRoutes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

// Security & Parsing Middleware
app.use(
  cors({
    origin: [CORS_ORIGIN, "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());

// Request Logging Middleware (Development)
app.use((req, res, next) => {
  console.log(`📡 [${req.method}] ${req.path}`);
  next();
});

// API Endpoints
app.use("/api", apiRoutes);

// Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🌱 CarbonLoop Core REST API Engine`);
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
  console.log(`🔒 Allowed CORS Origin: ${CORS_ORIGIN}`);
  console.log(`==================================================\n`);
});

export default app;
