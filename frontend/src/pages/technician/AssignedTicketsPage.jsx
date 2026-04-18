import { useEffect, useState } from "react";
import TechnicianPortalLayout from "../../components/technician/TechnicianPortalLayout";
import TicketTable from "../../components/ticket/TicketTable";
import api from "../../services/api";
import { jwtDecode } from "jwt-decode";

function AssignedTicketsPage() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAssignedTickets();
    }, []);

    const fetchAssignedTickets = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get technician ID from JWT token
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No authentication token found");
                setLoading(false);
                return;
            }

            // Decode token to get user info
            const decoded = jwtDecode(token);
            const email = decoded.sub;

            // First, get the user ID from email
            const userResponse = await api.get(`/users/email/${email}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const technicianId = userResponse.data.id;

            // Fetch tickets assigned to this technician
            const response = await api.get(`/tickets/technician/${technicianId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setTickets(response.data);
        } catch (err) {
            console.error("Error fetching assigned tickets:", err);
            setError(err.response?.data?.message || "Failed to load assigned tickets");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <TechnicianPortalLayout title="Assigned Tickets">
                <div style={styles.container}>
                    <p style={styles.message}>Loading assigned tickets...</p>
                </div>
            </TechnicianPortalLayout>
        );
    }

    if (error) {
        return (
            <TechnicianPortalLayout title="Assigned Tickets">
                <div style={styles.container}>
                    <p style={styles.errorMessage}>{error}</p>
                </div>
            </TechnicianPortalLayout>
        );
    }

    return (
        <TechnicianPortalLayout title="Assigned Tickets">
            <div style={styles.container}>
                {tickets.length === 0 ? (
                    <p style={styles.message}>No tickets assigned to you yet.</p>
                ) : (
                    <TicketTable tickets={tickets} />
                )}
            </div>
        </TechnicianPortalLayout>
    );
}

const styles = {
    container: {
        padding: "24px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    },
    message: {
        color: "#64748b",
        fontSize: "1rem",
        margin: 0,
    },
    errorMessage: {
        color: "#ef4444",
        fontSize: "1rem",
        margin: 0,
    },
};

export default AssignedTicketsPage;
