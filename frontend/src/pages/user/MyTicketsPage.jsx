import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyTickets } from "../../services/ticketService";
import TicketTable from "../../components/ticket/TicketTable";
import "./MyTicketsPage.css";

/**
 * Page showing all tickets submitted by the logged-in student.
 *
 * TODO: Replace hardcoded userId with logged-in user from auth context
 *       when Member 4's auth module is ready.
 */
function MyTicketsPage() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Temporary: hardcoded until auth context is integrated
  const currentUserId = 1;

  // Load tickets when the page mounts
  useEffect(() => {
    const fetchTickets = async () => {
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
  }, []);

  return (
    <div className="my-tickets-page">
      {/* Page header */}
      <div className="page-top-bar">
        <div>
          <h1 className="page-title">My Tickets</h1>
          <p className="page-subtitle">Track the status of all your submitted issues.</p>
        </div>
        {/* Button to go to the create ticket page */}
        <button className="new-ticket-btn" onClick={() => navigate("/create-ticket")}>
          + New Ticket
        </button>
      </div>

      {/* Loading state */}
      {loading && <p className="status-msg">Loading your tickets...</p>}

      {/* Error state */}
      {error && <p className="error-msg">{error}</p>}

      {/* Ticket list table */}
      {!loading && !error && (
        <TicketTable tickets={tickets} isAdmin={false} />
      )}
    </div>
  );
}

export default MyTicketsPage;
