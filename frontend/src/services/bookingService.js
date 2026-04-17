import api from "./api";

export const createBooking = async (bookingData) => {
  const response = await api.post("/bookings", bookingData);
  return response.data;
};

export const getMyBookings = async (userId) => {
  const response = await api.get(`/bookings/my?userId=${userId}`);
  return response.data;
};

export const getAllBookings = async (status) => {
  const query = status ? `?status=${status}` : "";
  const response = await api.get(`/bookings${query}`);
  return response.data;
};

export const updateBookingStatus = async (bookingId, status, rejectionReason) => {
  const payload = { status };
  if (rejectionReason) {
    payload.rejectionReason = rejectionReason;
  }

  const response = await api.put(`/bookings/${bookingId}/status`, payload);
  return response.data;
};

export const cancelBooking = async (bookingId, userId) => {
  await api.delete(`/bookings/${bookingId}?userId=${userId}`);
};
