import { useCallback, useEffect, useMemo, useState } from "react";
import AdminPortalLayout from "../../components/admin/AdminPortalLayout";
import BookingStats from "../../components/booking/BookingStats";
import BookingTable from "../../components/booking/BookingTable";
import { getAllBookings, updateBookingStatus } from "../../services/bookingService";
import "../user/BookingPage.css";

const RESOURCE_CATEGORY_FILTERS = [
  { value: "", label: "All categories" },
  { value: "classroom", label: "Classroom" },
  { value: "lab", label: "Lab" },
  { value: "lecture_hall", label: "Lecture Hall" },
  { value: "meeting_room", label: "Meeting Room" },
  { value: "equipment", label: "Equipment" },
];

const STATUS_FILTERS = [
  { value: "", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "CANCELLED", label: "Cancelled" },
];

const SORT_OPTIONS = [
  { value: "date_desc", label: "Newest first" },
  { value: "date_asc", label: "Oldest first" },
  { value: "resource_az", label: "Resource A–Z" },
];

function normalizeType(value) {
  if (value == null) return "";
  return String(value).trim().toLowerCase().replace(/\s+/g, "_");
}

function ManageBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");

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

  const filteredBookings = useMemo(() => {
    let list = [...bookings];
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((b) => {
        const name = (b.resourceName || "").toLowerCase();
        const purpose = (b.purpose || "").toLowerCase();
        const type = (b.resourceType || "").toLowerCase();
        const user = (b.userName || "").toLowerCase();
        const idStr = String(b.id ?? "");
        return (
          name.includes(q) ||
          purpose.includes(q) ||
          type.includes(q) ||
          user.includes(q) ||
          idStr.includes(q)
        );
      });
    }
    if (filterCategory) {
      const target = normalizeType(filterCategory);
      list = list.filter((b) => normalizeType(b.resourceType) === target);
    }
    if (filterStatus) {
      list = list.filter((b) => (b.status || "") === filterStatus);
    }
    list.sort((a, b) => {
      if (sortBy === "resource_az") {
        return (a.resourceName || "").localeCompare(b.resourceName || "", undefined, {
          sensitivity: "base",
        });
      }
      const da = new Date(a.bookingDate || 0).getTime();
      const db = new Date(b.bookingDate || 0).getTime();
      if (sortBy === "date_asc") return da - db;
      return db - da;
    });
    return list;
  }, [bookings, searchQuery, filterCategory, filterStatus, sortBy]);

  const stats = useMemo(() => {
    const source = filteredBookings;
    const total = source.length;
    const pending = source.filter((b) => b.status === "PENDING").length;
    const approved = source.filter((b) => b.status === "APPROVED").length;
    const cancelled = source.filter(
      (b) => b.status === "CANCELLED" || b.status === "REJECTED"
    ).length;
    return { total, pending, approved, cancelled };
  }, [filteredBookings]);

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
    <AdminPortalLayout title="Booking Manage">
      <section style={cardStyles.section}>
        <div style={cardStyles.cardHeader}>
          <div>
            <h2 style={cardStyles.cardTitle}>All booking requests</h2>
          </div>
          <button type="button" style={cardStyles.secondaryButton} onClick={() => fetchBookings()}>
            Refresh list
          </button>
        </div>

        <div style={cardStyles.grid}>
          <Field label="Search">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Resource, user, purpose, or ID…"
              style={cardStyles.input}
            />
          </Field>
          <Field label="Resource category">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={cardStyles.input}
            >
              {RESOURCE_CATEGORY_FILTERS.map((opt) => (
                <option key={opt.value || "all"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Booking status">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={cardStyles.input}
            >
              {STATUS_FILTERS.map((opt) => (
                <option key={opt.value || "all-status"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Sort by">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={cardStyles.input}>
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="booking-site booking-page-light" style={{ background: "transparent", minHeight: "auto" }}>
          <div className="booking-page" style={{ paddingTop: "16px" }}>
            <BookingStats stats={stats} />
            {error && <p className="booking-page-error">{error}</p>}
            <BookingTable
              bookings={filteredBookings}
              loading={loading}
              isAdminView={true}
              onCancelBooking={() => {}}
              onAdminStatusUpdate={handleAdminStatusUpdate}
            />
          </div>
        </div>
      </section>
    </AdminPortalLayout>
  );
}

function Field({ label, children }) {
  return (
    <label style={cardStyles.field}>
      <span style={cardStyles.label}>{label}</span>
      {children}
    </label>
  );
}

const cardStyles = {
  section: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "24px",
    boxShadow: "0 14px 32px rgba(15, 23, 42, 0.05)",
  },
  cardHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },
  cardTitle: {
    margin: "0 0 8px",
    color: "#0f172a",
    fontSize: "1.15rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "18px",
    marginBottom: "8px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    color: "#334155",
    fontSize: "0.92rem",
    fontWeight: 700,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    borderRadius: "12px",
    border: "1px solid #dbe2ea",
    backgroundColor: "#ffffff",
    color: "#0f172a",
    fontSize: "0.96rem",
    outline: "none",
  },
  secondaryButton: {
    border: "1px solid #dbe2ea",
    borderRadius: "12px",
    padding: "12px 18px",
    backgroundColor: "#ffffff",
    color: "#334155",
    fontWeight: 700,
    cursor: "pointer",
    alignSelf: "flex-start",
  },
};

export default ManageBookingsPage;
