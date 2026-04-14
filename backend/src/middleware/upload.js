import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

/* ------------------------------------------------------------------ */
/*  Allowed MIME types                                                 */
/* ------------------------------------------------------------------ */
const IMAGE_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml"
]);

const VIDEO_MIMES = new Set([
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/webm"
]);

const ALL_MEDIA_MIMES = new Set([...IMAGE_MIMES, ...VIDEO_MIMES]);

/* ------------------------------------------------------------------ */
/*  Size limits                                                        */
/* ------------------------------------------------------------------ */
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;  // 5 MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 MB

/* ------------------------------------------------------------------ */
/*  Multer factory                                                     */
/* ------------------------------------------------------------------ */

/**
 * Creates a multer middleware configured for in-memory buffer storage.
 *
 * @param {object}  opts
 * @param {"image"|"video"|"any"} opts.type – restrict to images, videos, or both
 * @param {number}  opts.maxFiles     – max number of files per request (default 5)
 * @param {string}  opts.fieldName    – form field name (default "files")
 * @returns {Function} multer .array() middleware
 */
export function createUploadMiddleware({
  type = "any",
  maxFiles = 5,
  fieldName = "files"
} = {}) {
  const allowedMimes =
    type === "image" ? IMAGE_MIMES :
    type === "video" ? VIDEO_MIMES :
    ALL_MEDIA_MIMES;

  const maxSize = type === "video" ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

  const storage = multer.memoryStorage();

  const upload = multer({
    storage,
    limits: {
      fileSize: maxSize,
      files: maxFiles
    },
    fileFilter(_req, file, cb) {
      if (!allowedMimes.has(file.mimetype)) {
        return cb(
          new ApiError(
            400,
            `Unsupported file type: ${file.mimetype}. Allowed: ${[...allowedMimes].join(", ")}`
          )
        );
      }
      cb(null, true);
    }
  });

  return upload.array(fieldName, maxFiles);
}

/**
 * Convenience: single-file upload middleware.
 */
export function createSingleUploadMiddleware({
  type = "any",
  fieldName = "file"
} = {}) {
  const allowedMimes =
    type === "image" ? IMAGE_MIMES :
    type === "video" ? VIDEO_MIMES :
    ALL_MEDIA_MIMES;

  const maxSize = type === "video" ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

  const storage = multer.memoryStorage();

  const upload = multer({
    storage,
    limits: { fileSize: maxSize, files: 1 },
    fileFilter(_req, file, cb) {
      if (!allowedMimes.has(file.mimetype)) {
        return cb(
          new ApiError(
            400,
            `Unsupported file type: ${file.mimetype}. Allowed: ${[...allowedMimes].join(", ")}`
          )
        );
      }
      cb(null, true);
    }
  });

  return upload.single(fieldName);
}
