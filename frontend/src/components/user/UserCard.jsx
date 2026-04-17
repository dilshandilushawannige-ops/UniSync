import UserRoleBadge from "./UserRoleBadge";

function UserCard({ user }) {
    return (
        <div style={styles.card}>
            <h3>{user.fullName}</h3>
            <p>Email: {user.email}</p>
            <UserRoleBadge role={user.role} />
        </div>
    );
}

const styles = {
    card: {
        border: "1px solid #ddd",
        padding: "15px",
        borderRadius: "8px",
        backgroundColor: "#fff",
        marginBottom: "12px",
    },
};

export default UserCard;