import { useState } from "react";

function UserForm({ onSubmit }) {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        role: "USER",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (onSubmit) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <h2>User Form</h2>

            <input
                type="text"
                name="fullName"
                placeholder="Full name"
                value={formData.fullName}
                onChange={handleChange}
                style={styles.input}
                required
            />

            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                required
            />

            <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={styles.input}
            >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
            </select>

            <button type="submit" style={styles.button}>
                Save User
            </button>
        </form>
    );
}

const styles = {
    form: {
        maxWidth: "450px",
        margin: "20px auto",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        backgroundColor: "#fff",
    },
    input: {
        padding: "10px",
        fontSize: "16px",
    },
    button: {
        padding: "10px",
        fontSize: "16px",
        cursor: "pointer",
        backgroundColor: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
    },
};

export default UserForm;