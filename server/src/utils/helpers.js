import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Lets async controllers throw errors without a try/catch in every function.
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export function signToken(userId) {
  return jwt.sign({ id: userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

export const round = (n, places = 2) => {
  const f = 10 ** places;
  return Math.round(n * f) / f;
};
