import { useState } from "react";
import { uploadAttachments } from "../../services/ticketService";
import "./AttachmentUpload.css";

/**
 * File upload component for attaching images to a ticket.
 * Allows JPG, JPEG, PNG only. Max 3 files per ticket.
 *
 * Props:
 *   ticketId (number)     — ID of the ticket to attach files to
 *   onUploadSuccess (func)— called after files are uploaded successfully
 */
function AttachmentUpload({ ticketId, onUploadSuccess }) {
  const [selectedFiles, setSelectedFiles] = useState([]); // files chosen by user
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // When user selects files from the file picker
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate: max 3 files
    if (files.length > 3) {
      setError("You can upload a maximum of 3 files.");
      return;
    }

    // Validate: only images allowed
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const invalidFile = files.find((f) => !allowedTypes.includes(f.type));
    if (invalidFile) {
      setError("Only JPG, JPEG, and PNG files are allowed.");
      return;
    }

    // Validate: max 5MB per file
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    const oversizedFile = files.find((f) => f.size > maxSize);
    if (oversizedFile) {
      setError(`File "${oversizedFile.name}" is too large. Maximum size is 5MB.`);
      return;
    }

    setError("");
    setSelectedFiles(files);
  };

  // Upload the selected files to the backend
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select at least one file.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      await uploadAttachments(ticketId, selectedFiles);
      setSelectedFiles([]); // clear selection
      onUploadSuccess();    // refresh the attachment preview list
    } catch (err) {
      console.error("Upload error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Upload failed. Please try again.";
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="attachment-upload">
      <h3 className="upload-title">Upload Attachments</h3>
      <p className="upload-hint">JPG, JPEG, PNG only · Max 3 files · Max 5MB each</p>

      {error && <p className="upload-error">{error}</p>}

      {/* File input */}
      <input
        type="file"
        id="file-input"
        accept="image/jpeg, image/jpg, image/png"
        multiple
        onChange={handleFileChange}
        className="file-input"
      />
      <label htmlFor="file-input" className="file-label">
        📎 Choose Files
      </label>

      {/* Show names of selected files */}
      {selectedFiles.length > 0 && (
        <ul className="selected-files">
          {selectedFiles.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      )}

      {/* Upload button */}
      <button
        className="upload-btn"
        onClick={handleUpload}
        disabled={uploading || selectedFiles.length === 0}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}

export default AttachmentUpload;
