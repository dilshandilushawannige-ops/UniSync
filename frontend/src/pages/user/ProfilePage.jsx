import { useState } from "react";
import StudentPortalLayout from "../../components/user/StudentPortalLayout";

const initialProfile = {
    fullName: "Thathsara Munasinghe",
    email: "thathsara.munasinghe@student.unisync.edu",
    phoneNumber: "+94 77 456 2847",
    studentId: "EG/2021/145",
    department: "Faculty of Computing",
    shortBio: "I am a computing student focused on campus technology, support services, and digital learning tools.",
};

function ProfilePage() {
    const [profile, setProfile] = useState(initialProfile);
    const [message, setMessage] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProfile((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setMessage("Profile changes saved.");
    };

    return (
        <StudentPortalLayout title="My Profile">
            <section style={styles.wrapper}>
                <div style={styles.profileHero}>
                    <div style={styles.avatar}>{getInitials(profile.fullName)}</div>
                    <div>
                        <h2 style={styles.heroName}>{profile.fullName}</h2>
                        <p style={styles.heroEmail}>{profile.email}</p>
                    </div>
                </div>

                <form style={styles.form} onSubmit={handleSubmit}>
                    <div style={styles.grid}>
                        <Field label="Full Name">
                            <input
                                name="fullName"
                                value={profile.fullName}
                                onChange={handleChange}
                                style={styles.input}
                            />
                        </Field>

                        <Field label="Email Address (Read only)">
                            <input
                                name="email"
                                value={profile.email}
                                readOnly
                                style={{ ...styles.input, ...styles.readOnlyInput }}
                            />
                        </Field>

                        <Field label="Phone Number">
                            <input
                                name="phoneNumber"
                                value={profile.phoneNumber}
                                onChange={handleChange}
                                style={styles.input}
                            />
                        </Field>

                        <Field label="Student / Employee ID">
                            <input
                                name="studentId"
                                value={profile.studentId}
                                onChange={handleChange}
                                style={styles.input}
                            />
                        </Field>
                    </div>

                    <Field label="Department / Faculty">
                        <input
                            name="department"
                            value={profile.department}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </Field>

                    <Field label="Short Bio">
                        <textarea
                            name="shortBio"
                            value={profile.shortBio}
                            onChange={handleChange}
                            rows={5}
                            style={styles.textarea}
                        />
                    </Field>

                    <div style={styles.actions}>
                        {message ? <p style={styles.message}>{message}</p> : <span />}
                        <button type="submit" style={styles.button}>Save Changes</button>
                    </div>
                </form>
            </section>
        </StudentPortalLayout>
    );
}

function Field({ label, children }) {
    return (
        <label style={styles.field}>
            <span style={styles.label}>{label}</span>
            {children}
        </label>
    );
}

function getInitials(fullName) {
    return fullName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");
}

const styles = {
    wrapper: {
        backgroundColor: "#ffffff",
        borderRadius: "20px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 18px 40px rgba(15, 23, 42, 0.06)",
        overflow: "hidden",
    },
    profileHero: {
        display: "flex",
        alignItems: "center",
        gap: "18px",
        padding: "28px 32px",
        background: "linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)",
        color: "#ffffff",
    },
    avatar: {
        width: "68px",
        height: "68px",
        borderRadius: "999px",
        border: "3px solid rgba(255,255,255,0.28)",
        display: "grid",
        placeItems: "center",
        fontSize: "1.4rem",
        fontWeight: 800,
        backgroundColor: "rgba(255,255,255,0.1)",
        flexShrink: 0,
    },
    heroName: {
        margin: "0 0 4px",
        color: "#ffffff",
        fontSize: "1.55rem",
        letterSpacing: "-0.03em",
    },
    heroEmail: {
        margin: 0,
        color: "rgba(255,255,255,0.86)",
    },
    form: {
        padding: "28px 32px 32px",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "18px",
    },
    field: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        marginBottom: "18px",
    },
    label: {
        color: "#334155",
        fontSize: "0.92rem",
        fontWeight: 700,
    },
    input: {
        width: "100%",
        boxSizing: "border-box",
        padding: "13px 14px",
        borderRadius: "12px",
        border: "1px solid #dbe2ea",
        backgroundColor: "#ffffff",
        color: "#0f172a",
        fontSize: "0.96rem",
        outline: "none",
    },
    readOnlyInput: {
        backgroundColor: "#f8fafc",
        color: "#64748b",
    },
    textarea: {
        width: "100%",
        boxSizing: "border-box",
        padding: "13px 14px",
        borderRadius: "12px",
        border: "1px solid #dbe2ea",
        backgroundColor: "#ffffff",
        color: "#0f172a",
        fontSize: "0.96rem",
        resize: "vertical",
        minHeight: "132px",
        outline: "none",
        fontFamily: "inherit",
    },
    actions: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        marginTop: "8px",
        flexWrap: "wrap",
    },
    message: {
        margin: 0,
        color: "#166534",
        fontWeight: 700,
    },
    button: {
        border: "none",
        borderRadius: "12px",
        padding: "13px 22px",
        backgroundColor: "#2563eb",
        color: "#ffffff",
        fontWeight: 700,
        cursor: "pointer",
        boxShadow: "0 14px 24px rgba(37, 99, 235, 0.22)",
    },
};

export default ProfilePage;
