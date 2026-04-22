import { BrowserRouter, Route, Routes } from "react-router-dom";
import StatusPage from "./components/StatusPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/user/LoginPage";
import OAuthSuccess from "./pages/OAuthSuccess";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminProfileModernPage from "./pages/admin/AdminProfileModernPage";
import ManageBookingsPage from "./pages/admin/ManageBookingsPage";
import ManageNotificationsPage from "./pages/admin/ManageNotificationsPage";
import ManageResourcesModernPage from "./pages/admin/ManageResourcesModernPage";
import ManageResourcesPage from "./pages/admin/ManageResourcesPage";
import ManageTicketsPage from "./pages/admin/ManageTicketsPage";
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import TicketManagementDetailsPage from "./pages/admin/TicketManagementDetailsPage";
import AssignedTicketsModernPage from "./pages/technician/AssignedTicketsModernPage";
import MaintenanceLogsModernPage from "./pages/technician/MaintenanceLogsModernPage";
import TechnicianDashboardPage from "./pages/technician/TechnicianDashboardPage";
import TechnicianNotificationsModernPage from "./pages/technician/TechnicianNotificationsModernPage";
import TechnicianProfileModernPage from "./pages/technician/TechnicianProfileModernPage";
import BrowseResourcesModernPage from "./pages/user/BrowseResourcesModernPage";
import CreateTicketModernPage from "./pages/user/CreateTicketModernPage";
import MyBookingsModernPage from "./pages/user/MyBookingsModernPage";
import MyNotificationsModernPage from "./pages/user/MyNotificationsModernPage";
import MyTicketsModernPage from "./pages/user/MyTicketsModernPage";
import ProfileModernPage from "./pages/user/ProfileModernPage";
import StudentDashboardPage from "./pages/user/StudentDashboardPage";
import TicketDetailsModernPage from "./pages/user/TicketDetailsModernPage";

import { AnnouncementProvider } from "./context/AnnouncementContext";

function App() {
  return (
    <AnnouncementProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />

          <Route path="/dashboard" element={<StudentDashboardPage />} />
          <Route path="/create-ticket" element={<CreateTicketModernPage />} />
          <Route path="/my-tickets" element={<MyTicketsModernPage />} />
          <Route path="/tickets/:id" element={<TicketDetailsModernPage />} />
          <Route
            path="/my-notifications"
            element={<MyNotificationsModernPage />}
          />
          <Route path="/profile" element={<ProfileModernPage />} />
          <Route path="/resources" element={<BrowseResourcesModernPage />} />
          <Route path="/booking" element={<MyBookingsModernPage />} />
          <Route path="/resource-booking" element={<MyBookingsModernPage />} />
          <Route path="/my-bookings" element={<MyBookingsModernPage />} />

          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<ManageUsersPage />} />
          <Route
            path="/admin/notifications"
            element={<ManageNotificationsPage />}
          />
          <Route path="/admin/tickets" element={<ManageTicketsPage />} />
          <Route
            path="/admin/tickets/:id"
            element={<TicketManagementDetailsPage />}
          />
          <Route path="/admin/bookings" element={<ManageBookingsPage />} />
          <Route
            path="/admin/resources"
            element={<ManageResourcesModernPage />}
          />
          <Route path="/admin/profile" element={<AdminProfileModernPage />} />

          <Route
            path="/technician/dashboard"
            element={<TechnicianDashboardPage />}
          />
          <Route
            path="/technician/profile"
            element={<TechnicianProfileModernPage />}
          />
          <Route
            path="/technician/tickets"
            element={<AssignedTicketsModernPage />}
          />
          <Route
            path="/technician/notifications"
            element={<TechnicianNotificationsModernPage />}
          />
          <Route
            path="/technician/logs"
            element={<MaintenanceLogsModernPage />}
          />

          <Route
            path="/unauthorized"
            element={
              <StatusPage
                title="Unauthorized"
                message="You do not have permission to view this page."
              />
            }
          />
          <Route
            path="*"
            element={
              <StatusPage
                title="Page Not Found"
                message="The page you requested does not exist."
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </AnnouncementProvider>
  );
}

export default App;
