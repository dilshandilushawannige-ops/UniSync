import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookingStats from "../../components/booking/BookingStats";
import BookingTable from "../../components/booking/BookingTable";
import BookingTopBar from "../../components/booking/BookingTopBar";
import { getAllBookings, updateBookingStatus } from "../../services/bookingService";
import "../user/BookingPage.css";

function ManageBookingsPage() {
  const navigate = useNavigate();
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
      const data = await getAllBookings();
      setBookings(data);
    } catch (fetchError) {
      setError(fetchError?.response?.data?.message || "Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

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
        isAdminView={true}
        onBack={() => navigate(-1)}
        onToggleView={() => navigate("/my-bookings")}
        onOpenModal={() => {}}
        toggleLabel="User View"
        showNewBooking={false}
      />

      <div className="booking-page">
        <div className="booking-page-header">
          <div className="booking-page-title-wrap">
            <h2 className="booking-page-title">Manage Bookings</h2>
            <p className="booking-page-subtitle">Approve or reject booking requests from users.</p>
          </div>
          <div className="booking-page-chip">Admin Panel</div>
        </div>

        <BookingStats stats={stats} />
        {error && <p className="booking-page-error">{error}</p>}

        <BookingTable
          bookings={bookings}
          loading={loading}
          isAdminView={true}
          onCancelBooking={() => {}}
          onAdminStatusUpdate={handleAdminStatusUpdate}
        />
      </div>
    </div>
  );
}

export default ManageBookingsPage;
