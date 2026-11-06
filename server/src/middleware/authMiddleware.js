import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import User from "../models/User.js";
import { asyncHandler, HttpError } from "../utils/helpers.js";

// Protects a route: reads "Authorization: Bearer <token>", verifies it, and attaches
// the logged-in user to req.user for the controller that runs next.
export const requireAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) throw new HttpError(401, "Please log in to continue.");

  const decoded = jwt.verify(token, env.jwtSecret); // throws if invalid or expired
  const user = await User.findById(decoded.id);
  if (!user) throw new HttpError(401, "This account no longer exists.");

  req.user = user;
  next();
});
