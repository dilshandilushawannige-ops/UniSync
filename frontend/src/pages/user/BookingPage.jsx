import { useNavigate } from "react-router-dom";
import Booking from "../../components/booking/Booking";
import "./BookingPage.css";

function BookingPage() {
  const navigate = useNavigate();

  return (
    <div className="booking-page">
      <div className="booking-page-header">
        <button className="booking-back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className="booking-page-title">Resource Booking</h1>
        <p className="booking-page-subtitle">
          Create your booking request and wait for admin approval.
        </p>
      </div>

      <Booking />
    </div>
  );
}

export default BookingPage;
