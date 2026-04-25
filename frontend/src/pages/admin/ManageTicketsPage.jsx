import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTickets } from "../../services/ticketService";
import TicketTable from "../../components/ticket/TicketTable";
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

  // Filter state — lets admin filter by status
  const [filterStatus, setFilterStatus] = useState("ALL");

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

  // Filter tickets by selected status
  const filteredTickets =
    filterStatus === "ALL"
      ? tickets
      : tickets.filter((t) => t.status === filterStatus);

  return (
    <AdminPortalLayout title="Manage Tickets">
      <div className="manage-tickets-page">

        {/* Page header */}
        <div className="page-top-bar">
          <div>
            <p className="page-subtitle">
              View and manage all support tickets in the system.
            </p>
          </div>

          {/* Count badge */}
          <span className="ticket-count">{tickets.length} Total</span>
        </div>

        {/* Status filter buttons */}
        <div className="filter-bar">
          {["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "REJECTED"].map(
            (status) => (
              <button
                key={status}
                className={`filter-btn ${filterStatus === status ? "active" : ""}`}
                onClick={() => setFilterStatus(status)}
              >
                {status === "ALL" ? "All" : status.replace("_", " ")}
              </button>
            )
          )}
        </div>

        {/* Loading / error / table */}
        {loading && <p className="status-msg">Loading tickets...</p>}
        {error && <p className="error-msg">{error}</p>}
        {!loading && !error && (
          <TicketTable tickets={filteredTickets} isAdmin={true} />
        )}
      </div>
    </AdminPortalLayout>
  );
}

export default ManageTicketsPage;
