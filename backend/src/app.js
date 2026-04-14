import cors from "cors";
import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import eventPostRoutes from "./routes/eventPostRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/health", async (req, res) => {
  const status = { status: "ok", service: "uniconnect-backend" };

  // Cloudinary connection check
  try {
    const { cloudinary } = await import("./config/cloudinary.js");
    const result = await cloudinary.api.ping();
    status.cloudinary = result.status === "ok" ? "connected" : "error";
  } catch {
    status.cloudinary = "not configured";
  }

  res.json(status);
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/events", eventPostRoutes);
app.use("/api/uploads", uploadRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
