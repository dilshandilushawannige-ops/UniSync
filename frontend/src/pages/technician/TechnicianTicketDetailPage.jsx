import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import TechnicianPortalLayout from "../../components/technician/TechnicianPortalLayout";
import { 
  getTicketById, 
  getComments, 
  addComment, 
  updateComment,
  deleteComment,
  updateTicketStatus,
  getAttachments, 
  uploadAttachment 
} from "../../services/ticketService";
import { API_ORIGIN } from "../../config/apiConfig";
import "./TechnicianTicketDetailPage.css";

function TechnicianTicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const currentUserId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketData, commentsData, attachmentsData] = await Promise.all([
          getTicketById(id),
          getComments(id),
          getAttachments(id)
        ]);
        setTicket(ticketData);
        setComments(commentsData);
        setAttachments(attachmentsData);
      } catch (err) {
        setError("Could not load ticket details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const posted = await addComment(id, newComment, currentUserId);
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
      inputLabel: 'Update your comment',
      inputValue: currentContent,
      inputAttributes: {
        'aria-label': 'Type your comment here'
      },
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#2563EB',
      cancelButtonColor: '#6B7280',
      inputValidator: (value) => {
        if (!value) {
          return 'Comment cannot be empty!';
        }
        if (value === currentContent) {
          return 'No changes made!';
        }
      }
    });

    if (result.isConfirmed && result.value) {
      try {
        const updatedComment = await updateComment(commentId, result.value, currentUserId);
        setComments(comments.map(c => c.id === commentId ? updatedComment : c));
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Your comment has been updated.',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (err) {
        console.error("Failed to edit comment:", err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update comment. Please try again.',
          confirmButtonColor: '#2563EB'
        });
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
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await deleteComment(commentId, currentUserId);
        setComments(comments.filter(c => c.id !== commentId));
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Your comment has been deleted.',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (err) {
        console.error("Failed to delete comment:", err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete comment. Please try again.',
          confirmButtonColor: '#2563EB'
        });
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

  const handleUpdateStatus = async () => {
    const result = await Swal.fire({
      title: 'Update Ticket Status',
      input: 'select',
      inputOptions: {
        'OPEN': 'Open',
        'IN_PROGRESS': 'In Progress',
        'RESOLVED': 'Resolved',
        'CLOSED': 'Closed'
      },
      inputValue: ticket.status,
      inputPlaceholder: 'Select a status',
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#2563EB',
      cancelButtonColor: '#6B7280',
      inputValidator: (value) => {
        if (!value) {
          return 'Please select a status!';
        }
        if (value === ticket.status) {
          return 'Status is already set to this value!';
        }
      }
    });

    if (result.isConfirmed && result.value) {
      try {
        console.log('Updating ticket status to:', result.value);
        const statusData = { status: result.value };
        console.log('Status data:', statusData);
        
        const updatedTicket = await updateTicketStatus(id, statusData);
        console.log('Updated ticket:', updatedTicket);
        
        setTicket(updatedTicket);
        
        Swal.fire({
          icon: 'success',
          title: 'Status Updated!',
          text: `Ticket status changed to ${result.value.replace('_', ' ')}`,
          timer: 2000,
          showConfirmButton: false
        });
      } catch (err) {
        console.error("Failed to update status:", err);
        console.error("Error details:", err.response?.data);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.response?.data?.message || 'Failed to update ticket status. Please try again.',
          confirmButtonColor: '#2563EB'
        });
      }
    }
  };

  if (loading) return (
    <TechnicianPortalLayout title="Ticket Details">
      <div className="tech-td-page"><p>Loading ticket...</p></div>
    </TechnicianPortalLayout>
  );

  if (error || !ticket) return (
    <TechnicianPortalLayout title="Error">
      <div className="tech-td-page"><p className="error-msg">{error || "Ticket not found."}</p></div>
    </TechnicianPortalLayout>
  );

  const formattedDate = new Date(ticket.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
  const formattedTime = new Date(ticket.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: true
  });

  const getPriorityClass = (priority) => {
    return `tech-priority-${priority?.toLowerCase() || 'low'}`;
  };

  return (
    <TechnicianPortalLayout title={`Ticket #US-${ticket.id}`}>
      <div className="tech-td-page">
        {/* Breadcrumb */}
        <div className="tech-td-breadcrumb">
          <Link to="/technician/dashboard" className="tech-breadcrumb-link">Dashboard</Link>
          <span className="tech-breadcrumb-separator">/</span>
          <Link to="/technician/tickets" className="tech-breadcrumb-link">Assigned Tickets</Link>
          <span className="tech-breadcrumb-separator">/</span>
          <span className="tech-breadcrumb-current">Ticket #US-{ticket.id}</span>
        </div>

        {/* Header */}
        <div className="tech-td-header">
          <div className="tech-td-header-left">
            <h1 className="tech-td-ticket-id">Ticket #US-{ticket.id}</h1>
            <p className="tech-td-reported-date">
              Reported on {formattedDate} • {formattedTime}
            </p>
          </div>
          <div className="tech-td-header-right">
            <div className={`tech-td-status-badge tech-status-${ticket.status.toLowerCase().replace('_', '-')}`}>
              {ticket.status === 'IN_PROGRESS' ? 'In Progress' : ticket.status}
            </div>
            <button className="tech-td-btn-update" onClick={handleUpdateStatus}>
              Update Status
            </button>
          </div>
        </div>

        <div className="tech-td-layout-grid">
          {/* Left Column */}
          <div className="tech-td-left-col">
            
            {/* Ticket Info Card */}
            <div className="tech-td-card tech-td-info-card">
              <h2 className="tech-td-subject">{ticket.title}</h2>
              
              <div className="tech-td-info-grid">
                <div className="tech-td-info-item">
                  <span className="tech-td-info-label">CATEGORY</span>
                  <span className="tech-td-info-value">{ticket.category || "Network & Connectivity"}</span>
                </div>
                
                <div className="tech-td-info-item">
                  <span className="tech-td-info-label">PRIORITY</span>
                  <span className={`tech-td-info-value ${getPriorityClass(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </div>

                <div className="tech-td-info-item">
                  <span className="tech-td-info-label">LOCATION</span>
                  <span className="tech-td-info-value">{ticket.location || "Sterling Hall - Room 302"}</span>
                </div>

                <div className="tech-td-info-item">
                  <span className="tech-td-info-label">CONTACT</span>
                  <span className="tech-td-info-value">{ticket.preferredContact || "m.smith@university.edu"}</span>
                </div>

                <div className="tech-td-info-item">
                  <span className="tech-td-info-label">REPORTED BY</span>
                  <div className="tech-td-user-info">
                    <div className="tech-td-user-avatar">
                      {ticket.reportedByName?.charAt(0) || "M"}
                    </div>
                    <span className="tech-td-user-name">{ticket.reportedByName || "Maya Smith"}</span>
                  </div>
                </div>

                <div className="tech-td-info-item">
                  <span className="tech-td-info-label">ASSIGNED TO</span>
                  <div className="tech-td-user-info">
                    <div className="tech-td-user-avatar tech-avatar">
                      {ticket.assignedTechnicianName?.charAt(0) || "D"}
                    </div>
                    <span className="tech-td-user-name">{ticket.assignedTechnicianName || "David Chen"}</span>
                  </div>
                </div>
              </div>

              <div className="tech-td-description-box">
                <h3 className="tech-td-desc-title">Description</h3>
                <p className="tech-td-desc-text">{ticket.description}</p>
              </div>
            </div>

            {/* Communication Thread */}
            <div className="tech-td-card tech-td-thread-card">
              <div className="tech-td-sec-header">
                <span className="tech-td-sec-title">Communication Thread</span>
              </div>

              <div className="tech-td-thread">
                {comments.map((comment) => {
                  const isTechnician = comment.authorRole === 'TECHNICIAN' || comment.authorRole === 'ADMIN';
                  const isOwnComment = comment.authorId === currentUserId;
                  const time = new Date(comment.createdAt).toLocaleTimeString('en-US', {
                    hour: '2-digit', minute: '2-digit', hour12: true
                  });
                  const dateStr = new Date(comment.createdAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', hour12: true
                  });

                  return (
                    <div key={comment.id} className={`tech-td-message ${isTechnician ? 'tech-td-msg-technician' : 'tech-td-msg-student'}`}>
                      <div className="tech-td-msg-avatar">
                        {comment.authorName?.charAt(0) || "U"}
                      </div>
                      <div className="tech-td-msg-content">
                        <div className="tech-td-msg-header">
                          <span className="tech-td-msg-author">{comment.authorName}</span>
                          {isTechnician && <span className="tech-td-role-badge">TECHNICIAN</span>}
                          <span className="tech-td-msg-time">{dateStr}, {time}</span>
                          {isOwnComment && (
                            <div className="tech-td-msg-actions">
                              <button 
                                className="tech-td-msg-action-btn tech-edit-btn"
                                onClick={() => handleEditComment(comment.id, comment.content)}
                                title="Edit"
                              >
                                <MdEdit />
                              </button>
                              <button 
                                className="tech-td-msg-action-btn tech-delete-btn"
                                onClick={() => handleDeleteComment(comment.id)}
                                title="Delete"
                              >
                                <MdDelete />
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="tech-td-msg-text">
                          {comment.content}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {comments.length === 0 && (
                  <p style={{ textAlign: 'center', color: '#9CA3AF', padding: '20px' }}>
                    No comments yet. Be the first to comment!
                  </p>
                )}

                <div className="tech-td-msg-system">
                  <div className="tech-td-system-icon">⚙</div>
                  <div className="tech-td-system-text">
                    System: Technician {ticket.assignedTechnicianName || "David Chen"} marked status as 'In Progress'
                  </div>
                  <div className="tech-td-system-time">{formattedTime}</div>
                </div>
              </div>

              {/* Comment Input */}
              <form className="tech-td-comment-input-area" onSubmit={handlePostComment}>
                <textarea 
                  className="tech-td-textarea" 
                  placeholder="Write a reply or internal note..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="tech-td-input-actions">
                  <div className="tech-td-input-tools">
                    <button type="button" className="tech-td-tool-btn">📎</button>
                    <button type="button" className="tech-td-tool-btn">@</button>
                  </div>
                  <button 
                    type="submit" 
                    className="tech-td-btn-send"
                    disabled={submittingComment || !newComment.trim()}
                  >
                    Send Message ➤
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column */}
          <div className="tech-td-right-col">
            <div className="tech-td-card tech-td-attachments-card">
              <div className="tech-td-sec-header">
                <span className="tech-td-sec-title">Attachments</span>
                <span className="tech-td-sec-count">{attachments.length} Files</span>
              </div>
              
              <div className="tech-td-attachments-grid">
                {attachments.map((file) => (
                  <div key={file.id} className="tech-td-attachment-item">
                    <img src={`${API_ORIGIN}${file.fileUrl}`} alt={file.fileName} />
                    <div className="tech-td-attachment-name">{file.fileName}</div>
                  </div>
                ))}
                
                <label className="tech-td-attachment-add-box">
                  <input type="file" style={{display: 'none'}} onChange={handleFileUpload} />
                  <div className="tech-td-add-icon-circle">+</div>
                  <span className="tech-td-add-text">Add Attachment</span>
                </label>
              </div>
            </div>
          </div>

        </div>
      </div>
    </TechnicianPortalLayout>
  );
}

export default TechnicianTicketDetailPage;
