package com.smartcampus.unisync.attachment.entity;

import com.smartcampus.unisync.ticket.entity.Ticket;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Represents a file attached to a ticket.
 * Stored in the 'attachments' table in the database.
 * The actual file is saved on disk; only file info is saved here.
 */
@Entity
@Table(name = "attachments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Attachment {

    // ─────────────────────────────
    // Primary Key
    // ─────────────────────────────

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ─────────────────────────────
    // File Information
    // ─────────────────────────────

    @Column(nullable = false)
    private String fileName;   // Original name of the uploaded file (e.g., "photo.jpg")

    @Column(nullable = false)
    private String filePath;   // Path where the file is saved on disk (e.g., "uploads/abc123.jpg")

    @Column(nullable = false)
    private String fileType;   // MIME type of the file (e.g., "image/jpeg", "image/png")

    // ─────────────────────────────
    // Timestamp
    // ─────────────────────────────

    @Column(nullable = false, updatable = false)
    private LocalDateTime uploadedAt; // When the file was uploaded

    // ─────────────────────────────
    // Relationship
    // ─────────────────────────────

    /**
     * The ticket this attachment belongs to.
     * Many attachments can belong to one ticket.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;

    // ─────────────────────────────
    // Lifecycle Hook
    // ─────────────────────────────

    @PrePersist
    public void onCreate() {
        this.uploadedAt = LocalDateTime.now();
    }
}
