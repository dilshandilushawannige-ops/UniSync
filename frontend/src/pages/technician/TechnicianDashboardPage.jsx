import { useEffect, useState } from "react";
import TechnicianPortalLayout from "../../components/technician/TechnicianPortalLayout";
import api from "../../services/api";

function TechnicianDashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTicketStats();
    }, []);

    const fetchTicketStats = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get technician ID from localStorage (set during OAuth login)
            const technicianId = localStorage.getItem("userId");
            if (!technicianId) {
                setError("User not authenticated. Please log in.");
                setLoading(false);
                return;
            }

            // Fetch tickets assigned to this technician
            const response = await api.get(`/tickets/technician/${technicianId}`);

            const tickets = response.data;

            // Calculate statistics
            const assigned = tickets.length;
            const inProgress = tickets.filter(t => t.status === "IN_PROGRESS").length;
            const completed = tickets.filter(t => t.status === "RESOLVED" || t.status === "CLOSED").length;
            const pending = tickets.filter(t => t.status === "OPEN").length;

            setStats({ assigned, inProgress, completed, pending });
        } catch (err) {
            console.error("Error fetching ticket statistics:", err);
            setError(err.response?.data?.message || "Failed to load statistics");
        } finally {
            setLoading(false);
        }
    };

    return (
        <TechnicianPortalLayout title="Technician Dashboard">
            <div style={styles.welcomeSection}>
                <h2 style={styles.welcomeText}>Welcome TECHNICIAN!!</h2>
                {loading && <p style={styles.loadingText}>Loading ticket statistics...</p>}
                {error && <p style={styles.errorText}>{error}</p>}
            </div>

            {!loading && !error && stats && (
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
    errorText: {
        color: "#ef4444",
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
