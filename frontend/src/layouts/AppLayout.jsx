import { useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const menus = {
  student: [
    { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { label: 'Create Ticket', path: '/create-ticket', icon: '🎫' },
    { label: 'My Tickets', path: '/my-tickets', icon: '📄' },
    { label: 'Notifications', path: '/my-notifications', icon: '🔔' },
    { label: 'Resources', path: '/resources', icon: '🏫' },
    { label: 'My Bookings', path: '/my-bookings', icon: '📅' },
    { label: 'Profile', path: '/profile', icon: '👤' },
  ],
  admin: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: '🏠' },
    { label: 'Users', path: '/admin/users', icon: '👥' },
    { label: 'Notifications', path: '/admin/notifications', icon: '🔔' },
    { label: 'Tickets', path: '/admin/tickets', icon: '🧰' },
    { label: 'Bookings', path: '/admin/bookings', icon: '📅' },
    { label: 'Resources', path: '/admin/resources', icon: '🏫' },
    { label: 'Profile', path: '/admin/profile', icon: '👤' },
  ],
  technician: [
    { label: 'Dashboard', path: '/technician/dashboard', icon: '🏠' },
    { label: 'Tickets', path: '/technician/tickets', icon: '🛠️' },
    { label: 'Notifications', path: '/technician/notifications', icon: '🔔' },
    { label: 'Logs', path: '/technician/logs', icon: '📘' },
    { label: 'Profile', path: '/technician/profile', icon: '👤' },
  ],
};

function AppLayout({ role = 'student', title, children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const items = useMemo(() => menus[role] || menus.student, [role]);
  const sidebarVariant = role === 'student' ? 'light' : 'dark';

  return (
    <div className="dashboard-shell page-shell app-shell">
      <div className="app-sidebar-desktop">
        <Sidebar
          title={`${role[0].toUpperCase()}${role.slice(1)} Portal`}
          items={items}
          isOpen={true}
          variant={sidebarVariant}
        />
      </div>

      <Sidebar
        title={`${role[0].toUpperCase()}${role.slice(1)} Portal`}
        items={items}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        mobile={true}
        variant={sidebarVariant}
      />

      <section className="app-main-area">
        <Topbar title={title} roleLabel={role} onMenuToggle={() => setMenuOpen((prev) => !prev)} />
        <main style={styles.main}>{children}</main>
      </section>
    </div>
  );
}

const styles = {
  main: {
    padding: '1rem',
    maxWidth: 1180,
  },
};

export default AppLayout;
