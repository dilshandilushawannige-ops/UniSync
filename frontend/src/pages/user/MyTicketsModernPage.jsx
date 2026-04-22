import AppLayout from '../../layouts/AppLayout';
import EmptyState from '../../components/EmptyState';
import PageHeader from '../../components/PageHeader';

function MyTicketsModernPage() {
  const tickets = [];

  return (
    <AppLayout role="student" title="My Tickets">
      <PageHeader title="My Tickets" subtitle="Track all issues you have reported." />
      {tickets.length === 0 ? (
        <EmptyState title="No tickets yet" description="Your submitted tickets will appear here with real-time status updates." />
      ) : null}
    </AppLayout>
  );
}

export default MyTicketsModernPage;
