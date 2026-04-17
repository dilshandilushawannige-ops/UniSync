import UserRoleBadge from "./UserRoleBadge";

function UserTable({ users = [] }) {
    return (
        <table style={styles.table}>
            <thead>
                <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Full Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Role</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td style={styles.td}>{user.id}</td>
                        <td style={styles.td}>{user.fullName}</td>
                        <td style={styles.td}>{user.email}</td>
                        <td style={styles.td}>
                            <UserRoleBadge role={user.role} />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

const styles = {
    table: {
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "20px",
        backgroundColor: "#fff",
    },
    th: {
        border: "1px solid #ddd",
        padding: "10px",
        backgroundColor: "#f3f4f6",
        textAlign: "left",
    },
    td: {
        border: "1px solid #ddd",
        padding: "10px",
    },
};

export default UserTable;