import { useEffect, useState } from "react";
import UserForm from "../../components/user/UserForm";
import UserTable from "../../components/user/UserTable";
import { createUser, getAllUsers } from "../../services/userService";

function ManageUsersPage() {
    const [users, setUsers] = useState([]);

    const loadUsers = async () => {
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error("Failed to load users", error);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleCreateUser = async (userData) => {
        try {
            await createUser(userData);
            loadUsers();
        } catch (error) {
            console.error("Failed to create user", error);
        }
    };

    return (
        <div style={styles.container}>
            <h2>Manage Users</h2>
            <UserForm onSubmit={handleCreateUser} />
            <UserTable users={users} />
        </div>
    );
}

const styles = {
    container: {
        padding: "30px",
    },
};

export default ManageUsersPage;