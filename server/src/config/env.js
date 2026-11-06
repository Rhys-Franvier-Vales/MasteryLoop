import dotenv from "dotenv";

dotenv.config();

for (const key of ["MONGO_URI", "JWT_SECRET"]) {
  if (!process.env[key]) {
    console.error(`Missing ${key}. Copy .env.example to .env and fill it in.`);
    process.exit(1);
  }
}

export const env = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  nodeEnv: process.env.NODE_ENV || "development",
};

// Game / learning rules live in one place so they are easy to tune and to explain.
export const GAME = {
  unlockThreshold: 0.6, // a prerequisite counts as "done" at this mastery
  masteredThreshold: 0.8, // a node counts as "mastered" at this mastery
  xpPerLevel: 200,
  // Streak days roll over at local midnight. 330 = India Standard Time (UTC+5:30).
  tzOffsetMinutes: Number(process.env.STREAK_TZ_OFFSET_MINUTES ?? 330),
};
