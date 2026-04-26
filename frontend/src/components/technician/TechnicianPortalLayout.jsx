import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { 
  MdDashboard, 
  MdAssignment, 
  MdHourglassEmpty, 
  MdCheckCircle, 
  MdNotifications, 
  MdPerson,
  MdLogout,
  MdNotificationsActive
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

    const handleLogout = () => {
        // Clear authentication data
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        localStorage.removeItem("email");

        // Redirect to home page
        navigate("/");
    };

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
                    <Link to="/technician/notifications" className="notification-bell">
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

export default TechnicianPortalLayout;
