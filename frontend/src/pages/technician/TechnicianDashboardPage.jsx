import { useEffect, useState } from "react";
import TechnicianPortalLayout from "../../components/technician/TechnicianPortalLayout";

function TechnicianDashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading ticket statistics
        setTimeout(() => {
            setStats({
                assigned: 12,
                inProgress: 5,
                completed: 28,
                pending: 7
            });
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <TechnicianPortalLayout title="Technician Dashboard">
            <div style={styles.welcomeSection}>
                <h2 style={styles.welcomeText}>Welcome TECHNICIAN!!</h2>
                <p style={styles.loadingText}>
                    {loading ? "Loading ticket statistics..." : ""}
                </p>
            </div>

            {!loading && stats && (
                <div style={styles.statsGrid}>
                    <div style={{ ...styles.statCard, ...styles.statCardBlue }}>
                        <div style={styles.statNumber}>{stats.assigned}</div>
                        <div style={styles.statLabel}>Assigned Tickets</div>
                    </div>
                    <div style={{ ...styles.statCard, ...styles.statCardYellow }}>
                        <div style={styles.statNumber}>{stats.inProgress}</div>
                        <div style={styles.statLabel}>In Progress</div>
                    </div>
                    <div style={{ ...styles.statCard, ...styles.statCardGreen }}>
                        <div style={styles.statNumber}>{stats.completed}</div>
                        <div style={styles.statLabel}>Completed</div>
                    </div>
                    <div style={{ ...styles.statCard, ...styles.statCardOrange }}>
                        <div style={styles.statNumber}>{stats.pending}</div>
                        <div style={styles.statLabel}>Pending Review</div>
                    </div>
                </div>
            )}
        </TechnicianPortalLayout>
    );
}

const styles = {
    welcomeSection: {
        marginBottom: "32px",
    },
    welcomeText: {
        fontSize: "2rem",
        fontWeight: 700,
        color: "#1e293b",
        margin: "0 0 12px",
    },
    loadingText: {
        color: "#64748b",
        fontSize: "1rem",
        margin: 0,
    },
    statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "20px",
        marginTop: "24px",
    },
    statCard: {
        padding: "28px",
        borderRadius: "12px",
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        textAlign: "center",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
    },
    statCardBlue: {
        borderLeft: "4px solid #3498db",
    },
    statCardYellow: {
        borderLeft: "4px solid #f39c12",
    },
    statCardGreen: {
        borderLeft: "4px solid #27ae60",
    },
    statCardOrange: {
        borderLeft: "4px solid #e67e22",
    },
    statNumber: {
        fontSize: "2.5rem",
        fontWeight: 800,
        color: "#1e293b",
        marginBottom: "8px",
    },
    statLabel: {
        fontSize: "1rem",
        color: "#64748b",
        fontWeight: 600,
    },
};

export default TechnicianDashboardPage;
