import { useEffect, useState } from "react";
import TechnicianPortalLayout from "../../components/technician/TechnicianPortalLayout";
import TicketTable from "../../components/ticket/TicketTable";
import api from "../../services/api";

function InProgressTicketsPage() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchInProgressTickets();
    }, []);

    const fetchInProgressTickets = async () => {
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

            // Fetch all tickets assigned to this technician
            const response = await api.get(`/tickets/technician/${technicianId}`);

            // Filter only IN_PROGRESS tickets
            const inProgressTickets = response.data.filter(
                ticket => ticket.status === "IN_PROGRESS"
            );

            setTickets(inProgressTickets);
        } catch (err) {
            console.error("Error fetching in-progress tickets:", err);
            setError(err.response?.data?.message || "Failed to load in-progress tickets");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <TechnicianPortalLayout title="In Progress Tickets">
                <div style={styles.container}>
                    <p style={styles.message}>Loading in-progress tickets...</p>
                </div>
            </TechnicianPortalLayout>
        );
    }

    if (error) {
        return (
            <TechnicianPortalLayout title="In Progress Tickets">
                <div style={styles.container}>
                    <p style={styles.errorMessage}>{error}</p>
                </div>
            </TechnicianPortalLayout>
        );
    }

    return (
        <TechnicianPortalLayout title="In Progress Tickets">
            <div style={styles.container}>
                <div style={styles.header}>
                    <div>
                        <h2 style={styles.title}>Tickets In Progress</h2>
                        <p style={styles.subtitle}>
                            View and manage tickets that are currently being worked on.
                        </p>
                    </div>
                    <span style={styles.badge}>{tickets.length} In Progress</span>
                </div>

                {tickets.length === 0 ? (
                    <div style={styles.placeholder}>
                        <p style={styles.placeholderText}>
                            No tickets in progress. All assigned tickets will appear here once you start working on them.
                        </p>
                    </div>
                ) : (
                    <TicketTable tickets={tickets} isTechnician={true} />
                )}
            </div>
        </TechnicianPortalLayout>
    );
}

const styles = {
    container: {
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "18px",
        padding: "28px",
        boxShadow: "0 14px 32px rgba(15, 23, 42, 0.05)",
    },
    header: {
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "20px",
        flexWrap: "wrap",
        marginBottom: "24px",
    },
    title: {
        margin: "0 0 8px",
        fontSize: "1.5rem",
        color: "#0f172a",
        fontWeight: 700,
    },
    subtitle: {
        margin: 0,
        color: "#64748b",
        lineHeight: 1.6,
    },
    badge: {
        padding: "8px 16px",
        borderRadius: "12px",
        backgroundColor: "#fef3c7",
        color: "#92400e",
        fontWeight: 700,
        fontSize: "0.9rem",
    },
    message: {
        color: "#64748b",
        fontSize: "1rem",
        textAlign: "center",
        padding: "40px 20px",
    },
    errorMessage: {
        color: "#ef4444",
        fontSize: "1rem",
        textAlign: "center",
        padding: "40px 20px",
    },
    placeholder: {
        minHeight: "200px",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        backgroundColor: "#f8fafc",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        textAlign: "center",
    },
    placeholderText: {
        margin: 0,
        color: "#64748b",
        fontSize: "1rem",
        maxWidth: "500px",
    },
};

export default InProgressTicketsPage;
