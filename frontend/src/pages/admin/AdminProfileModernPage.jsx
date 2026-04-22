import AppLayout from '../../layouts/AppLayout';
import PageHeader from '../../components/PageHeader';

function AdminProfileModernPage() {
  return (
    <AppLayout role="admin" title="Admin Profile">
      <PageHeader title="Admin Profile" subtitle="System administrator information and privileges." />
      <section className="glass-card" style={styles.card}>
        <p><strong>Name:</strong> System Admin</p>
        <p><strong>Email:</strong> admin@unisync.edu</p>
        <p><strong>Access:</strong> Full operational control</p>
      </section>
    </AppLayout>
  );
}

const styles = { card: { padding: '1rem', maxWidth: 520, lineHeight: 1.8 } };

export default AdminProfileModernPage;
