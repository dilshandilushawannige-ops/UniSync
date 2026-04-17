function BookingStats({ stats }) {
  return (
    <div className="booking-stats-grid">
      <article className="booking-stat-card">
        <h3>{stats.total}</h3>
        <p>Total Bookings</p>
      </article>
      <article className="booking-stat-card">
        <h3>{stats.pending}</h3>
        <p>Pending Approval</p>
      </article>
      <article className="booking-stat-card">
        <h3>{stats.approved}</h3>
        <p>Approved</p>
      </article>
      <article className="booking-stat-card">
        <h3>{stats.cancelled}</h3>
        <p>Cancelled/Rejected</p>
      </article>
    </div>
  );
}

export default BookingStats;
