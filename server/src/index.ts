import express, { Application } from "express";
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
];

app.get("/", (req, res) => {
  res.send("Hello from TS + Express");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
