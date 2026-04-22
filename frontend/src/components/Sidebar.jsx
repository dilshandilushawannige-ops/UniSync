import { NavLink } from 'react-router-dom';

function Sidebar({ items, isOpen, onClose, title, mobile = false, variant = 'dark' }) {
  const themeStyles = variant === 'light' ? styles.light : styles.dark;
  const panelStyle = mobile
    ? {
        ...themeStyles.sidebar,
        ...styles.mobileSidebar,
        ...(isOpen ? styles.mobileOpen : styles.mobileClosed),
      }
    : themeStyles.sidebar;

  return (
    <>
      {mobile && isOpen ? <div style={styles.backdrop} onClick={onClose} /> : null}
      <aside style={panelStyle}>
        <div style={themeStyles.header}>{title}</div>
        <nav style={styles.nav}>
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              style={({ isActive }) => ({
                ...themeStyles.link,
                ...(isActive ? themeStyles.linkActive : {}),
              })}
            >
              <span style={themeStyles.icon}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.35)',
    zIndex: 29,
  },
  dark: {
    sidebar: {
    width: 270,
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #0f172a, #1e293b)',
    color: '#e2e8f0',
    padding: '1rem 0.8rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
    header: {
      fontWeight: 800,
      padding: '0.8rem 0.6rem 0.5rem',
      borderBottom: '1px solid rgba(148, 163, 184, 0.25)',
    },
    link: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.7rem',
      textDecoration: 'none',
      color: '#cbd5e1',
      padding: '0.65rem 0.7rem',
      borderRadius: 10,
      fontWeight: 500,
    },
    linkActive: {
      background: 'rgba(59, 130, 246, 0.25)',
      color: '#fff',
    },
    icon: {
      width: 18,
      textAlign: 'center',
    },
  },
  light: {
    sidebar: {
      width: 270,
      minHeight: '100vh',
      background: '#f8f9fa',
      color: '#495057',
      padding: '1rem 0.8rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      borderRight: '1px solid #e9ecef',
    },
    header: {
      fontWeight: 800,
      padding: '0.8rem 0.6rem 0.5rem',
      borderBottom: '1px solid #dee2e6',
      color: '#212529',
    },
    link: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.7rem',
      textDecoration: 'none',
      color: '#6c757d',
      padding: '0.65rem 0.7rem',
      borderRadius: 10,
      fontWeight: 500,
    },
    linkActive: {
      background: '#e7f1ff',
      color: '#0d6efd',
      fontWeight: 600,
    },
    icon: {
      width: 18,
      textAlign: 'center',
    },
  },
  mobileSidebar: {
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 31,
    transition: 'transform 180ms ease',
  },
  mobileOpen: {
    transform: 'translateX(0)',
  },
  mobileClosed: {
    transform: 'translateX(-108%)',
  },
  nav: {
    display: 'grid',
    gap: '0.35rem',
  },
};

export default Sidebar;
