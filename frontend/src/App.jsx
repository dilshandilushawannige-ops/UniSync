import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CreateTicketPage from "./pages/user/CreateTicketPage";
import MyTicketsPage from "./pages/user/MyTicketsPage";
import TicketDetailsPage from "./pages/user/TicketDetailsPage";
import MyBookingsPage from "./pages/user/MyBookingsPage";
import ManageTicketsPage from "./pages/admin/ManageTicketsPage";
import TicketManagementDetailsPage from "./pages/admin/TicketManagementDetailsPage";
import ManageBookingsPage from "./pages/admin/ManageBookingsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/my-bookings" replace />} />
        <Route path="/create-ticket" element={<CreateTicketPage />} />
        <Route path="/booking" element={<Navigate to="/my-bookings" replace />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="/admin/bookings" element={<ManageBookingsPage />} />
        <Route path="/my-tickets" element={<MyTicketsPage />} />
        <Route path="/tickets/:id" element={<TicketDetailsPage />} />
        <Route path="/admin/tickets" element={<ManageTicketsPage />} />
        <Route path="/admin/tickets/:id" element={<TicketManagementDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
