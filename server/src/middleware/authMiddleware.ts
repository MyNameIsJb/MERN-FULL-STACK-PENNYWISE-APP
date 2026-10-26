import { NextFunction, Request, Response } from "express";
import { AppError } from "./errorHandler";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = "user123";

  if (!userId) {
    throw new AppError("User not authenticated. Please login.", 401);
  }

  req.userId = userId;

  next();
};
