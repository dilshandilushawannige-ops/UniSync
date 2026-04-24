import { Link, NavLink } from "react-router-dom";
import { useMemo } from "react";
import { useAnnouncements } from "../../context/AnnouncementContext";

const sidebarItems = [
    { label: "Student Dashboard", path: "/dashboard", icon: "📊" },
    { label: "Resources", path: "/resources", icon: "📚" },
    { label: "Resource Booking", path: "/resource-booking", icon: "📅" },
    { label: "My Ticket", path: "/my-tickets", icon: "🎫" },
    { label: "Tickets", path: "/create-ticket", icon: "📝" },
    { label: "Notification", path: "/my-notifications", icon: "🔔" },
    { label: "Profile", path: "/profile", icon: "👤" },
];

function StudentPortalLayout({ title, children }) {
    const { announcements } = useAnnouncements();

    // Calculate unread count for STUDENT role
    const unreadCount = useMemo(() => {
        return announcements.filter(announcement =>
            announcement.status === 'ACTIVE' &&
            (announcement.target.includes('ALL') || announcement.target.includes('STUDENT'))
        ).length;
    }, [announcements]);

    return (
        <div style={styles.page}>
            <div style={styles.contentShell}>
                <aside style={styles.sidebar}>
                    <div style={styles.sidebarTitle}>Student Portal</div>
                    <div style={styles.sidebarList}>
                        {sidebarItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                style={({ isActive }) => ({
                                    ...styles.sidebarLink,
                                    ...(isActive ? styles.sidebarLinkActive : {}),
                                })}
                            >
                                <span style={styles.sidebarIcon}>{item.icon}</span>
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </div>
                    <div style={styles.sidebarFooter}>
                        <Link to="/login" style={styles.logoutLink}>
                            <span style={styles.sidebarIcon}>🚪</span>
                            <span>Logout</span>
                        </Link>
                    </div>
                </aside>

                <main style={styles.main}>
                    <div style={styles.header}>
                        {title ? <h1 style={styles.title}>{title}</h1> : null}
                        <Link to="/my-notifications" style={styles.notificationBell}>
                            <span style={styles.bellIcon}>🔔</span>
                            {unreadCount > 0 && (
                                <span style={styles.badge}>{unreadCount}</span>
                            )}
                        </Link>
                    </div>
                    {children}
                </main>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
    },
    contentShell: {
        display: "flex",
        minHeight: "100vh",
    },
    sidebar: {
        width: "280px",
        backgroundColor: "#f8f9fa",
        color: "#495057",
        padding: "24px 16px",
        boxSizing: "border-box",
        borderRight: "1px solid #e9ecef",
        display: "flex",
        flexDirection: "column",
    },
    sidebarTitle: {
        marginBottom: "24px",
        paddingBottom: "16px",
        borderBottom: "1px solid #dee2e6",
        fontWeight: 700,
        color: "#212529",
        textAlign: "left",
        fontSize: "1.1rem",
    },
    sidebarList: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        flex: 1,
    },
    sidebarLink: {
        display: "flex",
        alignItems: "center",
        gap: "14px",
        textDecoration: "none",
        color: "#6c757d",
        padding: "14px 16px",
        borderRadius: "10px",
        fontWeight: 500,
        textAlign: "left",
        transition: "all 0.2s ease",
    },
    sidebarLinkActive: {
        backgroundColor: "#e7f1ff",
        color: "#0d6efd",
        fontWeight: 600,
    },
    sidebarIcon: {
        width: "24px",
        height: "24px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.2rem",
        flexShrink: 0,
    },
    sidebarFooter: {
        marginTop: "auto",
        paddingTop: "16px",
        borderTop: "1px solid #dee2e6",
    },
    logoutLink: {
        display: "flex",
        alignItems: "center",
        gap: "14px",
        textDecoration: "none",
        color: "#dc3545",
        padding: "14px 16px",
        borderRadius: "10px",
        fontWeight: 500,
        textAlign: "left",
        transition: "all 0.2s ease",
    },
    main: {
        flex: 1,
        padding: "28px",
        textAlign: "left",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
    },
    title: {
        margin: "0",
        fontSize: "1.8rem",
        color: "#0f172a",
        letterSpacing: "-0.04em",
    },
    notificationBell: {
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        cursor: "pointer",
        padding: "8px",
        borderRadius: "50%",
        transition: "background-color 0.2s ease",
        backgroundColor: "transparent",
    },
    bellIcon: {
        fontSize: "28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    badge: {
        position: "absolute",
        top: "2px",
        right: "2px",
        backgroundColor: "#dc3545",
        color: "white",
        borderRadius: "50%",
        minWidth: "20px",
        height: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "11px",
        fontWeight: "600",
        padding: "0 5px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    },
};

export default StudentPortalLayout;
