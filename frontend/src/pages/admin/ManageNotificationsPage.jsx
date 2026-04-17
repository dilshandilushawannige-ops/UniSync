import { useEffect, useState } from "react";
import NotificationPanel from "../../components/notification/NotificationPanel";
import {
    getAllNotifications,
    markNotificationAsRead,
    deleteNotification,
} from "../../services/notificationService";

function ManageNotificationsPage() {
    const [notifications, setNotifications] = useState([]);

    const loadNotifications = async () => {
        try {
            const data = await getAllNotifications();
            setNotifications(data);
        } catch (error) {
            console.error("Failed to load notifications", error);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await markNotificationAsRead(id);
            loadNotifications();
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteNotification(id);
            loadNotifications();
        } catch (error) {
            console.error("Failed to delete notification", error);
        }
    };

    return (
        <div style={styles.container}>
            <h2>Manage Notifications</h2>
            <NotificationPanel
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
            />
        </div>
    );
}

const styles = {
    container: {
        padding: "30px",
    },
};

export default ManageNotificationsPage;