import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

/**
 * Validates that a value is a valid MongoDB ObjectId.
 * @param {string} id    – value to check
 * @param {string} label – human-readable field name for the error message
 * @throws {ApiError} 400 if invalid
 */
export function validateObjectId(id, label = "ID") {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, `Invalid ${label}`);
  }
}

/**
 * Parses and clamps pagination query parameters.
 * Returns safe { page, limit, skip } values.
 *
 * Defaults: page = 1, limit = 20.
 * Max limit is clamped to 50 to prevent excessive reads.
 */
export function parsePagination(query = {}) {
  let page = parseInt(query.page, 10);
  let limit = parseInt(query.limit, 10);

  if (!Number.isFinite(page) || page < 1) page = 1;
  if (!Number.isFinite(limit) || limit < 1) limit = 20;
  if (limit > 50) limit = 50;

  return { page, limit, skip: (page - 1) * limit };
}
