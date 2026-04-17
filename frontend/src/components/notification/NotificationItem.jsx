function NotificationItem({ notification, onMarkAsRead, onDelete }) {
    return (
        <div style={styles.card}>
            <h4 style={styles.title}>{notification.title}</h4>
            <p style={styles.message}>{notification.message}</p>
            <p style={styles.type}>Type: {notification.type}</p>
            <p style={styles.status}>
                Status: {notification.read ? "Read" : "Unread"}
            </p>

            <div style={styles.actions}>
                {!notification.read && (
                    <button onClick={() => onMarkAsRead(notification.id)} style={styles.readButton}>
                        Mark as Read
                    </button>
                )}

                <button onClick={() => onDelete(notification.id)} style={styles.deleteButton}>
                    Delete
                </button>
            </div>
        </div>
    );
}

const styles = {
    card: {
        border: "1px solid #ddd",
        padding: "15px",
        borderRadius: "8px",
        marginBottom: "12px",
        backgroundColor: "#fff",
    },
    title: {
        margin: "0 0 8px 0",
    },
    message: {
        margin: "0 0 8px 0",
    },
    type: {
        margin: "0 0 4px 0",
        fontSize: "14px",
    },
    status: {
        margin: "0 0 10px 0",
        fontSize: "14px",
        fontWeight: "bold",
    },
    actions: {
        display: "flex",
        gap: "10px",
    },
    readButton: {
        padding: "8px 12px",
        border: "none",
        backgroundColor: "#16a34a",
        color: "#fff",
        borderRadius: "6px",
        cursor: "pointer",
    },
    deleteButton: {
        padding: "8px 12px",
        border: "none",
        backgroundColor: "#dc2626",
        color: "#fff",
        borderRadius: "6px",
        cursor: "pointer",
    },
};

export default NotificationItem;