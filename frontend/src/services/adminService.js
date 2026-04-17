import { apiClient } from "./apiClient";

export const adminService = {
  listUsers() {
    return apiClient.get("/api/admin/users");
  },
  blockUser(userId) {
    return apiClient.patch(`/api/admin/block/${userId}`, {});
  },
  unblockUser(userId) {
    return apiClient.patch(`/api/admin/unblock/${userId}`, {});
  },
  deleteUser(userId) {
    return apiClient.delete(`/api/admin/user/${userId}`);
  }
};
