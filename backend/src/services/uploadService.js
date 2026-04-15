import { cloudinary } from "../config/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Uploads a single buffer to Cloudinary.
 *
 * @param {Buffer} buffer      – file buffer from multer
 * @param {object} opts
 * @param {string} opts.folder         – Cloudinary folder (e.g. "posts", "avatars")
 * @param {"image"|"video"|"auto"} opts.resourceType – Cloudinary resource type
 * @param {string} [opts.publicId]     – optional custom public ID
 * @returns {Promise<{ url: string, publicId: string, resourceType: string }>}
 */
export async function uploadToCloudinary(buffer, {
  folder = "uniconnect",
  resourceType = "auto",
  publicId
} = {}) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        ...(publicId && { public_id: publicId }),
        // Image-specific optimizations
        quality: "auto:good",
        fetch_format: "auto"
      },
      (error, result) => {
        if (error) {
          return reject(new ApiError(502, `Cloud upload failed: ${error.message}`));
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes
        });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Uploads multiple buffers to Cloudinary in parallel.
 *
 * @param {Array<{ buffer: Buffer, originalname: string }>} files – from multer req.files
 * @param {object} opts – same as uploadToCloudinary opts
 * @returns {Promise<Array<{ url, publicId, resourceType }>>}
 */
export async function uploadMultipleToCloudinary(files, opts = {}) {
  if (!files || files.length === 0) return [];

  const uploads = files.map((file) =>
    uploadToCloudinary(file.buffer, opts)
  );

  return Promise.all(uploads);
}

/**
 * Delete a resource from Cloudinary by its public ID.
 *
 * @param {string} publicId
 * @param {"image"|"video"} resourceType
 */
export async function deleteFromCloudinary(publicId, resourceType = "image") {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    // Log but don't throw — deletion failures shouldn't break the request
    console.error(`Cloudinary deletion failed for ${publicId}:`, error.message);
  }
}
