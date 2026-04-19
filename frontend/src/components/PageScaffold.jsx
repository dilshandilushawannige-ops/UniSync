import AppLayout from '../layouts/AppLayout';
import EmptyState from './EmptyState';
import PageHeader from './PageHeader';

function PageScaffold({ role, title, subtitle, emptyTitle, emptyDescription, action }) {
  return (
    <AppLayout role={role} title={title}>
      <PageHeader title={title} subtitle={subtitle} action={action} />
      <EmptyState title={emptyTitle} description={emptyDescription} />
    </AppLayout>
  );
}

export default PageScaffold;
