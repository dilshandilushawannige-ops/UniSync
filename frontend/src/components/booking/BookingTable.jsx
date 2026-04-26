function BookingTable({
  bookings,
  loading,
  isAdminView,
  onCancelBooking,
  onAdminStatusUpdate,
  currentUserName,
}) {
  return (
    <section className="booking-table-card">
      <table className="booking-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Resource</th>
            <th>User</th>
            <th>Date & Time</th>
            <th>Purpose</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan="7" className="table-empty-cell">
                Loading bookings...
              </td>
            </tr>
          )}
          {!loading && bookings.length === 0 && (
            <tr>
              <td colSpan="7" className="table-empty-cell">
                No bookings found.
              </td>
            </tr>
          )}
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>#{booking.id}</td>
              <td>
                <div className="table-main">{booking.resourceName}</div>
                <small>{booking.resourceType}</small>
              </td>
              <td>
                <div className="table-main">
                  {!isAdminView && currentUserName ? currentUserName : booking.userName}
                </div>
                <small>{booking.userId}</small>
              </td>
              <td>
                <div className="table-main">{booking.bookingDate}</div>
                <small>
                  {booking.startTime} - {booking.endTime}
                </small>
              </td>
              <td>{booking.purpose}</td>
              <td>
                <span className={`status-pill status-${booking.status.toLowerCase()}`}>
                  {booking.status}
                </span>
              </td>
              <td>
                <div className="table-actions">
                  {!isAdminView && (booking.status === "PENDING" || booking.status === "APPROVED") && (
                    <button className="action-btn cancel-action" onClick={() => onCancelBooking(booking.id)}>
                      Cancel
                    </button>
                  )}
                  {isAdminView && booking.status === "PENDING" && (
                    <>
                      <button
                        className="action-btn approve-action"
                        onClick={() => onAdminStatusUpdate(booking.id, "APPROVED")}
                      >
                        Approve
                      </button>
                      <button
                        className="action-btn reject-action"
                        onClick={() => onAdminStatusUpdate(booking.id, "REJECTED")}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default BookingTable;
