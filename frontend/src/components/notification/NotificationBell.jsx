function NotificationBell({ unreadCount = 0, onClick }) {
    return (
        <button onClick={onClick} style={styles.bellButton}>
            🔔
            {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
        </button>
    );
}

const styles = {
    bellButton: {
        position: "relative",
        fontSize: "24px",
        background: "none",
        border: "none",
        cursor: "pointer",
    },
    badge: {
        position: "absolute",
        top: "-6px",
        right: "-8px",
        backgroundColor: "red",
        color: "white",
        borderRadius: "50%",
        padding: "2px 6px",
        fontSize: "12px",
    },
};

export default NotificationBell;