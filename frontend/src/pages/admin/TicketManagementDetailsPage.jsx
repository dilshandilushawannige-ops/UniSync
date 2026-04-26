import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getTicketById,
  updateTicketStatus,
  assignTechnician,
  getComments,
  addComment,
  updateComment,
  deleteComment,
  getAttachments,
  uploadAttachment
} from "../../services/ticketService";
import { MdEdit, MdDelete, MdSync, MdPerson, MdAttachFile, MdChat } from "react-icons/md";
import AdminPortalLayout from "../../components/admin/AdminPortalLayout";
import { API_ORIGIN } from "../../config/apiConfig";
import "./TicketManagementDetailsPage.css";

function TicketManagementDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // Status update form state
  const [newStatus, setNewStatus] = useState("");

  // Technician assign form state
  const [technicianId, setTechnicianId] = useState("");

  const adminUserId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    fetchTicketData();
  }, [id]);

  const fetchTicketData = async () => {
    try {
      const [ticketData, commentsData, attachmentsData] = await Promise.all([
        getTicketById(id),
        getComments(id),
        getAttachments(id)
      ]);
      setTicket(ticketData);
      setComments(commentsData);
      setAttachments(attachmentsData);
      setNewStatus(ticketData.status);
    } catch (err) {
      setError("Failed to load ticket.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedTicket = await updateTicketStatus(id, { status: newStatus });
      setTicket(updatedTicket);
      Swal.fire({
        icon: 'success',
        title: 'Status Updated!',
        text: 'Ticket status has been updated successfully.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update status.',
        confirmButtonColor: '#2563EB'
      });
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!technicianId) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please enter a technician ID.',
        confirmButtonColor: '#2563EB'
      });
      return;
    }
    try {
      await assignTechnician(id, technicianId);
      fetchTicketData();
      Swal.fire({
        icon: 'success',
        title: 'Assigned!',
        text: 'Technician has been assigned successfully.',
        timer: 2000,
        showConfirmButton: false
      });
      setTechnicianId("");
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to assign technician.',
        confirmButtonColor: '#2563EB'
      });
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const posted = await addComment(id, newComment, adminUserId);
      setComments([...comments, posted]);
      setNewComment("");
    } catch (err) {
      alert("Failed to post comment.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleEditComment = async (commentId, currentContent) => {
    const result = await Swal.fire({
      title: 'Edit Comment',
      input: 'textarea',
      inputValue: currentContent,
      showCancelButton: true,
      confirmButtonText: 'Save',
      confirmButtonColor: '#2563EB'
    });

    if (result.isConfirmed && result.value) {
      try {
        const updated = await updateComment(commentId, result.value, adminUserId);
        setComments(comments.map(c => c.id === commentId ? updated : c));
      } catch (err) {
        Swal.fire('Error', 'Failed to edit comment', 'error');
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    const result = await Swal.fire({
      title: 'Delete Comment?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await deleteComment(commentId, adminUserId);
        setComments(comments.filter(c => c.id !== commentId));
      } catch (err) {
        Swal.fire('Error', 'Failed to delete comment', 'error');
      }
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const uploaded = await uploadAttachment(id, file);
      setAttachments([...attachments, uploaded]);
    } catch (err) {
      alert("Failed to upload attachment.");
    }
  };

  if (loading) return (
    <AdminPortalLayout title="Ticket Details">
      <p className="status-msg">Loading ticket...</p>
    </AdminPortalLayout>
  );
  
  if (error) return (
    <AdminPortalLayout title="Ticket Details">
      <p className="error-msg">{error}</p>
    </AdminPortalLayout>
  );

  const formattedDate = new Date(ticket.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
  const formattedTime = new Date(ticket.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: true
  });

  return (
    <AdminPortalLayout title={`Ticket #US-${ticket.id}`}>
      <div className="admin-ticket-detail-page">
        {/* Breadcrumb */}
        <div className="admin-breadcrumb">
          <Link to="/admin/dashboard" className="breadcrumb-link">Dashboard</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to="/admin/tickets" className="breadcrumb-link">Manage Tickets</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Ticket #US-{ticket.id}</span>
        </div>

        {/* Header Card */}
        <div className="admin-ticket-header-card">
          <div className="admin-ticket-header-top">
            <div className="admin-ticket-id-badge">
              #US-{ticket.id} <span className={`priority-label priority-${ticket.priority?.toLowerCase()}`}>! {ticket.priority}</span>
            </div>
            <div className={`admin-status-badge status-${ticket.status?.toLowerCase().replace('_', '-')}`}>
              {ticket.status?.replace('_', ' ')}
            </div>
          </div>
          <h1 className="admin-ticket-title">{ticket.title}</h1>

          <div className="admin-ticket-meta-grid">
            <div className="admin-meta-section">
              <h3>Description</h3>
              <p>{ticket.description}</p>
              
              {/* Category and Location moved here */}
              <div className="admin-ticket-details-row" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #E5E7EB' }}>
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Category</span>
                  <span className="admin-detail-value">{ticket.category}</span>
                </div>
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Location</span>
                  <span className="admin-detail-value">{ticket.location || "Engineering North, Lab C"}</span>
                </div>
              </div>
            </div>

            <div className="admin-meta-sidebar">
              <div className="admin-meta-item">
                <span className="admin-meta-label">REPORTED BY</span>
                <div className="admin-user-info">
                  <div className="admin-user-avatar">{ticket.reportedByName?.charAt(0) || "U"}</div>
                  <div>
                    <div className="admin-user-name">{ticket.reportedByName}</div>
                  </div>
                </div>
              </div>

              <div className="admin-meta-item">
                <span className="admin-meta-label">Assigned To</span>
                <div className="admin-user-info">
                  <div className="admin-user-avatar tech-avatar">{ticket.assignedTechnicianName?.charAt(0) || "?"}</div>
                  <div>
                    <div className="admin-user-name">{ticket.assignedTechnicianName || "Not assigned"}</div>
                  </div>
                </div>
              </div>

              <div className="admin-meta-item">
                <span className="admin-meta-label">Created</span>
                <div className="admin-meta-value">{formattedDate} at {formattedTime}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="admin-main-grid">
          {/* Left Column - Action Cards and Communication */}
          <div className="admin-left-section">
            {/* Action Cards Stacked */}
            <div className="admin-action-cards-stack">
              {/* Update Status Card */}
              <div className="admin-action-card admin-compact-card">
                <div className="admin-action-card-header">
                  <MdSync className="admin-action-icon" />
                  <h3>Update Status</h3>
                </div>
                <form onSubmit={handleStatusUpdate}>
                  <div className="admin-form-group">
                    <label>SELECT NEW STATUS</label>
                    <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="CLOSED">Closed</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                  <button type="submit" className="admin-action-btn">Update Status</button>
                </form>
              </div>

              {/* Assign Technician Card */}
              <div className="admin-action-card admin-compact-card">
                <div className="admin-action-card-header">
                  <MdPerson className="admin-action-icon-user" />
                  <h3>Assign Technician</h3>
                </div>
                <div className="admin-current-tech">
                  <div className="admin-tech-avatar-circle">
                    <MdPerson className="admin-tech-icon" />
                  </div>
                  <div className="admin-tech-info">
                    <span className="admin-current-label">Current Technician</span>
                    <span className="admin-current-value">
                      {ticket.assignedTechnicianName 
                        ? `${ticket.assignedTechnicianName} (ID: ${ticket.assignedTechnicianId || 'N/A'})`
                        : 'Not assigned'}
                    </span>
                  </div>
                </div>
                <form onSubmit={handleAssign}>
                  <div className="admin-form-group">
                    <label>TECHNICIAN USER ID</label>
                    <input
                      type="number"
                      placeholder="Enter ID e.g. 5582"
                      value={technicianId}
                      onChange={(e) => setTechnicianId(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="admin-action-btn">Assign Technician</button>
                </form>
              </div>
            </div>

            {/* Activity & Communication - Below Action Cards */}
            <div className="admin-section-card">
              <div className="admin-section-header">
                <MdChat className="admin-section-icon" />
                <h3>Activity & Communication</h3>
              </div>

              <div className="admin-comments-thread">
                {comments.map((comment) => {
                  const isAdmin = comment.authorRole === 'ADMIN';
                  const isTechnician = comment.authorRole === 'TECHNICIAN';
                  const isOwnComment = comment.authorId === adminUserId;
                  const time = new Date(comment.createdAt).toLocaleTimeString('en-US', {
                    hour: '2-digit', minute: '2-digit', hour12: true
                  });

                  return (
                    <div key={comment.id} className="admin-comment">
                      <div className="admin-comment-avatar">
                        {comment.authorName?.charAt(0) || "U"}
                      </div>
                      <div className="admin-comment-content">
                        <div className="admin-comment-header">
                          <span className="admin-comment-author">{comment.authorName}</span>
                          {(isAdmin || isTechnician) && (
                            <span className="admin-comment-badge">{isAdmin ? 'ADMIN' : 'TECHNICIAN'}</span>
                          )}
                          <span className="admin-comment-time">{time}</span>
                          {isOwnComment && (
                            <div className="admin-comment-actions">
                              <button onClick={() => handleEditComment(comment.id, comment.content)}>
                                <MdEdit />
                              </button>
                              <button onClick={() => handleDeleteComment(comment.id)}>
                                <MdDelete />
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="admin-comment-text">{comment.content}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <form className="admin-comment-form" onSubmit={handlePostComment}>
                <textarea
                  placeholder="Write a reply or internal note..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="admin-comment-form-actions">
                  <div className="admin-comment-tools">
                    <button type="button">📎</button>
                    <button type="button">@</button>
                  </div>
                  <button type="submit" className="admin-send-btn" disabled={submittingComment || !newComment.trim()}>
                    Send Message ➤
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Attachments */}
          <div className="admin-right-section">
            <div className="admin-action-card">
              <div className="admin-action-card-header">
                <MdAttachFile className="admin-section-icon" />
                <h3>Attachments</h3>
              </div>
              <div className="admin-attachments-grid">
                {attachments.map((file) => (
                  <div key={file.id} className="admin-attachment-item">
                    <img src={`${API_ORIGIN}${file.fileUrl}`} alt={file.fileName} />
                    <div className="admin-attachment-name">{file.fileName}</div>
                  </div>
                ))}
                <label className="admin-attachment-add">
                  <input type="file" style={{display: 'none'}} onChange={handleFileUpload} />
                  <div className="admin-add-icon">+</div>
                  <span>Add File</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminPortalLayout>
  );
}

export default TicketManagementDetailsPage;
