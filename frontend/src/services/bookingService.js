import api from "./api";

/**
 * Backend expects numeric userId and non-blank purpose (JSON numbers, not string "1").
 */
function normalizeBookingPayload(data) {
  const uid = Number(data.userId);
  if (!Number.isFinite(uid) || uid <= 0) {
    throw new Error("You need to log in again before booking (missing user id).");
  }
  const purpose =
    data.purpose != null && String(data.purpose).trim() !== ""
      ? String(data.purpose).trim()
      : "Not specified";
  const resourceName = String(data.resourceName ?? "").trim();
  if (!resourceName) {
    throw new Error("Resource name is required.");
  }
  return {
    ...data,
    userId: uid,
    expectedAttendees: Math.max(1, Number(data.expectedAttendees ?? 1) || 1),
    purpose,
    resourceName,
  };
}

/** Human-readable message from Spring validation (400) or other API errors. */
export function formatBookingApiError(error) {
  if (!error?.response?.data) {
    return error?.message || "Request failed.";
  }
  const d = error.response.data;
  if (d.messages && typeof d.messages === "object") {
    return Object.values(d.messages)
      .filter(Boolean)
      .join(" ");
  }
  return d.message || "Request failed.";
}

/**
 * Local demo row only when server unreachable or 5xx — not for 400 validation, 409, or client throws.
 */
export function shouldUseBookingDemoFallback(error) {
  if (error?.response) {
    return error.response.status >= 500;
  }
  return Boolean(error?.request);
}

export const createBooking = async (bookingData) => {
  const body = normalizeBookingPayload(bookingData);
  const response = await api.post("/bookings", body);
  return response.data;
};

export const getMyBookings = async (userId) => {
  const uid = Number(userId);
  if (!Number.isFinite(uid) || uid <= 0) {
    throw new Error("Invalid user id.");
  }
  const response = await api.get(`/bookings/my?userId=${uid}`);
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
  const uid = Number(userId);
  if (!Number.isFinite(uid) || uid <= 0) {
    throw new Error("Invalid user id.");
  }
  await api.delete(`/bookings/${bookingId}?userId=${uid}`);
};

/** GET /api/bookings/availability — conflict check before submit (optional UX). */
export const checkBookingAvailability = async ({
  resourceId,
  date,
  startTime,
  endTime,
  excludeBookingId,
}) => {
  const params = { resourceId, date, startTime, endTime };
  if (excludeBookingId != null && excludeBookingId !== "") {
    params.excludeBookingId = excludeBookingId;
  }
  const response = await api.get("/bookings/availability", { params });
  return response.data;
};
