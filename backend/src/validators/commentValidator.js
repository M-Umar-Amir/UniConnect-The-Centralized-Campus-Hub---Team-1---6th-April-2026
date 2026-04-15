import { ApiError } from "../utils/ApiError.js";

export function validateCreateComment(body) {
  const { content } = body;

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    throw new ApiError(400, "Comment content is required");
  }

  if (content.length > 1000) {
    throw new ApiError(400, "Comment must not exceed 1000 characters");
  }
}

export function validateUpdateComment(body) {
  const { content } = body;

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    throw new ApiError(400, "Comment content is required");
  }

  if (content.length > 1000) {
    throw new ApiError(400, "Comment must not exceed 1000 characters");
  }
}
