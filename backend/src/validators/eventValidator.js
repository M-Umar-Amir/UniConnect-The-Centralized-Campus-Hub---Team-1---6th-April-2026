import { ApiError } from "../utils/ApiError.js";
import { EVENT_STATUS, EVENT_TYPES } from "../models/Event.js";

function validateDateRange(startDate, endDate) {
  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    throw new ApiError(400, "endDate must be after startDate");
  }
}

export function validateCreateEvent(body) {
  const required = ["title", "shortDescription", "eventType", "startDate", "endDate", "venue"];
  for (const field of required) {
    if (!body[field]) throw new ApiError(400, `${field} is required`);
  }

  if (!EVENT_TYPES.includes(body.eventType)) {
    throw new ApiError(400, `eventType must be one of: ${EVENT_TYPES.join(", ")}`);
  }
  if (body.shortDescription.length > 280) {
    throw new ApiError(400, "shortDescription must not exceed 280 characters");
  }
  validateDateRange(body.startDate, body.endDate);
}

export function validateUpdateEvent(body) {
  const allowed = [
    "title", "shortDescription", "fullDescription", "eventType", "startDate", "endDate", "venue",
    "isOnline", "coverImage", "tags", "capacity", "registrationDeadline", "waitlistEnabled",
    "registrationRequired", "status", "society", "segments", "media"
  ];
  const hasAtLeastOne = Object.keys(body).some((key) => allowed.includes(key));
  if (!hasAtLeastOne) throw new ApiError(400, "No valid event update fields provided");

  if (body.eventType && !EVENT_TYPES.includes(body.eventType)) {
    throw new ApiError(400, `eventType must be one of: ${EVENT_TYPES.join(", ")}`);
  }
  if (body.status && !EVENT_STATUS.includes(body.status)) {
    throw new ApiError(400, `status must be one of: ${EVENT_STATUS.join(", ")}`);
  }
  if (body.shortDescription && body.shortDescription.length > 280) {
    throw new ApiError(400, "shortDescription must not exceed 280 characters");
  }
  validateDateRange(body.startDate, body.endDate);
}

export function validateEventRegistration(body) {
  if (body.segment !== undefined && typeof body.segment !== "string") {
    throw new ApiError(400, "segment must be a string");
  }
}

export function validateEventRating(body) {
  const rating = Number(body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new ApiError(400, "rating must be an integer between 1 and 5");
  }
}

export function validateEventHighlight(body) {
  if (!body.caption || typeof body.caption !== "string") {
    throw new ApiError(400, "caption is required");
  }
  if (body.caption.length > 300) {
    throw new ApiError(400, "caption must not exceed 300 characters");
  }
  if (body.media && !Array.isArray(body.media)) {
    throw new ApiError(400, "media must be an array of URLs");
  }
}
