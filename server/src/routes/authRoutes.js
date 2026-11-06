import { Router } from "express";
import rateLimit from "express-rate-limit";
import { register, login, me } from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

// Slow down password guessing: 30 attempts per 15 minutes per IP.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again in a few minutes." },
});

router.post("/register", limiter, register);
router.post("/login", limiter, login);
router.get("/me", requireAuth, me);

export default router;
