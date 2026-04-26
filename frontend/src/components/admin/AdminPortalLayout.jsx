import { useState, useEffect, useMemo } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
    MdDashboard,
    MdConfirmationNumber,
    MdEventAvailable,
    MdInventory,
    MdCampaign,
    MdPerson,
    MdLogout,
    MdNotificationsActive
} from "react-icons/md";
import { getAllTickets } from "../../services/ticketService";
import "./AdminPortalLayout.css";

const sidebarItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: MdDashboard },
    { label: "Ticket Management", path: "/admin/tickets", icon: MdConfirmationNumber },
    { label: "Booking Management", path: "/admin/bookings", icon: MdEventAvailable },
    { label: "Resource Manager", path: "/admin/resources", icon: MdInventory },
    { label: "Announcements", path: "/admin/announcements", icon: MdCampaign },
    { label: "Profile", path: "/admin/profile", icon: MdPerson },
];

function AdminPortalLayout({ title, children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
    const [tickets, setTickets] = useState([]);

    // Fetch tickets on component mount and when location changes
    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const ticketsData = await getAllTickets();
                setTickets(ticketsData);
            } catch (error) {
                console.error("Error fetching tickets:", error);
            }
        };
        fetchTickets();
    }, [location.pathname]);

    // Calculate count of new tickets (OPEN status)
    const newTicketCount = useMemo(() => {
        return tickets.filter(ticket => ticket.status === "OPEN").length;
    }, [tickets]);

    // Get new tickets for dropdown
    const newTickets = useMemo(() => {
        return tickets
            .filter(ticket => ticket.status === "OPEN")
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5); // Show only latest 5 tickets
    }, [tickets]);

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
        navigate(`/admin/tickets/${ticketId}`);
        setShowNotificationDropdown(false);
    };

    const handleViewAllClick = () => {
        navigate('/admin/tickets');
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
        <div className="admin-portal-layout">
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">UniSync</div>
                    <div className="sidebar-subtitle">ADMIN PORTAL</div>
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

            <main className="admin-main">
                <div className="main-header">
                    {title ? <h1 className="main-title">{title}</h1> : null}
                    <div className="notification-container">
                        <button
                            className="notification-bell"
                            onClick={handleNotificationClick}
                        >
                            <MdNotificationsActive className="bell-icon" />
                            {newTicketCount > 0 && (
                                <span className="notification-badge">{newTicketCount}</span>
                            )}
                        </button>

                        {showNotificationDropdown && (
                            <div className="notification-dropdown">
                                <div className="notification-dropdown-header">
                                    <h3>New Tickets</h3>
                                    <span className="notification-count-text">
                                        {newTicketCount} new {newTicketCount === 1 ? 'ticket' : 'tickets'}
                                    </span>
                                </div>
                                <div className="notification-dropdown-body">
                                    {newTickets.length === 0 ? (
                                        <div className="notification-empty">
                                            <p>No new tickets</p>
                                        </div>
                                    ) : (
                                        newTickets.map((ticket) => (
                                            <div
                                                key={ticket.id}
                                                className="notification-item"
                                                onClick={() => handleTicketClick(ticket.id)}
                                            >
                                                <div className="notification-item-icon">
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
                                                        By: {ticket.reportedByName || 'Unknown'}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                {newTicketCount > 0 && (
                                    <div className="notification-dropdown-footer">
                                        <button
                                            className="view-all-btn"
                                            onClick={handleViewAllClick}
                                        >
                                            View All Tickets
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

export default AdminPortalLayout;
