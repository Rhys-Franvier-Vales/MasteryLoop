import { Router } from "express";
import { getTree, getDue } from "../controllers/skillController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();
router.use(requireAuth);
router.get("/", getTree);
router.get("/due", getDue);

export default router;
