import api from "./api";

export const getAllAnnouncements = () => api.get("/announcements");

export const getAnnouncementById = (id) => api.get(`/announcements/${id}`);

export const createAnnouncement = (data) => api.post("/announcements", data);

export const updateAnnouncement = (id, data) => api.put(`/announcements/${id}`, data);

export const deleteAnnouncement = (id) => api.delete(`/announcements/${id}`);

export const getAnnouncementsForRole = (role) => api.get(`/announcements/role/${role}`);
