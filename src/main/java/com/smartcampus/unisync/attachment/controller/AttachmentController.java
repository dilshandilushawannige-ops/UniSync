package com.smartcampus.unisync.attachment.controller;

import com.smartcampus.unisync.attachment.dto.AttachmentResponseDto;
import com.smartcampus.unisync.attachment.service.AttachmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * REST Controller for Attachment module.
 * Handles file upload, listing, and deletion for ticket attachments.
 */
@RestController
@RequiredArgsConstructor
public class AttachmentController {

    private final AttachmentService attachmentService;

    // ─────────────────────────────────────────────────────────
    // POST /api/tickets/{ticketId}/attachments
    // Upload a file and attach it to a ticket
    // Uses MultipartFile — not JSON — because we're uploading a file
    // ─────────────────────────────────────────────────────────
    @PostMapping("/api/tickets/{ticketId}/attachments")
    public ResponseEntity<AttachmentResponseDto> uploadAttachment(
            @PathVariable Long ticketId,
            @RequestParam("file") MultipartFile file // "file" must match the form-data key in frontend
    ) {
        AttachmentResponseDto response = attachmentService.uploadAttachment(ticketId, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(response); // 201 Created
    }

    // ─────────────────────────────────────────────────────────
    // GET /api/tickets/{ticketId}/attachments
    // Get all attachments for a specific ticket
    // ─────────────────────────────────────────────────────────
    @GetMapping("/api/tickets/{ticketId}/attachments")
    public ResponseEntity<List<AttachmentResponseDto>> getAttachmentsByTicket(
            @PathVariable Long ticketId
    ) {
        List<AttachmentResponseDto> attachments = attachmentService.getAttachmentsByTicket(ticketId);
        return ResponseEntity.ok(attachments); // 200 OK
    }

    // ─────────────────────────────────────────────────────────
    // DELETE /api/attachments/{attachmentId}
    // Delete an attachment (removes from DB and from disk)
    // ─────────────────────────────────────────────────────────
    @DeleteMapping("/api/attachments/{attachmentId}")
    public ResponseEntity<Void> deleteAttachment(
            @PathVariable Long attachmentId
    ) {
        attachmentService.deleteAttachment(attachmentId);
        return ResponseEntity.noContent().build(); // 204 No Content
    }
}
