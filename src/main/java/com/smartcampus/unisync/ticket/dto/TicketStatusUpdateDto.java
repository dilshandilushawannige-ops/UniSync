package com.smartcampus.unisync.ticket.dto;

import com.smartcampus.unisync.common.enums.TicketStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * DTO used when admin or technician updates the status of a ticket.
 * For example: changing from OPEN → IN_PROGRESS, or RESOLVED → CLOSED.
 */
@Data // Lombok: generates getters, setters, toString
public class TicketStatusUpdateDto {

    @NotNull(message = "Status is required")
    private TicketStatus status;     // The new status to set on the ticket

    private String resolutionNotes;  // Optional: technician notes when resolving
    private String rejectedReason;   // Optional: reason if status is set to REJECTED
}
