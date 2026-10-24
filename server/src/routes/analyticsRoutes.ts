import { Router } from "express";
import {
  getExpensesByCategories,
  getMonthlyTotals,
} from "../controllers/analyticsController";

const router = Router();

router.get("/category", getExpensesByCategories);
router.get("/monthly", getMonthlyTotals);

export default router;
