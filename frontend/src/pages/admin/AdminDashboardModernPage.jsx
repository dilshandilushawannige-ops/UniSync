import { Link } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';

function AdminDashboardModernPage() {
  return (
    <AppLayout role="admin" title="Admin Dashboard">
      <PageHeader
        title="Operations Overview"
        subtitle="Monitor service performance and quickly jump to management modules."
      />

      <section style={styles.stats}>
        <StatCard label="Active Users" value="1,284" tone="blue" />
        <StatCard label="Open Tickets" value="62" tone="amber" />
        <StatCard label="Resources" value="148" tone="teal" />
        <StatCard label="Pending Requests" value="19" tone="indigo" />
      </section>

      <section style={styles.grid}>
        <Link to="/admin/users" style={styles.card}><h3 style={styles.h3}>Manage Users</h3><p style={styles.p}>Roles, permissions, and account health.</p></Link>
        <Link to="/admin/tickets" style={styles.card}><h3 style={styles.h3}>Manage Tickets</h3><p style={styles.p}>Prioritize and assign technical issues.</p></Link>
        <Link to="/admin/bookings" style={styles.card}><h3 style={styles.h3}>Manage Bookings</h3><p style={styles.p}>Resolve booking conflicts and approvals.</p></Link>
        <Link to="/admin/resources" style={styles.card}><h3 style={styles.h3}>Manage Resources</h3><p style={styles.p}>Update inventory and availability windows.</p></Link>
      </section>
    </AppLayout>
  );
}

const styles = {
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '0.85rem',
    marginBottom: '1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '0.9rem',
  },
  card: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 16,
    boxShadow: '0 10px 24px rgba(15,23,42,0.06)',
    padding: '1rem',
    textDecoration: 'none',
  },
  h3: {
    margin: 0,
    color: '#1e293b',
  },
  p: {
    margin: '0.4rem 0 0',
    color: '#475569',
  },
};

export default AdminDashboardModernPage;
