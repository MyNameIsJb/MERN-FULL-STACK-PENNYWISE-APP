import { NextFunction, Request, Response } from "express";
import { ApiResponse, AuthResponse, User } from "../types";
import { asyncHandler, sendSuccess } from "../utils/responseHelpers";
import { AppError } from "../middleware/errorHandler";

export let fakeUsers: User[] = [
  {
    id: "user123",
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    createdAt: new Date("2025-12-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "user456",
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password456",
    createdAt: new Date("2025-12-01"),
    updatedAt: new Date("2026-01-05"),
  },
];

export const signup = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new AppError("Please provide name, email, and password", 400);
    }

    const existingUser = fakeUsers.find((user) => user.email === email);

    if (existingUser) {
      throw new AppError("Email already registered", 400);
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    fakeUsers.push(newUser);

    const { password: _, ...userWithoutPassword } = newUser;

    const authReponse: AuthResponse = {
      user: userWithoutPassword,
      token: "fake-jwt-token-" + newUser.id,
    };

    sendSuccess(res, authReponse, "Account created successfully!", 201);
  },
);

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("Please provide email and password", 400);
      8;
    }

    const user = fakeUsers.find((user) => user.email === email);

    if (!user || password !== user.password) {
      throw new AppError("Invalid email or password", 401);
    }

    const { password: _, ...userWithoutPassword } = user;

    const authReponse: AuthResponse = {
      user: userWithoutPassword,
      token: "fake-jwt-token-" + user.id,
    };

    sendSuccess(res, authReponse, "Log in successful!");
  },
);
