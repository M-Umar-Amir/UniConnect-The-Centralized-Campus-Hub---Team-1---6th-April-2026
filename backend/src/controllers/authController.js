import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { signAccessToken } from "../services/tokenService.js";
import {
  createEmailChangeVerification,
  verifyEmailChangeCode
} from "../services/emailVerificationService.js";

function sanitizeUser(user) {
  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    university: user.university,
    isVerified: user.isVerified,
    notificationSettings: user.notificationSettings,
    privacySettings: user.privacySettings
  };
}

export async function register(req, res, next) {
  try {
    const { fullName, email, password, role = "student", university = "" } = req.body;

    if (!fullName || !email || !password) {
      throw new ApiError(400, "fullName, email and password are required");
    }

    if (password.length < 8) {
      throw new ApiError(400, "Password must be at least 8 characters long");
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      throw new ApiError(409, "Email is already in use");
    }

    const user = new User({ fullName, email, role, university });
    await user.setPassword(password);
    await user.save();

    const token = signAccessToken(user);

    res.status(201).json({
      success: true,
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "email and password are required");
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      throw new ApiError(401, "Invalid email or password");
    }

    const token = signAccessToken(user);

    res.json({
      success: true,
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res) {
  res.json({ success: true, user: sanitizeUser(req.user) });
}

export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      throw new ApiError(400, "All password fields are required");
    }

    if (newPassword !== confirmPassword) {
      throw new ApiError(400, "New password and confirm password do not match");
    }

    if (newPassword.length < 8) {
      throw new ApiError(400, "New password must be at least 8 characters long");
    }

    if (!(await req.user.comparePassword(currentPassword))) {
      throw new ApiError(401, "Current password is incorrect");
    }

    await req.user.setPassword(newPassword);
    req.user.tokenVersion += 1;
    await req.user.save();

    const token = signAccessToken(req.user);

    res.json({
      success: true,
      token,
      message: "Password updated successfully"
    });
  } catch (error) {
    next(error);
  }
}

export async function requestEmailChange(req, res, next) {
  try {
    const { currentPassword, newEmail } = req.body;

    if (!currentPassword || !newEmail) {
      throw new ApiError(400, "currentPassword and newEmail are required");
    }

    if (!(await req.user.comparePassword(currentPassword))) {
      throw new ApiError(401, "Current password is incorrect");
    }

    const normalized = newEmail.toLowerCase();
    if (normalized === req.user.email) {
      throw new ApiError(400, "New email must be different from current email");
    }

    const existing = await User.findOne({ email: normalized });
    if (existing) {
      throw new ApiError(409, "Email is already in use");
    }

    await createEmailChangeVerification(req.user._id, normalized);

    res.json({
      success: true,
      message: "Verification code sent to new email"
    });
  } catch (error) {
    next(error);
  }
}

export async function verifyEmailChange(req, res, next) {
  try {
    const { code } = req.body;

    if (!code) {
      throw new ApiError(400, "Verification code is required");
    }

    const verifiedEmail = await verifyEmailChangeCode(req.user._id, code);
    if (!verifiedEmail) {
      throw new ApiError(400, "Invalid or expired verification code");
    }

    req.user.email = verifiedEmail;
    req.user.isVerified = true;
    await req.user.save();

    res.json({
      success: true,
      message: "Email changed successfully",
      user: sanitizeUser(req.user)
    });
  } catch (error) {
    next(error);
  }
}

export async function logoutOtherDevices(req, res, next) {
  try {
    req.user.tokenVersion += 1;
    await req.user.save();

    const token = signAccessToken(req.user);

    res.json({
      success: true,
      token,
      message: "Logged out from all other devices"
    });
  } catch (error) {
    next(error);
  }
}
