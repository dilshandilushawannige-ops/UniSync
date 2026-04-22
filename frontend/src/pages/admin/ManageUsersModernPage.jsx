import PageScaffold from '../../components/PageScaffold';

function ManageUsersModernPage() {
  return (
    <PageScaffold
      role="admin"
      title="Manage Users"
      subtitle="Create, update and assign user roles."
      emptyTitle="No users loaded"
      emptyDescription="Connect this view to the users API to render a searchable user table."
    />
  );
}

export default ManageUsersModernPage;
