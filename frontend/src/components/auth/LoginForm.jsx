import { useState } from "react";

function LoginForm({ onLogin }) {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
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

        if (onLogin) {
            onLogin(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <h2>Login</h2>

            <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                required
            />

            <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
                required
            />

            <button type="submit" style={styles.button}>
                Login
            </button>
        </form>
    );
}

const styles = {
    form: {
        maxWidth: "400px",
        margin: "30px auto",
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
        backgroundColor: "#1e3a8a",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
    },
};

export default LoginForm;