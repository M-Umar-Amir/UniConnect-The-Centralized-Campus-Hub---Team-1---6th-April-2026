import { apiClient } from "./apiClient";

export const notificationService = {
  getNotifications(filter = "all") {
    return apiClient.get(`/api/notifications?filter=${filter}`);
  },
  getRecent(limit = 8) {
    return apiClient.get(`/api/notifications/recent?limit=${limit}`);
  },
  markAsRead(notificationId) {
    return apiClient.patch(`/api/notifications/${notificationId}/read`, {});
  },
  markAllRead() {
    return apiClient.patch("/api/notifications/read-all", {});
  }
};
