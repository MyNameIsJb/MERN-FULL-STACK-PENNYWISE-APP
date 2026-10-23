import { Router } from "express";
import {
  getProfile,
  login,
  signup,
  updateProfile,
} from "../controllers/authControllers";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);

export default router;
