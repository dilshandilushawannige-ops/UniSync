function BookingTopBar({
  isAdminView,
  onBack,
  onToggleView,
  onOpenModal,
  toggleLabel,
  showNewBooking = true,
}) {
  return (
    <header className="booking-site-topbar">
      <div>
        <h1 className="brand-title">UniSync Booking Portal</h1>
        <p className="brand-subtitle">Smart Campus Resource Management</p>
      </div>
      <div className="booking-page-actions topbar-actions">
        <button className="home-btn" onClick={onBack}>
          Back
        </button>
        <button className="view-switch-btn" onClick={onToggleView}>
          {toggleLabel || (isAdminView ? "User View" : "Admin View")}
        </button>
        {showNewBooking && (
          <button className="new-booking-btn" onClick={onOpenModal}>
            + New Booking
          </button>
        )}
      </div>
    </header>
  );
}

export default BookingTopBar;
