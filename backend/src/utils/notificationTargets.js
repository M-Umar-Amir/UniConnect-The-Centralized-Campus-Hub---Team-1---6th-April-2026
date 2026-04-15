const targetByType = {
  like: (item) => item.targetUrl || "/notifications",
  comment: (item) => item.targetUrl || "/notifications",
  follow: (item) => item.targetUrl || "/notifications",
  event: (item) => item.targetUrl || "/events",
  startup: (item) => item.targetUrl || "/startups",
  announcement: (item) => item.targetUrl || "/notifications"
};

export function resolveNotificationTarget(notification) {
  const resolver = targetByType[notification.type] || targetByType.announcement;
  return resolver(notification);
}
