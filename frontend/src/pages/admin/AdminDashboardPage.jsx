import { Link } from "react-router-dom";
import AdminPortalLayout from "../../components/admin/AdminPortalLayout";

function AdminDashboardPage() {
    return (
        <AdminPortalLayout title="Admin Dashboard Overview">
            <section style={styles.card}>
                <div style={styles.hero}>
                    <h2 style={styles.heroTitle}>Welcome Back, Admin!</h2>
                    <p style={styles.heroText}>
                        Here is what&apos;s happening in your Campus Nexus system today.
                    </p>
                </div>

                <div style={styles.quickActions}>
                    <p style={styles.quickActionsLabel}>Quick access</p>
                    <div style={styles.quickActionsRow}>
                        <Link to="/admin/bookings" style={styles.primaryAction}>
                            <span style={styles.primaryActionIcon} aria-hidden>📅</span>
                            <span>
                                <span style={styles.primaryActionTitle}>Booking Manage</span>
                                <span style={styles.primaryActionHint}>
                                    Search, filter, and approve or reject booking requests
                                </span>
                            </span>
                        </Link>
                    </div>
                </div>

                <p style={styles.loadingText}>Loading system statistics...</p>

                <div style={styles.placeholderCard}>
                    <p style={styles.placeholderText}>
                        System activities and charts will appear here as the system grows.
                    </p>
                </div>
            </section>
        </AdminPortalLayout>
    );
}

const styles = {
    card: {
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "18px",
        padding: "28px",
        boxShadow: "0 14px 32px rgba(15, 23, 42, 0.05)",
    },
    hero: {
        marginBottom: "26px",
    },
    heroTitle: {
        margin: "0 0 10px",
        fontSize: "2rem",
        color: "#0f172a",
        letterSpacing: "-0.04em",
    },
    heroText: {
        margin: 0,
        color: "#64748b",
        lineHeight: 1.6,
        fontSize: "1rem",
    },
    quickActions: {
        marginBottom: "24px",
    },
    quickActionsLabel: {
        margin: "0 0 10px",
        fontSize: "0.75rem",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "#94a3b8",
    },
    quickActionsRow: {
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
    },
    primaryAction: {
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "16px 20px",
        borderRadius: "14px",
        background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
        color: "#ffffff",
        textDecoration: "none",
        fontWeight: 700,
        boxShadow: "0 12px 28px rgba(37, 99, 235, 0.28)",
        maxWidth: "100%",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
    },
    primaryActionIcon: {
        fontSize: "1.5rem",
        lineHeight: 1,
    },
    primaryActionTitle: {
        display: "block",
        fontSize: "1.05rem",
        marginBottom: "4px",
    },
    primaryActionHint: {
        display: "block",
        fontSize: "0.82rem",
        fontWeight: 500,
        opacity: 0.92,
    },
    loadingText: {
        margin: "0 0 18px",
        color: "#94a3b8",
        fontWeight: 600,
    },
    placeholderCard: {
        minHeight: "130px",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        backgroundColor: "#f8fafc",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        textAlign: "center",
    },
    placeholderText: {
        margin: 0,
        color: "#64748b",
        fontSize: "1rem",
    },
};

export default AdminDashboardPage;
