import { Router } from "express";
import { getStats, updateMe } from "../controllers/userController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();
router.use(requireAuth);
router.get("/me/stats", getStats);
router.patch("/me", updateMe);

export default router;
