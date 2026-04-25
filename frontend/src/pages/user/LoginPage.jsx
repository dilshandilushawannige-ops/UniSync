import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import googleIcon from "../../assets/google.png";

function LoginPage() {

    const fallbackApiBaseUrl = `${window.location.protocol}//${window.location.hostname}:8081`;
    const backendBaseUrl = (import.meta.env.VITE_API_BASE_URL || fallbackApiBaseUrl).replace(/\/$/, "");
    const googleOAuthUrl = `${backendBaseUrl}/oauth2/authorization/google`;

    const navigate = useNavigate();
    const [loadingProvider, setLoadingProvider] = useState("");
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(""); // Clear error when user types
    };

    const handleEmailPasswordLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await loginUser(loginData);

            // Store authentication data
            if (response.token) {
                localStorage.setItem("token", response.token);
                localStorage.setItem("role", response.role);
                localStorage.setItem("userId", response.userId);
                localStorage.setItem("email", response.email);

                // Redirect based on role
                if (response.role === "ADMIN") {
                    navigate("/admin/dashboard");
                } else if (response.role === "TECHNICIAN") {
                    navigate("/technician/dashboard");
                } else {
                    navigate("/dashboard");
                }
            }
        } catch (err) {
            setError(err.message || "Invalid email or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // OAuth login must be a browser navigation, not fetch/axios/iframe.
    const handleGoogleLogin = () => {
        setLoadingProvider("google");
        if (window.self !== window.top) {
            window.open(googleOAuthUrl, "_blank", "noopener,noreferrer");
            return;
        }

        window.location.assign(googleOAuthUrl);
    };

    return (
        <div style={styles.page}>
            <main style={styles.main}>
                <section style={styles.card}>
                    <p style={styles.overline}>Welcome Back</p>
                    <h1 style={styles.title}>Sign in to access SmartCampus Hub</h1>

                    {/* Email/Password Login Form */}
                    <form onSubmit={handleEmailPasswordLogin} style={styles.loginForm}>
                        {error && (
                            <div style={styles.errorBox}>
                                {error}
                            </div>
                        )}

                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={loginData.email}
                            onChange={handleInputChange}
                            style={styles.input}
                            required
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={loginData.password}
                            onChange={handleInputChange}
                            style={styles.input}
                            required
                        />

                        <button
                            type="submit"
                            style={styles.submitButton}
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>

                        <button
                            type="button"
                            style={styles.cancelButton}
                            onClick={() => navigate("/")}
                        >
                            Cancel
                        </button>
                    </form>

                    {/* Divider */}
                    <div style={styles.divider}>
                        <span style={styles.dividerLine}></span>
                        <span style={styles.dividerText}>OR</span>
                        <span style={styles.dividerLine}></span>
                    </div>

                    {/* OAuth Buttons */}
                    <div style={styles.buttonGroup}>

                        <button
                            type="button"
                            style={styles.oauthButton}
                            onClick={handleGoogleLogin}
                            disabled={loadingProvider === "google"}
                        >
                            <img
                                src={googleIcon}
                                alt="Google"
                                style={styles.googleIcon}
                            />

                            <span>
                                {loadingProvider === "google"
                                    ? "Redirecting..."
                                    : "Continue with Google"}
                            </span>
                        </button>

                    </div>

                    <p style={styles.helper}>
                        By signing in, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </section>
            </main>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
    },
    main: {
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "32px 20px",
    },
    card: {
        width: "min(100%, 420px)",
        padding: "34px 34px 28px",
        borderRadius: "24px",
        backgroundColor: "#ffffff",
        boxShadow: "0 26px 80px rgba(15, 23, 42, 0.12)",
        textAlign: "center",
        border: "1px solid rgba(15, 23, 42, 0.06)",
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
        margin: "0 0 24px",
        color: "#0f172a",
        fontSize: "1.9rem",
        lineHeight: 1.1,
        letterSpacing: "-0.04em",
    },
    buttonGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },
    oauthButton: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        padding: "14px 18px",
        borderRadius: "14px",
        border: "1px solid #dbe3f0",
        backgroundColor: "#ffffff",
        color: "#0f172a",
        fontSize: "0.98rem",
        fontWeight: 700,
        cursor: "pointer",
        transition: "transform 0.16s ease, box-shadow 0.16s ease",
        boxShadow: "0 10px 25px rgba(15, 23, 42, 0.05)",
    },
    googleIcon: {
        width: "20px",
        height: "20px",
        objectFit: "contain",
    },
    helper: {
        marginTop: "18px",
        color: "#64748b",
        fontSize: "0.82rem",
        lineHeight: 1.6,
    },
    loginForm: {
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        marginBottom: "20px",
    },
    input: {
        width: "100%",
        padding: "14px 16px",
        fontSize: "0.95rem",
        borderRadius: "12px",
        border: "1px solid #dbe3f0",
        backgroundColor: "#ffffff",
        color: "#0f172a",
        outline: "none",
        transition: "all 0.2s ease",
        fontFamily: "inherit",
        textAlign: "left",
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
    cancelButton: {
        width: "100%",
        padding: "14px 18px",
        borderRadius: "14px",
        border: "1px solid #dbe3f0",
        backgroundColor: "#ffffff",
        color: "#64748b",
        fontSize: "0.98rem",
        fontWeight: 700,
        cursor: "pointer",
        transition: "all 0.2s ease",
        marginTop: "8px",
    },
    errorBox: {
        padding: "12px 16px",
        borderRadius: "10px",
        backgroundColor: "#fee2e2",
        color: "#dc2626",
        fontSize: "0.9rem",
        textAlign: "left",
        border: "1px solid #fecaca",
    },
    divider: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        margin: "20px 0",
    },
    dividerLine: {
        flex: 1,
        height: "1px",
        backgroundColor: "#e2e8f0",
    },
    dividerText: {
        color: "#94a3b8",
        fontSize: "0.85rem",
        fontWeight: 600,
    },
};

export default LoginPage;