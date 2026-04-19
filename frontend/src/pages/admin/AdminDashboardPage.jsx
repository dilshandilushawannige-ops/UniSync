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
f
