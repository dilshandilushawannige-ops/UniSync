import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import Booking from "../../components/booking/Booking";
import BookingStats from "../../components/booking/BookingStats";
import BookingTable from "../../components/booking/BookingTable";
import BookingTopBar from "../../components/booking/BookingTopBar";
import {
  cancelBooking,
  createBooking,
  formatBookingApiError,
  getAllBookings,
  getMyBookings,
  shouldUseBookingDemoFallback,
  updateBookingStatus,
} from "../../services/bookingService";
import "./BookingPage.css";

function BookingPage() {
  const navigate = useNavigate();
  // Get userId from localStorage (set during OAuth login)
  const currentUserId = localStorage.getItem("userId");
  const currentUserName = "Demo Student";

  const [showModal, setShowModal] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
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
      const data = isAdminView ? await getAllBookings() : await getMyBookings(currentUserId);
      setBookings(data);
    } catch (fetchError) {
      setError(fetchError?.response?.data?.message || "Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  }, [currentUserId, isAdminView]);

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

  const handleAdminStatusUpdate = async (bookingId, status) => {
    try {
      let reason;
      if (status === "REJECTED") {
        reason = window.prompt("Enter rejection reason:");
        if (!reason) return;
      }
      await updateBookingStatus(bookingId, status, reason);
      await fetchBookings();
    } catch (actionError) {
      setError(actionError?.response?.data?.message || "Failed to update booking status.");
    }
  };

  return (
    <div className="booking-site booking-page-light">
      <BookingTopBar
        isAdminView={isAdminView}
        onBack={() => navigate(-1)}
        onToggleView={() => setIsAdminView((prev) => !prev)}
        onOpenModal={() => setShowModal(true)}
      />

      <div className="booking-page">
        <div className="booking-page-header">
          <div className="booking-page-title-wrap">
            <h2 className="booking-page-title">Booking Dashboard</h2>
            <p className="booking-page-subtitle">Create, review, and manage bookings in one place.</p>
          </div>
          <div className="booking-page-chip">{isAdminView ? "Admin Panel" : "My Bookings"}</div>
        </div>

        <BookingStats stats={stats} />

        {error && <p className="booking-page-error">{error}</p>}

        <BookingTable
          bookings={bookings}
          loading={loading}
          isAdminView={isAdminView}
          onCancelBooking={handleCancelBooking}
          onAdminStatusUpdate={handleAdminStatusUpdate}
        />
      </div>

      <Booking
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreateBooking}
        theme="light"
      />
    </div>
  );
}

export default BookingPage;
