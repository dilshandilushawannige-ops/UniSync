package com.smartcampus.unisync.ticket.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * DTO used when admin assigns a technician to a ticket.
 * Sends just the technician's user ID — nothing more needed.
 */
@Data // Lombok: generates getters, setters, toString
public class TechnicianAssignDto {

    @NotNull(message = "Technician ID is required")
    private Long technicianId; // The ID of the user (technician) to assign
}
