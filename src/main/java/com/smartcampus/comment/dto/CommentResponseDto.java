package com.smartcampus.comment.dto;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * DTO used when returning comment data to the frontend.
 * Includes who wrote the comment and when.
 */
@Data // Lombok: generates getters, setters, toString
public class CommentResponseDto {

    private Long id;               // Comment ID
    private Long ticketId;         // Which ticket this comment belongs to
    private String content;        // The comment text

    // Author info
    private Long authorId;         // User ID of who wrote the comment
    private String authorName;     // Display name of the comment author

    private LocalDateTime createdAt; // When the comment was posted
}
