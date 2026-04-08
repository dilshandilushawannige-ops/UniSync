package com.smartcampus.unisync.attachment.service;

import com.smartcampus.unisync.attachment.dto.AttachmentResponseDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Service interface for Attachment operations.
 * Defines what actions can be performed on attachments.
 * Actual logic is written in AttachmentServiceImpl.
 */
public interface AttachmentService {

    // Upload a file and attach it to a ticket
    AttachmentResponseDto uploadAttachment(Long ticketId, MultipartFile file);

    // Get all attachments for a specific ticket
    List<AttachmentResponseDto> getAttachmentsByTicket(Long ticketId);

    // Delete an attachment by its ID
    void deleteAttachment(Long attachmentId);
}
