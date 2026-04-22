import { useParams } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import PageHeader from '../../components/PageHeader';

function TicketDetailsModernPage() {
  const { id } = useParams();

  return (
    <AppLayout role="student" title="Ticket Details">
      <PageHeader title={`Ticket #${id}`} subtitle="Detailed view of the selected support request." />
      <article className="glass-card" style={styles.card}>
        <p style={styles.row}><strong>Status:</strong> In Progress</p>
        <p style={styles.row}><strong>Category:</strong> IT Support</p>
        <p style={styles.row}><strong>Assigned To:</strong> Technician Team A</p>
        <p style={styles.row}><strong>Description:</strong> This scaffold page is ready to bind API ticket details.</p>
      </article>
    </AppLayout>
  );
}

const styles = {
  card: { padding: '1rem' },
  row: { margin: '0.35rem 0', color: '#334155' },
};

export default TicketDetailsModernPage;
