import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useAnnouncements } from "../../context/AnnouncementContext";
import api from "../../services/api";
import {
    MdDashboard,
    MdAssignment,
    MdHourglassEmpty,
    MdCheckCircle,
    MdNotifications,
    MdPerson,
    MdLogout,
    MdNotificationsActive,
    MdConfirmationNumber,
    MdCampaign
} from "react-icons/md";
import "./TechnicianPortalLayout.css";

const sidebarItems = [
    { label: "Dashboard", path: "/technician/dashboard", icon: MdDashboard },
    { label: "Assigned Tickets", path: "/technician/tickets", icon: MdAssignment },
    { label: "In Progress", path: "/technician/in-progress", icon: MdHourglassEmpty },
    { label: "Maintenance Logs", path: "/technician/logs", icon: MdCheckCircle },
    { label: "Notifications", path: "/technician/notifications", icon: MdNotifications },
    { label: "Profile", path: "/technician/profile", icon: MdPerson },
];

function TechnicianPortalLayout({ title, children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { announcements } = useAnnouncements();
    const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
    const [tickets, setTickets] = useState([]);

    // Fetch assigned tickets on component mount and when location changes
    useEffect(() => {
        const fetchAssignedTickets = async () => {
            try {
                const technicianId = localStorage.getItem("userId");
                if (technicianId) {
                    const response = await api.get(`/tickets/technician/${technicianId}`);
                    setTickets(response.data);
                }
            } catch (error) {
                console.error("Error fetching assigned tickets:", error);
            }
        };
        fetchAssignedTickets();
    }, [location.pathname]);

    // Calculate unread count for TECHNICIAN role (announcements)
    const technicianAnnouncements = useMemo(() => {
        return announcements
            .filter(announcement =>
                announcement.status === 'ACTIVE' &&
                (announcement.target.includes('ALL') || announcement.target.includes('TECHNICIAN'))
            )
            .slice(0, 5); // Show only latest 5 announcements
    }, [announcements]);

    // Get newly assigned tickets (show all tickets, not just OPEN)
    const newAssignedTickets = useMemo(() => {
        return tickets
            .filter(ticket =>
                // Show tickets that are OPEN or IN_PROGRESS (not completed)
                ticket.status === "OPEN" ||
                ticket.status === "IN_PROGRESS" ||
                ticket.status === "ASSIGNED"
            )
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5); // Show only latest 5 tickets
    }, [tickets]);

    // Total notification count (announcements + new assigned tickets)
    const totalNotificationCount = technicianAnnouncements.length + newAssignedTickets.length;

    const handleLogout = () => {
        // Clear authentication data
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        localStorage.removeItem("email");

        // Redirect to home page
        navigate("/");
    };

    const handleNotificationClick = (e) => {
        e.preventDefault();
        setShowNotificationDropdown(!showNotificationDropdown);
    };

    const handleTicketClick = (ticketId) => {
        navigate(`/technician/tickets/${ticketId}`);
        setShowNotificationDropdown(false);
    };

    const handleAnnouncementClick = () => {
        navigate('/technician/notifications');
        setShowNotificationDropdown(false);
    };

    const handleViewAllClick = () => {
        navigate('/technician/notifications');
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
        <div className="technician-portal-layout">
            <aside className="technician-sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">UniSync</div>
                    <div className="sidebar-subtitle">TECHNICIAN PORTAL</div>
                </div>

                <nav className="sidebar-nav">
                    {sidebarItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    isActive ? "nav-item nav-item-active" : "nav-item"
                                }
                            >
                                <IconComponent className="nav-icon" />
                                <span className="nav-label">{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <MdLogout className="nav-icon" />
                        <span className="nav-label">Logout</span>
                    </button>
                </div>
            </aside>

            <main className="technician-main">
                <div className="main-header">
                    {title ? <h1 className="main-title">{title}</h1> : null}
                    <div className="notification-container">
                        <button
                            className="notification-bell"
                            onClick={handleNotificationClick}
                        >
                            <MdNotificationsActive className="bell-icon" />
                            {totalNotificationCount > 0 && (
                                <span className="notification-badge">{totalNotificationCount}</span>
                            )}
                        </button>

                        {showNotificationDropdown && (
                            <div className="notification-dropdown">
                                <div className="notification-dropdown-header">
                                    <h3>Notifications</h3>
                                    <span className="notification-count-text">
                                        {totalNotificationCount} total
                                    </span>
                                </div>
                                <div className="notification-dropdown-body">
                                    {/* Assigned Tickets Section */}
                                    {newAssignedTickets.length > 0 && (
                                        <>
                                            <div className="notification-section-header">
                                                <MdAssignment className="section-icon" />
                                                <span>Assigned Tickets ({newAssignedTickets.length})</span>
                                            </div>
                                            {newAssignedTickets.map((ticket) => (
                                                <div
                                                    key={`ticket-${ticket.id}`}
                                                    className="notification-item"
                                                    onClick={() => handleTicketClick(ticket.id)}
                                                >
                                                    <div className="notification-item-icon ticket-icon">
                                                        <MdConfirmationNumber />
                                                    </div>
                                                    <div className="notification-item-content">
                                                        <div className="notification-item-title">
                                                            #{ticket.id} - {ticket.title}
                                                        </div>
                                                        <div className="notification-item-meta">
                                                            <span className={`priority-tag priority-${ticket.priority?.toLowerCase()}`}>
                                                                {ticket.priority}
                                                            </span>
                                                            <span className="notification-item-category">
                                                                {ticket.category}
                                                            </span>
                                                        </div>
                                                        <div className="notification-item-user">
                                                            Reported by: {ticket.reportedByName || 'Unknown'}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    )}

                                    {/* Announcements Section */}
                                    {technicianAnnouncements.length > 0 && (
                                        <>
                                            <div className="notification-section-header">
                                                <MdCampaign className="section-icon" />
                                                <span>Announcements ({technicianAnnouncements.length})</span>
                                            </div>
                                            {technicianAnnouncements.map((announcement) => (
                                                <div
                                                    key={`announcement-${announcement.id}`}
                                                    className="notification-item"
                                                    onClick={() => handleAnnouncementClick()}
                                                >
                                                    <div className="notification-item-icon announcement-icon">
                                                        <MdCampaign />
                                                    </div>
                                                    <div className="notification-item-content">
                                                        <div className="notification-item-title">
                                                            {announcement.title}
                                                        </div>
                                                        <div className="notification-item-message">
                                                            {announcement.message}
                                                        </div>
                                                        <div className="notification-item-meta">
                                                            <span className={`priority-tag priority-${announcement.priority?.toLowerCase()}`}>
                                                                {announcement.priority}
                                                            </span>
                                                            <span className="notification-item-time">
                                                                {announcement.createdAt}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    )}

                                    {/* Empty State */}
                                    {newAssignedTickets.length === 0 && technicianAnnouncements.length === 0 && (
                                        <div className="notification-empty">
                                            <p>No new notifications</p>
                                        </div>
                                    )}
                                </div>
                                {totalNotificationCount > 0 && (
                                    <div className="notification-dropdown-footer">
                                        <button
                                            className="view-all-btn"
                                            onClick={handleViewAllClick}
                                        >
                                            View All Notifications
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div key={location.pathname} className="dashboard-content fade-in-up">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default TechnicianPortalLayout;
