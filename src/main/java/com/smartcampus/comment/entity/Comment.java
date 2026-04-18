package com.smartcampus.comment.entity;

import com.smartcampus.ticket.entity.Ticket;
import com.smartcampus.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Represents a comment posted on a ticket.
 * Stored in the 'comments' table in the database.
 */
@Entity
@Table(name = "comments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comment {

    // ─────────────────────────────
    // Primary Key
    // ─────────────────────────────

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ─────────────────────────────
    // Comment Content
    // ─────────────────────────────

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content; // The actual comment text written by the user

    // ─────────────────────────────
    // Timestamps
    // ─────────────────────────────

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt; // Set once when comment is first created

    @Column(nullable = false)
    private LocalDateTime updatedAt; // Updated every time comment is edited

    // ─────────────────────────────
    // Relationships
    // ─────────────────────────────

    /**
     * The ticket this comment belongs to.
     * Many comments can belong to one ticket.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;

    /**
     * The user who wrote this comment.
     * Many comments can be written by one user.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    // ─────────────────────────────
    // Lifecycle Hooks
    // ─────────────────────────────

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
