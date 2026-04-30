import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminPortalLayout from "../../components/admin/AdminPortalLayout";
import { getAllTickets } from "../../services/ticketService";
import api from "../../services/api";
import {
    MdConfirmationNumber,
    MdEventAvailable,
    MdInventory,
    MdCampaign,
    MdPerson,
    MdArrowForward,
    MdCheckCircle,
    MdHourglassEmpty,
    MdPending,
    MdCancel
} from "react-icons/md";
import "./AdminDashboardPage.css";

function AdminDashboardPage() {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);

            // Fetch tickets
            const tickets = await getAllTickets();

            // Fetch bookings
            let bookingsCount = 0;
            try {
                const bookingsResponse = await api.get('/bookings');
                bookingsCount = bookingsResponse.data.length;
            } catch (err) {
                console.error("Error fetching bookings:", err);
            }

            // Fetch resources
            let resourcesCount = 0;
            try {
                const resourcesResponse = await api.get('/resources');
                resourcesCount = resourcesResponse.data.length;
            } catch (err) {
                console.error("Error fetching resources:", err);
            }

            // Fetch announcements
            let announcementsCount = 0;
            try {
                const announcementsResponse = await api.get('/announcements');
                announcementsCount = announcementsResponse.data.length;
            } catch (err) {
                console.error("Error fetching announcements:", err);
            }

            // Calculate ticket statistics
            const totalTickets = tickets.length;
            const openTickets = tickets.filter(t => t.status === "OPEN").length;
            const inProgressTickets = tickets.filter(t => t.status === "IN_PROGRESS").length;
            const resolvedTickets = tickets.filter(t => t.status === "RESOLVED" || t.status === "CLOSED").length;

            setStats({
                totalTickets,
                openTickets,
                inProgressTickets,
                resolvedTickets,
                bookingsCount,
                resourcesCount,
                announcementsCount
            });
        } catch (err) {
            console.error("Error fetching dashboard statistics:", err);
        } finally {
            setLoading(false);
        }
    };

    const quickAccessCards = [
        {
            title: "Ticket Management",
            description: "View, assign, and manage all support tickets",
            icon: MdConfirmationNumber,
            path: "/admin/tickets",
            color: "#3B82F6",
            bgColor: "#EFF6FF",
            count: stats?.totalTickets || 0
        },
        {
            title: "Booking Management",
            description: "Approve and manage resource booking requests",
            icon: MdEventAvailable,
            path: "/admin/bookings",
            color: "#10B981",
            bgColor: "#D1FAE5",
            count: stats?.bookingsCount || 0
        },
        {
            title: "Resource Manager",
            description: "Add, edit, and manage campus resources",
            icon: MdInventory,
            path: "/admin/resources",
            color: "#F59E0B",
            bgColor: "#FEF3C7",
            count: stats?.resourcesCount || 0
        },
        {
            title: "Announcements",
            description: "Create and manage system announcements",
            icon: MdCampaign,
            path: "/admin/announcements",
            color: "#8B5CF6",
            bgColor: "#F3E8FF",
            count: stats?.announcementsCount || 0
        },
        {
            title: "Profile",
            description: "Manage your admin account settings",
            icon: MdPerson,
            path: "/admin/profile",
            color: "#6B7280",
            bgColor: "#F3F4F6"
        }
    ];

    return (
        <AdminPortalLayout title="Admin Dashboard Overview">
            <div className="admin-dashboard-container">
                <div className="admin-dashboard-welcome">
                    <h2 className="admin-dashboard-title">Welcome Back, Admin!</h2>
                    <p className="admin-dashboard-subtitle">
                        Here's an overview of your Campus Nexus system and quick access to all management features.
                    </p>
                </div>

                {/* Ticket Statistics */}
                {!loading && stats && (
                    <div className="admin-stats-grid">
                        <div className="admin-stat-card admin-stat-blue">
                            <div className="admin-stat-icon">
                                <MdConfirmationNumber />
                            </div>
                            <div className="admin-stat-content">
                                <div className="admin-stat-number">{stats.totalTickets}</div>
                                <div className="admin-stat-label">Total Tickets</div>
                            </div>
                        </div>
                        <div className="admin-stat-card admin-stat-yellow">
                            <div className="admin-stat-icon">
                                <MdPending />
                            </div>
                            <div className="admin-stat-content">
                                <div className="admin-stat-number">{stats.openTickets}</div>
                                <div className="admin-stat-label">Open Tickets</div>
                            </div>
                        </div>
                        <div className="admin-stat-card admin-stat-orange">
                            <div className="admin-stat-icon">
                                <MdHourglassEmpty />
                            </div>
                            <div className="admin-stat-content">
                                <div className="admin-stat-number">{stats.inProgressTickets}</div>
                                <div className="admin-stat-label">In Progress</div>
                            </div>
                        </div>
                        <div className="admin-stat-card admin-stat-green">
                            <div className="admin-stat-icon">
                                <MdCheckCircle />
                            </div>
                            <div className="admin-stat-content">
                                <div className="admin-stat-number">{stats.resolvedTickets}</div>
                                <div className="admin-stat-label">Resolved</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Access Section */}
                <div className="admin-quick-access-section">
                    <h3 className="admin-section-title">Quick Access</h3>
                    <p className="admin-section-subtitle">
                        Manage all aspects of the campus system from one place
                    </p>
                    <div className="admin-quick-access-grid">
                        {quickAccessCards.map((card) => {
                            const IconComponent = card.icon;
                            return (
                                <div 
                                    key={card.path}
                                    className="admin-quick-card"
                                    onClick={() => navigate(card.path)}
                                >
                                    <div className="admin-quick-card-header">
                                        <div 
                                            className="admin-quick-icon"
                                            style={{ 
                                                backgroundColor: card.bgColor,
                                                color: card.color 
                                            }}
                                        >
                                            <IconComponent />
                                        </div>
                                        {card.count !== undefined && (
                                            <span className="admin-quick-badge">{card.count}</span>
                                        )}
                                    </div>
                                    <h4 className="admin-quick-title">{card.title}</h4>
                                    <p className="admin-quick-description">{card.description}</p>
                                    <div className="admin-quick-action">
                                        <span>Go to {card.title}</span>
                                        <MdArrowForward />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AdminPortalLayout>
    );
}

export default AdminDashboardPage;
