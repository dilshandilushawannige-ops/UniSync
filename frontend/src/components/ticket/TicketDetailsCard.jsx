import TicketStatusBadge from "./TicketStatusBadge";
import "./TicketDetailsCard.css";

/**
 * Displays the full details of a single ticket in a card layout.
 * Used on TicketDetailsPage and TicketManagementDetailsPage.
 *
 * Props:
 *   ticket (object) — full ticket object from the API
 */
function TicketDetailsCard({ ticket }) {
  if (!ticket) return null;

  return (
    <div className="ticket-details-card">

      {/* Header: title + status badge */}
      <div className="card-header">
        <h2 className="card-title">{ticket.title}</h2>
        <TicketStatusBadge status={ticket.status} />
      </div>

      {/* Info grid: key-value pairs */}
      <div className="card-info-grid">
        <div className="info-item">
          <span className="info-label">Category</span>
          <span className="info-value">{ticket.category}</span>
        </div>

        <div className="info-item">
          <span className="info-label">Priority</span>
          <span className={`priority-tag priority-${ticket.priority}`}>
            {ticket.priority}
          </span>
        </div>

        <div className="info-item">
          <span className="info-label">Location</span>
          <span className="info-value">{ticket.location || "Not specified"}</span>
        </div>

        <div className="info-item">
          <span className="info-label">Preferred Contact</span>
          <span className="info-value">{ticket.preferredContact || "Not specified"}</span>
        </div>

        <div className="info-item">
          <span className="info-label">Reported By</span>
          <span className="info-value">{ticket.reportedByName || "—"}</span>
        </div>

        <div className="info-item">
          <span className="info-label">Assigned Technician</span>
          <span className="info-value">{ticket.assignedTechnicianName || "Not assigned"}</span>
        </div>

        <div className="info-item">
          <span className="info-label">Created</span>
          <span className="info-value">
            {new Date(ticket.createdAt).toLocaleString()}
          </span>
        </div>

        <div className="info-item">
          <span className="info-label">Last Updated</span>
          <span className="info-value">
            {new Date(ticket.updatedAt).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="card-section">
        <h3 className="section-label">Description</h3>
        <p className="section-text">{ticket.description}</p>
      </div>

      {/* Resolution Notes (shown only if present) */}
      {ticket.resolutionNotes && (
        <div className="card-section resolution-section">
          <h3 className="section-label">Resolution Notes</h3>
          <p className="section-text">{ticket.resolutionNotes}</p>
        </div>
      )}

      {/* Rejected Reason (shown only if present) */}
      {ticket.rejectedReason && (
        <div className="card-section rejected-section">
          <h3 className="section-label">Rejected Reason</h3>
          <p className="section-text">{ticket.rejectedReason}</p>
        </div>
      )}
    </div>
  );
}

export default TicketDetailsCard;
