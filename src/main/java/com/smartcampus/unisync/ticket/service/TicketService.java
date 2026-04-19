package com.smartcampus.unisync.ticket.service;

import com.smartcampus.unisync.ticket.dto.TechnicianAssignDto;
import com.smartcampus.unisync.ticket.dto.TicketRequestDto;
import com.smartcampus.unisync.ticket.dto.TicketResponseDto;
import com.smartcampus.unisync.ticket.dto.TicketStatusUpdateDto;

import java.util.List;

/**
 * Service interface for Ticket operations.
 * Defines what actions can be performed on tickets.
 * The actual logic is written in TicketServiceImpl.
 */
public interface TicketService {

    // Create a new ticket (submitted by a user)
    TicketResponseDto createTicket(TicketRequestDto requestDto, Long reportedByUserId);

    // Get all tickets (used by admin to see everything)
    List<TicketResponseDto> getAllTickets();

    // Get a single ticket by its ID
    TicketResponseDto getTicketById(Long ticketId);

    // Get all tickets submitted by a specific user
    List<TicketResponseDto> getTicketsByUser(Long userId);

    // Get all tickets assigned to a specific technician
    List<TicketResponseDto> getTicketsByTechnician(Long technicianId);

    // Update the status of a ticket (e.g., OPEN → IN_PROGRESS)
    TicketResponseDto updateTicketStatus(Long ticketId, TicketStatusUpdateDto statusUpdateDto);

    // Assign a technician to a ticket
    TicketResponseDto assignTechnician(Long ticketId, TechnicianAssignDto technicianAssignDto);

    // Add resolution notes when a ticket is resolved
    TicketResponseDto addResolutionNotes(Long ticketId, String notes);
}
