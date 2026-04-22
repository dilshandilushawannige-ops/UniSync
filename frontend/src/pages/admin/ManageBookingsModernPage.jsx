import PageScaffold from '../../components/PageScaffold';

function ManageBookingsModernPage() {
  return (
    <PageScaffold
      role="admin"
      title="Manage Bookings"
      subtitle="Approve, reject or reschedule booking requests."
      emptyTitle="No booking requests"
      emptyDescription="Booking workflows will render here once API data is connected."
    />
  );
}

export default ManageBookingsModernPage;
