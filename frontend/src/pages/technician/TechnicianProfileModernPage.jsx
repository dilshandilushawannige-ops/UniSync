import AppLayout from '../../layouts/AppLayout';
import PageHeader from '../../components/PageHeader';

function TechnicianProfileModernPage() {
  return (
    <AppLayout role="technician" title="Technician Profile">
      <PageHeader title="Technician Profile" subtitle="Personal details and work specialization." />
      <section className="glass-card" style={styles.card}>
        <p><strong>Name:</strong> Campus Technician</p>
        <p><strong>Specialization:</strong> Electrical & AV Systems</p>
        <p><strong>Email:</strong> tech@unisync.edu</p>
      </section>
    </AppLayout>
  );
}

const styles = { card: { padding: '1rem', maxWidth: 520, lineHeight: 1.8 } };

export default TechnicianProfileModernPage;
