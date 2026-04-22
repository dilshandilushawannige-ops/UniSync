function EmptyState({ title, description, action }) {
  return (
    <section style={styles.card} className="glass-card">
      <div style={styles.icon}>🔎</div>
      <h3 style={styles.title}>{title}</h3>
      <p style={styles.description}>{description}</p>
      {action ? <div>{action}</div> : null}
    </section>
  );
}

const styles = {
  card: {
    textAlign: 'center',
    padding: '2rem 1.2rem',
  },
  icon: {
    fontSize: '1.6rem',
  },
  title: {
    margin: '0.6rem 0 0.35rem',
  },
  description: {
    margin: 0,
    color: '#475569',
  },
};

export default EmptyState;
