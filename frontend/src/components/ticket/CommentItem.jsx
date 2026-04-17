import { useState } from "react";
import { updateComment, deleteComment } from "../../services/ticketService";
import "./CommentItem.css";

/**
 * Displays a single comment with edit and delete functionality.
 * Used inside TicketComments.
 *
 * Props:
 *   comment (object)      — the comment data from API
 *   currentUserId (number)— logged-in user's ID (to check ownership)
 *   onCommentUpdated (func) — called after edit/delete to refresh list
 */
function CommentItem({ comment, currentUserId, onCommentUpdated }) {
  const [isEditing, setIsEditing] = useState(false);     // toggle edit mode
  const [editedText, setEditedText] = useState(comment.content); // holds edited text

  // Check if the current user is the author of this comment
  const isOwner = currentUserId === comment.authorId;

  // Save the edited comment
  const handleUpdate = async () => {
    try {
      await updateComment(comment.id, editedText, currentUserId);
      setIsEditing(false);
      onCommentUpdated(); // refresh the comment list
    } catch (err) {
      alert("Failed to update comment.");
    }
  };

  // Delete the comment
  const handleDelete = async () => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await deleteComment(comment.id, currentUserId);
      onCommentUpdated(); // refresh the comment list
    } catch (err) {
      alert("Failed to delete comment.");
    }
  };

  return (
    <div className="comment-item">
      {/* Author name and timestamp */}
      <div className="comment-meta">
        <span className="comment-author">{comment.authorName}</span>
        <span className="comment-time">
          {new Date(comment.createdAt).toLocaleString()}
        </span>
      </div>

      {/* Edit mode: show textarea, save/cancel buttons */}
      {isEditing ? (
        <div className="comment-edit">
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            rows={3}
          />
          <div className="edit-actions">
            <button className="btn-save" onClick={handleUpdate}>Save</button>
            <button className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        /* Normal mode: show comment text */
        <p className="comment-content">{comment.content}</p>
      )}

      {/* Edit/Delete buttons — only shown to the comment owner */}
      {isOwner && !isEditing && (
        <div className="comment-actions">
          <button className="btn-edit" onClick={() => setIsEditing(true)}>Edit</button>
          <button className="btn-delete" onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
}

export default CommentItem;
