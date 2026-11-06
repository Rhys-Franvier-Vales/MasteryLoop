import { Router } from "express";
import { getQuestion, submitAttempt } from "../controllers/attemptController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();
router.use(requireAuth);
router.get("/question/:nodeId", getQuestion);
router.post("/", submitAttempt);

export default router;
