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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === "OPEN").length;
  const inProgressTickets = tickets.filter(t => t.status === "IN_PROGRESS").length;
  const resolvedThisMonth = tickets.filter(t => {
    const ticketDate = new Date(t.updatedAt || t.createdAt);
    const now = new Date();
    return t.status === "RESOLVED" && 
           ticketDate.getMonth() === now.getMonth() && 
           ticketDate.getFullYear() === now.getFullYear();
  }).length;

  // Pagination
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTickets = filteredTickets.slice(startIndex, startIndex + itemsPerPage);

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
    <StudentPortalLayout title="My Tickets">
      <div className="my-tickets-page">
        {/* Page subtitle */}
        <div className="page-header">
          <div>
            <p className="page-subtitle">
              Manage your active support requests, view technical assistance history, and track resolution progress from the University IT department.
            </p>
          </div>
          <button className="create-ticket-btn" onClick={() => navigate("/create-ticket")}>
            <span className="btn-icon">+</span> Create New Ticket
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">TOTAL TICKETS</div>
            <div className="stat-value">{totalTickets}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">OPEN REQUESTS</div>
            <div className="stat-value stat-value-blue">{openTickets}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">IN PROGRESS</div>
            <div className="stat-value stat-value-orange">{inProgressTickets}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">RESOLVED THIS MONTH</div>
            <div className="stat-value stat-value-green">{resolvedThisMonth}</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tabs-container">
          <div className="tabs">
            <button 
              className={statusFilter === "ALL" ? "tab active" : "tab"}
              onClick={() => setStatusFilter("ALL")}
            >
              All Tickets
            </button>
            <button 
              className={statusFilter === "OPEN" ? "tab active" : "tab"}
              onClick={() => setStatusFilter("OPEN")}
            >
              Open
            </button>
            <button 
              className={statusFilter === "IN_PROGRESS" ? "tab active" : "tab"}
              onClick={() => setStatusFilter("IN_PROGRESS")}
            >
              In Progress
            </button>
            <button 
              className={statusFilter === "RESOLVED" ? "tab active" : "tab"}
              onClick={() => setStatusFilter("RESOLVED")}
            >
              Resolved
            </button>
          </div>
          <div className="tab-actions">
            <button className="action-btn">
              <span className="action-icon">⚙</span> Filter
            </button>
            <button className="action-btn">
              <span className="action-icon">↕</span> Sort
            </button>
          </div>
        </div>

        {/* Loading state */}
        {loading && <p className="status-msg">Loading your tickets...</p>}

        {/* Error state */}
        {error && <p className="error-msg">{error}</p>}

        {/* Tickets Table */}
        {!loading && !error && (
          <div className="tickets-table-container">
            {filteredTickets.length === 0 ? (
              <p className="no-tickets">No tickets found matching your filters.</p>
            ) : (
              <>
                <table className="tickets-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>TITLE</th>
                      <th>CATEGORY</th>
                      <th>PRIORITY</th>
                      <th>STATUS</th>
                      <th>CREATED DATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTickets.map((ticket) => (
                      <tr 
                        key={ticket.id}
                        onClick={() => navigate(`/tickets/${ticket.id}`)}
                        className="ticket-row"
                      >
                        <td>
                          <span className="ticket-id-link">#US-{ticket.id}</span>
                        </td>
                        <td>
                          <div className="ticket-title-cell">
                            <div className="ticket-title-text">{ticket.title}</div>
                            <div className="ticket-assigned">Assigned to: {ticket.assignedTo || 'Network Operations'}</div>
                          </div>
                        </td>
                        <td>
                          <span className="category-text">{ticket.category}</span>
                        </td>
                        <td>
                          <span 
                            className={`priority-badge priority-${ticket.priority.toLowerCase()}`}
                          >
                            {ticket.priority}
                          </span>
                        </td>
                        <td>
                          <span 
                            className={`status-badge status-${ticket.status.toLowerCase().replace('_', '-')}`}
                          >
                            {ticket.status === "IN_PROGRESS" ? "IN PROGRESS" : ticket.status}
                          </span>
                        </td>
                        <td>
                          <span className="date-text">
                            {new Date(ticket.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="pagination-container">
                  <div className="pagination-info">
                    Showing {startIndex + 1} of {filteredTickets.length} tickets
                  </div>
                  <div className="pagination">
                    <button 
                      className="pagination-btn"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      ‹
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        className={currentPage === index + 1 ? "pagination-btn active" : "pagination-btn"}
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button 
                      className="pagination-btn"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      ›
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </StudentPortalLayout>
  );
}

export default MyTicketsPage;
