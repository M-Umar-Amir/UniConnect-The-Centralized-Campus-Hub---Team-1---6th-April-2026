import { ApiError } from "../utils/ApiError.js";
import { STARTUP_STATUS } from "../models/Startup.js";

export function validateCreateStartup(body) {
  if (!body.name) throw new ApiError(400, "name is required");
  if (body.tagline && body.tagline.length > 100) {
    throw new ApiError(400, "tagline must not exceed 100 characters");
  }
  if (body.status && !STARTUP_STATUS.includes(body.status)) {
    throw new ApiError(400, `status must be one of: ${STARTUP_STATUS.join(", ")}`);
  }
}

export function validateUpdateStartup(body) {
  const allowed = [
    "name", "tagline", "logo", "problemStatement", "solution", "businessModel",
    "targetAudience", "domainTags", "rolesNeeded", "status", "team"
  ];
  const hasAtLeastOne = Object.keys(body).some((key) => allowed.includes(key));
  if (!hasAtLeastOne) throw new ApiError(400, "No valid startup update fields provided");

  if (body.tagline && body.tagline.length > 100) {
    throw new ApiError(400, "tagline must not exceed 100 characters");
  }
  if (body.status && !STARTUP_STATUS.includes(body.status)) {
    throw new ApiError(400, `status must be one of: ${STARTUP_STATUS.join(", ")}`);
  }
}

export function validateCollabRequest(body) {
  if (!body.role) throw new ApiError(400, "role is required");
  if (body.message && body.message.length > 1000) {
    throw new ApiError(400, "message must not exceed 1000 characters");
  }
}

export function validateCollabReview(body) {
  if (!["accepted", "declined"].includes(body.status)) {
    throw new ApiError(400, "status must be either accepted or declined");
  }
}

export function validateStartupUpdate(body) {
  if (!body.content) throw new ApiError(400, "content is required");
  if (body.content.length > 1500) {
    throw new ApiError(400, "content must not exceed 1500 characters");
  }
  if (body.media && !Array.isArray(body.media)) {
    throw new ApiError(400, "media must be an array of URLs");
  }
}
