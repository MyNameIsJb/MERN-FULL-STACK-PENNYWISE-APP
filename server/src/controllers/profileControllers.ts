import { NextFunction, Request, Response } from "express";
import { ApiResponse, User } from "../types";
import { fakeUsers } from "./authControllers";
import { asyncHandler, sendSuccess } from "../utils/responseHelpers";
import { AppError } from "../middleware/errorHandler";

export const getProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = "user456";

    const user = fakeUsers.find((user) => user.id === userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const { password: _, ...userWithoutPassword } = user;

    sendSuccess(res, userWithoutPassword, "Profile retrieved successfully!");
  },
);

export const updateProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email } = req.body;

    const userId = "user123";

    if (!name && !email) {
      throw new AppError("Please provide name and email to update", 400);
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
