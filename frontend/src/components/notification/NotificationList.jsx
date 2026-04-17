import NotificationItem from "./NotificationItem";

function NotificationList({ notifications, onMarkAsRead, onDelete }) {
    if (!notifications || notifications.length === 0) {
        return <p>No notifications available.</p>;
    }

    return (
        <div>
            {notifications.map((notification) => (
                <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={onMarkAsRead}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}

export default NotificationList;