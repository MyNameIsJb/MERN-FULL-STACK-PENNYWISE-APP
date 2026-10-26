import { NextFunction, Request, Response } from "express";
import { ApiResponse, User } from "../types";
import { fakeUsers } from "./authControllers";
import { asyncHandler, sendSuccess } from "../utils/responseHelpers";
import { AppError } from "../middleware/errorHandler";

export const getProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    const user = fakeUsers.find((user) => user.id === userId)!;

    const { password: _, ...userWithoutPassword } = user;

    sendSuccess(res, userWithoutPassword, "Profile retrieved successfully!");
  },
);

export const updateProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    const userId = req.userId;

    if (!name && !email && !password) {
      throw new AppError(
        "Please provide name, email or password to update",
        400,
      );
    }

    if (name && name.trim().length < 2) {
      throw new AppError("Name must be at least 2 characters long.", 400);
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new AppError("Invalid email format", 400);
      }
    }

    if (password) {
      if (password.length < 8) {
        throw new AppError("Password must be at least 8 characters.", 400);
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;
      if (!passwordRegex.test(password)) {
        throw new AppError(
          "Password must contain uppercase, lowercase, number, and special character (@$!%*?&)",
          400,
        );
      }
    }

    const userIndex = fakeUsers.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      throw new AppError("User not found", 404);
    }

    if (email && email !== fakeUsers[userIndex].email) {
      const emailExists = fakeUsers.find((user) => user.email === email);

      if (emailExists) {
        throw new AppError("Email already in use!", 400);
      }
    }

    fakeUsers[userIndex] = {
      ...fakeUsers[userIndex],
      name: name || fakeUsers[userIndex].name,
      email: email || fakeUsers[userIndex].email,
      updatedAt: new Date(),
    };

    const { password: _, ...userWithoutPassword } = fakeUsers[userIndex];

    sendSuccess(res, userWithoutPassword, "Profile updated successfully!");
  },
);
