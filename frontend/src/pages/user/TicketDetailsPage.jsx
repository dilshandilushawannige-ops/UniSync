import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTicketById } from "../../services/ticketService";
import TicketDetailsCard from "../../components/ticket/TicketDetailsCard";
import TicketComments from "../../components/ticket/TicketComments";
import AttachmentUpload from "../../components/ticket/AttachmentUpload";
import AttachmentPreview from "../../components/ticket/AttachmentPreview";
import "./TicketDetailsPage.css";

/**
 * Full detail page for a single ticket — visible to the student who submitted it.
 * Shows ticket info, attachments, and comments.
 *
 * TODO: Replace hardcoded userId with auth context when Member 4 is ready.
 */
function TicketDetailsPage() {
  const { id } = useParams();       // get ticket ID from the URL (e.g. /tickets/5)
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // refreshKey triggers AttachmentPreview to reload when a new file is uploaded
  const [refreshKey, setRefreshKey] = useState(0);

  // Get userId from localStorage (set during OAuth login)
  const currentUserId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const data = await getTicketById(id);
        setTicket(data);
      } catch (err) {
        setError("Could not load ticket details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  // Called by AttachmentUpload after a successful upload
  const handleUploadSuccess = () => {
    setRefreshKey((prev) => prev + 1); // increment to trigger preview reload
  };

  if (loading) return <p className="status-msg">Loading ticket...</p>;
  if (error)   return <p className="error-msg">{error}</p>;

  return (
    <div className="ticket-details-page">
      {/* Back button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back to My Tickets
      </button>

      {/* Ticket info card */}
      <TicketDetailsCard ticket={ticket} />

      {/* Attachments section */}
      <div className="section-block">
        <AttachmentPreview ticketId={Number(id)} refreshTrigger={refreshKey} />
        <AttachmentUpload ticketId={Number(id)} onUploadSuccess={handleUploadSuccess} />
      </div>

      {/* Comments section */}
      <div className="section-block">
        <TicketComments ticketId={Number(id)} currentUserId={currentUserId} />
      </div>
    </div>
  );
}

export default TicketDetailsPage;
