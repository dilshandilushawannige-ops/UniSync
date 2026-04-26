import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import StudentPortalLayout from "../../components/user/StudentPortalLayout";
import { createTicket, uploadAttachments } from "../../services/ticketService";
import { MdOutlineDescription, MdLocationOn, MdEmail, MdAttachFile, MdImage } from "react-icons/md";
import { FiSend } from "react-icons/fi";
import { HiOutlineInformationCircle } from "react-icons/hi";
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
    "ACCOUNTS",
    "FACILITY",
    "OTHER",
];

const priorityOptions = ["LOW", "MEDIUM", "HIGH", "URGENT"];

function formatLabel(value) {
    return value
        .toLowerCase()
        .split("_")
        .map((s) => s[0].toUpperCase() + s.slice(1))
        .join(" ");
}

function CreateTicketPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(defaultFormData);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadError, setUploadError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const currentUserId = localStorage.getItem("userId");

    useEffect(() => {
        if (!currentUserId) {
            navigate("/login");
        }
    }, [currentUserId, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files || []);
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (files.length + selectedFiles.length > 4) {
            setUploadError("You can upload a maximum of 4 images.");
            return;
        }
        const invalid = files.find((f) => !allowedTypes.includes(f.type));
        if (invalid) {
            setUploadError("Only JPG, JPEG, and PNG files are allowed.");
            return;
        }
        const oversized = files.find((f) => f.size > 5 * 1024 * 1024);
        if (oversized) {
            setUploadError("Each file must be less than 5MB.");
            return;
        }
        setUploadError("");
        setSelectedFiles([...selectedFiles, ...files]);
    };

    const handleRemoveFile = (i) =>
        setSelectedFiles((f) => f.filter((_, idx) => idx !== i));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage("");
        setIsError(false);
        try {
            const created = await createTicket(formData, currentUserId);
            if (selectedFiles.length > 0) await uploadAttachments(created.id, selectedFiles);
            setMessage("Ticket submitted successfully.");
            setFormData(defaultFormData);
            setSelectedFiles([]);
            setTimeout(() => navigate("/my-tickets"), 900);
        } catch {
            setIsError(true);
            setMessage("Failed to submit ticket. Please review your inputs and try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <StudentPortalLayout title="New Ticket">
            <div className="new-ticket-page">
                {/* Breadcrumb Navigation */}
                <div className="ticket-breadcrumb">
                    <Link to="/dashboard" className="breadcrumb-link">Dashboard</Link>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-current">New Ticket</span>
                </div>

                {/* Page Description */}
                <p className="page-description">
                    Submit a new support ticket for IT-related issues. Provide detailed information to help us resolve your issue quickly.
                </p>

                <form className="new-ticket-form" onSubmit={handleSubmit}>
                    {/* Two Column Layout */}
                    <div className="form-grid">
                        {/* Left Column - Essential Details */}
                        <div className="form-section">
                            <div className="section-header">
                                <MdOutlineDescription className="section-icon" />
                                <h3>Essential Details</h3>
                            </div>

                            {/* Issue Title */}
                            <div className="form-field">
                                <label className="field-label">
                                    Issue Title <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Example: Projector not working in Lab 3"
                                    className="field-input"
                                    required
                                />
                            </div>

                            {/* Category + Priority Row */}
                            <div className="form-row">
                                <div className="form-field">
                                    <label className="field-label">
                                        Category <span className="required">*</span>
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="field-select"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categoryOptions.map((o) => (
                                            <option key={o} value={o}>{formatLabel(o)}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-field">
                                    <label className="field-label">
                                        Priority <span className="required">*</span>
                                    </label>
                                    <select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        className="field-select"
                                        required
                                    >
                                        <option value="">Select Priority</option>
                                        {priorityOptions.map((o) => (
                                            <option key={o} value={o}>{formatLabel(o)}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Detailed Description */}
                            <div className="form-field">
                                <label className="field-label">
                                    Detailed Description <span className="required">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Please provide as much detail as possible, including steps to reproduce the issue..."
                                    className="field-textarea"
                                    rows={6}
                                    required
                                />
                            </div>
                        </div>

                        {/* Right Column - Context */}
                        <div className="form-section">
                            <div className="section-header">
                                <HiOutlineInformationCircle className="section-icon" />
                                <h3>Context</h3>
                            </div>

                            {/* Location */}
                            <div className="form-field">
                                <label className="field-label">Location</label>
                                <div className="input-with-icon">
                                    <MdLocationOn className="input-icon" />
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="Example: Lab 3, Block B"
                                        className="field-input with-icon"
                                    />
                                </div>
                            </div>

                            {/* Preferred Contact */}
                            <div className="form-field">
                                <label className="field-label">Preferred Contact</label>
                                <div className="input-with-icon">
                                    <select
                                        name="preferredContact"
                                        value={formData.preferredContact}
                                        onChange={handleChange}
                                        className="field-select with-icon"
                                    >
                                        <option value="EMAIL">Email</option>
                                        <option value="PHONE">Phone</option>
                                        <option value="IN_APP">In App</option>
                                    </select>
                                    <MdEmail className="input-icon-right" />
                                </div>
                                <p className="field-hint">
                                    How would you like us to contact you about this ticket?
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Attachments Section */}
                    <div className="attachments-section">
                        <div className="section-header">
                            <MdAttachFile className="section-icon" />
                            <h3>Attachments</h3>
                        </div>

                        <div className="attachments-grid">
                            {/* Add File Button */}
                            <label className="attachment-add">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/jpeg,image/jpg,image/png"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />
                                <MdImage className="add-icon" />
                                <span>Add File</span>
                            </label>

                            {/* Preview uploaded files */}
                            {selectedFiles.map((file, i) => (
                                <div key={i} className="attachment-preview">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        className="preview-image"
                                    />
                                    <button
                                        type="button"
                                        className="remove-btn"
                                        onClick={() => handleRemoveFile(i)}
                                    >
                                        ×
                                    </button>
                                    <div className="preview-label">NO MEDIA</div>
                                </div>
                            ))}

                            {/* Empty placeholders */}
                            {Array.from({ length: Math.max(0, 3 - selectedFiles.length) }).map((_, i) => (
                                <div key={`empty-${i}`} className="attachment-placeholder">
                                    <MdImage className="placeholder-icon" />
                                    <span>NO MEDIA</span>
                                </div>
                            ))}
                        </div>

                        <p className="attachments-hint">
                            Upload screenshots or photos of the error (Max 4 files, 5MB each).
                        </p>
                        {uploadError && <p className="upload-error">{uploadError}</p>}
                    </div>

                    {/* Status Message */}
                    {message && (
                        <div className={`status-message ${isError ? 'error' : 'success'}`}>
                            {message}
                        </div>
                    )}

                    {/* Form Actions */}
                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={() => navigate("/my-tickets")}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={submitting}
                        >
                            <FiSend className="btn-icon" />
                            {submitting ? "Submitting..." : "Submit Ticket"}
                        </button>
                    </div>
                </form>
            </div>
        </StudentPortalLayout>
    );
}

export default CreateTicketPage;
