import { useCallback, useEffect, useMemo, useState } from "react";
import Booking from "../../components/booking/Booking";
import BookingStats from "../../components/booking/BookingStats";
import BookingTable from "../../components/booking/BookingTable";
import {
  cancelBooking,
  checkBookingAvailability,
  createBooking,
  formatBookingApiError,
  getMyBookings,
  shouldUseBookingDemoFallback,
} from "../../services/bookingService";
import "./BookingPage.css";

function MyBookingsPage() {
  // Get userId from localStorage (set during OAuth login)
  const currentUserId = localStorage.getItem("userId");
  const currentUserName = "Demo Student";
  const [activeView, setActiveView] = useState("form");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter((b) => b.status === "PENDING").length;
    const approved = bookings.filter((b) => b.status === "APPROVED").length;
    const cancelled = bookings.filter((b) => b.status === "CANCELLED" || b.status === "REJECTED").length;
    return { total, pending, approved, cancelled };
  }, [bookings]);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMyBookings(currentUserId);
      setBookings(data);
    } catch (fetchError) {
      setError(fetchError?.response?.data?.message || "Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCreateBooking = async (newBooking) => {
    const payload = {
      userId: currentUserId,
      userName: currentUserName,
      resourceId: Number(newBooking.resourceId || Date.now()),
      resourceName: newBooking.resource,
      resourceType: newBooking.resourceType,
      bookingDate: newBooking.date,
      startTime: newBooking.startTime,
      endTime: newBooking.endTime,
      purpose: newBooking.purpose,
      expectedAttendees: Number(newBooking.attendees || 1),
    };

    try {
      try {
        const availability = await checkBookingAvailability({
          resourceId: payload.resourceId,
          date: payload.bookingDate,
          startTime: payload.startTime,
          endTime: payload.endTime,
        });
        if (!availability.available) {
          setError(
            "This resource is already booked for that time (PENDING or APPROVED). Pick another slot or room."
          );
          return;
        }
      } catch {
        /* availability optional; backend create still enforces conflicts */
      }
      const created = await createBooking(payload);
      setBookings((prev) => [created, ...prev]);
      setError("");
    } catch (createError) {
      if (shouldUseBookingDemoFallback(createError)) {
        const fallbackBooking = {
          id: Date.now(),
          userId: payload.userId,
          userName: payload.userName,
          resourceId: payload.resourceId,
          resourceName: payload.resourceName,
          resourceType: payload.resourceType,
          bookingDate: payload.bookingDate,
          startTime: payload.startTime,
          endTime: payload.endTime,
          purpose: payload.purpose,
          expectedAttendees: payload.expectedAttendees,
          status: "PENDING",
        };
        setBookings((prev) => [fallbackBooking, ...prev]);
        setError(
          "Backend unavailable. Booking shown in demo mode only (not saved to the database)."
        );
      } else {
        setError(formatBookingApiError(createError));
      }
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await cancelBooking(bookingId, currentUserId);
      await fetchBookings();
    } catch (actionError) {
      setError(actionError?.response?.data?.message || "Failed to cancel booking.");
    }
  };

  return (
    <div className="booking-site booking-page-light booking-dashboard-shell">
      <div className="booking-page">
        <h1 className="booking-page-main-title">Welcome to Student Dashboard</h1>

        <div className="booking-panel-card">
          <div className="booking-panel-header">
            <div>
              <h2 className="booking-panel-title">Resource Booking</h2>
            </div>
            <button
              type="button"
              className="booking-view-btn"
              onClick={() => setActiveView((prev) => (prev === "form" ? "list" : "form"))}
            >
              {activeView === "form" ? "View My Bookings" : "Create Booking"}
            </button>
          </div>

          {activeView === "form" ? (
            <Booking
              isOpen={true}
              onClose={() => {}}
              onCreate={handleCreateBooking}
              theme="light"
              mode="inline"
            />
          ) : (
            <>
              <BookingStats stats={stats} />
              {error && <p className="booking-page-error">{error}</p>}

              <BookingTable
                bookings={bookings}
                loading={loading}
                isAdminView={false}
                onCancelBooking={handleCancelBooking}
                onAdminStatusUpdate={() => {}}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyBookingsPage;
