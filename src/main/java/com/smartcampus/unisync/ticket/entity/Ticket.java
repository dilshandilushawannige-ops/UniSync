package com.smartcampus.unisync.ticket.entity;

import com.smartcampus.unisync.common.enums.ContactMethod;
import com.smartcampus.unisync.common.enums.TicketCategory;
import com.smartcampus.unisync.common.enums.TicketPriority;
import com.smartcampus.unisync.common.enums.TicketStatus;
import com.smartcampus.unisync.user.entity.User;
import com.smartcampus.unisync.resource.entity.Resource;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Represents a maintenance or support ticket raised by a user.
 * Stored in the 'tickets' table in the database.
 */
@Entity
@Table(name = "tickets")
@Data               // Lombok: generates getters, setters, toString, equals, hashCode
@NoArgsConstructor  // Lombok: generates a no-argument constructor
@AllArgsConstructor // Lombok: generates a constructor with all fields
public class Ticket {

    // ──────────────────────────────────────────
    // Primary Key
    // ──────────────────────────────────────────

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment in MySQL
    private Long id;

    // ──────────────────────────────────────────
    // Basic Ticket Information
    // ──────────────────────────────────────────

    @Column(nullable = false)
    private String title;           // Short title describing the issue

    @Enumerated(EnumType.STRING)    // Store as readable text (e.g., "IT_SUPPORT") instead of numbers
    @Column(nullable = false)
    private TicketCategory category; // Type of issue (e.g., MAINTENANCE, IT_SUPPORT)

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;     // Detailed description of the issue

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketPriority priority; // How urgent is this ticket (LOW, MEDIUM, HIGH, URGENT)

    @Enumerated(EnumType.STRING)
    private ContactMethod preferredContact; // How the reporter wants to be contacted (optional)

    private String location;        // Where the issue is located (e.g., "Lab 3, Block B")

    // ──────────────────────────────────────────
    // Ticket Status and Resolution
    // ──────────────────────────────────────────

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status = TicketStatus.OPEN; // Default status when a ticket is created

    @Column(columnDefinition = "TEXT")
    private String resolutionNotes; // Notes added by the technician when resolving the ticket

    @Column(columnDefinition = "TEXT")
    private String rejectedReason;  // Reason provided if the ticket is rejected by admin

    // ──────────────────────────────────────────
    // Timestamps
    // ──────────────────────────────────────────

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt; // Set once when the ticket is first created

    @Column(nullable = false)
    private LocalDateTime updatedAt; // Updated every time the ticket is modified

    // ──────────────────────────────────────────
    // Relationships
    // ──────────────────────────────────────────

    /**
     * The user who reported/submitted this ticket.
     * Many tickets can belong to one user.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_by_id", nullable = false)
    private User reportedBy;

    /**
     * The resource (lab, room, equipment) related to this ticket.
     * This is optional — not every ticket is linked to a resource.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resource_id")
    private Resource resource;

    /**
     * The technician assigned to handle this ticket.
     * This is optional — assigned later by admin.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_technician_id")
    private User assignedTechnician;

    // ──────────────────────────────────────────
    // Lifecycle Hooks
    // ──────────────────────────────────────────

    /**
     * Automatically sets createdAt and updatedAt before the ticket is first saved.
     */
    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Automatically updates updatedAt every time the ticket is modified and saved.
     */
    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
