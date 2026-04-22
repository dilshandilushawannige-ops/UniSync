import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentPortalLayout from "../../components/user/StudentPortalLayout";
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

function ResourceBookingPage() {
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId");
  const currentUserName = "Demo Student";

  const [activeView, setActiveView] = useState("form");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");

  useEffect(() => {
    if (!currentUserId) {
      navigate("/login");
    }
  }, [currentUserId, navigate]);

  const fetchBookings = useCallback(async () => {
    if (!currentUserId) return;
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

  const filteredBookings = useMemo(() => {
    let list = [...bookings];
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((b) => {
        const name = (b.resourceName || "").toLowerCase();
        const purpose = (b.purpose || "").toLowerCase();
        const type = (b.resourceType || "").toLowerCase();
        const idStr = String(b.id ?? "");
        return (
          name.includes(q) ||
          purpose.includes(q) ||
          type.includes(q) ||
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
        /* availability endpoint optional; server still validates on create */
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

  const filterToolbar = (
    <div style={styles.filterBlock}>
      <div style={styles.grid}>
        <Field label="Search">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Resource name, purpose, or ID…"
            style={styles.input}
          />
        </Field>
        <Field label="Resource category">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={styles.input}
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
            style={styles.input}
          >
            {STATUS_FILTERS.map((opt) => (
              <option key={opt.value || "all-status"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Sort by">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.input}>
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>
      </div>
    </div>
  );

  return (
    <StudentPortalLayout title="Resource Booking">
      <section style={styles.card}>
        <div style={styles.cardHeader}>
          <div>
            <h2 style={styles.cardTitle}>Resource Booking</h2>
          </div>
          <button
            type="button"
            style={styles.secondaryButton}
            onClick={() => setActiveView((prev) => (prev === "form" ? "list" : "form"))}
          >
            {activeView === "form" ? "View My Bookings" : "Create Booking"}
          </button>
        </div>

        {activeView === "form" ? (
          <div style={styles.bookingFormWrap}>
            <Booking
              isOpen
              onClose={() => {}}
              onCreate={handleCreateBooking}
              theme="light"
              mode="inline"
            />
          </div>
        ) : (
          <>
            {filterToolbar}
            <BookingStats stats={stats} />
            {error && <p style={styles.inlineError}>{error}</p>}
            <BookingTable
              bookings={filteredBookings}
              loading={loading}
              isAdminView={false}
              onCancelBooking={handleCancelBooking}
              onAdminStatusUpdate={() => {}}
            />
          </>
        )}
      </section>
    </StudentPortalLayout>
  );
}

function Field({ label, children }) {
  return (
    <label style={styles.field}>
      <span style={styles.label}>{label}</span>
      {children}
    </label>
  );
}

const styles = {
  card: {
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
  filterBlock: {
    marginBottom: "18px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "18px",
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
  bookingFormWrap: {
    marginTop: "4px",
  },
  inlineError: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "0.875rem",
    marginBottom: "12px",
  },
};

export default ResourceBookingPage;
