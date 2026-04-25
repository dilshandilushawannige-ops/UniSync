import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import googleIcon from "../../assets/google.png";

function LoginPage() {

    const fallbackApiBaseUrl = `${window.location.protocol}//${window.location.hostname}:8081`;
    const backendBaseUrl = (import.meta.env.VITE_API_BASE_URL || fallbackApiBaseUrl).replace(/\/$/, "");
    const googleOAuthUrl = `${backendBaseUrl}/oauth2/authorization/google`;
    const githubOAuthUrl = `${backendBaseUrl}/oauth2/authorization/github`;

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

    const handleGithubLogin = () => {
        setLoadingProvider("github");
        if (window.self !== window.top) {
            window.open(githubOAuthUrl, "_blank", "noopener,noreferrer");
            return;
        }

        window.location.assign(githubOAuthUrl);
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

                        <button
                            type="button"
                            style={styles.oauthButton}
                            onClick={handleGithubLogin}
                            disabled={loadingProvider === "github"}
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                style={{ flexShrink: 0 }}
                            >
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>

                            <span>
                                {loadingProvider === "github"
                                    ? "Redirecting..."
                                    : "Continue with GitHub"}
                            </span>
                        </button>

                    </div>

                    <p style={styles.helper}>
                        Don't have an account? <Link to="/signup" style={styles.signupLink}>Sign up</Link>
                        <br />
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
    signupLink: {
        color: "#1d4ed8",
        textDecoration: "none",
        fontWeight: 600,
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