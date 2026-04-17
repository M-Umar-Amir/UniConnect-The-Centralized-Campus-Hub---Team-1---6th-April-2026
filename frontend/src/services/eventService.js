import { apiClient } from "./apiClient";

export const eventService = {
  list(query = "") {
    const q = query.trim();
    const suffix = q ? `?q=${encodeURIComponent(q)}` : "";
    return apiClient.get(`/api/events${suffix}`);
  },
  getById(eventId) {
    return apiClient.get(`/api/events/${eventId}`);
  },
  register(eventId, segment = "") {
    return apiClient.post(`/api/events/${eventId}/register`, { segment });
  },
  cancelRegistration(eventId) {
    return apiClient.post(`/api/events/${eventId}/cancel`, {});
  }
};
