import { apiClient } from "./apiClient";

export const tagService = {
  list() {
    return apiClient.get("/api/tags");
  },
  create(name) {
    return apiClient.post("/api/tags", { name });
  },
  remove(tagId) {
    return apiClient.delete(`/api/tags/${tagId}`);
  }
};
