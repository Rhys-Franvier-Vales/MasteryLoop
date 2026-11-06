import { env } from "../config/env.js";

export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// Every error in the app ends up here, so the client always gets { message }.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  let status = err.status || 500;
  let message = err.message || "Server error";

  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
  } else if (err.name === "CastError") {
    status = 400;
    message = "Invalid id.";
  } else if (err.code === 11000) {
    status = 409;
    message = "That value is already in use.";
  } else if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    status = 401;
    message = "Your session has expired. Please log in again.";
  } else if (err.type === "entity.too.large") {
    status = 413;
    message = "That upload is too large.";
  }

  if (status >= 500) console.error(err);
  res.status(status).json({
    message: status >= 500 && env.nodeEnv === "production" ? "Something went wrong on our side." : message,
  });
}
