import { Link } from 'react-router-dom';

function StatusPage({ title, message, actionLabel = 'Back to Home', actionPath = '/' }) {
  return (
    <div className="public-shell page-shell" style={styles.wrap}>
      <article style={styles.card} className="glass-card">
        <h2 style={styles.title}>{title}</h2>
        <p style={styles.message}>{message}</p>
        <Link to={actionPath} className="btn btn-primary" style={styles.link}>
          {actionLabel}
        </Link>
      </article>
    </div>
  );
}

const styles = {
  wrap: {
    display: 'grid',
    placeItems: 'center',
    padding: '1.2rem',
  },
  card: {
    width: 'min(100%, 520px)',
    padding: '1.8rem',
    textAlign: 'center',
  },
  title: {
    margin: 0,
    color: '#0f172a',
  },
  message: {
    margin: '0.65rem 0 1.2rem',
    color: '#334155',
  },
  link: {
    display: 'inline-block',
    textDecoration: 'none',
  },
};

export default StatusPage;
