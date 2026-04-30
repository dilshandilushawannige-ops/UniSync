import { useNavigate } from "react-router-dom";
import TicketStatusBadge from "./TicketStatusBadge";
import "./TicketTable.css";

/**
 * Displays a list of tickets in a table format.
 * Used on MyTicketsPage (student), ManageTicketsPage (admin), and technician pages.
 *
 * Props:
 *   tickets (array)        — list of ticket objects from the API
 *   isAdmin (boolean)      — if true, shows extra admin columns and routes to admin details
 *   isTechnician (boolean) — if true, routes to technician ticket details
 */
function TicketTable({ tickets = [], isAdmin = false, isTechnician = false }) {
  const navigate = useNavigate();

  // When a row is clicked, go to the ticket detail page
  const handleRowClick = (ticketId) => {
    if (isAdmin) {
      navigate(`/admin/tickets/${ticketId}`);
    } else if (isTechnician) {
      navigate(`/technician/tickets/${ticketId}`);
    } else {
      navigate(`/tickets/${ticketId}`);
    }
  };

  // Show a message if there are no tickets
  if (tickets.length === 0) {
    return <p className="no-tickets">No tickets found.</p>;
  }

  return (
    <div className="ticket-table-wrapper">
      <table className="ticket-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Status</th>
            {/* Only show Reporter column in admin view */}
            {isAdmin && <th>Reported By</th>}
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              className="ticket-row"
              onClick={() => handleRowClick(ticket.id)}
            >
              <td>{ticket.id}</td>
              <td className="ticket-title">{ticket.title}</td>
              <td>{ticket.category}</td>
              <td>
                <span className={`priority-tag priority-${ticket.priority}`}>
                  {ticket.priority}
                </span>
              </td>
              <td>
                <TicketStatusBadge status={ticket.status} />
              </td>
              {isAdmin && <td>{ticket.reportedByName || "—"}</td>}
              <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TicketTable;
