import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getTicketById,
  updateTicketStatus,
  assignTechnician,
} from "../../services/ticketService";
import TicketDetailsCard from "../../components/ticket/TicketDetailsCard";
import TicketComments from "../../components/ticket/TicketComments";
import AttachmentPreview from "../../components/ticket/AttachmentPreview";
import "./TicketManagementDetailsPage.css";

/**
 * Admin-only detail page for a ticket.
 * Allows admin to:
 *   - View full ticket info
 *   - Change the ticket status (with optional notes/reason)
 *   - Assign a technician by user ID
 *   - View attachments and comments
 *
 * TODO: Replace hardcoded technicianId input with a user search/select
 *       dropdown once Member 4's user list API is available.
 */
function TicketManagementDetailsPage() {
  const { id } = useParams();     // ticket ID from URL
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Status update form state
  const [newStatus, setNewStatus] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [rejectedReason, setRejectedReason] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  // Technician assign form state
  const [technicianId, setTechnicianId] = useState("");
  const [assignMsg, setAssignMsg] = useState("");

  // Temp admin userId — replace with auth context later
  const adminUserId = 1;

  // Load ticket on mount
  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      const data = await getTicketById(id);
      setTicket(data);
      setNewStatus(data.status); // pre-fill status dropdown
    } catch (err) {
      setError("Failed to load ticket.");
    } finally {
      setLoading(false);
    }
  };

  // ── Handle status update ──────────────────────────────
  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateTicketStatus(id, {
        status: newStatus,
        resolutionNotes: resolutionNotes || null,
        rejectedReason: rejectedReason || null,
      });
      setStatusMsg("✅ Status updated successfully.");
      fetchTicket(); // reload to show updated data
    } catch (err) {
      setStatusMsg("❌ Failed to update status.");
    }
  };

  // ── Handle technician assignment ─────────────────────
  const handleAssign = async (e) => {
    e.preventDefault();
    if (!technicianId) {
      setAssignMsg("Please enter a technician ID.");
      return;
    }
    try {
      await assignTechnician(id, technicianId);
      setAssignMsg("✅ Technician assigned successfully.");
      fetchTicket(); // reload to show assigned tech
    } catch (err) {
      setAssignMsg("❌ Failed to assign technician.");
    }
  };

  if (loading) return <p className="status-msg">Loading ticket...</p>;
  if (error)   return <p className="error-msg">{error}</p>;

  return (
    <div className="management-details-page">

      {/* Back button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back to Manage Tickets
      </button>

      {/* Ticket info card */}
      <TicketDetailsCard ticket={ticket} />

      {/* ── Admin Controls ─────────────────────────── */}
      <div className="admin-controls">

        {/* Status Update Form */}
        <div className="control-card">
          <h3 className="control-title">Update Status</h3>
          <form onSubmit={handleStatusUpdate} className="control-form">

            <div className="form-group">
              <label>New Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            {/* Resolution notes — shown only when resolving */}
            {(newStatus === "RESOLVED" || newStatus === "CLOSED") && (
              <div className="form-group">
                <label>Resolution Notes</label>
                <textarea
                  rows={3}
                  placeholder="Describe how the issue was resolved..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                />
              </div>
            )}

            {/* Rejected reason — shown only when rejecting */}
            {newStatus === "REJECTED" && (
              <div className="form-group">
                <label>Rejection Reason</label>
                <textarea
                  rows={3}
                  placeholder="Explain why this ticket is being rejected..."
                  value={rejectedReason}
                  onChange={(e) => setRejectedReason(e.target.value)}
                />
              </div>
            )}

            <button type="submit" className="control-btn">
              Update Status
            </button>

            {statusMsg && (
              <p className={`feedback-msg ${statusMsg.startsWith("✅") ? "success" : "fail"}`}>
                {statusMsg}
              </p>
            )}
          </form>
        </div>

        {/* Assign Technician Form */}
        <div className="control-card">
          <h3 className="control-title">Assign Technician</h3>
          <p className="control-hint">
            Currently assigned:{" "}
            <strong>{ticket.assignedTechnicianName || "Not assigned"}</strong>
          </p>
          <form onSubmit={handleAssign} className="control-form">
            <div className="form-group">
              <label>Technician User ID</label>
              <input
                type="number"
                placeholder="Enter technician's user ID"
                value={technicianId}
                onChange={(e) => setTechnicianId(e.target.value)}
              />
            </div>

            <button type="submit" className="control-btn">
              Assign Technician
            </button>

            {assignMsg && (
              <p className={`feedback-msg ${assignMsg.startsWith("✅") ? "success" : "fail"}`}>
                {assignMsg}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Attachments */}
      <div className="section-block">
        <AttachmentPreview ticketId={Number(id)} refreshTrigger={0} />
      </div>

      {/* Comments */}
      <div className="section-block">
        <TicketComments ticketId={Number(id)} currentUserId={adminUserId} />
      </div>
    </div>
  );
}

export default TicketManagementDetailsPage;
