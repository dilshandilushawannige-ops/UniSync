function StatCard({ label, value, tone = 'blue' }) {
  const gradients = {
    blue: 'linear-gradient(140deg, #1d4ed8, #2563eb)',
    indigo: 'linear-gradient(140deg, #4338ca, #4f46e5)',
    teal: 'linear-gradient(140deg, #0f766e, #14b8a6)',
    amber: 'linear-gradient(140deg, #b45309, #f59e0b)',
  };

  return (
    <article style={{ ...styles.card, background: gradients[tone] || gradients.blue }}>
      <p style={styles.label}>{label}</p>
      <p style={styles.value}>{value}</p>
    </article>
  );
}

const styles = {
  card: {
    borderRadius: 16,
    color: '#fff',
    padding: '1rem 1rem 0.9rem',
    boxShadow: '0 10px 24px rgba(30, 41, 59, 0.2)',
  },
  label: {
    margin: 0,
    opacity: 0.9,
    fontSize: '0.86rem',
  },
  value: {
    margin: '0.25rem 0 0',
    fontSize: '1.5rem',
    fontWeight: 800,
  },
};

export default StatCard;
