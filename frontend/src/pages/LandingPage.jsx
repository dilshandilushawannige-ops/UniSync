import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="public-shell page-shell" style={styles.wrap}>
      <div style={styles.container}>
        <p style={styles.tag}>University Service Management</p>
        <h1 style={styles.title}>UniSync</h1>
        <p style={styles.subtitle}>
          One portal for support tickets, resource booking, notifications, and operational workflows.
        </p>
        <div style={styles.actions}>
          <Link to="/login" className="btn btn-primary" style={styles.linkButton}>Get Started</Link>
          <Link to="/dashboard" style={styles.secondaryLink}>Preview Student Dashboard</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    display: 'grid',
    placeItems: 'center',
    padding: '1.2rem',
  },
  container: {
    width: 'min(100%, 860px)',
    textAlign: 'center',
    color: '#e2e8f0',
  },
  tag: {
    margin: 0,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    fontWeight: 700,
    opacity: 0.9,
  },
  title: {
    margin: '0.4rem 0 0',
    fontSize: 'clamp(2.4rem, 7vw, 5rem)',
    lineHeight: 1,
  },
  subtitle: {
    margin: '1rem auto 0',
    maxWidth: 670,
    fontSize: '1.04rem',
    lineHeight: 1.7,
    color: '#cbd5e1',
  },
  actions: {
    marginTop: '1.35rem',
    display: 'flex',
    justifyContent: 'center',
    gap: '0.8rem',
    flexWrap: 'wrap',
  },
  linkButton: {
    textDecoration: 'none',
  },
  secondaryLink: {
    textDecoration: 'none',
    padding: '0.72rem 1rem',
    borderRadius: 12,
    border: '1px solid rgba(148, 163, 184, 0.6)',
    color: '#e2e8f0',
  },
};

export default LandingPage;
