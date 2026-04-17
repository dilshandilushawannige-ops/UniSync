import api from "./api";

export const getAllNotifications = async () => {
    const response = await api.get("/notifications");
    return response.data;
};

export const getNotificationsByEmail = async (email) => {
    const response = await api.get(`/notifications/user?email=${email}`);
    return response.data;
};

export const createNotification = async (notificationData) => {
    const response = await api.post("/notifications", notificationData);
    return response.data;
};

export const markNotificationAsRead = async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
};

export const deleteNotification = async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
};