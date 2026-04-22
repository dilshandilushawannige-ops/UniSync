import PageScaffold from '../../components/PageScaffold';

function ManageTicketsModernPage() {
  return (
    <PageScaffold
      role="admin"
      title="Manage Tickets"
      subtitle="Review, prioritize and assign unresolved tickets."
      emptyTitle="Ticket queue is empty"
      emptyDescription="No pending tickets right now. New incoming tickets will appear here."
    />
  );
}

export default ManageTicketsModernPage;
