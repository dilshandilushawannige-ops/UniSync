import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Booking from "../../components/booking/Booking";
import BookingStats from "../../components/booking/BookingStats";
import BookingTable from "../../components/booking/BookingTable";
import BookingTopBar from "../../components/booking/BookingTopBar";
import { cancelBooking, createBooking, getMyBookings } from "../../services/bookingService";
import "./BookingPage.css";

function MyBookingsPage() {
  const navigate = useNavigate();
  const currentUserId = 1;
  const currentUserName = "Demo Student";

  const [showModal, setShowModal] = useState(false);
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
      const created = await createBooking(payload);
      setBookings((prev) => [created, ...prev]);
      setError("");
    } catch (createError) {
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
      setError("Backend unavailable. Booking added in local demo mode only (not saved to database).");
      if (createError?.response?.data?.message) {
        throw createError;
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
    <div className="booking-site booking-page-light">
      <BookingTopBar
        isAdminView={false}
        onBack={() => navigate(-1)}
        onToggleView={() => navigate("/admin/bookings")}
        onOpenModal={() => setShowModal(true)}
        toggleLabel="Admin View"
        showNewBooking={true}
      />

      <div className="booking-page">
        <div className="booking-page-header">
          <div className="booking-page-title-wrap">
            <h2 className="booking-page-title">My Bookings</h2>
            <p className="booking-page-subtitle">Create requests and track your booking status.</p>
          </div>
          <div className="booking-page-chip">User Panel</div>
        </div>

        <BookingStats stats={stats} />
        {error && <p className="booking-page-error">{error}</p>}

        <BookingTable
          bookings={bookings}
          loading={loading}
          isAdminView={false}
          onCancelBooking={handleCancelBooking}
          onAdminStatusUpdate={() => {}}
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

export default MyBookingsPage;
