import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAllTickets } from "../../services/ticketService";
import AdminPortalLayout from "../../components/admin/AdminPortalLayout";
import "./ManageTicketsPage.css";

/**
 * Admin page showing ALL tickets in the system.
 * Admin can click any row to open the management detail page.
 */
function ManageTicketsPage() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await getAllTickets();
        setTickets(data);
      } catch (err) {
        setError("Failed to load tickets.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

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
    <AdminPortalLayout title="Manage Tickets">
      <div className="manage-tickets-page">
        {/* Breadcrumb */}
        <div className="manage-tickets-breadcrumb">
          <Link to="/admin/dashboard" className="breadcrumb-link">Dashboard</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Manage Tickets</span>
        </div>

        <div className="manage-tickets-header">
          <p className="manage-tickets-subtitle">
            View and manage all support tickets in the system. Monitor ticket status and assign technicians.
          </p>
        </div>

        <div className="manage-tickets-controls">
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

        {loading && <p className="loading-text">Loading tickets...</p>}
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
                    <th>STATUS</th>
                    <th>SUBMITTED BY</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTickets.map((ticket) => (
                    <tr 
                      key={ticket.id}
                      onClick={() => navigate(`/admin/tickets/${ticket.id}`)}
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
                        <span className={`status-badge status-${ticket.status?.toLowerCase().replace('_', '-')}`}>
                          {ticket.status?.replace('_', ' ')}
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
                          className="view-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/tickets/${ticket.id}`);
                          }}
                        >
                          View Details
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
      </div>
    </AdminPortalLayout>
  );
}

export default ManageTicketsPage;
