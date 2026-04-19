import { useParams } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import PageHeader from '../../components/PageHeader';

function TicketManagementDetailsModernPage() {
  const { id } = useParams();

  return (
    <AppLayout role="admin" title="Ticket Management Details">
      <PageHeader title={`Ticket #${id}`} subtitle="Admin-level diagnostics and assignment controls." />
      <section className="glass-card" style={styles.card}>
        <p><strong>Current Status:</strong> OPEN</p>
        <p><strong>Priority:</strong> HIGH</p>
        <p><strong>Assigned Technician:</strong> Not Assigned</p>
      </section>
    </AppLayout>
  );
}

const styles = { card: { padding: '1rem', maxWidth: 760, lineHeight: 1.8 } };

export default TicketManagementDetailsModernPage;
