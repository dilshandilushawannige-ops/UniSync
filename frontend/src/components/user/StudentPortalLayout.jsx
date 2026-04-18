import { Link, NavLink } from "react-router-dom";

const sidebarItems = [
    { label: "Dashboard Home", path: "/dashboard", shortLabel: "D" },
    { label: "Profile", path: "/profile", shortLabel: "P" },
    { label: "Notifications", path: "/my-notifications", shortLabel: "N" },
    { label: "Publish Ticket", path: "/create-ticket", shortLabel: "T" },
    { label: "Resources", path: "/resources", shortLabel: "R" },
    { label: "View Grades", path: "/grades", shortLabel: "G" },
];

function StudentPortalLayout({ title, children }) {
    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <div style={styles.logoWrap}>
                    <span style={styles.logoMark} />
                    <span style={styles.logoText}>UniSync</span>
                </div>

                <nav style={styles.topNav}>
                    <Link to="/" style={styles.topLink}>Home</Link>
                    <a href="#services" style={styles.topLink}>Services</a>
                    <a href="#achievements" style={styles.topLink}>Achievements</a>
                    <a href="#about" style={styles.topLink}>About Us</a>
                    <a href="#contact" style={styles.topLink}>Contact</a>
                    <NavLink to="/dashboard" style={({ isActive }) => ({ ...styles.topLink, ...(isActive ? styles.topLinkActive : {}) })}>
                        Dashboard
                    </NavLink>
                    <Link to="/login" style={styles.logoutButton}>Logout</Link>
                </nav>
            </header>

            <div style={styles.contentShell}>
                <aside style={styles.sidebar}>
                    <div style={styles.sidebarTitle}>Campus Portal</div>
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
                                <span style={styles.sidebarIcon}>{item.shortLabel}</span>
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
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
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "24px",
        padding: "14px 28px",
        borderBottom: "1px solid #e2e8f0",
        backgroundColor: "#ffffff",
    },
    logoWrap: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },
    logoMark: {
        width: "22px",
        height: "22px",
        borderRadius: "6px",
        background: "linear-gradient(135deg, #f59e0b 0%, #2563eb 100%)",
    },
    logoText: {
        fontSize: "1rem",
        fontWeight: 800,
        color: "#1e3a8a",
        letterSpacing: "-0.02em",
    },
    topNav: {
        display: "flex",
        alignItems: "center",
        gap: "18px",
        flexWrap: "wrap",
        justifyContent: "flex-end",
    },
    topLink: {
        textDecoration: "none",
        color: "#475569",
        fontSize: "0.92rem",
        fontWeight: 600,
    },
    topLinkActive: {
        color: "#1e3a8a",
    },
    logoutButton: {
        textDecoration: "none",
        padding: "10px 18px",
        borderRadius: "999px",
        backgroundColor: "#fee2e2",
        color: "#dc2626",
        fontWeight: 700,
    },
    contentShell: {
        display: "flex",
        minHeight: "calc(100vh - 70px)",
    },
    sidebar: {
        width: "260px",
        backgroundColor: "#1e293b",
        color: "#ffffff",
        padding: "24px 16px",
        boxSizing: "border-box",
    },
    sidebarTitle: {
        marginBottom: "18px",
        paddingBottom: "16px",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
        fontWeight: 800,
        color: "#93c5fd",
        textAlign: "left",
    },
    sidebarList: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    sidebarLink: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        textDecoration: "none",
        color: "#e2e8f0",
        padding: "12px 14px",
        borderRadius: "12px",
        fontWeight: 600,
        textAlign: "left",
    },
    sidebarLinkActive: {
        backgroundColor: "#2563eb",
        color: "#ffffff",
        boxShadow: "0 10px 24px rgba(37, 99, 235, 0.28)",
    },
    sidebarIcon: {
        width: "20px",
        height: "20px",
        borderRadius: "999px",
        backgroundColor: "rgba(255,255,255,0.12)",
        display: "inline-grid",
        placeItems: "center",
        fontSize: "0.72rem",
        fontWeight: 800,
        flexShrink: 0,
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
