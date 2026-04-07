package com.smartcampus.unisync.ticket.dto;

import com.smartcampus.unisync.common.enums.PriorityLevel;
import com.smartcampus.unisync.common.enums.TicketCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * DTO used when a user submits a new ticket.
 * Only contains the fields the user is allowed to fill in.
 */
@Data // Lombok: generates getters, setters, toString
public class TicketRequestDto {

    @NotBlank(message = "Title is required")
    private String title;             // Short title of the issue

    @NotNull(message = "Category is required")
    private TicketCategory category;  // Type of issue (e.g., ELECTRICAL, NETWORK)

    @NotBlank(message = "Description is required")
    private String description;       // Detailed explanation of the problem

    @NotNull(message = "Priority is required")
    private PriorityLevel priority;   // How urgent is this issue

    private String location;          // Where the issue is (optional)

    private String preferredContact;  // How user wants to be contacted (optional)

    private Long resourceId;          // Related resource/room ID (optional)
}
