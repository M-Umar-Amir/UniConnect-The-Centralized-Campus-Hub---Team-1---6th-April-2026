import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new ApiError(401, "Authentication required");
    }

    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.userId);

    if (!user || user.tokenVersion !== payload.tokenVersion) {
      throw new ApiError(401, "Session is invalid. Please log in again");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error.name === "JsonWebTokenError" ? new ApiError(401, "Invalid token") : error);
  }
}

export function requireRole(...allowedRoles) {
  return function roleMiddleware(req, res, next) {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, "You do not have permission to access this resource"));
    }

    return next();
  };
}
