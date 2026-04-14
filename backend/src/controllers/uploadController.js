import { ApiError } from "../utils/ApiError.js";
import {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  deleteFromCloudinary
} from "../services/uploadService.js";

/* ================================================================== */
/*  Upload multiple images                                             */
/* ================================================================== */

/**
 * POST /api/uploads/images
 * Accepts multipart/form-data with field "files" (max 5 images).
 * Returns array of Cloudinary URLs.
 */
export async function uploadImages(req, res, next) {
  try {
    if (!req.files || req.files.length === 0) {
      throw new ApiError(400, "At least one image file is required");
    }

    const results = await uploadMultipleToCloudinary(req.files, {
      folder: "uniconnect/posts",
      resourceType: "image"
    });

    res.status(201).json({
      success: true,
      uploads: results.map((r) => ({
        url: r.url,
        publicId: r.publicId,
        width: r.width,
        height: r.height,
        format: r.format,
        bytes: r.bytes
      }))
    });
  } catch (error) {
    next(error);
  }
}

/* ================================================================== */
/*  Upload single video                                                */
/* ================================================================== */

/**
 * POST /api/uploads/video
 * Accepts multipart/form-data with field "file" (single video, max 50 MB).
 * Returns Cloudinary URL.
 */
export async function uploadVideo(req, res, next) {
  try {
    if (!req.file) {
      throw new ApiError(400, "A video file is required");
    }

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: "uniconnect/videos",
      resourceType: "video"
    });

    res.status(201).json({
      success: true,
      upload: {
        url: result.url,
        publicId: result.publicId,
        format: result.format,
        bytes: result.bytes
      }
    });
  } catch (error) {
    next(error);
  }
}

/* ================================================================== */
/*  Upload avatar / cover image                                        */
/* ================================================================== */

/**
 * POST /api/uploads/avatar
 * Accepts multipart/form-data with field "file" (single image).
 * Optimized for profile pictures (auto crop, 400x400 max).
 */
export async function uploadAvatar(req, res, next) {
  try {
    if (!req.file) {
      throw new ApiError(400, "An image file is required");
    }

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: "uniconnect/avatars",
      resourceType: "image"
    });

    res.status(201).json({
      success: true,
      upload: {
        url: result.url,
        publicId: result.publicId
      }
    });
  } catch (error) {
    next(error);
  }
}

/* ================================================================== */
/*  Delete a previously uploaded resource                               */
/* ================================================================== */

/**
 * DELETE /api/uploads
 * Body: { publicId: string, resourceType?: "image" | "video" }
 */
export async function deleteUpload(req, res, next) {
  try {
    const { publicId, resourceType = "image" } = req.body;

    if (!publicId) {
      throw new ApiError(400, "publicId is required");
    }

    await deleteFromCloudinary(publicId, resourceType);

    res.json({ success: true, message: "Resource deleted" });
  } catch (error) {
    next(error);
  }
}
