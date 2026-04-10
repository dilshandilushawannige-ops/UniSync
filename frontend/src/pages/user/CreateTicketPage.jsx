import { useNavigate } from "react-router-dom";
import TicketForm from "../../components/ticket/TicketForm";
import "./CreateTicketPage.css";

/**
 * Page for students to submit a new ticket.
 * Contains just the TicketForm component.
 *
 * TODO: Replace hardcoded userId with logged-in user from auth context
 *       when Member 4's auth module is ready.
 */
function CreateTicketPage() {
  const navigate = useNavigate();

  // Temporary: hardcoded user ID until auth context is available
  const currentUserId = 1;

  // Called by TicketForm after a ticket is successfully created
  const handleSuccess = () => {
    navigate("/my-tickets"); // go to "My Tickets" page after submission
  };

  return (
    <div className="create-ticket-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className="page-title">Report an Issue</h1>
        <p className="page-subtitle">
          Fill in the form below to submit a support ticket.
        </p>
      </div>

      {/* Ticket submission form */}
      <TicketForm userId={currentUserId} onSuccess={handleSuccess} />
    </div>
  );
}

export default CreateTicketPage;
