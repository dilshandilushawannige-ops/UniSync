import { Link, NavLink, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useAnnouncements } from "../../context/AnnouncementContext";
import "./StudentPortalLayout.css";

const sidebarItems = [
    { label: "Dashboard", path: "/dashboard", icon: "📊" },
    { label: "Resources", path: "/resources", icon: "📚" },
    { label: "Resource Booking", path: "/resource-booking", icon: "📅" },
    { label: "My Tickets", path: "/my-tickets", icon: "🎫" },
    { label: "New Ticket", path: "/create-ticket", icon: "📝" },
    { label: "Notifications", path: "/my-notifications", icon: "🔔" },
    { label: "Profile", path: "/profile", icon: "👤" },
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
                    {sidebarItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => 
                                isActive ? "nav-item nav-item-active" : "nav-item"
                            }
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <span className="nav-icon">🚪</span>
                        <span className="nav-label">Logout</span>
                    </button>
                </div>
            </aside>

            <main className="student-main">
                <div className="main-header">
                    {title ? <h1 className="main-title">{title}</h1> : null}
                    <Link to="/my-notifications" className="notification-bell">
                        <span className="bell-icon">🔔</span>
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
