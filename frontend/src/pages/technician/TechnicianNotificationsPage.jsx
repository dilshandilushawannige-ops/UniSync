import { useMemo } from "react";
import TechnicianPortalLayout from "../../components/technician/TechnicianPortalLayout";
import AnnouncementList from "../../components/announcement/AnnouncementList";
import { useAnnouncements } from "../../context/AnnouncementContext";

function TechnicianNotificationsPage() {
    const { announcements } = useAnnouncements();

    // Filter announcements for TECHNICIAN role
    const technicianAnnouncements = useMemo(() => {
        return announcements.filter(announcement =>
            announcement.status === 'ACTIVE' &&
            (announcement.target.includes('ALL') || announcement.target.includes('TECHNICIAN'))
        );
    }, [announcements]);

    const stats = useMemo(() => {
        const importantCount = technicianAnnouncements.filter(a => a.priority === 'IMPORTANT').length;
        return {
            total: technicianAnnouncements.length,
            unread: technicianAnnouncements.length,
            important: importantCount,
        };
    }, [technicianAnnouncements]);

    return (
        <TechnicianPortalLayout title="Technician Notifications">
            <section style={styles.card}>
                <div style={styles.headerRow}>
                    <div>
                        <h2 style={styles.cardTitle}>📢 Notifications</h2>
                        <p style={styles.cardText}>
                            Review unread alerts, track recent updates, and clear items after reading them.
                        </p>
                    </div>

                    <div style={styles.statGrid}>
                        <StatCard label="Total" value={stats.total} />
                        <StatCard label="Unread" value={stats.unread} accent />
                        <StatCard label="Important" value={stats.important} important />
                    </div>
                </div>

                <div style={styles.announcementSection}>
                    {technicianAnnouncements.length === 0 ? (
                        <div style={styles.emptyState}>
                            <div style={styles.emptyIcon}>📭</div>
                            <p style={styles.emptyText}>No notifications available.</p>
                        </div>
                    ) : (
                        <AnnouncementList announcements={announcements} userRole="TECHNICIAN" />
                    )}
                </div>
            </section>
        </TechnicianPortalLayout>
    );
}

function StatCard({ label, value, accent = false, important = false }) {
    return (
        <div
            style={{
                ...styles.statCard,
                ...(accent ? styles.statCardAccent : {}),
                ...(important ? styles.statCardImportant : {}),
            }}
        >
            <span style={styles.statLabel}>{label}</span>
            <strong style={styles.statValue}>{value}</strong>
        </div>
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
    headerRow: {
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "24px",
        flexWrap: "wrap",
        marginBottom: "28px",
    },
    cardTitle: {
        margin: "0 0 10px",
        color: "#0f172a",
        fontSize: "1.5rem",
        fontWeight: "700",
    },
    cardText: {
        margin: 0,
        color: "#64748b",
        lineHeight: 1.6,
        maxWidth: "60ch",
        fontSize: "15px",
    },
    statGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(100px, 1fr))",
        gap: "14px",
        minWidth: "320px",
    },
    statCard: {
        padding: "16px 18px",
        borderRadius: "14px",
        backgroundColor: "#f8fafc",
        border: "2px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        transition: "all 0.2s ease",
    },
    statCardAccent: {
        backgroundColor: "#eff6ff",
        borderColor: "#3b82f6",
    },
    statCardImportant: {
        backgroundColor: "#fef2f2",
        borderColor: "#ef4444",
    },
    statLabel: {
        color: "#64748b",
        fontSize: "0.75rem",
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
    },
    statValue: {
        color: "#0f172a",
        fontSize: "1.75rem",
        fontWeight: "800",
    },
    announcementSection: {
        marginTop: "8px",
    },
    emptyState: {
        textAlign: "center",
        padding: "60px 20px",
    },
    emptyIcon: {
        fontSize: "64px",
        marginBottom: "16px",
    },
    emptyText: {
        color: "#94a3b8",
        fontSize: "15px",
        margin: 0,
    },
};

export default TechnicianNotificationsPage;
