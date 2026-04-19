import { BrowserRouter, Route, Routes } from "react-router-dom";
import CreateTicketPage from "./pages/user/CreateTicketPage";
import LandingPage from "./pages/HomePage";
import LoginPage from "./pages/user/LoginPage";
import "./pages/HomePage.css";
import MyTicketsPage from "./pages/user/MyTicketsPage";
import MyNotificationsPage from "./pages/user/MyNotificationsPage";
import ProfilePage from "./pages/user/ProfilePage";
import StudentDashboardPage from "./pages/user/StudentDashboardPage";
import TicketDetailsPage from "./pages/user/TicketDetailsPage";
import MyBookingsPage from "./pages/user/MyBookingsPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import ManageNotificationsPage from "./pages/admin/ManageNotificationsPage";
import ManageTicketsPage from "./pages/admin/ManageTicketsPage";
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import TicketManagementDetailsPage from "./pages/admin/TicketManagementDetailsPage";
import ManageBookingsPage from "./pages/admin/ManageBookingsPage";
import TechnicianDashboardPage from "./pages/technician/TechnicianDashboardPage";
import TechnicianProfilePage from "./pages/technician/TechnicianProfilePage";
import AssignedTicketsPage from "./pages/technician/AssignedTicketsPage";
import TechnicianNotificationsPage from "./pages/technician/TechnicianNotificationsPage";
import MaintenanceLogsPage from "./pages/technician/MaintenanceLogsPage";
import InProgressTicketsPage from "./pages/technician/InProgressTicketsPage";
import OAuthSuccess from "./pages/OAuthSuccess";
import BrowseResourcesPage from "./pages/user/BrowseResourcesPage";
import ManageResourcesPage from "./pages/admin/ManageResourcesPage";
import AboutUsPage from "./pages/AboutUsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/dashboard" element={<StudentDashboardPage />} />
        <Route path="/create-ticket" element={<CreateTicketPage />} />
        <Route path="/booking" element={<MyBookingsPage />} />
        <Route path="/resource-booking" element={<MyBookingsPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="/admin/bookings" element={<ManageBookingsPage />} />
        <Route path="/my-tickets" element={<MyTicketsPage />} />
        <Route path="/my-notifications" element={<MyNotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/resources" element={<BrowseResourcesPage />} />
        <Route path="/tickets/:id" element={<TicketDetailsPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/profile" element={<StatusPage title="Admin Profile" message="Admin profile details will appear here." />} />
        <Route path="/admin/users" element={<ManageUsersPage />} />
        <Route path="/admin/notifications" element={<ManageNotificationsPage />} />
        <Route path="/admin/tickets" element={<ManageTicketsPage />} />
        <Route path="/admin/tickets/:id" element={<TicketManagementDetailsPage />} />
        <Route path="/admin/bookings" element={<StatusPage title="Booking Management" message="Booking management tools will appear here." />} />
        <Route path="/admin/resources" element={<ManageResourcesPage />} />
        <Route path="/technician/dashboard" element={<TechnicianDashboardPage />} />
        <Route path="/technician/profile" element={<TechnicianProfilePage />} />
        <Route path="/technician/tickets" element={<AssignedTicketsPage />} />
        <Route path="/technician/in-progress" element={<InProgressTicketsPage />} />
        <Route path="/technician/notifications" element={<TechnicianNotificationsPage />} />
        <Route path="/technician/logs" element={<MaintenanceLogsPage />} />
        <Route path="/unauthorized" element={<StatusPage title="Unauthorized" message="You do not have permission to view this page." />} />
        <Route path="*" element={<StatusPage title="Page Not Found" message="The page you requested does not exist." />} />
      </Routes>
    </BrowserRouter>
  );
}

function StatusPage({ title, message }) {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>{title}</h2>
        <p style={styles.message}>{message}</p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "24px",
    backgroundColor: "#f8fafc",
  },
  card: {
    width: "min(100%, 480px)",
    padding: "32px",
    borderRadius: "16px",
    backgroundColor: "#ffffff",
    boxShadow: "0 12px 40px rgba(15, 23, 42, 0.08)",
    textAlign: "center",
  },
  title: {
    margin: "0 0 12px",
  },
  message: {
    margin: 0,
    color: "#475569",
  },
};

export default App;
