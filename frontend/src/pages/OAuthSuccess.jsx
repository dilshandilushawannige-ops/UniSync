import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function OAuthSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get("token");
        const role = searchParams.get("role");

        console.log("=== OAuth Success Page ===");
        console.log("Token:", token);
        console.log("Role:", role);

        if (!token || !role) {
            console.log("Missing token or role, redirecting to login");
            navigate("/login", { replace: true });
            return;
        }

        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        console.log("Role check:", role);

        if (role === "ROLE_ADMIN") {
            console.log("Redirecting to Admin Dashboard");
            navigate("/admin/dashboard", { replace: true });
        } else if (role === "ROLE_TECHNICIAN") {
            console.log("Redirecting to Technician Dashboard");
            navigate("/technician/dashboard", { replace: true });
        } else {
            console.log("Redirecting to Student Dashboard");
            navigate("/dashboard", { replace: true });
        }

        console.log("=========================");
    }, [searchParams, navigate]);

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h2 style={styles.title}>Logging you in...</h2>
                <p style={styles.message}>Please wait while we redirect you.</p>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        backgroundColor: "#f8fafc",
    },
    card: {
        width: "min(100%, 420px)",
        padding: "32px",
        borderRadius: "16px",
        backgroundColor: "#ffffff",
        boxShadow: "0 12px 40px rgba(15, 23, 42, 0.08)",
        textAlign: "center",
    },
    title: {
        margin: "0 0 12px",
        color: "#0f172a",
    },
    message: {
        margin: 0,
        color: "#475569",
    },
};

export default OAuthSuccess;