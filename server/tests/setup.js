// Imported first by each test file so the env vars exist before src/config/env.js runs.
process.env.MONGO_URI ||= "mongodb://localhost/test";
process.env.JWT_SECRET ||= "test-secret";
