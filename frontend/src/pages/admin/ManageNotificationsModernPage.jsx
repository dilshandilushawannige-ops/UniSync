import PageScaffold from '../../components/PageScaffold';

function ManageNotificationsModernPage() {
  return (
    <PageScaffold
      role="admin"
      title="Manage Notifications"
      subtitle="Broadcast and monitor campus-wide notifications."
      emptyTitle="No notifications configured"
      emptyDescription="Use this module to draft notices and schedule announcements."
    />
  );
}

export default ManageNotificationsModernPage;
