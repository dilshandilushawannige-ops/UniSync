import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudentPortalLayout from "../../components/user/StudentPortalLayout";
import { createTicket, uploadAttachments } from "../../services/ticketService";
import "./CreateTicketPage.css";

const defaultFormData = {
    title: "",
    category: "",
    description: "",
    priority: "",
    location: "",
    preferredContact: "EMAIL",
};

const categoryOptions = [
    "NETWORK",
    "HARDWARE",
    "SOFTWARE",
    "FACILITY",
    "OTHER",
];

const priorityOptions = ["LOW", "MEDIUM", "HIGH", "URGENT"];

function CreateTicketPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(defaultFormData);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadError, setUploadError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    // Get userId from localStorage (set during OAuth login)
    const currentUserId = localStorage.getItem("userId");

    // Redirect to login if user is not authenticated
    useEffect(() => {
        if (!currentUserId) {
            console.warn("No userId found in localStorage. Redirecting to login.");
            navigate("/login");
        }
    }, [currentUserId, navigate]);

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

    const handleRemoveFile = (indexToRemove) => {
        setSelectedFiles(files => files.filter((_, index) => index !== indexToRemove));
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

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "HIGH": return "#ef4444";
            case "URGENT": return "#dc2626";
            case "MEDIUM": return "#f59e0b";
            case "LOW": return "#10b981";
            default: return "#94a3b8";
        }
    };

    return (
        <StudentPortalLayout>
            <div className="create-ticket-page">
                {/* Page Header */}
                <div className="page-header">
                    <h1 className="page-title">Create New Ticket</h1>
                    <p className="page-subtitle">
                        Fill out the details below to report a maintenance issue or request service from the campus facilities and IT teams.
                    </p>
                </div>

                <form className="ticket-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        {/* Left Column - Ticket Details */}
                        <div className="form-section">
                            <div className="section-header">
                                <div className="section-indicator"></div>
                                <h2 className="section-title">Ticket Details</h2>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Issue Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g., Broken projector in Lab 3"
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">Select category</option>
                                        {categoryOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {formatLabel(option)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Priority</label>
                                    <select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        className="form-select priority-select"
                                        required
                                    >
                                        <option value="">Select priority</option>
                                        {priorityOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {formatLabel(option)}
                                            </option>
                                        ))}
                                    </select>
                                    {formData.priority && (
                                        <div className="priority-indicator">
                                            <span 
                                                className="priority-dot"
                                                style={{ backgroundColor: getPriorityColor(formData.priority) }}
                                            ></span>
                                            <span 
                                                className="priority-label"
                                                style={{ color: getPriorityColor(formData.priority) }}
                                            >
                                                {formatLabel(formData.priority)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Detailed Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe the problem in detail. Include any error codes or specific symptoms."
                                    className="form-textarea"
                                    rows={6}
                                    required
                                />
                            </div>

                            {/* Contact Preference */}
                            <div className="form-section-inner">
                                <div className="section-header">
                                    <div className="section-indicator"></div>
                                    <h3 className="section-title-small">Contact Preference</h3>
                                </div>

                                <div className="contact-options">
                                    <label className={`contact-option ${formData.preferredContact === "EMAIL" ? "active" : ""}`}>
                                        <input
                                            type="radio"
                                            name="preferredContact"
                                            value="EMAIL"
                                            checked={formData.preferredContact === "EMAIL"}
                                            onChange={handleChange}
                                            className="contact-radio"
                                        />
                                        <div className="contact-icon">📧</div>
                                        <span className="contact-label">Email</span>
                                    </label>

                                    <label className={`contact-option ${formData.preferredContact === "PHONE" ? "active" : ""}`}>
                                        <input
                                            type="radio"
                                            name="preferredContact"
                                            value="PHONE"
                                            checked={formData.preferredContact === "PHONE"}
                                            onChange={handleChange}
                                            className="contact-radio"
                                        />
                                        <div className="contact-icon">📱</div>
                                        <span className="contact-label">Phone</span>
                                    </label>

                                    <label className={`contact-option ${formData.preferredContact === "SMS" ? "active" : ""}`}>
                                        <input
                                            type="radio"
                                            name="preferredContact"
                                            value="SMS"
                                            checked={formData.preferredContact === "SMS"}
                                            onChange={handleChange}
                                            className="contact-radio"
                                        />
                                        <div className="contact-icon">🔔</div>
                                        <span className="contact-label">In-app</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Location & Attachments */}
                        <div className="form-section">
                            <div className="section-header">
                                <div className="section-indicator"></div>
                                <h2 className="section-title">Location</h2>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Location Details</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="e.g., Science Block B, Room 202"
                                    className="form-input"
                                />
                            </div>

                            {/* Map Placeholder */}
                            <div className="map-placeholder">
                                <div className="map-pin">📍</div>
                                <p className="map-text">Location map view</p>
                            </div>

                            {/* Media & Attachments */}
                            <div className="form-section-inner">
                                <div className="section-header">
                                    <div className="section-indicator"></div>
                                    <h3 className="section-title-small">Media & Attachments</h3>
                                </div>

                                <p className="upload-hint">
                                    Attach up to 3 images to help our team understand the issue better.
                                </p>

                                <div className="upload-area">
                                    <div className="upload-icon">☁️</div>
                                    <p className="upload-text">Drag and drop images here</p>
                                    <p className="upload-subtext">Supports JPG, PNG (Max 5MB each)</p>
                                    
                                    <label className="browse-button">
                                        Browse Files
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png"
                                            multiple
                                            onChange={handleFileChange}
                                            className="file-input"
                                        />
                                    </label>
                                </div>

                                {uploadError && <p className="error-message">{uploadError}</p>}

                                {/* File Preview */}
                                {selectedFiles.length > 0 && (
                                    <div className="file-preview-grid">
                                        {selectedFiles.map((file, index) => (
                                            <div key={`${file.name}-${index}`} className="file-preview-item">
                                                <div className="file-icon">📄</div>
                                                <div className="file-info">
                                                    <p className="file-name">{file.name}</p>
                                                    <p className="file-size">{Math.ceil(file.size / 1024)} KB</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="file-remove"
                                                    onClick={() => handleRemoveFile(index)}
                                                    title="Remove file"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Status Message */}
                    {message && (
                        <div className={`status-message ${isError ? "error" : "success"}`}>
                            {message}
                        </div>
                    )}

                    {/* Form Actions */}
                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => navigate("/my-tickets")}
                        >
                            Cancel & Discard
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={submitting}
                        >
                            {submitting ? "Publishing..." : "Publish Ticket ➤"}
                        </button>
                    </div>
                </form>
            </div>
        </StudentPortalLayout>
    );
}

function formatLabel(value) {
    return value
        .toLowerCase()
        .split("_")
        .map((segment) => segment[0].toUpperCase() + segment.slice(1))
        .join(" ");
}

export default CreateTicketPage;
