import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyTickets } from "../../services/ticketService";
import StudentPortalLayout from "../../components/user/StudentPortalLayout";
import "./MyTicketsPage.css";

/**
 * Page showing all tickets submitted by the logged-in student.
 */
function MyTicketsPage() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  // Get userId from localStorage (set during OAuth login)
  const currentUserId = localStorage.getItem("userId");

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!currentUserId) {
      console.warn("No userId found in localStorage. Redirecting to login.");
      navigate("/login");
    }
  }, [currentUserId, navigate]);

  // Load tickets when the page mounts
  useEffect(() => {
    const fetchTickets = async () => {
      if (!currentUserId) {
        setError("User not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const data = await getMyTickets(currentUserId);
        setTickets(data);
      } catch (err) {
        setError("Failed to load your tickets. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [currentUserId]);

  // Filter tickets based on selected filters
  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = statusFilter === "ALL" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "ALL" || ticket.priority === priorityFilter;
    const matchesCategory = categoryFilter === "ALL" || ticket.category === categoryFilter;
    return matchesStatus && matchesPriority && matchesCategory;
  });

  // Get unique categories from tickets
  const categories = ["ALL", ...new Set(tickets.map(t => t.category))];

  // Calculate statistics
  const openTickets = tickets.filter(t => t.status === "OPEN").length;
  const avgWaitTime = tickets.length > 0 ? "1.4h" : "0h"; // Placeholder calculation

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "OPEN": return "#f59e0b";
      case "IN_PROGRESS": return "#f97316";
      case "RESOLVED": return "#10b981";
      case "CLOSED": return "#6b7280";
      default: return "#94a3b8";
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH": return "#ef4444";
      case "MEDIUM": return "#f59e0b";
      case "LOW": return "#94a3b8";
      default: return "#64748b";
    }
  };

  // Get border color based on status
  const getBorderColor = (status) => {
    switch (status) {
      case "OPEN": return "#fbbf24";
      case "IN_PROGRESS": return "#fb923c";
      case "RESOLVED": return "#34d399";
      case "CLOSED": return "#9ca3af";
      default: return "#cbd5e1";
    }
  };

  return (
    <StudentPortalLayout>
      <div className="my-tickets-page">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span className="breadcrumb-item">Maintenance</span>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-item active">My Tickets</span>
        </div>

        {/* Page header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">My Tickets</h1>
            <p className="page-subtitle">Manage and track your active service requests across campus.</p>
          </div>
          <button className="create-ticket-btn" onClick={() => navigate("/create-ticket")}>
            + Create Ticket
          </button>
        </div>

        {/* Filters and view toggle */}
        <div className="filters-bar">
          <div className="filters-group">
            <div className="filter-item">
              <label>STATUS</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="ALL">All Tickets</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>

            <div className="filter-item">
              <label>PRIORITY</label>
              <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                <option value="ALL">Any Priority</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            <div className="filter-item">
              <label>CATEGORY</label>
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === "ALL" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="view-controls">
            <span className="ticket-count">Showing {filteredTickets.length} tickets</span>
            <div className="view-toggle">
              <button 
                className={viewMode === "grid" ? "active" : ""} 
                onClick={() => setViewMode("grid")}
                title="Grid view"
              >
                ⊞
              </button>
              <button 
                className={viewMode === "list" ? "active" : ""} 
                onClick={() => setViewMode("list")}
                title="List view"
              >
                ☰
              </button>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading && <p className="status-msg">Loading your tickets...</p>}

        {/* Error state */}
        {error && <p className="error-msg">{error}</p>}

        {/* Tickets grid/list */}
        {!loading && !error && (
          <div className="tickets-content">
            <div className={`tickets-${viewMode}`}>
              {filteredTickets.length === 0 ? (
                <p className="no-tickets">No tickets found matching your filters.</p>
              ) : (
                filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="ticket-card"
                    style={{ borderLeftColor: getBorderColor(ticket.status) }}
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                  >
                    <div className="ticket-card-header">
                      <span className="ticket-id">#{ticket.id}</span>
                      <span 
                        className="ticket-status-badge"
                        style={{ 
                          backgroundColor: `${getStatusColor(ticket.status)}20`,
                          color: getStatusColor(ticket.status)
                        }}
                      >
                        ● {ticket.status.replace("_", " ")}
                      </span>
                    </div>

                    <h3 className="ticket-title">{ticket.title}</h3>
                    
                    <div className="ticket-location">
                      <span className="location-icon">📍</span>
                      {ticket.location || "No location specified"}
                    </div>

                    <p className="ticket-description">
                      {ticket.description?.substring(0, 100) || "No description provided"}
                      {ticket.description?.length > 100 ? "..." : ""}
                    </p>

                    <div className="ticket-card-footer">
                      <div className="ticket-meta">
                        <span className="meta-label">CREATED</span>
                        <span className="meta-value">
                          {new Date(ticket.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                      </div>
                      <div className="ticket-meta">
                        <span className="meta-label">PRIORITY</span>
                        <span 
                          className="meta-value priority"
                          style={{ color: getPriorityColor(ticket.priority) }}
                        >
                          {ticket.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Operational Insight Section */}
            {!loading && !error && tickets.length > 0 && (
              <div className="operational-insight">
                <div className="insight-header">
                  <span className="insight-icon">💡</span>
                  <span className="insight-label">OPERATIONAL INSIGHT</span>
                </div>
                <h2 className="insight-title">Efficiency is up 12% this week.</h2>
                <p className="insight-description">
                  Your ticket resolution time has improved significantly. Most issues are being addressed within 4 hours of reporting.
                </p>
                <div className="insight-stats">
                  <div className="stat-box">
                    <div className="stat-label">Open Tickets</div>
                    <div className="stat-value">{openTickets.toString().padStart(2, "0")}</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">Average Wait</div>
                    <div className="stat-value">{avgWaitTime}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </StudentPortalLayout>
  );
}

export default MyTicketsPage;
