import { BrowserRouter, Route, Routes } from "react-router-dom";
import StatusPage from "./components/StatusPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import OAuthSuccessModernPage from "./pages/OAuthSuccessModernPage";
import AdminDashboardModernPage from "./pages/admin/AdminDashboardModernPage";
import AdminProfileModernPage from "./pages/admin/AdminProfileModernPage";
import ManageBookingsModernPage from "./pages/admin/ManageBookingsModernPage";
import ManageNotificationsModernPage from "./pages/admin/ManageNotificationsModernPage";
import ManageResourcesModernPage from "./pages/admin/ManageResourcesModernPage";
import ManageTicketsModernPage from "./pages/admin/ManageTicketsModernPage";
import ManageUsersModernPage from "./pages/admin/ManageUsersModernPage";
import TicketManagementDetailsModernPage from "./pages/admin/TicketManagementDetailsModernPage";
import AssignedTicketsModernPage from "./pages/technician/AssignedTicketsModernPage";
import MaintenanceLogsModernPage from "./pages/technician/MaintenanceLogsModernPage";
import TechnicianDashboardModernPage from "./pages/technician/TechnicianDashboardModernPage";
import TechnicianNotificationsModernPage from "./pages/technician/TechnicianNotificationsModernPage";
import TechnicianProfileModernPage from "./pages/technician/TechnicianProfileModernPage";
import BrowseResourcesModernPage from "./pages/user/BrowseResourcesModernPage";
import CreateTicketModernPage from "./pages/user/CreateTicketModernPage";
import MyBookingsModernPage from "./pages/user/MyBookingsModernPage";
import MyNotificationsModernPage from "./pages/user/MyNotificationsModernPage";
import MyTicketsModernPage from "./pages/user/MyTicketsModernPage";
import ProfileModernPage from "./pages/user/ProfileModernPage";
import StudentDashboardModernPage from "./pages/user/StudentDashboardModernPage";
import TicketDetailsModernPage from "./pages/user/TicketDetailsModernPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/oauth-success" element={<OAuthSuccessModernPage />} />

        <Route path="/dashboard" element={<StudentDashboardModernPage />} />
        <Route path="/create-ticket" element={<CreateTicketModernPage />} />
        <Route path="/my-tickets" element={<MyTicketsModernPage />} />
        <Route path="/tickets/:id" element={<TicketDetailsModernPage />} />
        <Route path="/my-notifications" element={<MyNotificationsModernPage />} />
        <Route path="/profile" element={<ProfileModernPage />} />
        <Route path="/resources" element={<BrowseResourcesModernPage />} />
        <Route path="/booking" element={<MyBookingsModernPage />} />
        <Route path="/resource-booking" element={<MyBookingsModernPage />} />
        <Route path="/my-bookings" element={<MyBookingsModernPage />} />

        <Route path="/admin/dashboard" element={<AdminDashboardModernPage />} />
        <Route path="/admin/users" element={<ManageUsersModernPage />} />
        <Route path="/admin/notifications" element={<ManageNotificationsModernPage />} />
        <Route path="/admin/tickets" element={<ManageTicketsModernPage />} />
        <Route path="/admin/tickets/:id" element={<TicketManagementDetailsModernPage />} />
        <Route path="/admin/bookings" element={<ManageBookingsModernPage />} />
        <Route path="/admin/resources" element={<ManageResourcesModernPage />} />
        <Route path="/admin/profile" element={<AdminProfileModernPage />} />

        <Route path="/technician/dashboard" element={<TechnicianDashboardModernPage />} />
        <Route path="/technician/profile" element={<TechnicianProfileModernPage />} />
        <Route path="/technician/tickets" element={<AssignedTicketsModernPage />} />
        <Route path="/technician/notifications" element={<TechnicianNotificationsModernPage />} />
        <Route path="/technician/logs" element={<MaintenanceLogsModernPage />} />

        <Route path="/unauthorized" element={<StatusPage title="Unauthorized" message="You do not have permission to view this page." />} />
        <Route path="*" element={<StatusPage title="Page Not Found" message="The page you requested does not exist." />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
