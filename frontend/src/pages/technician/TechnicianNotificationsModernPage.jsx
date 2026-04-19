import PageScaffold from '../../components/PageScaffold';

function TechnicianNotificationsModernPage() {
  return (
    <PageScaffold
      role="technician"
      title="Technician Notifications"
      subtitle="Alerts related to assignments and escalations."
      emptyTitle="No alerts"
      emptyDescription="You are up to date. New alerts will show in this panel."
    />
  );
}

export default TechnicianNotificationsModernPage;
