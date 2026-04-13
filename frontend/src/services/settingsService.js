import { apiClient } from "./apiClient";

export const settingsService = {
  changePassword(payload) {
    return apiClient.patch("/api/auth/change-password", payload);
  },
  requestEmailChange(payload) {
    return apiClient.post("/api/auth/change-email/request", payload);
  },
  verifyEmailChange(payload) {
    return apiClient.post("/api/auth/change-email/verify", payload);
  },
  logoutOtherDevices() {
    return apiClient.post("/api/auth/logout-others", {});
  },
  updateNotificationSettings(payload) {
    return apiClient.patch("/api/users/me/notifications", payload);
  },
  updatePrivacySettings(payload) {
    return apiClient.patch("/api/users/me/privacy", payload);
  },
  updateProfile(payload) {
    return apiClient.patch("/api/users/me/profile", payload);
  }
};
