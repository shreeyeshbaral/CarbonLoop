import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

/**
 * Global Error Handler Middleware
 */
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("❌ [API Error]:", err);

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: "fail",
      message: "Validation failed on request payload",
      errors: err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  // Handle standard HTTP / Prisma errors
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    status: "error",
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

/**
 * Async handler wrapper to eliminate try/catch boilerplate in controllers
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
