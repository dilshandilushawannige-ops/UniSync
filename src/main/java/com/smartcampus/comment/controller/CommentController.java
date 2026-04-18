package com.smartcampus.comment.controller;

import com.smartcampus.comment.dto.CommentRequestDto;
import com.smartcampus.comment.dto.CommentResponseDto;
import com.smartcampus.comment.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Comment module.
 * Handles all HTTP requests related to comments on tickets.
 * Delegates logic to CommentService.
 */
@RestController
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    // ─────────────────────────────────────────────────────────
    // POST /api/tickets/{ticketId}/comments
    // Add a new comment to a ticket
    // Called by: any logged-in user (student, technician, admin)
    // ─────────────────────────────────────────────────────────
    @PostMapping("/api/tickets/{ticketId}/comments")
    public ResponseEntity<CommentResponseDto> addComment(
            @PathVariable Long ticketId,
            @Valid @RequestBody CommentRequestDto requestDto,
            @RequestParam Long userId // The ID of the logged-in user posting the comment
    ) {
        CommentResponseDto response = commentService.addComment(ticketId, requestDto, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response); // 201 Created
    }

    // ─────────────────────────────────────────────────────────
    // GET /api/tickets/{ticketId}/comments
    // Get all comments for a specific ticket
    // Called by: anyone viewing the ticket details page
    // ─────────────────────────────────────────────────────────
    @GetMapping("/api/tickets/{ticketId}/comments")
    public ResponseEntity<List<CommentResponseDto>> getCommentsByTicket(
            @PathVariable Long ticketId
    ) {
        List<CommentResponseDto> comments = commentService.getCommentsByTicket(ticketId);
        return ResponseEntity.ok(comments); // 200 OK
    }

    // ─────────────────────────────────────────────────────────
    // PUT /api/comments/{commentId}
    // Update an existing comment
    // Rule: only the comment owner can update their own comment
    // ─────────────────────────────────────────────────────────
    @PutMapping("/api/comments/{commentId}")
    public ResponseEntity<CommentResponseDto> updateComment(
            @PathVariable Long commentId,
            @RequestParam String content,   // New comment text
            @RequestParam Long userId       // Must match the comment author
    ) {
        CommentResponseDto updated = commentService.updateComment(commentId, content, userId);
        return ResponseEntity.ok(updated); // 200 OK
    }

    // ─────────────────────────────────────────────────────────
    // DELETE /api/comments/{commentId}
    // Delete a comment
    // Rule: only the comment owner can delete their own comment
    // ─────────────────────────────────────────────────────────
    @DeleteMapping("/api/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            @RequestParam Long userId       // Must match the comment author
    ) {
        commentService.deleteComment(commentId, userId);
        return ResponseEntity.noContent().build(); // 204 No Content (success, nothing to return)
    }
}
