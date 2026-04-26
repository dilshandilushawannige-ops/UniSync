import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TechnicianPortalLayout from "../../components/technician/TechnicianPortalLayout";
import api from "../../services/api";
import { 
    MdAssignment, 
    MdNotifications, 
    MdPerson,
    MdArrowForward,
    MdCheckCircle,
    MdHourglassEmpty,
    MdPending
} from "react-icons/md";
import "./TechnicianDashboardPage.css";

function TechnicianDashboardPage() {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTicketStats();
    }, []);

    const fetchTicketStats = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get technician ID from localStorage (set during OAuth login)
            const technicianId = localStorage.getItem("userId");
            if (!technicianId) {
                setError("User not authenticated. Please log in.");
                setLoading(false);
                return;
            }

            // Fetch tickets assigned to this technician
            const response = await api.get(`/tickets/technician/${technicianId}`);

            const tickets = response.data;

            // Calculate statistics
            const assigned = tickets.length;
            const inProgress = tickets.filter(t => t.status === "IN_PROGRESS").length;
            const completed = tickets.filter(t => t.status === "RESOLVED" || t.status === "CLOSED").length;
            const pending = tickets.filter(t => t.status === "OPEN").length;

            setStats({ assigned, inProgress, completed, pending });
        } catch (err) {
            console.error("Error fetching ticket statistics:", err);
            setError(err.response?.data?.message || "Failed to load statistics");
        } finally {
            setLoading(false);
        }
    };

    const quickAccessCards = [
        {
            title: "Assigned Tickets",
            description: "View and manage all tickets assigned to you",
            icon: MdAssignment,
            path: "/technician/tickets",
            color: "#3B82F6",
            bgColor: "#EFF6FF",
            count: stats?.assigned || 0
        },
        {
            title: "Notifications",
            description: "Check announcements and system updates",
            icon: MdNotifications,
            path: "/technician/notifications",
            color: "#F59E0B",
            bgColor: "#FEF3C7",
            count: null
        },
        {
            title: "Profile",
            description: "Manage your account and preferences",
            icon: MdPerson,
            path: "/technician/profile",
            color: "#8B5CF6",
            bgColor: "#F3E8FF",
            count: null
        }
    ];

    return (
        <TechnicianPortalLayout title="Technician Dashboard">
            <div className="tech-dashboard-container">
                <div className="tech-dashboard-welcome">
                    <h2 className="tech-dashboard-title">Welcome Back, Technician!</h2>
                    <p className="tech-dashboard-subtitle">
                        Here's an overview of your assigned tickets and quick access to key features.
                    </p>
                </div>

                {loading && <p className="tech-dashboard-loading">Loading ticket statistics...</p>}
                {error && <p className="tech-dashboard-error">{error}</p>}

                {!loading && !error && stats && (
                    <>
                        {/* Statistics Cards */}
                        <div className="tech-stats-grid">
                            <div className="tech-stat-card tech-stat-blue">
                                <div className="tech-stat-icon">
                                    <MdAssignment />
                                </div>
                                <div className="tech-stat-content">
                                    <div className="tech-stat-number">{stats.assigned}</div>
                                    <div className="tech-stat-label">Assigned Tickets</div>
                                </div>
                            </div>
                            <div className="tech-stat-card tech-stat-yellow">
                                <div className="tech-stat-icon">
                                    <MdHourglassEmpty />
                                </div>
                                <div className="tech-stat-content">
                                    <div className="tech-stat-number">{stats.inProgress}</div>
                                    <div className="tech-stat-label">In Progress</div>
                                </div>
                            </div>
                            <div className="tech-stat-card tech-stat-green">
                                <div className="tech-stat-icon">
                                    <MdCheckCircle />
                                </div>
                                <div className="tech-stat-content">
                                    <div className="tech-stat-number">{stats.completed}</div>
                                    <div className="tech-stat-label">Completed</div>
                                </div>
                            </div>
                            <div className="tech-stat-card tech-stat-orange">
                                <div className="tech-stat-icon">
                                    <MdPending />
                                </div>
                                <div className="tech-stat-content">
                                    <div className="tech-stat-number">{stats.pending}</div>
                                    <div className="tech-stat-label">Pending Review</div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Access Section */}
                        <div className="tech-quick-access-section">
                            <h3 className="tech-section-title">Quick Access</h3>
                            <div className="tech-quick-access-grid">
                                {quickAccessCards.map((card) => {
                                    const IconComponent = card.icon;
                                    return (
                                        <div 
                                            key={card.path}
                                            className="tech-quick-card"
                                            onClick={() => navigate(card.path)}
                                        >
                                            <div className="tech-quick-card-header">
                                                <div 
                                                    className="tech-quick-icon"
                                                    style={{ 
                                                        backgroundColor: card.bgColor,
                                                        color: card.color 
                                                    }}
                                                >
                                                    <IconComponent />
                                                </div>
                                                {card.count !== null && (
                                                    <span className="tech-quick-badge">{card.count}</span>
                                                )}
                                            </div>
                                            <h4 className="tech-quick-title">{card.title}</h4>
                                            <p className="tech-quick-description">{card.description}</p>
                                            <div className="tech-quick-action">
                                                <span>Go to {card.title}</span>
                                                <MdArrowForward />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </TechnicianPortalLayout>
    );
}

export default TechnicianDashboardPage;
