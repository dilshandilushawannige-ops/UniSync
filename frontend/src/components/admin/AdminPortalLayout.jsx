import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import bellIcon from "../../assets/bell.png";

const sidebarItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { label: "Ticket Manage", path: "/admin/tickets", icon: "🎫" },
    { label: "Booking Manage", path: "/admin/bookings", icon: "📅" },
    { label: "Resource Manager", path: "/admin/resources", icon: "📦" },
    { label: "Announcement", path: "/admin/announcements", icon: "📢" },
    { label: "Profile", path: "/admin/profile", icon: "👤" },
];

function AdminPortalLayout({ title, children }) {
    const navigate = useNavigate();
    const [newTicketCount, setNewTicketCount] = useState(0);
    const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Fetch unread notifications
        const fetchNotifications = async () => {
            try {
                const email = localStorage.getItem('email');
                if (!email) {
                    console.error('No email found in localStorage');
                    return;
                }

                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'}/api/notifications/unread?email=${encodeURIComponent(email)}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setNotifications(data);
                    setNewTicketCount(data.length);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
        // Refresh notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        // Clear authentication data
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        localStorage.removeItem("email");

        // Redirect to home page
        navigate("/");
    };

    const handleNotificationClick = () => {
        setShowNotificationDropdown(!showNotificationDropdown);
    };

    const handleNotificationItemClick = async (notification) => {
        // Mark notification as read
        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'}/api/notifications/${notification.id}/read`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }

        // Navigate to the ticket
        if (notification.ticketId) {
            navigate(`/admin/tickets/${notification.ticketId}`);
        }
        setShowNotificationDropdown(false);
    };

    const handleClickOutside = (e) => {
        if (!e.target.closest('.notification-container')) {
            setShowNotificationDropdown(false);
        }
    };

    useEffect(() => {
        if (showNotificationDropdown) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showNotificationDropdown]);

    return (
        <div style={styles.page}>
            <div style={styles.contentShell}>
                <aside style={styles.sidebar}>
                    <div style={styles.sidebarTitle}>Admin Portal</div>
                    <div style={styles.sidebarList}>
                        {sidebarItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                style={({ isActive }) => ({
                                    ...styles.sidebarLink,
                                    ...(isActive ? styles.sidebarLinkActive : {}),
                                })}
                            >
                                <span style={styles.sidebarIcon}>{item.icon}</span>
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </div>
                    <div style={styles.sidebarFooter}>
                        <button onClick={handleLogout} style={styles.logoutLink}>
                            <span style={styles.sidebarIcon}>🚪</span>
                            <span>Logout</span>
                        </button>
                    </div>
                </aside>

                <main style={styles.main}>
                    <div style={styles.mainHeader}>
                        {title ? <h1 style={styles.title}>{title}</h1> : <div />}
                        <div className="notification-container" style={{ position: 'relative' }}>
                            <button onClick={handleNotificationClick} style={styles.notificationButton}>
                                <img src={bellIcon} alt="Notifications" style={styles.bellIcon} />
                                {newTicketCount > 0 && (
                                    <span style={styles.notificationBadge}>{newTicketCount}</span>
                                )}
                            </button>

                            {showNotificationDropdown && (
                                <div style={styles.notificationDropdown}>
                                    <div style={styles.dropdownHeader}>
                                        <h3 style={styles.dropdownTitle}>Notifications</h3>
                                        <span style={styles.notificationCount}>{newTicketCount} new</span>
                                    </div>
                                    <div style={styles.notificationList}>
                                        {notifications.length > 0 ? (
                                            notifications.map((notification) => (
                                                <div
                                                    key={notification.id}
                                                    onClick={() => handleNotificationItemClick(notification)}
                                                    style={styles.notificationItem}
                                                >
                                                    <div style={styles.notificationIcon}>🎫</div>
                                                    <div style={styles.notificationContent}>
                                                        <div style={styles.notificationTitle}>{notification.message}</div>
                                                        <div style={styles.notificationTime}>{notification.createdAt}</div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div style={styles.emptyNotifications}>
                                                <p>No new notifications</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {children}
                </main>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
    },
    contentShell: {
        display: "flex",
        minHeight: "100vh",
    },
    sidebar: {
        width: "280px",
        backgroundColor: "#f8f9fa",
        color: "#495057",
        padding: "24px 16px",
        boxSizing: "border-box",
        borderRight: "1px solid #e9ecef",
        display: "flex",
        flexDirection: "column",
    },
    sidebarTitle: {
        marginBottom: "24px",
        paddingBottom: "16px",
        borderBottom: "1px solid #dee2e6",
        fontWeight: 700,
        color: "#212529",
        textAlign: "left",
        fontSize: "1.1rem",
    },
    sidebarList: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        flex: 1,
    },
    sidebarLink: {
        display: "flex",
        alignItems: "center",
        gap: "14px",
        textDecoration: "none",
        color: "#6c757d",
        padding: "14px 16px",
        borderRadius: "10px",
        fontWeight: 500,
        textAlign: "left",
        transition: "all 0.2s ease",
    },
    sidebarLinkActive: {
        backgroundColor: "#e7f1ff",
        color: "#0d6efd",
        fontWeight: 600,
    },
    sidebarIcon: {
        width: "24px",
        height: "24px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.2rem",
        flexShrink: 0,
    },
    sidebarFooter: {
        marginTop: "auto",
        paddingTop: "16px",
        borderTop: "1px solid #dee2e6",
    },
    logoutLink: {
        display: "flex",
        alignItems: "center",
        gap: "14px",
        textDecoration: "none",
        color: "#dc3545",
        padding: "14px 16px",
        borderRadius: "10px",
        fontWeight: 500,
        textAlign: "left",
        transition: "all 0.2s ease",
        border: "none",
        background: "none",
        cursor: "pointer",
        width: "100%",
        fontSize: "inherit",
        fontFamily: "inherit",
    },
    main: {
        flex: 1,
        padding: "28px",
        textAlign: "left",
    },
    mainHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
    },
    title: {
        margin: 0,
        fontSize: "1.8rem",
        color: "#0f172a",
        letterSpacing: "-0.04em",
    },
    notificationButton: {
        position: "relative",
        background: "transparent",
        border: "none",
        borderRadius: "12px",
        padding: "8px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    bellIcon: {
        width: "24px",
        height: "24px",
        objectFit: "contain",
    },
    notificationBadge: {
        position: "absolute",
        top: "-6px",
        right: "-6px",
        background: "#dc2626",
        color: "#ffffff",
        borderRadius: "999px",
        padding: "4px 8px",
        fontSize: "11px",
        fontWeight: "700",
        minWidth: "20px",
        height: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px solid #ffffff",
    },
    notificationDropdown: {
        position: "absolute",
        top: "calc(100% + 8px)",
        right: "0",
        width: "380px",
        maxHeight: "500px",
        background: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
        border: "1px solid #e2e8f0",
        zIndex: 1000,
        overflow: "hidden",
    },
    dropdownHeader: {
        padding: "16px 20px",
        borderBottom: "1px solid #e2e8f0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#f8fafc",
    },
    dropdownTitle: {
        margin: 0,
        fontSize: "16px",
        fontWeight: "700",
        color: "#0f172a",
    },
    notificationCount: {
        fontSize: "12px",
        fontWeight: "600",
        color: "#64748b",
        background: "#e2e8f0",
        padding: "4px 10px",
        borderRadius: "12px",
    },
    notificationList: {
        maxHeight: "400px",
        overflowY: "auto",
    },
    notificationItem: {
        padding: "16px 20px",
        borderBottom: "1px solid #f1f5f9",
        cursor: "pointer",
        transition: "background 0.2s ease",
        display: "flex",
        gap: "12px",
        alignItems: "flex-start",
    },
    notificationIcon: {
        fontSize: "24px",
        flexShrink: 0,
    },
    notificationContent: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#0f172a",
        marginBottom: "4px",
        lineHeight: "1.4",
    },
    notificationTime: {
        fontSize: "12px",
        color: "#64748b",
    },
    emptyNotifications: {
        padding: "40px 20px",
        textAlign: "center",
        color: "#94a3b8",
        fontSize: "14px",
    },
};

export default AdminPortalLayout;
