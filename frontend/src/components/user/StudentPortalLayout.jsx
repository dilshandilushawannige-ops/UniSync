import { Link, NavLink, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useAnnouncements } from "../../context/AnnouncementContext";
import { 
  MdDashboard, 
  MdLibraryBooks, 
  MdEventAvailable, 
  MdConfirmationNumber, 
  MdAddCircleOutline, 
  MdNotifications, 
  MdPerson,
  MdLogout,
  MdNotificationsActive
} from "react-icons/md";
import "./StudentPortalLayout.css";

const sidebarItems = [
    { label: "Dashboard", path: "/dashboard", icon: MdDashboard },
    { label: "Resources", path: "/resources", icon: MdLibraryBooks },
    { label: "Resource Booking", path: "/resource-booking", icon: MdEventAvailable },
    { label: "My Tickets", path: "/my-tickets", icon: MdConfirmationNumber },
    { label: "New Ticket", path: "/create-ticket", icon: MdAddCircleOutline },
    { label: "Notifications", path: "/my-notifications", icon: MdNotifications },
    { label: "Profile", path: "/profile", icon: MdPerson },
];

function StudentPortalLayout({ title, children }) {
    const navigate = useNavigate();
    const { announcements } = useAnnouncements();

    // Calculate unread count for STUDENT role
    const unreadCount = useMemo(() => {
        return announcements.filter(announcement =>
            announcement.status === 'ACTIVE' &&
            (announcement.target.includes('ALL') || announcement.target.includes('STUDENT'))
        ).length;
    }, [announcements]);

    const handleLogout = () => {
        // Clear authentication data
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");

        // Redirect to home page
        navigate("/");
    };

    return (
        <div className="student-portal-layout">
            <aside className="student-sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">EduSupport</div>
                    <div className="sidebar-subtitle">STUDENT IT PORTAL</div>
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

            <main className="student-main">
                <div className="main-header">
                    {title ? <h1 className="main-title">{title}</h1> : null}
                    <Link to="/my-notifications" className="notification-bell">
                        <MdNotificationsActive className="bell-icon" />
                        {unreadCount > 0 && (
                            <span className="notification-badge">{unreadCount}</span>
                        )}
                    </Link>
                </div>
                <div className="main-content">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default StudentPortalLayout;
