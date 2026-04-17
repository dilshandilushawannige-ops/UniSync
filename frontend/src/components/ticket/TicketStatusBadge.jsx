import "./TicketStatusBadge.css";

/**
 * Displays the current status of a ticket as a coloured badge.
 * Used in ticket tables, cards, and detail pages.
 *
 * Props:
 *   status (string) — one of: OPEN, IN_PROGRESS, RESOLVED, CLOSED, REJECTED
 */
function TicketStatusBadge({ status }) {
  // Map each status to a readable label
  const labels = {
    OPEN: "Open",
    IN_PROGRESS: "In Progress",
    RESOLVED: "Resolved",
    CLOSED: "Closed",
    REJECTED: "Rejected",
  };

  return (
    <span className={`status-badge status-${status}`}>
      {labels[status] || status}
    </span>
  );
}

export default TicketStatusBadge;
