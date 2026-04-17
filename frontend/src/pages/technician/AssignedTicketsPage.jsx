import TechnicianPortalLayout from "../../components/technician/TechnicianPortalLayout";

function AssignedTicketsPage() {
    return (
        <TechnicianPortalLayout title="Assigned Tickets">
            <div style={styles.container}>
                <p style={styles.message}>Your assigned tickets will appear here.</p>
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
};

export default AssignedTicketsPage;
