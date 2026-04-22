import AppLayout from '../../layouts/AppLayout';
import EmptyState from '../../components/EmptyState';
import PageHeader from '../../components/PageHeader';

function MyBookingsModernPage() {
  const bookings = [];

  return (
    <AppLayout role="student" title="My Bookings">
      <PageHeader title="My Bookings" subtitle="All your reservation requests and statuses in one list." />
      {bookings.length === 0 ? (
        <EmptyState title="No bookings yet" description="Reserve resources to see your booking timeline here." />
      ) : null}
    </AppLayout>
  );
}

export default MyBookingsModernPage;
