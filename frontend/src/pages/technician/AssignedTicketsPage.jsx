import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import TechnicianPortalLayout from "../../components/technician/TechnicianPortalLayout";
import api from "../../services/api";
import "./AssignedTicketsPage.css";

function AssignedTicketsPage() {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState("All");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    useEffect(() => {
        fetchAssignedTickets();
    }, []);

    const fetchAssignedTickets = async () => {
        try {
            setLoading(true);
            setError(null);

            const technicianId = localStorage.getItem("userId");
            if (!technicianId) {
                setError("User not authenticated. Please log in.");
                setLoading(false);
                return;
            }

            const response = await api.get(`/tickets/technician/${technicianId}`);
            setTickets(response.data);
        } catch (err) {
            console.error("Error fetching assigned tickets:", err);
            setError(err.response?.data?.message || "Failed to load assigned tickets");
        } finally {
            setLoading(false);
        }
    };

    const handleAssignToMe = async (ticketId) => {
        try {
            const technicianId = localStorage.getItem("userId");
            await api.put(`/tickets/${ticketId}/assign`, { technicianId });
            fetchAssignedTickets();
        } catch (err) {
            console.error("Error assigning ticket:", err);
        }
    };

    const getFilteredTickets = () => {
        let filtered = tickets;

        if (activeFilter === "New") {
            filtered = filtered.filter(t => t.status === "OPEN");
        } else if (activeFilter === "Priority") {
            filtered = filtered.filter(t => t.priority === "HIGH" || t.priority === "URGENT");
        }

        if (selectedCategory !== "All Categories") {
            filtered = filtered.filter(t => t.category === selectedCategory);
        }

        return filtered;
    };

    const filteredTickets = getFilteredTickets();
    const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
    const paginatedTickets = filteredTickets.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getPriorityIcon = (priority) => {
        if (priority === "URGENT") return "!";
        if (priority === "HIGH") return "▲";
        if (priority === "MEDIUM") return "●";
        return "○";
    };

    const getPriorityClass = (priority) => {
        return `priority-badge priority-${priority?.toLowerCase() || 'low'}`;
    };

    return (
        <TechnicianPortalLayout title="Support Requests">
            {/* Breadcrumb */}
            <div className="assigned-tickets-breadcrumb">
                <Link to="/technician/dashboard" className="breadcrumb-link">Dashboard</Link>
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-current">Assigned Tickets</span>
            </div>

            <div className="assigned-tickets-header">
                <p className="assigned-tickets-subtitle">
                    Review and assign new support requests to yourself or your team. High priority items
                    are flagged for immediate attention.
                </p>
            </div>

            <div className="assigned-tickets-controls">
                <div className="filter-tabs">
                    {["All", "New", "Priority"].map(filter => (
                        <button
                            key={filter}
                            className={`filter-tab ${activeFilter === filter ? "active" : ""}`}
                            onClick={() => setActiveFilter(filter)}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                <select
                    className="category-dropdown"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option>All Categories</option>
                    <option>NETWORK</option>
                    <option>HARDWARE</option>
                    <option>SOFTWARE</option>
                    <option>ACCESS</option>
                </select>

                <div className="results-info">
                    <span>Showing {filteredTickets.length} results</span>
                    <button className="sort-btn">⚙ Sort by Latest</button>
                </div>
            </div>

            {loading && <p className="loading-text">Loading assigned tickets...</p>}
            {error && <p className="error-text">{error}</p>}

            {!loading && !error && (
                <>
                    <div className="tickets-table-container">
                        <table className="tickets-table">
                            <thead>
                                <tr>
                                    <th>TICKET ID</th>
                                    <th>TITLE & DESCRIPTION</th>
                                    <th>CATEGORY</th>
                                    <th>PRIORITY</th>
                                    <th>SUBMITTED BY</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedTickets.map((ticket) => (
                                    <tr 
                                        key={ticket.id}
                                        onClick={() => navigate(`/technician/tickets/${ticket.id}`)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <td className="ticket-id">#US-{ticket.id}</td>
                                        <td className="ticket-info">
                                            <div className="ticket-title">{ticket.title}</div>
                                            <div className="ticket-description">{ticket.description}</div>
                                        </td>
                                        <td>
                                            <span className="category-badge">{ticket.category}</span>
                                        </td>
                                        <td>
                                            <span className={getPriorityClass(ticket.priority)}>
                                                <span className="priority-icon">{getPriorityIcon(ticket.priority)}</span>
                                                {ticket.priority}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="user-info">
                                                <div className="user-avatar">
                                                    {ticket.reportedByName?.charAt(0) || "U"}
                                                </div>
                                                <span>{ticket.reportedByName || "Unknown"}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <button
                                                className="assign-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAssignToMe(ticket.id);
                                                }}
                                            >
                                                Assign to Me
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination">
                        <button
                            className="pagination-btn"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                        >
                            &lt; Previous
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                className={`pagination-number ${currentPage === i + 1 ? "active" : ""}`}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            className="pagination-btn"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next &gt;
                        </button>
                    </div>
                </>
            )}
        </TechnicianPortalLayout>
    );
}

export default AssignedTicketsPage;
