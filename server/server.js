import app from "./src/app.js";
import { env } from "./src/config/env.js";
import { connectDB } from "./src/config/db.js";

await connectDB();
app.listen(env.port, () => console.log(`Mastery Loop API running on http://localhost:${env.port}`));
