import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { rateLimiter } from "../middleware/rateLimiter.js";
import { createUploadMiddleware, createSingleUploadMiddleware } from "../middleware/upload.js";
import {
  uploadImages,
  uploadVideo,
  uploadAvatar,
  deleteUpload
} from "../controllers/uploadController.js";

const router = Router();

/* Rate limiter for uploads — 20 upload requests per minute */
const uploadLimiter = rateLimiter({
  windowMs: 60_000,
  max: 20,
  message: "Upload rate limit exceeded. Please try again later."
});

/* All routes require authentication */
router.use(requireAuth);
router.use(uploadLimiter);

/**
 * POST /api/uploads/images
 * Field: "files" (max 5 images, max 5 MB each)
 */
router.post(
  "/images",
  createUploadMiddleware({ type: "image", maxFiles: 5, fieldName: "files" }),
  uploadImages
);

/**
 * POST /api/uploads/video
 * Field: "file" (single video, max 50 MB)
 */
router.post(
  "/video",
  createSingleUploadMiddleware({ type: "video", fieldName: "file" }),
  uploadVideo
);

/**
 * POST /api/uploads/avatar
 * Field: "file" (single image, max 5 MB)
 */
router.post(
  "/avatar",
  createSingleUploadMiddleware({ type: "image", fieldName: "file" }),
  uploadAvatar
);

/**
 * DELETE /api/uploads
 * Body: { publicId, resourceType? }
 */
router.delete("/", deleteUpload);

export default router;
