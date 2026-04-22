import api from "./api";

// ─────────────────────────────────────────────────────────────────────────────
// TICKET SERVICE
// All API calls related to tickets, comments, and attachments go here.
// Each function returns the response data from the backend.
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────
// TICKET FUNCTIONS
// ─────────────────────────────────────────────────────────

/**
 * Build JSON the backend can deserialize: omit blank optional enums/strings
 * so Spring does not receive "" for ContactMethod.
 */
function buildCreateTicketPayload(ticketData) {
  const {
    title,
    category,
    description,
    priority,
    location,
    preferredContact,
    resourceId,
  } = ticketData;

  const payload = {
    title,
    category,
    description,
    priority,
  };

  if (location != null && String(location).trim() !== "") {
    payload.location = String(location).trim();
  }

  if (preferredContact != null && String(preferredContact).trim() !== "") {
    payload.preferredContact = String(preferredContact).trim();
  }

  if (resourceId != null && resourceId !== "" && !Number.isNaN(Number(resourceId))) {
    payload.resourceId = Number(resourceId);
  }

  return payload;
}

/**
 * Create a new ticket.
 * Called when a student submits the ticket form.
 *
 * @param {Object} ticketData - title, category, description, priority, location, etc.
 * @param {number} userId - ID of the logged-in user submitting the ticket
 */
export const createTicket = async (ticketData, userId) => {
  const payload = buildCreateTicketPayload(ticketData);
  const response = await api.post(`/tickets?userId=${userId}`, payload);
  return response.data;
};

/**
 * Get all tickets submitted by a specific user.
 * Called on the "My Tickets" page for students.
 *
 * @param {number} userId - ID of the logged-in student
 */
export const getMyTickets = async (userId) => {
  const response = await api.get(`/tickets/user/${userId}`);
  return response.data;
};

/**
 * Get all tickets in the system.
 * Called on the admin panel to see every ticket.
 */
export const getAllTickets = async () => {
  const response = await api.get("/tickets");
  return response.data;
};

/**
 * Get a single ticket by its ID.
 * Called when opening the ticket detail page.
 *
 * @param {number} ticketId - ID of the ticket to view
 */
export const getTicketById = async (ticketId) => {
  const response = await api.get(`/tickets/${ticketId}`);
  return response.data;
};

/**
 * Update the status of a ticket.
 * Called by admin or technician (e.g., OPEN → IN_PROGRESS → RESOLVED).
 *
 * @param {number} ticketId - ID of the ticket to update
 * @param {Object} statusData - { status, resolutionNotes, rejectedReason }
 */
export const updateTicketStatus = async (ticketId, statusData) => {
  const response = await api.patch(`/tickets/${ticketId}/status`, statusData);
  return response.data;
};

/**
 * Assign a technician to a ticket.
 * Called by admin when routing a ticket to a technician.
 *
 * @param {number} ticketId - ID of the ticket
 * @param {number} technicianId - ID of the technician to assign
 */
export const assignTechnician = async (ticketId, technicianId) => {
  const response = await api.patch(`/tickets/${ticketId}/assign/${technicianId}`);
  return response.data;
};

// ─────────────────────────────────────────────────────────
// ATTACHMENT FUNCTIONS
// ─────────────────────────────────────────────────────────

/**
 * Upload an image file and attach it to a ticket.
 * Uses FormData because we're sending a file — not JSON.
 * Allowed types: JPG, JPEG, PNG. Max 3 files per ticket.
 *
 * @param {number} ticketId - ID of the ticket to attach the file to
 * @param {File} file - The file object selected by the user
 */
export const uploadAttachment = async (ticketId, file) => {
  // FormData is required for file uploads — axios handles the Content-Type automatically
  const formData = new FormData();
  formData.append("file", file); // "file" must match the @RequestParam name in the controller

  const response = await api.post(`/tickets/${ticketId}/attachments`, formData, {
    headers: {
      "Content-Type": "multipart/form-data", // Override default JSON header for file upload
    },
  });
  return response.data;
};

/**
 * Upload multiple files for a ticket one by one.
 * Loops through the files array and calls uploadAttachment for each.
 *
 * @param {number} ticketId - ID of the ticket
 * @param {File[]} files - Array of file objects to upload
 */
export const uploadAttachments = async (ticketId, files) => {
  const results = [];
  for (const file of files) {
    const result = await uploadAttachment(ticketId, file);
    results.push(result);
  }
  return results;
};

/**
 * Get all attachments for a specific ticket.
 *
 * @param {number} ticketId - ID of the ticket
 */
export const getAttachments = async (ticketId) => {
  const response = await api.get(`/tickets/${ticketId}/attachments`);
  return response.data;
};

/**
 * Delete an attachment by its ID.
 * Removes the file from the server disk and from the database.
 *
 * @param {number} attachmentId - ID of the attachment to delete
 */
export const deleteAttachment = async (attachmentId) => {
  await api.delete(`/attachments/${attachmentId}`);
};

// ─────────────────────────────────────────────────────────
// COMMENT FUNCTIONS
// ─────────────────────────────────────────────────────────

/**
 * Add a comment to a ticket.
 *
 * @param {number} ticketId - ID of the ticket to comment on
 * @param {string} content - The comment text
 * @param {number} userId - ID of the logged-in user posting the comment
 */
export const addComment = async (ticketId, content, userId) => {
  const response = await api.post(
    `/tickets/${ticketId}/comments?userId=${userId}`,
    { content } // Matches CommentRequestDto fields
  );
  return response.data;
};

/**
 * Get all comments for a specific ticket.
 *
 * @param {number} ticketId - ID of the ticket
 */
export const getComments = async (ticketId) => {
  const response = await api.get(`/tickets/${ticketId}/comments`);
  return response.data;
};

/**
 * Update the text of an existing comment.
 * Only the comment's author can do this.
 *
 * @param {number} commentId - ID of the comment to update
 * @param {string} newContent - The updated comment text
 * @param {number} userId - Must match the comment author's ID
 */
export const updateComment = async (commentId, newContent, userId) => {
  const response = await api.put(
    `/comments/${commentId}?content=${encodeURIComponent(newContent)}&userId=${userId}`
  );
  return response.data;
};

/**
 * Delete a comment by its ID.
 * Only the comment's author can do this.
 *
 * @param {number} commentId - ID of the comment to delete
 * @param {number} userId - Must match the comment author's ID
 */
export const deleteComment = async (commentId, userId) => {
  await api.delete(`/comments/${commentId}?userId=${userId}`);
};
