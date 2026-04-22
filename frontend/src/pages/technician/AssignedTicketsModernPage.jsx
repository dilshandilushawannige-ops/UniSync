import PageScaffold from '../../components/PageScaffold';

function AssignedTicketsModernPage() {
  return (
    <PageScaffold
      role="technician"
      title="Assigned Tickets"
      subtitle="All tickets currently assigned to you."
      emptyTitle="No assigned tickets"
      emptyDescription="Assigned tasks will appear here for action and updates."
    />
  );
}

export default AssignedTicketsModernPage;
