package com.smartcampus.ticket.repository;

import com.smartcampus.ticket.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Ticket entity.
 * JpaRepository gives us built-in methods like:
 * save(), findById(), findAll(), deleteById() — no need to write them.
 */
@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    // Get all tickets submitted by a specific user
    List<Ticket> findByReportedById(Long userId);

    // Get all tickets assigned to a specific technician
    List<Ticket> findByAssignedTechnicianId(Long technicianId);
}
