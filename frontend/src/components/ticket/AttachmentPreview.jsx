import { useState, useEffect } from "react";
import { getAttachments, deleteAttachment } from "../../services/ticketService";
import "./AttachmentPreview.css";

/**
 * Displays uploaded image attachments for a ticket.
 * Each image can be viewed full-size or deleted.
 *
 * Props:
 *   ticketId (number)  — ID of the ticket
 *   refreshTrigger     — changes when parent wants this to reload (e.g. after upload)
 */
function AttachmentPreview({ ticketId, refreshTrigger }) {
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load attachments when ticketId or refreshTrigger changes
  useEffect(() => {
    loadAttachments();
  }, [ticketId, refreshTrigger]);

  const loadAttachments = async () => {
    try {
      const data = await getAttachments(ticketId);
      setAttachments(data);
    } catch (err) {
      console.error("Failed to load attachments:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete an attachment
  const handleDelete = async (attachmentId) => {
    if (!window.confirm("Remove this attachment?")) return;
    try {
      await deleteAttachment(attachmentId);
      loadAttachments(); // refresh after delete
    } catch (err) {
      alert("Failed to delete attachment.");
    }
  };

  if (loading) return <p className="preview-loading">Loading attachments...</p>;
  if (attachments.length === 0) return <p className="no-attachments">No attachments uploaded.</p>;

  return (
    <div className="attachment-preview">
      <h3 className="preview-title">Attachments ({attachments.length})</h3>
      <div className="attachment-grid">
        {attachments.map((attachment) => (
          <div key={attachment.id} className="attachment-card">
            {/* Clickable image — opens full size in new tab */}
            <a
              href={`http://localhost:8081/${attachment.fileUrl}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={`http://localhost:8081/${attachment.fileUrl}`}
                alt={attachment.fileName}
                className="attachment-img"
              />
            </a>

            {/* File name */}
            <p className="attachment-name">{attachment.fileName}</p>

            {/* Delete button */}
            <button
              className="delete-attachment-btn"
              onClick={() => handleDelete(attachment.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AttachmentPreview;
