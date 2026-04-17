import { Link } from "react-router-dom";
import StudentPortalLayout from "../../components/user/StudentPortalLayout";

function StudentDashboardPage() {
    return (
        <StudentPortalLayout title="Welcome to Student Dashboard">
            <section style={styles.card}>
                <h2 style={styles.cardTitle}>Quick Actions</h2>
                <p style={styles.cardText}>
                    Welcome to your portal. Use the sidebar to publish tickets or view resources.
                </p>

                <div style={styles.actionGrid}>
                    <Link to="/create-ticket" style={styles.actionCard}>
                        <strong style={styles.actionLabel}>Publish Ticket</strong>
                        <span style={styles.actionCopy}>Report a new issue and follow its progress.</span>
                    </Link>

                    <Link to="/my-notifications" style={styles.actionCard}>
                        <strong style={styles.actionLabel}>Check Notifications</strong>
                        <span style={styles.actionCopy}>Review updates from the support team.</span>
                    </Link>

                    <Link to="/profile" style={styles.actionCard}>
                        <strong style={styles.actionLabel}>Open Profile</strong>
                        <span style={styles.actionCopy}>View your student details and account info.</span>
                    </Link>
                </div>
            </section>
        </StudentPortalLayout>
    );
}

const styles = {
    card: {
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "18px",
        padding: "24px",
        boxShadow: "0 14px 32px rgba(15, 23, 42, 0.05)",
    },
    cardTitle: {
        margin: "0 0 8px",
        color: "#0f172a",
        fontSize: "1.15rem",
    },
    cardText: {
        margin: "0 0 20px",
        color: "#64748b",
        lineHeight: 1.6,
    },
    actionGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "14px",
    },
    actionCard: {
        textDecoration: "none",
        borderRadius: "16px",
        padding: "18px",
        backgroundColor: "#f8fafc",
        border: "1px solid #dbeafe",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    actionLabel: {
        color: "#1e3a8a",
    },
    actionCopy: {
        color: "#64748b",
        lineHeight: 1.5,
    },
};

export default StudentDashboardPage;
