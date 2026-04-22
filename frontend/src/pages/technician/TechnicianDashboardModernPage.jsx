import AppLayout from '../../layouts/AppLayout';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';

function TechnicianDashboardModernPage() {
  return (
    <AppLayout role="technician" title="Technician Dashboard">
      <PageHeader title="Workload Summary" subtitle="Keep track of assignments and maintenance tasks." />
      <section style={styles.grid}>
        <StatCard label="Assigned" value="12" tone="blue" />
        <StatCard label="In Progress" value="4" tone="indigo" />
        <StatCard label="Resolved Today" value="6" tone="teal" />
      </section>
    </AppLayout>
  );
}

const styles = {
  grid: { display: 'grid', gap: '0.9rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' },
};

export default TechnicianDashboardModernPage;
