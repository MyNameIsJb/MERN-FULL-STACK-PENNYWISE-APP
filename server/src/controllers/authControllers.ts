import { Request, Response } from "express";
import { ApiResponse, AuthResponse, User } from "../types";

let fakeUsers: User[] = [
  {
    id: "user123",
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "user456",
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password456",
    createdAt: new Date("2026-01-05"),
    updatedAt: new Date("2026-01-05"),
  },
];

export const signup = (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Please provide name, email and password",
    };

    res.status(400).json(response);
  }

  const existingUser = fakeUsers.find((user) => user.email === email);

  if (existingUser) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Email already registered",
    };

    res.status(400).json(response);
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

  const authReponse = {
    user: userWithoutPassword,
    token: "fake-jwt-token-" + newUser.id,
  };

  const response: ApiResponse<AuthResponse> = {
    success: true,
    data: authReponse,
    message: "Account created successfully",
  };

  res.status(201).json(response);
};
