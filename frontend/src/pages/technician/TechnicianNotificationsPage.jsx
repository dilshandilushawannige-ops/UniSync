import { useEffect, useState, useMemo } from "react";
import { MdNotifications, MdCheckCircle, MdDelete, MdCampaign, MdInbox, MdFilterList } from "react-icons/md";
import TechnicianPortalLayout from "../../components/technician/TechnicianPortalLayout";
import { getNotificationsByEmail, markNotificationAsRead, deleteNotification } from "../../services/notificationService";

function TechnicianNotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, unread, announcements
    const userEmail = localStorage.getItem('email');

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        if (!userEmail) return;
        
        setIsLoading(true);
        try {
            const data = await getNotificationsByEmail(userEmail);
            setNotifications(data || []);
        } catch (error) {
            console.error('Error loading notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await markNotificationAsRead(id);
            setNotifications(notifications.map(n => 
                n.id === id ? { ...n, read: true } : n
            ));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteNotification(id);
            setNotifications(notifications.filter(n => n.id !== id));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        const unreadNotifications = notifications.filter(n => !n.read);
        for (const notification of unreadNotifications) {
            await handleMarkAsRead(notification.id);
        }
    };

    const filteredNotifications = useMemo(() => {
        switch (filter) {
            case 'unread':
                return notifications.filter(n => !n.read);
            case 'announcements':
                return notifications.filter(n => n.type === 'ANNOUNCEMENT');
            default:
                return notifications;
        }
    }, [notifications, filter]);

    const stats = useMemo(() => {
        const unreadCount = notifications.filter(n => !n.read).length;
        const announcementCount = notifications.filter(n => n.type === 'ANNOUNCEMENT').length;
        return {
            total: notifications.length,
            unread: unreadCount,
            announcements: announcementCount,
        };
    }, [notifications]);

    return (
        <TechnicianPortalLayout title="Technician Notifications">
            <div style={styles.container}>
                {/* Header Section */}
                <div style={styles.header}>
                    <div>
                        <h1 style={styles.title}>
                            <MdNotifications style={styles.titleIcon} />
                            Notifications
                        </h1>
                        <p style={styles.subtitle}>Stay updated with announcements and important alerts</p>
                    </div>
                    {stats.unread > 0 && (
                        <button onClick={handleMarkAllAsRead} style={styles.markAllButton}>
                            <MdCheckCircle style={{ marginRight: '8px' }} />
                            Mark all as read
                        </button>
                    )}
                </div>

                {/* Stats Cards */}
                <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                        <div style={styles.statIconWrapper}>
                            <MdFilterList style={styles.statIconSvg} />
                        </div>
                        <div>
                            <div style={styles.statValue}>{stats.total}</div>
                            <div style={styles.statLabel}>Total</div>
                        </div>
                    </div>
                    <div style={{...styles.statCard, ...styles.statCardBlue}}>
                        <div style={styles.statIconWrapper}>
                            <MdInbox style={styles.statIconSvg} />
                        </div>
                        <div>
                            <div style={styles.statValue}>{stats.unread}</div>
                            <div style={styles.statLabel}>Unread</div>
                        </div>
                    </div>
                    <div style={{...styles.statCard, ...styles.statCardPurple}}>
                        <div style={styles.statIconWrapper}>
                            <MdCampaign style={styles.statIconSvg} />
                        </div>
                        <div>
                            <div style={styles.statValue}>{stats.announcements}</div>
                            <div style={styles.statLabel}>Announcements</div>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div style={styles.filterTabs}>
                    <button 
                        onClick={() => setFilter('all')}
                        style={{...styles.filterTab, ...(filter === 'all' ? styles.filterTabActive : {})}}
                    >
                        All ({notifications.length})
                    </button>
                    <button 
                        onClick={() => setFilter('unread')}
                        style={{...styles.filterTab, ...(filter === 'unread' ? styles.filterTabActive : {})}}
                    >
                        Unread ({stats.unread})
                    </button>
                    <button 
                        onClick={() => setFilter('announcements')}
                        style={{...styles.filterTab, ...(filter === 'announcements' ? styles.filterTabActive : {})}}
                    >
                        Announcements ({stats.announcements})
                    </button>
                </div>

                {/* Notifications List */}
                <div style={styles.notificationsList}>
                    {isLoading ? (
                        <div style={styles.emptyState}>
                            <div style={styles.loader}></div>
                            <p style={styles.emptyText}>Loading notifications...</p>
                        </div>
                    ) : filteredNotifications.length === 0 ? (
                        <div style={styles.emptyState}>
                            <MdInbox style={styles.emptyIcon} />
                            <h3 style={styles.emptyTitle}>No notifications</h3>
                            <p style={styles.emptyText}>
                                {filter === 'unread' ? "You're all caught up!" : "You don't have any notifications yet."}
                            </p>
                        </div>
                    ) : (
                        filteredNotifications.map((notification) => (
                            <div 
                                key={notification.id} 
                                style={{
                                    ...styles.notificationCard,
                                    ...(notification.read ? {} : styles.notificationCardUnread)
                                }}
                            >
                                <div style={styles.notificationLeft}>
                                    <div style={{
                                        ...styles.notificationIconWrapper,
                                        ...(notification.read ? {} : styles.notificationIconWrapperUnread)
                                    }}>
                                        {notification.type === 'ANNOUNCEMENT' ? 
                                            <MdCampaign style={styles.notificationIcon} /> : 
                                            <MdNotifications style={styles.notificationIcon} />
                                        }
                                    </div>
                                </div>
                                
                                <div style={styles.notificationContent}>
                                    <div style={styles.notificationHeader}>
                                        <h3 style={styles.notificationTitle}>{notification.title}</h3>
                                        {!notification.read && (
                                            <span style={styles.newBadge}>NEW</span>
                                        )}
                                    </div>
                                    <p style={styles.notificationMessage}>{notification.message}</p>
                                    <div style={styles.notificationFooter}>
                                        <span style={styles.notificationTag}>{notification.type}</span>
                                    </div>
                                </div>

                                <div style={styles.notificationActions}>
                                    {!notification.read && (
                                        <button 
                                            onClick={() => handleMarkAsRead(notification.id)}
                                            style={styles.actionBtn}
                                            title="Mark as read"
                                        >
                                            <MdCheckCircle />
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => handleDelete(notification.id)}
                                        style={{...styles.actionBtn, ...styles.actionBtnDelete}}
                                        title="Delete"
                                    >
                                        <MdDelete />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </TechnicianPortalLayout>
    );
}

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px',
    },
    title: {
        fontSize: '2rem',
        fontWeight: '700',
        color: '#0f172a',
        margin: '0 0 8px 0',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    titleIcon: {
        fontSize: '2rem',
        color: '#3b82f6',
    },
    subtitle: {
        fontSize: '1rem',
        color: '#64748b',
        margin: 0,
    },
    markAllButton: {
        padding: '10px 20px',
        borderRadius: '10px',
        border: 'none',
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        fontSize: '0.875rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
    },
    statCard: {
        padding: '20px',
        borderRadius: '16px',
        backgroundColor: '#ffffff',
        border: '2px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        transition: 'all 0.3s',
    },
    statCardBlue: {
        borderColor: '#3b82f6',
        backgroundColor: '#eff6ff',
    },
    statCardPurple: {
        borderColor: '#8b5cf6',
        backgroundColor: '#f5f3ff',
    },
    statIconWrapper: {
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statIconSvg: {
        fontSize: '1.5rem',
        color: '#3b82f6',
    },
    statValue: {
        fontSize: '1.75rem',
        fontWeight: '800',
        color: '#0f172a',
        lineHeight: 1,
    },
    statLabel: {
        fontSize: '0.875rem',
        color: '#64748b',
        fontWeight: '600',
        marginTop: '4px',
    },
    filterTabs: {
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        borderBottom: '2px solid #e2e8f0',
        paddingBottom: '0',
    },
    filterTab: {
        padding: '12px 24px',
        border: 'none',
        backgroundColor: 'transparent',
        color: '#64748b',
        fontSize: '0.875rem',
        fontWeight: '600',
        cursor: 'pointer',
        borderBottom: '3px solid transparent',
        transition: 'all 0.2s',
        marginBottom: '-2px',
    },
    filterTabActive: {
        color: '#3b82f6',
        borderBottomColor: '#3b82f6',
    },
    notificationsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    notificationCard: {
        display: 'flex',
        gap: '16px',
        padding: '20px',
        borderRadius: '16px',
        backgroundColor: '#ffffff',
        border: '2px solid #e2e8f0',
        transition: 'all 0.3s',
    },
    notificationCardUnread: {
        borderColor: '#3b82f6',
        backgroundColor: '#eff6ff',
    },
    notificationLeft: {
        flexShrink: 0,
    },
    notificationIconWrapper: {
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        backgroundColor: '#f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
    },
    notificationIconWrapperUnread: {
        backgroundColor: '#dbeafe',
    },
    notificationIcon: {
        fontSize: '1.5rem',
        color: '#3b82f6',
    },
    notificationContent: {
        flex: 1,
        minWidth: 0,
    },
    notificationHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '8px',
    },
    notificationTitle: {
        fontSize: '1.125rem',
        fontWeight: '600',
        color: '#0f172a',
        margin: 0,
    },
    newBadge: {
        padding: '4px 10px',
        borderRadius: '6px',
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        fontSize: '0.625rem',
        fontWeight: '700',
        letterSpacing: '0.5px',
    },
    notificationMessage: {
        fontSize: '0.9375rem',
        color: '#475569',
        lineHeight: 1.6,
        margin: '0 0 12px 0',
    },
    notificationFooter: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    notificationTag: {
        padding: '4px 12px',
        borderRadius: '6px',
        backgroundColor: '#f1f5f9',
        color: '#64748b',
        fontSize: '0.75rem',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    notificationActions: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        flexShrink: 0,
    },
    actionBtn: {
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        border: '2px solid #e2e8f0',
        backgroundColor: '#ffffff',
        cursor: 'pointer',
        fontSize: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
    },
    actionBtnDelete: {
        borderColor: '#fee2e2',
        color: '#ef4444',
    },
    emptyState: {
        textAlign: 'center',
        padding: '80px 20px',
    },
    emptyIcon: {
        fontSize: '4rem',
        marginBottom: '16px',
        color: '#cbd5e1',
    },
    emptyTitle: {
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#0f172a',
        margin: '0 0 8px 0',
    },
    emptyText: {
        fontSize: '1rem',
        color: '#94a3b8',
        margin: 0,
    },
    loader: {
        width: '40px',
        height: '40px',
        border: '4px solid #e2e8f0',
        borderTop: '4px solid #3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 16px',
    },
};

export default TechnicianNotificationsPage;
