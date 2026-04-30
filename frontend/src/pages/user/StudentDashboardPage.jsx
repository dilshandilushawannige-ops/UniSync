import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import StudentPortalLayout from "../../components/user/StudentPortalLayout";
import AnnouncementList from "../../components/announcement/AnnouncementList";
import { useAnnouncements } from "../../context/AnnouncementContext";
import api from "../../services/api";
import {
    MdLibraryBooks,
    MdEventAvailable,
    MdConfirmationNumber,
    MdAddCircleOutline,
    MdNotifications,
    MdPerson,
    MdArrowForward,
    MdCheckCircle,
    MdHourglassEmpty,
    MdPending,
    MdCancel
} from "react-icons/md";
import "./StudentDashboardPage.css";

function StudentDashboardPage() {
    const navigate = useNavigate();
    const { announcements } = useAnnouncements();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTicketStats();
    }, []);

    const fetchTicketStats = async () => {
        try {
            setLoading(true);
            const userId = localStorage.getItem("userId");
            if (!userId) {
                setLoading(false);
                return;
            }

            const response = await api.get(`/tickets/user/${userId}`);
            const tickets = response.data;

            const total = tickets.length;
            const open = tickets.filter(t => t.status === "OPEN").length;
            const inProgress = tickets.filter(t => t.status === "IN_PROGRESS").length;
            const resolved = tickets.filter(t => t.status === "RESOLVED" || t.status === "CLOSED").length;

            setStats({ total, open, inProgress, resolved });
        } catch (err) {
            console.error("Error fetching ticket statistics:", err);
        } finally {
            setLoading(false);
        }
    };

    const quickAccessCards = [
        {
            title: "Resources",
            description: "Browse available labs, halls and equipment on campus",
            icon: MdLibraryBooks,
            path: "/resources",
            color: "#3B82F6",
            bgColor: "#EFF6FF"
        },
        {
            title: "Resource Booking",
            description: "Book and manage your resource reservations",
            icon: MdEventAvailable,
            path: "/resource-booking",
            color: "#10B981",
            bgColor: "#D1FAE5"
        },
        {
            title: "My Tickets",
            description: "View and track all your support tickets",
            icon: MdConfirmationNumber,
            path: "/my-tickets",
            color: "#F59E0B",
            bgColor: "#FEF3C7",
            count: stats?.total || 0
        },
        {
            title: "New Ticket",
            description: "Report a new issue and get support",
            icon: MdAddCircleOutline,
            path: "/create-ticket",
            color: "#EF4444",
            bgColor: "#FEE2E2"
        },
        {
            title: "Notifications",
            description: "Check announcements and system updates",
            icon: MdNotifications,
            path: "/my-notifications",
            color: "#8B5CF6",
            bgColor: "#F3E8FF",
            count: announcements.filter(a => 
                a.status === 'ACTIVE' && 
                (a.target.includes('ALL') || a.target.includes('STUDENT'))
            ).length
        },
        {
            title: "Profile",
            description: "Manage your account and preferences",
            icon: MdPerson,
            path: "/profile",
            color: "#6B7280",
            bgColor: "#F3F4F6"
        }
    ];

    return (
        <StudentPortalLayout title="Welcome to Student Dashboard">
            <div className="student-dashboard-container">
                <div className="student-dashboard-welcome">
                    <h2 className="student-dashboard-title">Welcome Back, Student!</h2>
                    <p className="student-dashboard-subtitle">
                        Here's an overview of your tickets and quick access to all portal features.
                    </p>
                </div>

                {/* Ticket Statistics */}
                {!loading && stats && (
                    <div className="student-stats-grid">
                        <div className="student-stat-card student-stat-blue">
                            <div className="student-stat-icon">
                                <MdConfirmationNumber />
                            </div>
                            <div className="student-stat-content">
                                <div className="student-stat-number">{stats.total}</div>
                                <div className="student-stat-label">Total Tickets</div>
                            </div>
                        </div>
                        <div className="student-stat-card student-stat-yellow">
                            <div className="student-stat-icon">
                                <MdPending />
                            </div>
                            <div className="student-stat-content">
                                <div className="student-stat-number">{stats.open}</div>
                                <div className="student-stat-label">Open</div>
                            </div>
                        </div>
                        <div className="student-stat-card student-stat-orange">
                            <div className="student-stat-icon">
                                <MdHourglassEmpty />
                            </div>
                            <div className="student-stat-content">
                                <div className="student-stat-number">{stats.inProgress}</div>
                                <div className="student-stat-label">In Progress</div>
                            </div>
                        </div>
                        <div className="student-stat-card student-stat-green">
                            <div className="student-stat-icon">
                                <MdCheckCircle />
                            </div>
                            <div className="student-stat-content">
                                <div className="student-stat-number">{stats.resolved}</div>
                                <div className="student-stat-label">Resolved</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Access Section */}
                <div className="student-quick-access-section">
                    <h3 className="student-section-title">Quick Access</h3>
                    <div className="student-quick-access-grid">
                        {quickAccessCards.map((card) => {
                            const IconComponent = card.icon;
                            return (
                                <div 
                                    key={card.path}
                                    className="student-quick-card"
                                    onClick={() => navigate(card.path)}
                                >
                                    <div className="student-quick-card-header">
                                        <div 
                                            className="student-quick-icon"
                                            style={{ 
                                                backgroundColor: card.bgColor,
                                                color: card.color 
                                            }}
                                        >
                                            <IconComponent />
                                        </div>
                                        {card.count !== undefined && card.count > 0 && (
                                            <span className="student-quick-badge">{card.count}</span>
                                        )}
                                    </div>
                                    <h4 className="student-quick-title">{card.title}</h4>
                                    <p className="student-quick-description">{card.description}</p>
                                    <div className="student-quick-action">
                                        <span>Go to {card.title}</span>
                                        <MdArrowForward />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Announcements Section */}
                <section className="student-announcements-section">
                    <h3 className="student-section-title">📢 Recent Announcements</h3>
                    <p className="student-section-subtitle">
                        Review unread alerts, track recent updates, and stay informed.
                    </p>
                    <AnnouncementList announcements={announcements} userRole="STUDENT" />
                </section>
            </div>
        </StudentPortalLayout>
    );
}

export default StudentDashboardPage;
