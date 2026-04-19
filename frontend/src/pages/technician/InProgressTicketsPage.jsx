import TechnicianPortalLayout from "../../components/technician/TechnicianPortalLayout";

function InProgressTicketsPage() {
    return (
        <TechnicianPortalLayout title="In Progress Tickets">
            <section style={styles.card}>
                <h2 style={styles.cardTitle}>Tickets In Progress</h2>
                <p style={styles.cardText}>
                    View and manage tickets that are currently being worked on.
                </p>
                <div style={styles.placeholder}>
                    <p style={styles.placeholderText}>
                        In progress tickets will appear here.
                    </p>
                </div>
            </section>
        </TechnicianPortalLayout>
    );
}

const styles = {
    card: {
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "18px",
        padding: "28px",
        boxShadow: "0 14px 32px rgba(15, 23, 42, 0.05)",
    },
    cardTitle: {
        margin: "0 0 10px",
        fontSize: "1.5rem",
        color: "#0f172a",
    },
    cardText: {
        margin: "0 0 20px",
        color: "#64748b",
        lineHeight: 1.6,
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
    },
};

export default InProgressTicketsPage;
