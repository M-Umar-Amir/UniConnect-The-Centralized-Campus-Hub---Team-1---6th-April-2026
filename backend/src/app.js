import cors from "cors";
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import startupRoutes from "./routes/startupRoutes.js";
import eventPostRoutes from "./routes/eventPostRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import admineventRoutes from "./routes/admineventRoutes.js";

import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;

  res.status(databaseReady ? 200 : 503).json({
    success: databaseReady,
    service: "uniconnect-backend",
    message: "UniConnect backend is running",
    health: "/health",
    database: databaseReady ? "connected" : "disconnected"
  });
});

app.get("/health", async (req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;
  let cloudinaryStatus = "not configured";

  try {
    const { cloudinary } = await import("./config/cloudinary.js");
    const result = await cloudinary.api.ping();
    cloudinaryStatus = result.status === "ok" ? "connected" : "error";
  } catch {
    cloudinaryStatus = "not configured";
  }

  const serviceReady = databaseReady && cloudinaryStatus !== "error";

  res.status(serviceReady ? 200 : 503).json({
    status: serviceReady,
    service: "uniconnect-backend",
    database: databaseReady ? "connected" : "disconnected",
    cloudinary: cloudinaryStatus
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/startups", startupRoutes);
app.use("/api/event-posts", eventPostRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", admineventRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
