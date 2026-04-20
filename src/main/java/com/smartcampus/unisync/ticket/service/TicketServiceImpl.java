package com.smartcampus.unisync.ticket.service;

import com.smartcampus.unisync.common.exception.ResourceNotFoundException;
import com.smartcampus.unisync.common.enums.TicketStatus;
import com.smartcampus.unisync.ticket.dto.TechnicianAssignDto;
import com.smartcampus.unisync.ticket.dto.TicketRequestDto;
import com.smartcampus.unisync.ticket.dto.TicketResponseDto;
import com.smartcampus.unisync.ticket.dto.TicketStatusUpdateDto;
import com.smartcampus.unisync.ticket.entity.Ticket;
import com.smartcampus.unisync.ticket.repository.TicketRepository;
import com.smartcampus.unisync.user.entity.User;
import com.smartcampus.unisync.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of TicketService.
 * Contains all the actual business logic for ticket operations.
 */
@Service
@RequiredArgsConstructor // Lombok: generates constructor for all final fields (used for injection)
public class TicketServiceImpl implements TicketService {

    // Injected automatically by Spring (via constructor injection)
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository; // From Member 4's user module

    // ─────────────────────────────────────────────────
    // CREATE a new ticket
    // ─────────────────────────────────────────────────
    @Override
    public TicketResponseDto createTicket(TicketRequestDto requestDto, Long reportedByUserId) {

        // Find the user who is submitting the ticket
        User reporter = userRepository.findById(reportedByUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + reportedByUserId));

        // Build a new Ticket object from the request data
        Ticket ticket = new Ticket();
        ticket.setTitle(requestDto.getTitle());
        ticket.setCategory(requestDto.getCategory());
        ticket.setDescription(requestDto.getDescription());
        ticket.setPriority(requestDto.getPriority());
        ticket.setLocation(requestDto.getLocation());
        ticket.setPreferredContact(requestDto.getPreferredContact());
        ticket.setStatus(TicketStatus.OPEN); // Every new ticket starts as OPEN
        ticket.setReportedBy(reporter);

        // Save the ticket to the database
        Ticket savedTicket = ticketRepository.save(ticket);

        // Convert to DTO and return
        return mapToDto(savedTicket);
    }

    // ─────────────────────────────────────────────────
    // GET all tickets (admin view)
    // ─────────────────────────────────────────────────
    @Override
    public List<TicketResponseDto> getAllTickets() {
        // Get all tickets from DB with relationships eagerly loaded
        return ticketRepository.findAllWithRelations()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────────
    // GET a single ticket by ID
    // ─────────────────────────────────────────────────
    @Override
    public TicketResponseDto getTicketById(Long ticketId) {
        // Look for the ticket with relationships eagerly loaded
        Ticket ticket = ticketRepository.findByIdWithRelations(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with ID: " + ticketId));

        return mapToDto(ticket);
    }

    // ─────────────────────────────────────────────────
    // GET all tickets submitted by a specific user
    // ─────────────────────────────────────────────────
    @Override
    public List<TicketResponseDto> getTicketsByUser(Long userId) {
        return ticketRepository.findByReportedByIdWithRelations(userId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────────
    // GET all tickets assigned to a specific technician
    // ─────────────────────────────────────────────────
    @Override
    public List<TicketResponseDto> getTicketsByTechnician(Long technicianId) {
        return ticketRepository.findByAssignedTechnicianIdWithRelations(technicianId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────────
    // UPDATE ticket status (admin or technician)
    // ─────────────────────────────────────────────────
    @Override
    public TicketResponseDto updateTicketStatus(Long ticketId, TicketStatusUpdateDto statusUpdateDto) {
        // Find the ticket
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with ID: " + ticketId));

        // Update the status
        ticket.setStatus(statusUpdateDto.getStatus());

        // If resolution notes are provided, save them
        if (statusUpdateDto.getResolutionNotes() != null) {
            ticket.setResolutionNotes(statusUpdateDto.getResolutionNotes());
        }

        // If rejected reason is provided, save it
        if (statusUpdateDto.getRejectedReason() != null) {
            ticket.setRejectedReason(statusUpdateDto.getRejectedReason());
        }

        // Save updated ticket and return
        return mapToDto(ticketRepository.save(ticket));
    }

    // ─────────────────────────────────────────────────
    // ASSIGN a technician to a ticket
    // ─────────────────────────────────────────────────
    @Override
    public TicketResponseDto assignTechnician(Long ticketId, TechnicianAssignDto technicianAssignDto) {
        // Find the ticket
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with ID: " + ticketId));

        // Find the technician user
        User technician = userRepository.findById(technicianAssignDto.getTechnicianId())
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found with ID: " + technicianAssignDto.getTechnicianId()));

        // Assign the technician and update status to IN_PROGRESS
        ticket.setAssignedTechnician(technician);
        ticket.setStatus(TicketStatus.IN_PROGRESS);

        // Save and return
        return mapToDto(ticketRepository.save(ticket));
    }

    // ─────────────────────────────────────────────────
    // ADD resolution notes to a ticket
    // ─────────────────────────────────────────────────
    @Override
    public TicketResponseDto addResolutionNotes(Long ticketId, String notes) {
        // Find the ticket
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with ID: " + ticketId));

        // Set the resolution notes
        ticket.setResolutionNotes(notes);

        // Save and return
        return mapToDto(ticketRepository.save(ticket));
    }

    // ─────────────────────────────────────────────────
    // HELPER: Convert Ticket entity → TicketResponseDto
    // ─────────────────────────────────────────────────
    private TicketResponseDto mapToDto(Ticket ticket) {
        TicketResponseDto dto = new TicketResponseDto();

        dto.setId(ticket.getId());
        dto.setTitle(ticket.getTitle());
        dto.setCategory(ticket.getCategory());
        dto.setDescription(ticket.getDescription());
        dto.setPriority(ticket.getPriority());
        dto.setLocation(ticket.getLocation());
        dto.setPreferredContact(ticket.getPreferredContact());
        dto.setStatus(ticket.getStatus());
        dto.setResolutionNotes(ticket.getResolutionNotes());
        dto.setRejectedReason(ticket.getRejectedReason());
        dto.setCreatedAt(ticket.getCreatedAt());
        dto.setUpdatedAt(ticket.getUpdatedAt());

        // Reporter details
        if (ticket.getReportedBy() != null) {
            dto.setReportedById(ticket.getReportedBy().getId());
            dto.setReportedByName(ticket.getReportedBy().getFullName()); // from User entity
        }

        // Technician details (may be null if not yet assigned)
        if (ticket.getAssignedTechnician() != null) {
            dto.setAssignedTechnicianId(ticket.getAssignedTechnician().getId());
            dto.setAssignedTechnicianName(ticket.getAssignedTechnician().getFullName());
        }

        // Resource details (may be null if not linked)
        if (ticket.getResource() != null) {
            dto.setResourceId(ticket.getResource().getId());
            dto.setResourceName(ticket.getResource().getName()); // from Resource entity
        }

        return dto;
    }
}
