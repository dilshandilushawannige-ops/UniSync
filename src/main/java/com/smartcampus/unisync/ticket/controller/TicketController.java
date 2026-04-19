package com.smartcampus.unisync.ticket.controller;

import com.smartcampus.unisync.ticket.dto.TechnicianAssignDto;
import com.smartcampus.unisync.ticket.dto.TicketRequestDto;
import com.smartcampus.unisync.ticket.dto.TicketResponseDto;
import com.smartcampus.unisync.ticket.dto.TicketStatusUpdateDto;
import com.smartcampus.unisync.ticket.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Ticket module.
 * Handles all HTTP requests related to tickets.
 * Delegates actual logic to TicketService.
 */
@RestController
@RequestMapping("/api/tickets") // Base URL for all endpoints in this controller
@RequiredArgsConstructor        // Lombok: injects TicketService via constructor
public class TicketController {

    private final TicketService ticketService;

    // ─────────────────────────────────────────────────────────
    // POST /api/tickets
    // Create a new ticket
    // Called by: student when submitting a new issue
    // ─────────────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<TicketResponseDto> createTicket(
            @Valid @RequestBody TicketRequestDto requestDto,
            @RequestParam Long userId // The ID of the logged-in user submitting the ticket
    ) {
        TicketResponseDto response = ticketService.createTicket(requestDto, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response); // 201 Created
    }

    // ─────────────────────────────────────────────────────────
    // GET /api/tickets
    // Get all tickets
    // Called by: admin to view all tickets in the system
    // ─────────────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<List<TicketResponseDto>> getAllTickets() {
        List<TicketResponseDto> tickets = ticketService.getAllTickets();
        return ResponseEntity.ok(tickets); // 200 OK
    }

    // ─────────────────────────────────────────────────────────
    // GET /api/tickets/{id}
    // Get a single ticket by ID
    // Called by: anyone viewing a specific ticket's details
    // ─────────────────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<TicketResponseDto> getTicketById(@PathVariable Long id) {
        TicketResponseDto ticket = ticketService.getTicketById(id);
        return ResponseEntity.ok(ticket); // 200 OK
    }

    // ─────────────────────────────────────────────────────────
    // GET /api/tickets/user/{userId}
    // Get all tickets submitted by a specific user
    // Called by: student to see their own tickets
    // ─────────────────────────────────────────────────────────
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TicketResponseDto>> getTicketsByUser(@PathVariable Long userId) {
        List<TicketResponseDto> tickets = ticketService.getTicketsByUser(userId);
        return ResponseEntity.ok(tickets); // 200 OK
    }

    // ─────────────────────────────────────────────────────────
    // GET /api/tickets/technician/{technicianId}
    // Get all tickets assigned to a specific technician
    // Called by: technician to see their assigned tickets
    // ─────────────────────────────────────────────────────────
    @GetMapping("/technician/{technicianId}")
    public ResponseEntity<List<TicketResponseDto>> getTicketsByTechnician(@PathVariable Long technicianId) {
        List<TicketResponseDto> tickets = ticketService.getTicketsByTechnician(technicianId);
        return ResponseEntity.ok(tickets); // 200 OK
    }

    // ─────────────────────────────────────────────────────────
    // PATCH /api/tickets/{id}/status
    // Update the status of a ticket
    // Called by: admin or technician (e.g., OPEN → IN_PROGRESS → RESOLVED)
    // ─────────────────────────────────────────────────────────
    @PatchMapping("/{id}/status")
    public ResponseEntity<TicketResponseDto> updateTicketStatus(
            @PathVariable Long id,
            @Valid @RequestBody TicketStatusUpdateDto statusUpdateDto
    ) {
        TicketResponseDto updated = ticketService.updateTicketStatus(id, statusUpdateDto);
        return ResponseEntity.ok(updated); // 200 OK
    }

    // ─────────────────────────────────────────────────────────
    // PATCH /api/tickets/{id}/assign/{technicianId}
    // Assign a technician to a ticket
    // Called by: admin when routing the ticket to a technician
    // ─────────────────────────────────────────────────────────
    @PatchMapping("/{id}/assign/{technicianId}")
    public ResponseEntity<TicketResponseDto> assignTechnician(
            @PathVariable Long id,
            @PathVariable Long technicianId
    ) {
        // Build the DTO from the path variable
        TechnicianAssignDto assignDto = new TechnicianAssignDto();
        assignDto.setTechnicianId(technicianId);

        TicketResponseDto updated = ticketService.assignTechnician(id, assignDto);
        return ResponseEntity.ok(updated); // 200 OK
    }

    // ─────────────────────────────────────────────────────────
    // PATCH /api/tickets/{id}/resolution-notes
    // Add resolution notes to a ticket
    // Called by: technician after fixing the issue
    // ─────────────────────────────────────────────────────────
    @PatchMapping("/{id}/resolution-notes")
    public ResponseEntity<TicketResponseDto> addResolutionNotes(
            @PathVariable Long id,
            @RequestParam String notes // Notes passed as a query parameter
    ) {
        TicketResponseDto updated = ticketService.addResolutionNotes(id, notes);
        return ResponseEntity.ok(updated); // 200 OK
    }
}
