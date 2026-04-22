import AppLayout from '../../layouts/AppLayout';
import EmptyState from '../../components/EmptyState';
import PageHeader from '../../components/PageHeader';

function MyNotificationsModernPage() {
  const notifications = [];

  return (
    <AppLayout role="student" title="Notifications">
      <PageHeader title="My Notifications" subtitle="Important updates about your tickets and bookings." />
      {notifications.length === 0 ? (
        <EmptyState title="No notifications" description="You are all caught up. New updates will show here." />
      ) : null}
    </AppLayout>
  );
}

export default MyNotificationsModernPage;
