import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./ServicesPage.css";

const services = [
  {
    icon: "🛠️",
    title: "Ticket Management",
    description:
      "Submit technical or facility issues, add details and attachments, and track progress until resolution.",
    action: "/create-ticket",
    actionLabel: "Create Ticket",
  },
  {
    icon: "📅",
    title: "Resource Booking",
    description:
      "Reserve campus spaces and equipment with date and time preferences for classes, events, and meetings.",
    action: "/resource-booking",
    actionLabel: "Book Resource",
  },
  {
    icon: "🔔",
    title: "Notifications",
    description:
      "Get important updates about ticket status changes, booking approvals, and administrative announcements.",
    action: "/my-notifications",
    actionLabel: "View Notifications",
  },
  {
    icon: "👤",
    title: "Profile & Account",
    description:
      "Manage personal details and access settings to keep your UniSync account up to date.",
    action: "/profile",
    actionLabel: "Open Profile",
  },
];

function ServicesPage() {
  return (
    <div className="services-page">
      <Navbar />
      <main className="services-main">
        <section className="services-hero-card">
          <p className="services-eyebrow">UniSync Services</p>
          <h1 className="services-title">Services for smooth campus operations</h1>
          <p className="services-subtitle">
            Access core tools for student support, maintenance coordination, and day-to-day campus workflows.
          </p>
        </section>

        <section className="services-grid-section">
          <div className="services-grid">
            {services.map((service, index) => (
              <article key={service.title} className="services-card">
                <div className="services-card-top">
                  <span className="services-card-badge">{String(index + 1).padStart(2, "0")}</span>
                  <span className="services-card-icon" aria-hidden="true">
                    {service.icon}
                  </span>
                </div>
                <h2 className="services-card-title">{service.title}</h2>
                <p className="services-card-description">{service.description}</p>
                <Link to={service.action} className="services-card-button">
                  {service.actionLabel}
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default ServicesPage;
