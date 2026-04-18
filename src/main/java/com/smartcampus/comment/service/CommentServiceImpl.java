package com.smartcampus.comment.service;

import com.smartcampus.comment.dto.CommentRequestDto;
import com.smartcampus.comment.dto.CommentResponseDto;
import com.smartcampus.comment.entity.Comment;
import com.smartcampus.comment.repository.CommentRepository;
import com.smartcampus.common.exception.ResourceNotFoundException;
import com.smartcampus.ticket.entity.Ticket;
import com.smartcampus.ticket.repository.TicketRepository;
import com.smartcampus.user.entity.User;
import com.smartcampus.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of CommentService.
 * Contains the actual business logic for comment operations.
 */
@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository; // From Member 4's user module

    // ─────────────────────────────────────────────────
    // ADD a new comment to a ticket
    // ─────────────────────────────────────────────────
    @Override
    public CommentResponseDto addComment(Long ticketId, CommentRequestDto requestDto, Long authorId) {

        // Check that the ticket exists
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with ID: " + ticketId));

        // Check that the user (author) exists
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + authorId));

        // Build the comment object
        Comment comment = new Comment();
        comment.setContent(requestDto.getContent());
        comment.setTicket(ticket);
        comment.setAuthor(author);

        // Save and return
        Comment saved = commentRepository.save(comment);
        return mapToDto(saved);
    }

    // ─────────────────────────────────────────────────
    // GET all comments for a ticket
    // ─────────────────────────────────────────────────
    @Override
    public List<CommentResponseDto> getCommentsByTicket(Long ticketId) {
        // Check ticket exists
        if (!ticketRepository.existsById(ticketId)) {
            throw new ResourceNotFoundException("Ticket not found with ID: " + ticketId);
        }

        // Get all comments for this ticket and convert to DTOs
        return commentRepository.findByTicketId(ticketId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────────
    // UPDATE a comment (only owner can edit)
    // ─────────────────────────────────────────────────
    @Override
    public CommentResponseDto updateComment(Long commentId, String newContent, Long requestingUserId) {

        // Find the comment
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with ID: " + commentId));

        // Check if the requesting user is the author of this comment
        if (!comment.getAuthor().getId().equals(requestingUserId)) {
            throw new RuntimeException("You are not allowed to edit this comment");
        }

        // Update the content
        comment.setContent(newContent);

        // Save and return
        return mapToDto(commentRepository.save(comment));
    }

    // ─────────────────────────────────────────────────
    // DELETE a comment (only owner can delete)
    // ─────────────────────────────────────────────────
    @Override
    public void deleteComment(Long commentId, Long requestingUserId) {

        // Find the comment
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with ID: " + commentId));

        // Check if the requesting user is the author
        if (!comment.getAuthor().getId().equals(requestingUserId)) {
            throw new RuntimeException("You are not allowed to delete this comment");
        }

        // Delete the comment
        commentRepository.delete(comment);
    }

    // ─────────────────────────────────────────────────
    // HELPER: Convert Comment entity → CommentResponseDto
    // ─────────────────────────────────────────────────
    private CommentResponseDto mapToDto(Comment comment) {
        CommentResponseDto dto = new CommentResponseDto();

        dto.setId(comment.getId());
        dto.setTicketId(comment.getTicket().getId());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());

        // Author details
        if (comment.getAuthor() != null) {
            dto.setAuthorId(comment.getAuthor().getId());
            dto.setAuthorName(comment.getAuthor().getFullName()); // from User entity
        }

        return dto;
    }
}
