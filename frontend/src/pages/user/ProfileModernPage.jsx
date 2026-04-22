import AppLayout from '../../layouts/AppLayout';
import PageHeader from '../../components/PageHeader';

function ProfileModernPage() {
  return (
    <AppLayout role="student" title="Profile">
      <PageHeader title="My Profile" subtitle="Your account summary and preferences." />
      <section className="glass-card" style={styles.card}>
        <p><strong>Name:</strong> Student User</p>
        <p><strong>Email:</strong> student@unisync.edu</p>
        <p><strong>Role:</strong> STUDENT</p>
      </section>
    </AppLayout>
  );
}

const styles = {
  card: { padding: '1rem', maxWidth: 520, lineHeight: 1.8 },
};

export default ProfileModernPage;
