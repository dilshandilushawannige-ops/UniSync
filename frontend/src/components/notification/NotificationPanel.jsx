import NotificationList from "./NotificationList";

function NotificationPanel({ notifications, onMarkAsRead, onDelete }) {
    return (
        <div style={styles.panel}>
            <h3>Notifications</h3>
            <NotificationList
                notifications={notifications}
                onMarkAsRead={onMarkAsRead}
                onDelete={onDelete}
            />
        </div>
    );
}

const styles = {
    panel: {
        width: "350px",
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        backgroundColor: "#f9fafb",
    },
};

export default NotificationPanel;