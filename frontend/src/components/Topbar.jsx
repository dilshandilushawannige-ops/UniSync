import { Link } from 'react-router-dom';

function Topbar({ title, roleLabel, onMenuToggle }) {
  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <button type="button" style={styles.menuButton} onClick={onMenuToggle} className="hide-desktop">
          ☰
        </button>
        <div>
          <p style={styles.kicker}>{roleLabel}</p>
          <h1 style={styles.title}>{title}</h1>
        </div>
      </div>
      <div style={styles.right}>
        <Link to="/" style={styles.brand}>UniSync</Link>
      </div>
    </header>
  );
}

const styles = {
  header: {
    height: 76,
    background: 'rgba(255,255,255,0.95)',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 1rem',
    position: 'sticky',
    top: 0,
    zIndex: 20,
    backdropFilter: 'blur(3px)',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
  },
  menuButton: {
    border: '1px solid #cbd5e1',
    background: '#fff',
    borderRadius: 10,
    height: 36,
    width: 36,
    cursor: 'pointer',
    fontSize: 16,
  },
  kicker: {
    margin: 0,
    fontSize: 12,
    color: '#64748b',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    fontWeight: 700,
  },
  title: {
    margin: '0.1rem 0 0',
    fontSize: '1.1rem',
    color: '#0f172a',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
  },
  brand: {
    fontWeight: 800,
    textDecoration: 'none',
    color: '#1d4ed8',
  },
};

export default Topbar;
