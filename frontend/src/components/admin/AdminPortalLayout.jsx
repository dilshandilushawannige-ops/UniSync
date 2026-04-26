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
                    <Link to="/admin/notifications" className="notification-bell">
                        <MdNotificationsActive className="bell-icon" />
                    </Link>
                </div>
                <div key={location.pathname} className="dashboard-content fade-in-up">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default AdminPortalLayout;
