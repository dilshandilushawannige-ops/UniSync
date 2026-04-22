import "./Booking.css";
import { useState } from "react";

function Booking({ isOpen, onClose, onCreate, theme = "light", mode = "modal" }) {
  const [formData, setFormData] = useState({
    resource: "",
    resourceType: "classroom",
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
      resourceType: "classroom",
      date: "",
      startTime: "",
      endTime: "",
      purpose: "",
      attendees: "",
      needsProjector: false,
      needsWhiteboard: false,
    });
    setError("");
    if (onClose) {
      onClose();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      setError("End time must be later than start time.");
      return;
    }

    const resourceName = (formData.resource || "").trim();
    if (!resourceName) {
      setError("Please type the resource name or location you want to book.");
      return;
    }

    const newBooking = {
      id: Date.now(),
      resource: resourceName,
      resourceType: formData.resourceType,
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

  if (!isOpen && mode !== "inline") return null;

  const bookingContent = (
    <div className={`booking-modal booking-modal-${theme} ${mode === "inline" ? "booking-inline" : ""}`}>
      <div className="booking-card">
        <div className="booking-header">
          <div>
            <h2 className="booking-title">Resource Booking</h2>
            <p className="booking-subtitle">Fill all required details to submit your booking request.</p>
          </div>
          {mode !== "inline" && (
            <button className="booking-close-btn" type="button" aria-label="Close" onClick={handleCancel}>
              x
            </button>
          )}
        </div>

        <form className="booking-form" onSubmit={handleSubmit}>
          <div className="booking-grid-four">
            <div>
              <label className="booking-label" htmlFor="resource">
                Resource *
              </label>
              <input
                className="booking-input"
                id="resource"
                name="resource"
                type="text"
                value={formData.resource}
                onChange={handleChange}
                required
                placeholder="e.g. Lab 3, Lecture Hall A, Meeting Room 2"
                autoComplete="off"
              />
            </div>

            <div>
              <label className="booking-label" htmlFor="resourceType">
                Category *
              </label>
              <select
                className="booking-input"
                id="resourceType"
                name="resourceType"
                value={formData.resourceType}
                onChange={handleChange}
                required
              >
                <option value="classroom">Classroom</option>
                <option value="lab">Lab</option>
                <option value="lecture_hall">Lecture Hall</option>
                <option value="meeting_room">Meeting Room</option>
                <option value="equipment">Equipment (projector, camera, …)</option>
              </select>
            </div>

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
              <label className="booking-label" htmlFor="attendees">
                Number of People
              </label>
              <input
                className="booking-input"
                id="attendees"
                name="attendees"
                type="number"
                min="1"
                value={formData.attendees}
                onChange={handleChange}
                placeholder="e.g. 25"
              />
            </div>
          </div>

          <div className="booking-grid-two">
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

          <label className="booking-label" htmlFor="purpose">
            Purpose
          </label>
          <textarea
            className="booking-input booking-textarea"
            id="purpose"
            name="purpose"
            rows="4"
            value={formData.purpose}
            onChange={handleChange}
            placeholder="Describe the purpose (lecture, meeting, event, etc.)"
          />

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
            {mode !== "inline" && (
              <button className="booking-cancel-btn" type="button" onClick={handleCancel}>
                Cancel
              </button>
            )}
            <button className="booking-submit-btn" type="submit">
              {submitting ? "Submitting..." : "Submit Booking"}
            </button>
          </div>

          {error && <p className="booking-error">{error}</p>}
        </form>
      </div>
    </div>
  );

  if (mode === "inline") {
    return bookingContent;
  }

  return <section className="booking-modal-overlay">{bookingContent}</section>;
}

export default Booking;
