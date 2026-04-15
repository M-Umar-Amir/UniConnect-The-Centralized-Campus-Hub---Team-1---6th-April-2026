import { ApiError } from "../utils/ApiError.js";
import { POST_TYPES, VISIBILITY } from "../models/Post.js";

const REPORT_REASONS = ["spam", "harassment", "misinformation", "inappropriate", "other"];


export function validateCreatePost(body) {
  const { postType = "text", content, images, poll, visibility } = body;

  if (!POST_TYPES.includes(postType)) {
    throw new ApiError(400, `postType must be one of: ${POST_TYPES.join(", ")}`);
  }

  if (visibility && !VISIBILITY.includes(visibility)) {
    throw new ApiError(400, `visibility must be one of: ${VISIBILITY.join(", ")}`);
  }

  if (content && content.length > 2000) {
    throw new ApiError(400, "Post content must not exceed 2000 characters");
  }
  if (images) {
    if (!Array.isArray(images)) {
      throw new ApiError(400, "images must be an array of URLs");
    }
    if (images.length > 5) {
      throw new ApiError(400, "A post can have at most 5 images");
    }
  }

  if (postType === "poll") {
    if (!poll || !poll.question || !Array.isArray(poll.options)) {
      throw new ApiError(400, "Poll posts require a poll object with question and options");
    }
    if (poll.question.length > 300) {
      throw new ApiError(400, "Poll question must not exceed 300 characters");
    }
    if (poll.options.length < 2 || poll.options.length > 6) {
      throw new ApiError(400, "A poll must have between 2 and 6 options");
    }
    for (const opt of poll.options) {
      if (!opt.text || typeof opt.text !== "string" || opt.text.trim().length === 0) {
        throw new ApiError(400, "Each poll option must have a non-empty text");
      }
      if (opt.text.length > 200) {
        throw new ApiError(400, "Each poll option text must not exceed 200 characters");
      }
    }
  } else {
    const hasContent = content && content.trim().length > 0;
    const hasImages = images && images.length > 0;
    if (!hasContent && !hasImages) {
      throw new ApiError(400, "Post must have content or at least one image");
    }
  }
}

export function validateUpdatePost(body) {
  const { content, images, visibility } = body;

  const hasContent = content !== undefined;
  const hasImages = images !== undefined;
  const hasVisibility = visibility !== undefined;

  if (!hasContent && !hasImages && !hasVisibility) {
    throw new ApiError(400, "At least one field (content, images, visibility) is required");
  }

  if (hasContent && content.length > 2000) {
    throw new ApiError(400, "Post content must not exceed 2000 characters");
  }

  if (hasImages) {
    if (!Array.isArray(images)) {
      throw new ApiError(400, "images must be an array of URLs");
    }
    if (images.length > 5) {
      throw new ApiError(400, "A post can have at most 5 images");
    }
  }

  if (hasVisibility && !VISIBILITY.includes(visibility)) {
    throw new ApiError(400, `visibility must be one of: ${VISIBILITY.join(", ")}`);
  }
}

export function validateReportPost(body) {
  const { reason, details } = body;

  if (!reason) {
    throw new ApiError(400, "Report reason is required");
  }

  if (!REPORT_REASONS.includes(reason)) {
    throw new ApiError(400, `reason must be one of: ${REPORT_REASONS.join(", ")}`);
  }

  if (details && details.length > 500) {
    throw new ApiError(400, "Report details must not exceed 500 characters");
  }
}
