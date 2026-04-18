package com.smartcampus.comment.service;

import com.smartcampus.comment.dto.CommentRequestDto;
import com.smartcampus.comment.dto.CommentResponseDto;

import java.util.List;

/**
 * Service interface for Comment operations.
 * Defines what actions can be done on comments.
 * Actual logic is written in CommentServiceImpl.
 */
public interface CommentService {

    // Add a new comment to a ticket
    CommentResponseDto addComment(Long ticketId, CommentRequestDto requestDto, Long authorId);

    // Get all comments for a specific ticket
    List<CommentResponseDto> getCommentsByTicket(Long ticketId);

    // Update an existing comment (only the owner can do this)
    CommentResponseDto updateComment(Long commentId, String newContent, Long requestingUserId);

    // Delete a comment (only the owner can do this)
    void deleteComment(Long commentId, Long requestingUserId);
}
