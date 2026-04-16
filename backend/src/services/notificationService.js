import { Notification } from "../models/Notification.js";

export async function createNotification({
  recipient,
  actor = null,
  type,
  text,
  targetUrl,
  referenceThumbnail = ""
}) {
  if (!recipient || !type || !text || !targetUrl) {
    return null;
  }

  return Notification.create({
    recipient,
    actor,
    type,
    text,
    targetUrl,
    referenceThumbnail
  });
}
