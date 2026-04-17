import { useEffect, useMemo, useState } from "react";
import NotificationPanel from "../../components/notification/NotificationPanel";
import StudentPortalLayout from "../../components/user/StudentPortalLayout";
import {
    deleteNotification,
    getNotificationsByEmail,
    markNotificationAsRead,
} from "../../services/notificationService";

function MyNotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const userEmail = "student@gmail.com";

    const loadNotifications = async () => {
        try {
            setError("");
            const data = await getNotificationsByEmail(userEmail);
            setNotifications(data);
        } catch (loadError) {
            setError("Failed to load notifications.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const stats = useMemo(() => {
        const unreadCount = notifications.filter((notification) => !notification.read).length;
        return {
            total: notifications.length,
            unread: unreadCount,
            read: notifications.length - unreadCount,
        };
    }, [notifications]);

    const handleMarkAsRead = async (id) => {
        try {
            await markNotificationAsRead(id);
            loadNotifications();
        } catch (actionError) {
            setError("Failed to mark notification as read.");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteNotification(id);
            loadNotifications();
        } catch (actionError) {
            setError("Failed to delete notification.");
        }
    };

    return (
        <StudentPortalLayout title="Welcome to Student Dashboard">
            <section style={styles.card}>
                <div style={styles.headerRow}>
                    <div>
                        <h2 style={styles.cardTitle}>Notifications</h2>
                        <p style={styles.cardText}>
                            Review unread alerts, track recent updates, and clear items after reading them.
                        </p>
                    </div>

                    <div style={styles.statGrid}>
                        <StatCard label="Total" value={stats.total} />
                        <StatCard label="Unread" value={stats.unread} accent />
                        <StatCard label="Read" value={stats.read} />
                    </div>
                </div>

                {loading ? <p style={styles.status}>Loading notifications...</p> : null}
                {error ? <p style={styles.error}>{error}</p> : null}

                {!loading && !error ? (
                    <div style={styles.panelWrap}>
                        <NotificationPanel
                            notifications={notifications}
                            onMarkAsRead={handleMarkAsRead}
                            onDelete={handleDelete}
                        />
                    </div>
                ) : null}
            </section>
        </StudentPortalLayout>
    );
}

function StatCard({ label, value, accent = false }) {
    return (
        <div
            style={{
                ...styles.statCard,
                ...(accent ? styles.statCardAccent : {}),
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
        padding: "24px",
        boxShadow: "0 14px 32px rgba(15, 23, 42, 0.05)",
    },
    headerRow: {
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "20px",
        flexWrap: "wrap",
        marginBottom: "20px",
    },
    cardTitle: {
        margin: "0 0 8px",
        color: "#0f172a",
        fontSize: "1.15rem",
    },
    cardText: {
        margin: 0,
        color: "#64748b",
        lineHeight: 1.6,
        maxWidth: "60ch",
    },
    statGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(90px, 1fr))",
        gap: "12px",
        minWidth: "300px",
    },
    statCard: {
        padding: "14px 16px",
        borderRadius: "14px",
        backgroundColor: "#f8fafc",
        border: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },
    statCardAccent: {
        backgroundColor: "#eff6ff",
        borderColor: "#bfdbfe",
    },
    statLabel: {
        color: "#64748b",
        fontSize: "0.82rem",
        fontWeight: 700,
    },
    statValue: {
        color: "#0f172a",
        fontSize: "1.25rem",
    },
    status: {
        color: "#64748b",
        margin: 0,
    },
    error: {
        color: "#b91c1c",
        margin: 0,
        fontWeight: 700,
    },
    panelWrap: {
        display: "flex",
        justifyContent: "flex-start",
    },
};

export default MyNotificationsPage;
