import { useState } from "react";
import { createTicket } from "../../services/ticketService";
import "./TicketForm.css";

/**
 * Form for creating a new ticket.
 * Used inside CreateTicketPage.
 *
 * Props:
 *   userId (number)   — ID of the logged-in user submitting the ticket
 *   onSuccess (func)  — called after ticket is created successfully
 */
function TicketForm({ userId, onSuccess }) {
  // Form field state
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    priority: "",
    location: "",
    preferredContact: "",
  });

  const [loading, setLoading] = useState(false); // true while API call is in progress
  const [error, setError] = useState("");        // error message to show user

  // Update state when any field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    setLoading(true);
    setError("");

    try {
      await createTicket(formData, userId);
      onSuccess(); // go back or show success message
    } catch (err) {
      setError("Failed to submit ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="ticket-form" onSubmit={handleSubmit}>
      <h2 className="form-title">Submit a New Ticket</h2>

      {/* Error message */}
      {error && <p className="form-error">{error}</p>}

      {/* Title */}
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="Short description of the issue"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      {/* Category */}
      <div className="form-group">
        <label htmlFor="category">Category *</label>
        <select id="category" name="category" value={formData.category} onChange={handleChange} required>
          <option value="">Select a category</option>
          <option value="ELECTRICAL">Electrical</option>
          <option value="NETWORK">Network</option>
          <option value="PROJECTOR">Projector</option>
          <option value="COMPUTER">Computer</option>
          <option value="AIR_CONDITIONING">Air Conditioning</option>
          <option value="FURNITURE">Furniture</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      {/* Priority */}
      <div className="form-group">
        <label htmlFor="priority">Priority *</label>
        <select id="priority" name="priority" value={formData.priority} onChange={handleChange} required>
          <option value="">Select priority</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>

      {/* Description */}
      <div className="form-group">
        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          name="description"
          rows={4}
          placeholder="Describe the issue in detail..."
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      {/* Location */}
      <div className="form-group">
        <label htmlFor="location">Location</label>
        <input
          id="location"
          name="location"
          type="text"
          placeholder="e.g. Lab 3, Block B"
          value={formData.location}
          onChange={handleChange}
        />
      </div>

      {/* Preferred Contact */}
      <div className="form-group">
        <label htmlFor="preferredContact">Preferred Contact</label>
        <select id="preferredContact" name="preferredContact" value={formData.preferredContact} onChange={handleChange}>
          <option value="">Select contact method</option>
          <option value="EMAIL">Email</option>
          <option value="PHONE">Phone</option>
          <option value="IN_APP">In-App Notification</option>
        </select>
      </div>

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? "Submitting..." : "Submit Ticket"}
      </button>
    </form>
  );
}

export default TicketForm;
