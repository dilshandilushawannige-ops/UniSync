package com.smartcampus.unisync.ticket.repository;

import com.smartcampus.unisync.ticket.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

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
    
    // Custom query to fetch all tickets with their relationships eagerly loaded
    @Query("SELECT t FROM Ticket t " +
           "LEFT JOIN FETCH t.reportedBy " +
           "LEFT JOIN FETCH t.assignedTechnician " +
           "LEFT JOIN FETCH t.resource")
    List<Ticket> findAllWithRelations();
    
    // Custom query to fetch a single ticket with relationships eagerly loaded
    @Query("SELECT t FROM Ticket t " +
           "LEFT JOIN FETCH t.reportedBy " +
           "LEFT JOIN FETCH t.assignedTechnician " +
           "LEFT JOIN FETCH t.resource " +
           "WHERE t.id = :id")
    Optional<Ticket> findByIdWithRelations(Long id);
    
    // Custom query to fetch tickets by user with relationships eagerly loaded
    @Query("SELECT t FROM Ticket t " +
           "LEFT JOIN FETCH t.reportedBy " +
           "LEFT JOIN FETCH t.assignedTechnician " +
           "LEFT JOIN FETCH t.resource " +
           "WHERE t.reportedBy.id = :userId")
    List<Ticket> findByReportedByIdWithRelations(Long userId);
    
    // Custom query to fetch tickets assigned to a technician with relationships eagerly loaded
    @Query("SELECT t FROM Ticket t " +
           "LEFT JOIN FETCH t.assignedTechnician " +
           "LEFT JOIN FETCH t.reportedBy " +
           "LEFT JOIN FETCH t.resource " +
           "WHERE t.assignedTechnician.id = :technicianId")
    List<Ticket> findByAssignedTechnicianIdWithRelations(Long technicianId);
}
