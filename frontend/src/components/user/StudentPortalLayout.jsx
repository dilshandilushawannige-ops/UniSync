import { Link, NavLink } from "react-router-dom";

const sidebarItems = [
    { label: "Student Dashboard", path: "/dashboard", icon: "📊" },
    { label: "Resource Booking", path: "/resource-booking", icon: "📅" },
    { label: "Resources", path: "/resources", icon: "🏫" },
    { label: "My Ticket", path: "/my-tickets", icon: "🎫" },
    { label: "Tickets", path: "/create-ticket", icon: "📝" },
    { label: "Notification", path: "/my-notifications", icon: "🔔" },
    { label: "Profile", path: "/profile", icon: "👤" },
];

function StudentPortalLayout({ title, children }) {
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
                    {title ? <h1 style={styles.title}>{title}</h1> : null}
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
    title: {
        margin: "0 0 20px",
        fontSize: "1.8rem",
        color: "#0f172a",
        letterSpacing: "-0.04em",
    },
};

export default StudentPortalLayout;
