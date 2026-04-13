import mongoose from "mongoose";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";

export async function updateOwnProfile(req, res, next) {
  try {
    const editable = ["fullName", "university", "bio", "avatarUrl", "coverUrl", "interests", "links"];

    for (const key of editable) {
      if (Object.hasOwn(req.body, key)) {
        req.user[key] = req.body[key];
      }
    }

    await req.user.save();

    res.json({ success: true, user: req.user });
  } catch (error) {
    next(error);
  }
}

export async function updateNotificationSettings(req, res, next) {
  try {
    req.user.notificationSettings = {
      ...req.user.notificationSettings.toObject(),
      ...req.body
    };

    await req.user.save();

    res.json({ success: true, notificationSettings: req.user.notificationSettings });
  } catch (error) {
    next(error);
  }
}

export async function updatePrivacySettings(req, res, next) {
  try {
    req.user.privacySettings = {
      ...req.user.privacySettings.toObject(),
      ...req.body
    };

    await req.user.save();

    res.json({ success: true, privacySettings: req.user.privacySettings });
  } catch (error) {
    next(error);
  }
}

export async function followUser(req, res, next) {
  try {
    const targetUserId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      throw new ApiError(400, "Invalid user ID");
    }

    if (String(req.user._id) === targetUserId) {
      throw new ApiError(400, "You cannot follow yourself");
    }

    const target = await User.findById(targetUserId);
    if (!target) {
      throw new ApiError(404, "User not found");
    }

    const alreadyFollowing = req.user.following.some((id) => String(id) === targetUserId);
    if (!alreadyFollowing) {
      req.user.following.push(target._id);
    }

    const isFollower = target.followers.some((id) => String(id) === String(req.user._id));
    if (!isFollower) {
      target.followers.push(req.user._id);
    }

    await Promise.all([req.user.save(), target.save()]);

    res.json({ success: true, message: "User followed" });
  } catch (error) {
    next(error);
  }
}

export async function unfollowUser(req, res, next) {
  try {
    const targetUserId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      throw new ApiError(400, "Invalid user ID");
    }

    const target = await User.findById(targetUserId);
    if (!target) {
      throw new ApiError(404, "User not found");
    }

    req.user.following = req.user.following.filter((id) => String(id) !== targetUserId);
    target.followers = target.followers.filter((id) => String(id) !== String(req.user._id));

    await Promise.all([req.user.save(), target.save()]);

    res.json({ success: true, message: "User unfollowed" });
  } catch (error) {
    next(error);
  }
}

export async function saveEvent(req, res, next) {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      throw new ApiError(400, "Invalid event ID");
    }

    const exists = req.user.savedEvents.some((id) => String(id) === eventId);
    if (!exists) {
      req.user.savedEvents.push(eventId);
      await req.user.save();
    }

    res.json({ success: true, savedEvents: req.user.savedEvents });
  } catch (error) {
    next(error);
  }
}

export async function unsaveEvent(req, res, next) {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      throw new ApiError(400, "Invalid event ID");
    }

    req.user.savedEvents = req.user.savedEvents.filter((id) => String(id) !== eventId);
    await req.user.save();

    res.json({ success: true, savedEvents: req.user.savedEvents });
  } catch (error) {
    next(error);
  }
}
