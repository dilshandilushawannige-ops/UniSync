function UserRoleBadge({ role }) {
    const backgroundColor = role === "ADMIN" ? "#dc2626" : "#2563eb";

    return (
        <span
            style={{
                padding: "4px 10px",
                borderRadius: "20px",
                color: "#fff",
                backgroundColor,
                fontSize: "12px",
                fontWeight: "bold",
            }}
        >
            {role}
        </span>
    );
}

export default UserRoleBadge;