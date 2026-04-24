import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUser } from "../../services/userService";
import studentImg from "../../assets/student.png";
import technicianImg from "../../assets/technician.png";

function SignupPage() {
    const [step, setStep] = useState("role"); // "role" or "form"
    const [selectedRole, setSelectedRole] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        role: "",
    });

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setFormData((prev) => ({ ...prev, role }));
        setStep("form");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await createUser(formData);
            alert("Account created successfully! Please login.");
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create account. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setStep("role");
        setSelectedRole("");
    };

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <div style={styles.logoWrap}>
                    <span style={styles.logoMark} />
                    <span style={styles.logoText}>UniSync</span>
                </div>

                <nav style={styles.nav}>
                    <Link to="/" style={styles.navLink}>Home</Link>
                    <Link to="/login" style={styles.navLink}>Login</Link>
                    <span style={styles.activePill}>Sign Up</span>
                </nav>
            </header>

            <main style={styles.main}>
                {step === "role" ? (
                    <section style={styles.card}>
                        <p style={styles.overline}>Get Started</p>
                        <h1 style={styles.title}>Choose Your Role</h1>
                        <p style={styles.subtitle}>Select how you'll be using UniSync</p>

                        <div style={styles.roleGrid}>
                            <button
                                type="button"
                                style={styles.roleCard}
                                onClick={() => handleRoleSelect("USER")}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = "#1d4ed8";
                                    e.currentTarget.style.transform = "translateY(-4px)";
                                    e.currentTarget.style.boxShadow = "0 12px 24px rgba(37, 99, 235, 0.15)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "#e2e8f0";
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                            >
                                <img src={studentImg} alt="Student" style={styles.roleImage} />
                                <h3 style={styles.roleTitle}>Student</h3>
                                <p style={styles.roleDesc}>
                                    Report issues, track tickets, and manage campus support requests
                                </p>
                            </button>

                            <button
                                type="button"
                                style={styles.roleCard}
                                onClick={() => handleRoleSelect("TECHNICIAN")}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = "#1d4ed8";
                                    e.currentTarget.style.transform = "translateY(-4px)";
                                    e.currentTarget.style.boxShadow = "0 12px 24px rgba(37, 99, 235, 0.15)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "#e2e8f0";
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                            >
                                <img src={technicianImg} alt="Technician" style={styles.roleImage} />
                                <h3 style={styles.roleTitle}>Technician</h3>
                                <p style={styles.roleDesc}>
                                    Manage assigned tickets, update status, and resolve campus issues
                                </p>
                            </button>
                        </div>

                        <p style={styles.helper}>
                            Already have an account? <Link to="/login" style={styles.link}>Sign in</Link>
                        </p>
                    </section>
                ) : (
                    <section style={styles.card}>
                        <button type="button" onClick={handleBack} style={styles.backButton}>
                            ← Back
                        </button>

                        <p style={styles.overline}>
                            {selectedRole === "USER" ? "Student" : "Technician"} Registration
                        </p>
                        <h1 style={styles.title}>Create Your Account</h1>

                        {error && <div style={styles.errorBox}>{error}</div>}

                        <form onSubmit={handleSubmit} style={styles.form}>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Full Name"
                                value={formData.fullName}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            />

                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            />

                            <button
                                type="submit"
                                style={styles.submitButton}
                                disabled={loading}
                            >
                                {loading ? "Creating Account..." : "Create Account"}
                            </button>
                        </form>

                        <p style={styles.helper}>
                            Already have an account? <Link to="/login" style={styles.link}>Sign in</Link>
                        </p>
                    </section>
                )}
            </main>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
    },
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 40px",
        borderBottom: "1px solid rgba(15, 23, 42, 0.08)",
        backgroundColor: "#ffffff",
    },
    logoWrap: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },
    logoMark: {
        width: "22px",
        height: "22px",
        borderRadius: "6px",
        background: "linear-gradient(135deg, #f59e0b 0%, #2563eb 100%)",
        boxShadow: "0 8px 16px rgba(37, 99, 235, 0.18)",
    },
    logoText: {
        fontSize: "1rem",
        fontWeight: 800,
        color: "#1e3a8a",
        letterSpacing: "-0.02em",
    },
    nav: {
        display: "flex",
        alignItems: "center",
        gap: "22px",
        flexWrap: "wrap",
        justifyContent: "flex-end",
    },
    navLink: {
        color: "#475569",
        textDecoration: "none",
        fontSize: "0.95rem",
    },
    activePill: {
        padding: "10px 20px",
        borderRadius: "999px",
        backgroundColor: "#1d4ed8",
        color: "#ffffff",
        fontWeight: 700,
        boxShadow: "0 12px 24px rgba(37, 99, 235, 0.2)",
    },
    main: {
        minHeight: "calc(100vh - 78px)",
        display: "grid",
        placeItems: "center",
        padding: "32px 20px",
    },
    card: {
        width: "min(100%, 520px)",
        padding: "34px 34px 28px",
        borderRadius: "24px",
        backgroundColor: "#ffffff",
        boxShadow: "0 26px 80px rgba(15, 23, 42, 0.12)",
        textAlign: "center",
        border: "1px solid rgba(15, 23, 42, 0.06)",
        position: "relative",
    },
    backButton: {
        position: "absolute",
        top: "20px",
        left: "20px",
        background: "none",
        border: "none",
        color: "#1d4ed8",
        fontSize: "0.95rem",
        fontWeight: 600,
        cursor: "pointer",
        padding: "8px",
    },
    overline: {
        marginBottom: "8px",
        color: "#1d4ed8",
        fontWeight: 800,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        fontSize: "0.74rem",
    },
    title: {
        margin: "0 0 12px",
        color: "#0f172a",
        fontSize: "1.9rem",
        lineHeight: 1.1,
        letterSpacing: "-0.04em",
    },
    subtitle: {
        margin: "0 0 28px",
        color: "#64748b",
        fontSize: "0.95rem",
    },
    roleGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "16px",
        marginBottom: "24px",
    },
    roleCard: {
        padding: "24px 16px",
        borderRadius: "16px",
        border: "2px solid #e2e8f0",
        backgroundColor: "#ffffff",
        cursor: "pointer",
        transition: "all 0.2s ease",
        textAlign: "center",
    },
    roleImage: {
        width: "80px",
        height: "80px",
        objectFit: "contain",
        marginBottom: "12px",
    },
    roleTitle: {
        margin: "0 0 8px",
        color: "#0f172a",
        fontSize: "1.1rem",
        fontWeight: 700,
    },
    roleDesc: {
        margin: 0,
        color: "#64748b",
        fontSize: "0.85rem",
        lineHeight: 1.5,
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        marginTop: "24px",
    },
    input: {
        padding: "14px 16px",
        fontSize: "0.95rem",
        borderRadius: "12px",
        border: "1px solid #dbe3f0",
        backgroundColor: "#ffffff",
        color: "#0f172a",
        outline: "none",
    },
    submitButton: {
        width: "100%",
        padding: "14px 18px",
        borderRadius: "14px",
        border: "none",
        backgroundColor: "#1d4ed8",
        color: "#ffffff",
        fontSize: "0.98rem",
        fontWeight: 700,
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: "0 12px 24px rgba(37, 99, 235, 0.2)",
        marginTop: "8px",
    },
    errorBox: {
        padding: "12px",
        borderRadius: "10px",
        backgroundColor: "#fee2e2",
        color: "#dc2626",
        fontSize: "0.9rem",
        marginTop: "16px",
    },
    helper: {
        marginTop: "18px",
        color: "#64748b",
        fontSize: "0.82rem",
        lineHeight: 1.6,
    },
    link: {
        color: "#1d4ed8",
        textDecoration: "none",
        fontWeight: 600,
    },
};

export default SignupPage;
