import express, { Application, Request, Response } from "express";
import { Expense, ExpenseCategory } from "./types";

const app: Application = express();
const PORT = 8000;

app.use(express.json());

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

// Basic Health Check Route
app.get("/", (req, res) => {
  res.send("Hello from TS + Express");
});

// Get All Expenses
app.get("/api/expenses", (req: Request, res: Response) => {
  const response = {
    success: true,
    data: fakeExpenses,
    message: "Expenses retrieved successfully",
  };

  res.status(200).json(response);
});

// Get Single Expense by ID
app.get("/api/expenses/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  const expense = fakeExpenses.find((exp) => exp.id === id);

  if (!expense) {
    const response = {
      success: false,
      error: "Expense Not Found",
    };

    return res.status(404).json(response);
  }

  const response = {
    success: true,
    data: expense,
  };

  res.status(200).json(response);
});

// Create New Expense
app.post("/api/expenses", (req: Request, res: Response) => {
  const { amount, category, description, date } = req.body;

  if (!amount || !category || !description) {
    const response = {
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

  const response = {
    success: true,
    data: newExpense,
    message: "Expense created successfully",
  };

  res.status(201).json(response);
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
