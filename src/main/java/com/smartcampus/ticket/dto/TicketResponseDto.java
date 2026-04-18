package com.smartcampus.ticket.dto;

import com.smartcampus.common.enums.TicketPriority;
import com.smartcampus.common.enums.ContactMethod;
import com.smartcampus.common.enums.TicketCategory;
import com.smartcampus.common.enums.TicketStatus;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * DTO used when returning ticket data to the frontend.
 * Contains all the info needed to display a ticket — no validation needed here.
 */
@Data // Lombok: generates getters, setters, toString
public class TicketResponseDto {

    private Long id; // Ticket ID

    private String title; // Title of the issue
    private TicketCategory category; // Category (e.g., NETWORK)
    private String description; // Full description
    private TicketPriority priority; // Priority level
    private String location; // Where the issue is
    private String preferredContact; // How user wants to be contacted (as string)

    private TicketStatus status; // Current status (e.g., OPEN, IN_PROGRESS)
    private String resolutionNotes; // Notes added by technician when resolved
    private String rejectedReason; // Reason if ticket was rejected

    // Reporter info (the user who submitted the ticket)
    private Long reportedById;
    private String reportedByName; // Display name of the reporter

    // Technician info (who is assigned to fix it)
    private Long assignedTechnicianId;
    private String assignedTechnicianName; // Display name of the technician

    // Related resource (if any)
    private Long resourceId;
    private String resourceName; // Name of the room/lab/equipment

    private LocalDateTime createdAt; // When ticket was created
    private LocalDateTime updatedAt; // When ticket was last updated
}
