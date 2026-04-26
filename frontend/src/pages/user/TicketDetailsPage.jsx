import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import StudentPortalLayout from "../../components/user/StudentPortalLayout";
import { 
  getTicketById, 
  getComments, 
  addComment, 
  getAttachments, 
  uploadAttachment 
} from "../../services/ticketService";
import { 
  MdOutlineDashboard, 
  MdChevronRight, 
  MdPerson, 
  MdComputer, 
  MdErrorOutline, 
  MdLocationOn, 
  MdEmail, 
  MdHistory,
  MdAddCircleOutline
} from "react-icons/md";
import { FiSend, FiPaperclip, FiSmile } from "react-icons/fi";
import { API_ORIGIN } from "../../config/apiConfig";
import "./TicketDetailsPage.css";

function TicketDetailsPage() {
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
    <StudentPortalLayout title="Ticket Details">
      <div className="td-page"><p>Loading ticket...</p></div>
    </StudentPortalLayout>
  );

  if (error || !ticket) return (
    <StudentPortalLayout title="Error">
      <div className="td-page"><p className="error-msg">{error || "Ticket not found."}</p></div>
    </StudentPortalLayout>
  );

  const formattedDate = new Date(ticket.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
  const formattedTime = new Date(ticket.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <StudentPortalLayout title="Ticket Details">
      <div className="td-page">
        {/* ─── Breadcrumb ─── */}
        <div className="td-breadcrumb">
          <MdOutlineDashboard className="td-bc-icon" />
          <Link to="/dashboard" className="td-bc-link">Dashboard</Link>
          <MdChevronRight className="td-bc-sep" />
          <Link to="/my-tickets" className="td-bc-link">My Tickets</Link>
          <MdChevronRight className="td-bc-sep" />
          <span className="td-bc-current">Ticket #US-{ticket.id}</span>
        </div>

        {/* ─── Header ─── */}
        <div className="td-header">
          <div className="td-header-left">
            <h1 className="td-ticket-id">Ticket #US-{ticket.id}</h1>
            <p className="td-reported-date">
              Reported on {formattedDate} • {formattedTime}
            </p>
          </div>
          <div className="td-header-right">
            <div className={`td-status-badge td-status-${ticket.status.toLowerCase().replace('_', '-')}`}>
              {ticket.status.replace('_', ' ')}
            </div>
            <button className="td-btn-update">Update Ticket</button>
          </div>
        </div>

        <div className="td-layout-grid">
          {/* ─── Left Column ─── */}
          <div className="td-left-col">
            
            {/* Ticket Info Card */}
            <div className="td-card td-info-card">
              <h2 className="td-subject">{ticket.title}</h2>
              
              <div className="td-info-grid">
                <div className="td-info-item">
                  <span className="td-info-label">CATEGORY</span>
                  <span className="td-info-value">{ticket.category}</span>
                </div>
                
                <div className="td-info-item">
                  <span className="td-info-label">PRIORITY</span>
                  <span className={`td-info-value td-priority-${ticket.priority.toLowerCase()}`}>
                    <span className="td-priority-icon">!</span> {ticket.priority.charAt(0) + ticket.priority.slice(1).toLowerCase()}
                  </span>
                </div>

                <div className="td-info-item">
                  <span className="td-info-label">LOCATION</span>
                  <span className="td-info-value">{ticket.location || "Sterling Hall - Room 302"}</span>
                </div>

                <div className="td-info-item">
                  <span className="td-info-label">CONTACT</span>
                  <span className="td-info-value">{ticket.preferredContact || "m.smith@university.edu"}</span>
                </div>

                <div className="td-info-item">
                  <span className="td-info-label">REPORTED BY</span>
                  <div className="td-info-value">
                    <div className="td-user-info">
                      <div className="td-user-avatar student">
                        <MdPerson />
                      </div>
                      <span className="td-user-name">{ticket.reportedByName} (Student)</span>
                    </div>
                  </div>
                </div>

                <div className="td-info-item">
                  <span className="td-info-label">ASSIGNED TO</span>
                  <div className="td-info-value">
                    <div className="td-user-info">
                      <div className="td-user-avatar technician">
                        <MdComputer />
                      </div>
                      <span className="td-user-name">{ticket.assignedTechnicianName || "David Chen (IT Specialist)"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="td-description-box">
                <h3 className="td-desc-title">Description</h3>
                <p className="td-desc-text">{ticket.description}</p>
              </div>
            </div>

            {/* Communication Thread */}
            <div className="td-card td-thread-card">
              <div className="td-sec-header">
                <span className="td-sec-title">Communication Thread</span>
              </div>

              <div className="td-thread">
                {comments.map((comment) => {
                  const isTechnician = comment.authorRole === 'TECHNICIAN' || comment.authorRole === 'ADMIN';
                  const time = new Date(comment.createdAt).toLocaleTimeString('en-US', {
                    hour: '2-digit', minute: '2-digit', hour12: true
                  });
                  const dateStr = new Date(comment.createdAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric'
                  });

                  return (
                    <div key={comment.id} className={`td-message ${isTechnician ? 'td-msg-technician' : 'td-msg-student'}`}>
                      <div className="td-msg-avatar">
                        {comment.authorName?.charAt(0) || "U"}
                      </div>
                      <div className="td-msg-content">
                        <div className="td-msg-header">
                          <span className="td-msg-author">{comment.authorName}</span>
                          {isTechnician && <span className="td-role-badge">TECHNICIAN</span>}
                          <span className="td-msg-time">{dateStr}, {time}</span>
                        </div>
                        <div className="td-msg-bubble">
                          {comment.content}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="td-msg-system">
                  <div className="td-system-icon"><MdHistory /></div>
                  <div className="td-system-text">
                    System: Technician {ticket.assignedTechnicianName || "David Chen"} marked status as '{ticket.status.replace('_', ' ')}'
                  </div>
                  <div className="td-system-time">{formattedTime}</div>
                </div>
              </div>

              {/* Comment Input */}
              <form className="td-comment-input-area" onSubmit={handlePostComment}>
                <textarea 
                  className="td-textarea" 
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="td-input-actions">
                  <div className="td-input-tools">
                    <button type="button" className="td-tool-btn"><FiPaperclip /></button>
                    <button type="button" className="td-tool-btn"><FiSmile /></button>
                  </div>
                  <button 
                    type="submit" 
                    className="td-btn-send"
                    disabled={submittingComment || !newComment.trim()}
                  >
                    {submittingComment ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* ─── Right Column ─── */}
          <div className="td-right-col">
            <div className="td-card td-attachments-card">
              <div className="td-sec-header">
                <span className="td-sec-title">Attachments</span>
                <span className="td-sec-count">{attachments.length} Files</span>
              </div>
              
              <div className="td-attachments-grid">
                {attachments.map((file) => (
                  <div key={file.id} className="td-attachment-item">
                    <img src={`${API_ORIGIN}${file.fileUrl}`} alt={file.fileName} />
                    <div className="td-attachment-overlay">{file.fileName}</div>
                  </div>
                ))}
                
                <label className="td-attachment-add-box">
                  <input type="file" style={{display: 'none'}} onChange={handleFileUpload} />
                  <div className="td-add-icon-circle">
                    <MdAddCircleOutline />
                  </div>
                  <span className="td-add-text">Add Attachment</span>
                </label>
              </div>
            </div>
          </div>

        </div>
      </div>
    </StudentPortalLayout>
  );
}

export default TicketDetailsPage;
