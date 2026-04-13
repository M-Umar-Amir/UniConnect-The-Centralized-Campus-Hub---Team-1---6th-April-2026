import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function signAccessToken(user) {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
      tokenVersion: user.tokenVersion
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}
