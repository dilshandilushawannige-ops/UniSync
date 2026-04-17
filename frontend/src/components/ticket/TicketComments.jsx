import { useState, useEffect } from "react";
import { getComments, addComment } from "../../services/ticketService";
import CommentItem from "./CommentItem";
import "./TicketComments.css";

/**
 * Displays all comments for a ticket and allows adding new ones.
 * Used on TicketDetailsPage.
 *
 * Props:
 *   ticketId (number)      — ID of the ticket
 *   currentUserId (number) — ID of the logged-in user
 */
function TicketComments({ ticketId, currentUserId }) {
  const [comments, setComments] = useState([]);     // list of comments from API
  const [newComment, setNewComment] = useState(""); // text in the input box
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load comments when the component mounts
  useEffect(() => {
    loadComments();
  }, [ticketId]);

  const loadComments = async () => {
    try {
      const data = await getComments(ticketId);
      setComments(data);
    } catch (err) {
      console.error("Failed to load comments:", err);
    } finally {
      setLoading(false);
    }
  };

  // Submit a new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return; // ignore empty input
    setSubmitting(true);
    try {
      await addComment(ticketId, newComment, currentUserId);
      setNewComment(""); // clear input
      loadComments();    // refresh the list
    } catch (err) {
      alert("Failed to post comment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ticket-comments">
      <h3 className="comments-title">Comments ({comments.length})</h3>

      {/* Loading state */}
      {loading ? (
        <p className="comments-loading">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="no-comments">No comments yet. Be the first to comment!</p>
      ) : (
        /* Render each comment */
        comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            currentUserId={currentUserId}
            onCommentUpdated={loadComments}
          />
        ))
      )}

      {/* Add new comment form */}
      <form className="comment-form" onSubmit={handleAddComment}>
        <textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
          required
        />
        <button type="submit" className="post-btn" disabled={submitting}>
          {submitting ? "Posting..." : "Post Comment"}
        </button>
      </form>
    </div>
  );
}

export default TicketComments;
