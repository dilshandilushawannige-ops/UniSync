import "./Booking.css";
import { useState } from "react";

function Booking() {
  const [formData, setFormData] = useState({
    resource: "",
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
    attendees: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      setError("End time must be later than start time.");
      return;
    }

    setMessage("Booking request submitted (UI demo). API integration can be added next.");
    setFormData({
      resource: "",
      date: "",
      startTime: "",
      endTime: "",
      purpose: "",
      attendees: "",
    });
  };

  return (
    <section className="booking-card">
      <h2 className="booking-title">Book a Resource</h2>
      <p className="booking-subtitle">
        Fill resource, date, time range, and purpose to submit a booking request.
      </p>

      <form className="booking-form" onSubmit={handleSubmit}>
        <label className="booking-label" htmlFor="resource">
          Resource
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

        <label className="booking-label" htmlFor="date">
          Date
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

        <div className="booking-time-grid">
          <div>
            <label className="booking-label" htmlFor="startTime">
              Start Time
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
              End Time
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
          value={formData.purpose}
          onChange={handleChange}
          placeholder="Describe why you need this booking"
          rows="3"
          required
        />

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
          placeholder="e.g. 20"
        />

        <button className="booking-submit-btn" type="submit">
          Submit Booking
        </button>

        {error && <p className="booking-error">{error}</p>}
        {message && <p className="booking-success">{message}</p>}
      </form>
    </section>
  );
}

export default Booking;
