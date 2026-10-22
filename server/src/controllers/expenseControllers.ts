import { Request, Response } from "express";
import { ApiResponse, Expense, ExpenseCategory } from "../types";

let fakeExpenses: Expense[] = [
  {
    id: "1",
    userId: "user123",
    amount: 45.99,
    category: ExpenseCategory.FOOD,
    description: "Lunch at restaurant",
    date: new Date("2025-10-15"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    userId: "user123",
    amount: 20.0,
    category: ExpenseCategory.TRANSPORT,
    description: "Uber to work",
    date: new Date("2025-10-14"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const getAllExpenses = (req: Request, res: Response) => {
  const response: ApiResponse<Expense[]> = {
    success: true,
    data: fakeExpenses,
    message: "Expenses retrieved successfully",
  };

  res.status(200).json(response);
};

export const getExpenseById = (req: Request, res: Response) => {
  const { id } = req.params;

  const expense = fakeExpenses.find((exp) => exp.id === id);

  if (!expense) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Expense Not Found",
    };

    return res.status(404).json(response);
  }

  const response: ApiResponse<Expense> = {
    success: true,
    data: expense,
  };

  res.status(200).json(response);
};

export const createExpense = (req: Request, res: Response) => {
  const { amount, category, description, date } = req.body;

  if (!amount || !category || !description) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Please provide amount, category and description",
    };

    return res.status(400).json(response);
  }

  const newExpense: Expense = {
    id: crypto.randomUUID(),
    userId: "user123",
    amount,
    category,
    description,
    date: date ? new Date(date) : new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  fakeExpenses.push(newExpense);

  const response: ApiResponse<Expense> = {
    success: true,
    data: newExpense,
    message: "Expense created successfully",
  };

  res.status(201).json(response);
};

export const updateExpense = (req: Request, res: Response) => {
  const { id } = req.params;

  const { amount, category, description, date } = req.body;

  const expenseId = fakeExpenses.findIndex((expense) => expense.id === id);

  if (expenseId === -1) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Expense not found",
    };

    return res.status(404).json(response);
  }

  fakeExpenses[expenseId] = {
    ...fakeExpenses[expenseId],
    amount: amount || fakeExpenses[expenseId].amount,
    category: category || fakeExpenses[expenseId].category,
    description: description || fakeExpenses[expenseId].description,
    date: date ? new Date(date) : fakeExpenses[expenseId].date,

    updatedAt: new Date(),
  };

  const response: ApiResponse<Expense> = {
    success: true,
    data: fakeExpenses[expenseId],
    message: "Expense updated successfully",
  };

  res.status(200).json(response);
};

export const deleteExpense = (req: Request, res: Response) => {
  const { id } = req.params;

  const expenseId = fakeExpenses.findIndex((expense) => expense.id === id);

  if (expenseId === -1) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Expense not found",
    };

    return res.status(404).json(response);
  }

  fakeExpenses.splice(expenseId, 1);

  const response: ApiResponse<null> = {
    success: true,
    message: "Expense deleted successfully",
  };

  res.status(200).json(response);
};
