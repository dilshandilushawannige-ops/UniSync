import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentPortalLayout from "../../components/user/StudentPortalLayout";
import { createTicket, uploadAttachments } from "../../services/ticketService";

const defaultFormData = {
    title: "",
    category: "",
    description: "",
    priority: "",
    location: "",
    preferredContact: "",
};

const categoryOptions = [
    "ELECTRICAL",
    "NETWORK",
    "PROJECTOR",
    "COMPUTER",
    "AIR_CONDITIONING",
    "FURNITURE",
    "OTHER",
];

const priorityOptions = ["LOW", "MEDIUM", "HIGH"];
const contactOptions = ["EMAIL", "PHONE", "IN_APP"];

function CreateTicketPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(defaultFormData);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadError, setUploadError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const currentUserId = 1;

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files || []);
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

        if (files.length > 3) {
            setUploadError("You can upload a maximum of 3 images.");
            return;
        }

        const invalidFile = files.find((file) => !allowedTypes.includes(file.type));
        if (invalidFile) {
            setUploadError("Only JPG, JPEG, and PNG files are allowed.");
            return;
        }

        setUploadError("");
        setSelectedFiles(files);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setMessage("");
        setIsError(false);

        try {
            const createdTicket = await createTicket(formData, currentUserId);

            if (selectedFiles.length > 0) {
                await uploadAttachments(createdTicket.id, selectedFiles);
            }

            setMessage("Ticket submitted successfully.");
            setFormData(defaultFormData);
            setSelectedFiles([]);

            setTimeout(() => {
                navigate("/my-tickets");
            }, 900);
        } catch (error) {
            setIsError(true);
            setMessage("Failed to publish ticket. Please review your inputs and try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <StudentPortalLayout title="Welcome to Student Dashboard">
            <section style={styles.card}>
                <div style={styles.cardHeader}>
                    <div>
                        <h2 style={styles.cardTitle}>Tickets</h2>
                        <p style={styles.cardText}>
                            Publish a support request, attach up to three images, and send complete details to the support team.
                        </p>
                    </div>

                    <button type="button" style={styles.secondaryButton} onClick={() => navigate("/my-tickets")}>
                        View My Tickets
                    </button>
                </div>

                <form style={styles.form} onSubmit={handleSubmit}>
                    <div style={styles.grid}>
                        <Field label="Issue Title">
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Short description of the issue"
                                style={styles.input}
                                required
                            />
                        </Field>

                        <Field label="Category">
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            >
                                <option value="">Select a category</option>
                                {categoryOptions.map((option) => (
                                    <option key={option} value={option}>{formatLabel(option)}</option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Priority">
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            >
                                <option value="">Select priority</option>
                                {priorityOptions.map((option) => (
                                    <option key={option} value={option}>{formatLabel(option)}</option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Preferred Contact">
                            <select
                                name="preferredContact"
                                value={formData.preferredContact}
                                onChange={handleChange}
                                style={styles.input}
                            >
                                <option value="">Select contact method</option>
                                {contactOptions.map((option) => (
                                    <option key={option} value={option}>{formatLabel(option)}</option>
                                ))}
                            </select>
                        </Field>
                    </div>

                    <Field label="Location">
                        <input
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g. Lab 3, Block B"
                            style={styles.input}
                        />
                    </Field>

                    <Field label="Description">
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the issue in detail..."
                            rows={6}
                            style={styles.textarea}
                            required
                        />
                    </Field>

                    <div style={styles.uploadCard}>
                        <div>
                            <h3 style={styles.uploadTitle}>Upload Images</h3>
                            <p style={styles.uploadHint}>Add up to 3 JPG or PNG images. They will upload after the ticket is created.</p>
                        </div>

                        <label style={styles.uploadButton}>
                            Choose Images
                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png"
                                multiple
                                onChange={handleFileChange}
                                style={styles.hiddenInput}
                            />
                        </label>
                    </div>

                    {uploadError ? <p style={styles.error}>{uploadError}</p> : null}

                    {selectedFiles.length > 0 ? (
                        <div style={styles.previewGrid}>
                            {selectedFiles.map((file) => (
                                <div key={`${file.name}-${file.lastModified}`} style={styles.previewCard}>
                                    <strong style={styles.previewName}>{file.name}</strong>
                                    <span style={styles.previewMeta}>{Math.ceil(file.size / 1024)} KB</span>
                                </div>
                            ))}
                        </div>
                    ) : null}

                    {message ? (
                        <p style={{ ...styles.message, ...(isError ? styles.error : styles.success) }}>
                            {message}
                        </p>
                    ) : null}

                    <div style={styles.actions}>
                        <button type="button" style={styles.secondaryButton} onClick={() => navigate(-1)}>
                            Back
                        </button>
                        <button type="submit" style={styles.primaryButton} disabled={submitting}>
                            {submitting ? "Publishing..." : "Publish Ticket"}
                        </button>
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

function formatLabel(value) {
    return value
        .toLowerCase()
        .split("_")
        .map((segment) => segment[0].toUpperCase() + segment.slice(1))
        .join(" ");
}

const styles = {
    card: {
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "18px",
        padding: "24px",
        boxShadow: "0 14px 32px rgba(15, 23, 42, 0.05)",
    },
    cardHeader: {
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "20px",
        flexWrap: "wrap",
        marginBottom: "20px",
    },
    cardTitle: {
        margin: "0 0 8px",
        color: "#0f172a",
        fontSize: "1.15rem",
    },
    cardText: {
        margin: 0,
        color: "#64748b",
        lineHeight: 1.6,
        maxWidth: "60ch",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "18px",
    },
    field: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
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
        minHeight: "148px",
        outline: "none",
        fontFamily: "inherit",
    },
    uploadCard: {
        marginTop: "6px",
        padding: "18px 20px",
        borderRadius: "16px",
        border: "1px dashed #93c5fd",
        backgroundColor: "#f8fbff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        flexWrap: "wrap",
    },
    uploadTitle: {
        margin: "0 0 6px",
        color: "#1e3a8a",
        fontSize: "1rem",
    },
    uploadHint: {
        margin: 0,
        color: "#64748b",
        lineHeight: 1.5,
    },
    uploadButton: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px 18px",
        borderRadius: "12px",
        backgroundColor: "#2563eb",
        color: "#ffffff",
        fontWeight: 700,
        cursor: "pointer",
        whiteSpace: "nowrap",
    },
    hiddenInput: {
        display: "none",
    },
    previewGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "12px",
        marginTop: "2px",
    },
    previewCard: {
        padding: "14px",
        borderRadius: "14px",
        border: "1px solid #dbeafe",
        backgroundColor: "#f8fafc",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },
    previewName: {
        color: "#0f172a",
        wordBreak: "break-word",
    },
    previewMeta: {
        color: "#64748b",
        fontSize: "0.84rem",
    },
    message: {
        margin: "0",
        fontWeight: 700,
    },
    success: {
        color: "#166534",
    },
    error: {
        color: "#b91c1c",
    },
    actions: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "14px",
        marginTop: "8px",
        flexWrap: "wrap",
    },
    secondaryButton: {
        border: "1px solid #dbe2ea",
        borderRadius: "12px",
        padding: "12px 18px",
        backgroundColor: "#ffffff",
        color: "#334155",
        fontWeight: 700,
        cursor: "pointer",
    },
    primaryButton: {
        border: "none",
        borderRadius: "12px",
        padding: "12px 22px",
        backgroundColor: "#2563eb",
        color: "#ffffff",
        fontWeight: 700,
        cursor: "pointer",
        boxShadow: "0 14px 24px rgba(37, 99, 235, 0.22)",
    },
};

export default CreateTicketPage;
