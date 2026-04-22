import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import AppLayout from '../../layouts/AppLayout';

function StudentDashboardModernPage() {
  return (
    <AppLayout role="student" title="Student Dashboard">
      <PageHeader
        title="Welcome back"
        subtitle="Track service requests, notifications, and campus resources from one place."
      />

      <section style={styles.stats}>
        <StatCard label="Open Tickets" value="4" tone="blue" />
        <StatCard label="Pending Bookings" value="2" tone="indigo" />
        <StatCard label="Unread Alerts" value="7" tone="teal" />
      </section>

      <section style={styles.cards}>
        <Link style={styles.card} to="/create-ticket">
          <h3 style={styles.cardTitle}>Create Service Ticket</h3>
          <p style={styles.cardCopy}>Report classroom, IT, or facility issues with priority tagging.</p>
        </Link>
        <Link style={styles.card} to="/resources">
          <h3 style={styles.cardTitle}>Browse Resources</h3>
          <p style={styles.cardCopy}>Search lecture halls, labs, and equipment availability.</p>
        </Link>
        <Link style={styles.card} to="/my-bookings">
          <h3 style={styles.cardTitle}>My Bookings</h3>
          <p style={styles.cardCopy}>Review upcoming reservations and booking statuses.</p>
        </Link>
      </section>
    </AppLayout>
  );
}

const styles = {
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
    gap: '0.9rem',
    marginBottom: '1rem',
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '0.9rem',
  },
  card: {
    textDecoration: 'none',
    background: '#fff',
    border: '1px solid #dbeafe',
    borderRadius: 16,
    padding: '1rem',
    boxShadow: '0 10px 24px rgba(15,23,42,0.06)',
  },
  cardTitle: {
    margin: 0,
    color: '#1e3a8a',
  },
  cardCopy: {
    margin: '0.45rem 0 0',
    color: '#475569',
    lineHeight: 1.6,
  },
};

export default StudentDashboardModernPage;
