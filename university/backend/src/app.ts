import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import studentsRouter from "./routes/students";
import authRouter from "./routes/auth";
import assessmentRoutes from "./routes/assessments"; // <--- Mukkiyamana Import

dotenv.config();

// Ensure a default NODE_ENV for local debugging
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const app = express();
const PORT = process.env.PORT ?? 4000;

// prefer a full URI if provided
let MONGO_URI = process.env.MONGO_URI ?? "";
if (!MONGO_URI) {
  const MONGO_USER = process.env.MONGO_USER;
  const MONGO_PASS = process.env.MONGO_PASS;
  const MONGO_HOST = process.env.MONGO_HOST;
  const MONGO_DB = process.env.MONGO_DB ?? "mydb";

  if (MONGO_USER && MONGO_PASS && MONGO_HOST) {
    const user = encodeURIComponent(MONGO_USER);
    const pass = encodeURIComponent(MONGO_PASS);
    MONGO_URI = `mongodb+srv://${user}:${pass}@${MONGO_HOST}/${MONGO_DB}?retryWrites=true&w=majority`;
  }
}

// fail fast if still empty
if (!MONGO_URI) {
  console.error("MONGO_URI (or MONGO_USER/MONGO_PASS/MONGO_HOST) is not set. Please add it to your .env");
  process.exit(1);
}

// Create a masked display string for logs (hide password)
let maskedUri = MONGO_URI;
try {
  maskedUri = MONGO_URI.replace(/(\/\/[^:]+:)(.*?)(@)/, (_m, p1, _p2, p3) => `${p1}*****${p3}`);
} catch {
  // ignore if regex fails
}

// CORS: allow dev frontend and credentials; explicitly allow Authorization header
app.use(cors({
  origin: "*",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Authorization"],
}));

app.use(cookieParser());
app.use(express.json());

// Simple request logger for debugging
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// health endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", env: process.env.NODE_ENV });
});

// mount api routes
app.use("/api/auth", authRouter);
app.use("/api/students", studentsRouter);
app.use("/api/assessments", assessmentRoutes); // <--- Mukkiyamana Line (Exam create panna ithu thevai)


console.log(`Attempting MongoDB connection to: ${maskedUri}`);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
  })
  .catch((err: any) => {
    console.error("Mongo connection error:", err);

    // Provide targeted troubleshooting tips for authentication failures
    const msg = err?.message || "";
    if (msg.toLowerCase().includes("authentication failed") || (err?.code === 8000)) {
      console.error("\nAuthentication failed. Troubleshooting tips:");
      console.error("1) Verify the database user & password are correct in Atlas (Database Access).");
      console.error("2) In Atlas > Network Access, add your current IP address (or 0.0.0.0/0 for testing).");
      console.error("3) If the password has special characters, use a URL-encoded MONGO_URI or set MONGO_PASS and let the app encode it.");
      console.error("4) Ensure the user has an appropriate role (read/write) for the target database.");
      console.error("5) Optionally test the exact connection string in MongoDB Compass or the mongo shell.");
    }

    process.exit(1);
  });