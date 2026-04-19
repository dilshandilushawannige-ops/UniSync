import { useEffect, useState } from "react";
import TechnicianPortalLayout from "../../components/technician/TechnicianPortalLayout";
import TicketTable from "../../components/ticket/TicketTable";
import api from "../../services/api";

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

            // Get technician ID from localStorage (set during OAuth login)
            const technicianId = localStorage.getItem("userId");
            if (!technicianId) {
                setError("User not authenticated. Please log in.");
                setLoading(false);
                return;
            }

            // Fetch tickets assigned to this technician
            const response = await api.get(`/tickets/technician/${technicianId}`);

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
