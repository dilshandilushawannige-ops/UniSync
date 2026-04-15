import "./Booking.css";
import { useState } from "react";

function Booking({ isOpen, onClose, onCreate, theme = "light" }) {
  const [formData, setFormData] = useState({
    resource: "",
    resourceType: "lab",
    userId: "",
    userName: "",
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
    attendees: "",
    needsProjector: false,
    needsWhiteboard: false,
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCancel = () => {
    setFormData({
      resource: "",
      resourceType: "lab",
      userId: "",
      userName: "",
      date: "",
      startTime: "",
      endTime: "",
      purpose: "",
      attendees: "",
      needsProjector: false,
      needsWhiteboard: false,
    });
    setError("");
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      setError("End time must be later than start time.");
      return;
    }

    const newBooking = {
      id: Date.now(),
      resource: formData.resource,
      resourceType: formData.resourceType,
      userId: formData.userId,
      userName: formData.userName,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      purpose: formData.purpose || "Not specified",
      attendees: formData.attendees || "1",
      needsProjector: formData.needsProjector,
      needsWhiteboard: formData.needsWhiteboard,
      status: "PENDING",
    };

    try {
      setSubmitting(true);
      await onCreate(newBooking);
      handleCancel();
    } catch (submitError) {
      const message = submitError?.response?.data?.message || "Failed to create booking request.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <section className="booking-modal-overlay">
      <div className={`booking-modal booking-modal-${theme}`}>
      <div className="booking-card">
        <div className="booking-header">
          <div>
            <h2 className="booking-title">Create New Booking</h2>
            <p className="booking-subtitle">Add all required details and submit your request.</p>
          </div>
          <button className="booking-close-btn" type="button" aria-label="Close" onClick={handleCancel}>
            x
          </button>
        </div>

        <form className="booking-form" onSubmit={handleSubmit}>
          <label className="booking-label" htmlFor="resource">
            Resource Name *
          </label>
          <input
            className="booking-input"
            id="resource"
            name="resource"
            type="text"
            value={formData.resource}
            onChange={handleChange}
            placeholder="e.g. Computer Lab A"
            required
          />

          <label className="booking-label" htmlFor="resourceType">
            Resource Type *
          </label>
          <select
            className="booking-input"
            id="resourceType"
            name="resourceType"
            value={formData.resourceType}
            onChange={handleChange}
            required
          >
            <option value="lab">Lab</option>
            <option value="lecture_hall">Lecture Hall</option>
            <option value="meeting_room">Meeting Room</option>
            <option value="equipment">Equipment</option>
          </select>

          <div className="booking-grid-two">
            <div>
              <label className="booking-label" htmlFor="userId">
                User ID *
              </label>
              <input
                className="booking-input"
                id="userId"
                name="userId"
                type="text"
                value={formData.userId}
                onChange={handleChange}
                placeholder="e.g. STU001"
                required
              />
            </div>
            <div>
              <label className="booking-label" htmlFor="userName">
                User Name *
              </label>
              <input
                className="booking-input"
                id="userName"
                name="userName"
                type="text"
                value={formData.userName}
                onChange={handleChange}
                placeholder="Full name"
                required
              />
            </div>
          </div>

          <div className="booking-grid-three">
            <div>
              <label className="booking-label" htmlFor="date">
                Date *
              </label>
              <input
                className="booking-input"
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="booking-label" htmlFor="startTime">
                Start Time *
              </label>
              <input
                className="booking-input"
                id="startTime"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="booking-label" htmlFor="endTime">
                End Time *
              </label>
              <input
                className="booking-input"
                id="endTime"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="booking-grid-two">
            <div>
              <label className="booking-label" htmlFor="purpose">
                Purpose
              </label>
              <input
                className="booking-input"
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                placeholder="What's this for?"
              />
            </div>
            <div>
              <label className="booking-label" htmlFor="attendees">
                Expected Attendees
              </label>
              <input
                className="booking-input"
                id="attendees"
                name="attendees"
                type="number"
                min="1"
                value={formData.attendees}
                onChange={handleChange}
                placeholder="e.g. 1"
              />
            </div>
          </div>

          <div className="booking-options">
            <label className="booking-check">
              <input
                type="checkbox"
                name="needsProjector"
                checked={formData.needsProjector}
                onChange={handleChange}
              />
              Needs Projector
            </label>
            <label className="booking-check">
              <input
                type="checkbox"
                name="needsWhiteboard"
                checked={formData.needsWhiteboard}
                onChange={handleChange}
              />
              Needs Whiteboard
            </label>
          </div>

          <div className="booking-actions">
            <button className="booking-cancel-btn" type="button" onClick={handleCancel}>
              Cancel
            </button>
            <button className="booking-submit-btn" type="submit">
              {submitting ? "Creating..." : "Create Booking"}
            </button>
          </div>

          {error && <p className="booking-error">{error}</p>}
        </form>
      </div>
      </div>
    </section>
  );
}

export default Booking;
