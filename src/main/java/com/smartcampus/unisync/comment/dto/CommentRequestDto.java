package com.smartcampus.unisync.comment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * DTO used when a user or technician posts a new comment on a ticket.
 */
@Data // Lombok: generates getters, setters, toString
public class CommentRequestDto {

    @NotNull(message = "Ticket ID is required")
    private Long ticketId;             // Which ticket this comment belongs to

    @NotBlank(message = "Comment text is required")
    private String content;            // The actual comment message
}
