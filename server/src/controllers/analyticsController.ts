import { NextFunction, Request, Response } from "express";
import { asyncHandler, sendSuccess } from "../utils/responseHelpers";
import { AppError } from "../middleware/errorHandler";
import { fakeExpenses } from "./expenseControllers";
import { ExpenseCategory, MonthlyTotals } from "../types";

export const getExpensesByCategories = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = "user123";

    if (!userId) {
      throw new AppError("User not authenticated. Please login.", 401);
    }

    const userExpenses = fakeExpenses.filter((exp) => exp.userId === userId);

    if (userExpenses.length === 0) {
      throw new AppError("No expenses found for this user.", 404);
    }

    const categoryTotals = userExpenses.reduce(
      (acc, expense) => {
        if (!acc[expense.category]) {
          acc[expense.category] = { total: 0, count: 0 };
        }

        acc[expense.category].total += expense.amount;
        acc[expense.category].count += 1;

        return acc;
      },
      {} as Record<ExpenseCategory, { total: number; count: number }>,
    );

    const grandTotal = Object.values(categoryTotals).reduce(
      (sum, cat) => sum + cat.total,
      0,
    );

    const categoryArray = Object.entries(categoryTotals).map(
      ([category, cat]) => ({
        category,
        ...cat,
        percentage: Math.round((cat.total / grandTotal) * 1000) / 10,
        total: Math.round(cat.total * 100) / 100,
      }),
    );

    categoryArray.sort((a, b) => b.total - a.total);
    sendSuccess(res, categoryArray, "Category breakdown retrieved!");
  },
);

const getMonthString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${month}-${year}`;
};

export const getMonthlyTotals = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = "user123";

    if (!userId) {
      throw new AppError("User not authenticated. Please login.", 401);
    }

    const year = req.query.year
      ? Number(req.query.year)
      : new Date().getFullYear();

    if (isNaN(year)) {
      throw new AppError("Year must be a valid number", 400);
    }

    const currentYear = new Date().getFullYear();
    if (year < 2000 || year > currentYear + 1) {
      throw new AppError(
        `Year must be between 2000 and ${currentYear + 1}`,
        400,
      );
    }

    const userExpenses = fakeExpenses.filter((exp) => {
      const expenseYear = new Date(exp.date).getFullYear();
      return exp.userId === userId && expenseYear === year;
    });

    if (userExpenses.length === 0) {
      return sendSuccess(res, [], `No expenses found for year ${year}`);
    }

    const monthlyTotals = userExpenses.reduce(
      (acc, expense) => {
        const monthString = getMonthString(new Date(expense.date));

        if (!acc[monthString]) {
          acc[monthString] = {
            month: monthString,
            total: 0,
            count: 0,
          };
        }

        acc[monthString].total += expense.amount;
        acc[monthString].count += 1;

        return acc;
      },
      {} as Record<string, MonthlyTotals>,
    );

    const monthlyArray = Object.values(monthlyTotals);

    monthlyArray.sort((a, b) => a.month.localeCompare(b.month));

    monthlyArray.forEach((month) => {
      month.total = Math.round(month.total * 100) / 100;
    });

    sendSuccess(
      res,
      monthlyArray,
      `Monthly totals for year ${year} retrieved.`,
    );
  },
);
