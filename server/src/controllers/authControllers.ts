import { Request, Response } from "express";
import { ApiResponse, AuthResponse, User } from "../types";

let fakeUsers: User[] = [
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

  const authReponse: AuthResponse = {
    user: userWithoutPassword,
    token: "fake-jwt-token-" + newUser.id,
  };

  const response: ApiResponse<AuthResponse> = {
    success: true,
    data: authReponse,
    message: "Account created successfully!",
  };

  res.status(201).json(response);
};

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Please provide email and password",
    };

    res.status(400).json(response);
    return;
  }

  const user = fakeUsers.find((user) => user.email === email);

  if (!user || user.password !== password) {
    const response: ApiResponse<null> = {
      success: false,
      error: "invalid email and password",
    };

    res.status(401).json(response);
    return;
  }

  const { password: _, ...userWithoutPassword } = user;

  const authReponse: AuthResponse = {
    user: userWithoutPassword,
    token: "fake-jwt-token-" + user.id,
  };

  const response: ApiResponse<AuthResponse> = {
    success: true,
    data: authReponse,
    message: "Login successful!",
  };

  res.status(201).json(response);
};

export const getProfile = (req: Request, res: Response) => {
  const userId = "user456";

  const user = fakeUsers.find((user) => user.id === userId);

  if (!user) {
    const response: ApiResponse<null> = {
      success: false,
      error: "User not found",
    };

    res.status(404).json(response);
    return;
  }

  const { password: _, ...userWithoutPassword } = user;

  const response: ApiResponse<Omit<User, "password">> = {
    success: true,
    data: userWithoutPassword,
  };

  res.status(200).json(response);
};

export const updateProfile = (req: Request, res: Response) => {
  const { name, email } = req.body;

  const userId = "user123";

  const userIndex = fakeUsers.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    const response: ApiResponse<null> = {
      success: false,
      error: "User not found",
    };

    res.status(404).json(response);
    return;
  }

  if (email && email !== fakeUsers[userIndex].email) {
    const emailExists = fakeUsers.find((user) => user.email === email);

    if (emailExists) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Email already in use!",
      };

      res.status(409).json(response);
      return;
    }
  }

  fakeUsers[userIndex] = {
    ...fakeUsers[userIndex],
    name: name || fakeUsers[userIndex].name,
    email: email || fakeUsers[userIndex].email,
    updatedAt: new Date(),
  };

  const { password: _, ...userWithoutPassword } = fakeUsers[userIndex];

  const response: ApiResponse<Omit<User, "password">> = {
    success: true,
    data: userWithoutPassword,
    message: "Profile updated successfully!",
  };

  res.status(200).json(response);
};
