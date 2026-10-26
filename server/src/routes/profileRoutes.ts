import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profileControllers";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.get("/", requireAuth, getProfile);
router.put("/", requireAuth, updateProfile);

export default router;
