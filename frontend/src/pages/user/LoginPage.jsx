import { useState } from "react";
import { Link } from "react-router-dom";

function LoginPage() {

    const fallbackApiBaseUrl = `${window.location.protocol}//${window.location.hostname}:8081`;
    const backendBaseUrl = (import.meta.env.VITE_API_BASE_URL || fallbackApiBaseUrl).replace(/\/$/, "");
    const googleOAuthUrl = `${backendBaseUrl}/oauth2/authorization/google`;

    const [loadingProvider, setLoadingProvider] = useState("");

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
            <header style={styles.header}>
                <div style={styles.logoWrap}>
                    <span style={styles.logoMark} />
                    <span style={styles.logoText}>UniSync</span>
                </div>

                <nav style={styles.nav}>
                    <Link to="/" style={styles.navLink}>Home</Link>
                    <a href="#services" style={styles.navLink}>Services</a>
                    <a href="#achievements" style={styles.navLink}>Achievements</a>
                    <a href="#about" style={styles.navLink}>About Us</a>
                    <a href="#contact" style={styles.navLink}>Contact</a>
                    <span style={styles.activePill}>Login</span>
                </nav>
            </header>

            <main style={styles.main}>
                <section style={styles.card}>
                    <p style={styles.overline}>Welcome Back</p>
                    <h1 style={styles.title}>Sign in to access SmartCampus Hub</h1>

                    <div style={styles.buttonGroup}>

                        <button
                            type="button"
                            style={styles.oauthButton}
                            onClick={handleGoogleLogin}
                            disabled={loadingProvider === "google"}
                        >
                            <span style={styles.oauthIcon}>
                                <span style={{ ...styles.googleDot, backgroundColor: "#ea4335" }} />
                                <span style={{ ...styles.googleDot, backgroundColor: "#fbbc05" }} />
                                <span style={{ ...styles.googleDot, backgroundColor: "#34a853" }} />
                                <span style={{ ...styles.googleDot, backgroundColor: "#4285f4" }} />
                            </span>

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
    oauthIcon: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 7px)",
        gap: "2px",
        alignItems: "center",
        justifyItems: "center",
    },
    googleDot: {
        width: "7px",
        height: "7px",
        borderRadius: "999px",
        display: "block",
    },
    helper: {
        marginTop: "18px",
        color: "#64748b",
        fontSize: "0.82rem",
        lineHeight: 1.6,
    },
};

export default LoginPage;