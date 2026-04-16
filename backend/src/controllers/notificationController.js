import { Notification } from "../models/Notification.js";
import { resolveNotificationTarget } from "../utils/notificationTargets.js";

const filterMap = {
  all: null,
  likes: "like",
  comments: "comment",
  follows: "follow",
  events: "event",
  event_reg: "event_reg",
  startups: "startup",
  startup_match: "startup_match",
  announcements: "announcement"
};

function serializeNotification(notification) {
  const plain = typeof notification.toObject === "function" ? notification.toObject() : notification;

  return {
    ...plain,
    targetUrl: resolveNotificationTarget(plain)
  };
}

export async function listNotifications(req, res, next) {
  try {
    const filter = String(req.query.filter || "all").toLowerCase();
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(50, Math.max(1, Number(req.query.limit || 20)));

    const query = { recipient: req.user._id };
    if (filterMap[filter]) {
      query.type = filterMap[filter];
    }

    const items = await Notification.find(query)
      .populate("actor", "fullName avatarUrl")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const unreadCount = await Notification.countDocuments({ recipient: req.user._id, isRead: false });

    res.json({
      success: true,
      items: items.map(serializeNotification),
      page,
      limit,
      unreadCount
    });
  } catch (error) {
    next(error);
  }
}

export async function recentNotifications(req, res, next) {
  try {
    const limit = Math.min(8, Math.max(5, Number(req.query.limit || 8)));

    const items = await Notification.find({ recipient: req.user._id })
      .populate("actor", "fullName avatarUrl")
      .sort({ createdAt: -1 })
      .limit(limit);

    const unreadCount = items.filter((item) => !item.isRead).length;

    res.json({
      success: true,
      items: items.map(serializeNotification),
      unreadCount
    });
  } catch (error) {
    next(error);
  }
}

export async function markNotificationRead(req, res, next) {
  try {
    const item = await Notification.findOneAndUpdate(
      { _id: req.params.id || req.params.notificationId, recipient: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.json({ success: true, item: serializeNotification(item) });
  } catch (error) {
    next(error);
  }
}

export async function markAllRead(req, res, next) {
  try {
    const result = await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    next(error);
  }
}
