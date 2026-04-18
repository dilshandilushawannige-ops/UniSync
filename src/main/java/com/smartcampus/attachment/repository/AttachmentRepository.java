package com.smartcampus.attachment.repository;

import com.smartcampus.attachment.entity.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Attachment entity.
 * JpaRepository gives us built-in methods like:
 * save(), findById(), findAll(), deleteById() — no need to write them.
 */
@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, Long> {

    // Get all attachments that belong to a specific ticket
    List<Attachment> findByTicketId(Long ticketId);

    // Count how many attachments a ticket has
    // Useful to enforce a maximum attachment limit per ticket
    int countByTicketId(Long ticketId);
}
