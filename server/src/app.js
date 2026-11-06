import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import attemptRoutes from "./routes/attemptRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientUrl }));
app.use(express.json({ limit: "3mb" })); // room for a base64 profile photo

app.get("/api/health", (req, res) => res.json({ status: "ok", app: "Mastery Loop API" }));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/attempts", attemptRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
