import { Link } from "react-router-dom";

function HomePage() {
    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <div style={styles.logoWrap}>
                    <span style={styles.logoMark} />
                    <span style={styles.logoText}>UniSync</span>
                </div>

                <nav style={styles.nav}>
                    <a href="#home" style={styles.navLink}>Home</a>
                    <a href="#services" style={styles.navLink}>Services</a>
                    <a href="#achievements" style={styles.navLink}>Achievements</a>
                    <a href="#about" style={styles.navLink}>About Us</a>
                    <a href="#contact" style={styles.navLink}>Contact</a>
                    <Link to="/login" style={styles.loginButton}>Login</Link>
                </nav>
            </header>

            <main style={styles.hero}>
                <section style={styles.heroPanel}>
                    <p style={styles.eyebrow}>Smart Campus Help Desk</p>
                    <h1 style={styles.title}>Support for every classroom, lab, and office.</h1>
                    <p style={styles.subtitle}>
                        Track issues, route requests, and keep campus operations moving from one clean dashboard.
                    </p>
                    <div style={styles.actions}>
                        <Link to="/login" style={styles.primaryAction}>Open Login</Link>
                        <Link to="/my-tickets" style={styles.secondaryAction}>View Tickets</Link>
                    </div>
                </section>
            </main>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "linear-gradient(180deg, #fffefb 0%, #f7f8fc 100%)",
    },
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 40px",
        borderBottom: "1px solid rgba(15, 23, 42, 0.08)",
        backgroundColor: "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(8px)",
        position: "sticky",
        top: 0,
        zIndex: 2,
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
    loginButton: {
        textDecoration: "none",
        color: "#ffffff",
        backgroundColor: "#1d4ed8",
        padding: "10px 20px",
        borderRadius: "999px",
        fontWeight: 700,
        boxShadow: "0 12px 24px rgba(37, 99, 235, 0.2)",
    },
    hero: {
        padding: "96px 24px 48px",
        display: "grid",
        placeItems: "center",
    },
    heroPanel: {
        width: "min(100%, 920px)",
        padding: "56px",
        borderRadius: "32px",
        background: "radial-gradient(circle at top left, rgba(253, 224, 71, 0.26), transparent 30%), #ffffff",
        boxShadow: "0 28px 70px rgba(15, 23, 42, 0.08)",
        textAlign: "left",
    },
    eyebrow: {
        marginBottom: "12px",
        color: "#1d4ed8",
        textTransform: "uppercase",
        letterSpacing: "0.14em",
        fontSize: "0.78rem",
        fontWeight: 800,
    },
    title: {
        margin: "0 0 18px",
        maxWidth: "12ch",
        fontSize: "clamp(2.4rem, 6vw, 4.8rem)",
        lineHeight: 1,
        letterSpacing: "-0.06em",
        color: "#0f172a",
    },
    subtitle: {
        maxWidth: "58ch",
        color: "#475569",
        fontSize: "1.05rem",
        lineHeight: 1.7,
    },
    actions: {
        marginTop: "28px",
        display: "flex",
        gap: "14px",
        flexWrap: "wrap",
    },
    primaryAction: {
        textDecoration: "none",
        backgroundColor: "#1d4ed8",
        color: "#ffffff",
        padding: "14px 22px",
        borderRadius: "999px",
        fontWeight: 700,
    },
    secondaryAction: {
        textDecoration: "none",
        backgroundColor: "#eff6ff",
        color: "#1d4ed8",
        padding: "14px 22px",
        borderRadius: "999px",
        fontWeight: 700,
    },
};

export default HomePage;
