import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateTicketPage from "./pages/user/CreateTicketPage";
import MyTicketsPage from "./pages/user/MyTicketsPage";
import TicketDetailsPage from "./pages/user/TicketDetailsPage";
import ManageTicketsPage from "./pages/admin/ManageTicketsPage";
import TicketManagementDetailsPage from "./pages/admin/TicketManagementDetailsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/create-ticket" element={<CreateTicketPage />} />
        <Route path="/my-tickets" element={<MyTicketsPage />} />
        <Route path="/tickets/:id" element={<TicketDetailsPage />} />
        <Route path="/admin/tickets" element={<ManageTicketsPage />} />
        <Route path="/admin/tickets/:id" element={<TicketManagementDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
