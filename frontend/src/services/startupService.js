import { apiClient } from "./apiClient";

export const startupService = {
  list(query = "") {
    const q = query.trim();
    const suffix = q ? `?q=${encodeURIComponent(q)}` : "";
    return apiClient.get(`/api/startups${suffix}`);
  },
  getById(startupId) {
    return apiClient.get(`/api/startups/${startupId}`);
  },
  create(payload) {
    return apiClient.post("/api/startups", payload);
  },
  apply(startupId, payload) {
    return apiClient.post(`/api/startups/${startupId}/collab-request`, payload);
  },
  listRequests(startupId) {
    return apiClient.get(`/api/startups/${startupId}/collab-requests`);
  }
};
