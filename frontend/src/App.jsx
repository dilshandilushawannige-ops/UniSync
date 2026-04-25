import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AnnouncementProvider } from "./context/AnnouncementContext";
import StatusPage from "./components/StatusPage";
import CreateTicketPage from "./pages/user/CreateTicketPage";
import LandingPage from "./pages/HomePage";
import LoginPage from "./pages/user/LoginPage";
import SignupPage from "./pages/user/SignupPage";
import "./pages/HomePage.css";
import MyTicketsPage from "./pages/user/MyTicketsPage";
import MyNotificationsPage from "./pages/user/MyNotificationsPage";
import ProfilePage from "./pages/user/ProfilePage";
import StudentDashboardPage from "./pages/user/StudentDashboardPage";
import TicketDetailsPage from "./pages/user/TicketDetailsPage";
import MyBookingsPage from "./pages/user/MyBookingsPage";
import ResourceBookingPage from "./pages/user/ResourceBookingPage";
import OAuthSuccess from "./pages/OAuthSuccess";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminProfileModernPage from "./pages/admin/AdminProfileModernPage";
import ManageBookingsPage from "./pages/admin/ManageBookingsPage";
import ManageNotificationsPage from "./pages/admin/ManageNotificationsPage";
import ManageResourcesModernPage from "./pages/admin/ManageResourcesModernPage";
import ManageResourcesPage from "./pages/admin/ManageResourcesPage";
import ManageAnnouncementsPage from "./pages/admin/ManageAnnouncementsPage";
import ManageTicketsPage from "./pages/admin/ManageTicketsPage";
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import TicketManagementDetailsPage from "./pages/admin/TicketManagementDetailsPage";
import AssignedTicketsModernPage from "./pages/technician/AssignedTicketsModernPage";
import MaintenanceLogsModernPage from "./pages/technician/MaintenanceLogsModernPage";
import TechnicianDashboardPage from "./pages/technician/TechnicianDashboardPage";
import TechnicianProfilePage from "./pages/technician/TechnicianProfilePage";
import AssignedTicketsPage from "./pages/technician/AssignedTicketsPage";
import TechnicianNotificationsPage from "./pages/technician/TechnicianNotificationsPage";
import MaintenanceLogsPage from "./pages/technician/MaintenanceLogsPage";
import InProgressTicketsPage from "./pages/technician/InProgressTicketsPage";
import BrowseResourcesPage from "./pages/user/BrowseResourcesPage";
import AboutUsPage from "./pages/AboutUsPage";
import ContactUsPage from "./pages/ContactUsPage";

function App() {
  return (
    <AnnouncementProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path="/dashboard" element={<StudentDashboardPage />} />
          <Route path="/create-ticket" element={<CreateTicketPage />} />
          <Route path="/booking" element={<MyBookingsPage />} />
          <Route path="/resource-booking" element={<ResourceBookingPage />} />
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
          <Route path="/admin/announcements" element={<ManageAnnouncementsPage />} />
          <Route path="/admin/tickets" element={<ManageTicketsPage />} />
          <Route path="/admin/tickets/:id" element={<TicketManagementDetailsPage />} />
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
    </AnnouncementProvider>
  );
}

export default App;
