package com.smartcampus.attachment.service;

import com.smartcampus.attachment.dto.AttachmentResponseDto;
import com.smartcampus.attachment.entity.Attachment;
import com.smartcampus.attachment.repository.AttachmentRepository;
import com.smartcampus.common.exception.ResourceNotFoundException;
import com.smartcampus.ticket.entity.Ticket;
import com.smartcampus.ticket.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Implementation of AttachmentService.
 * Handles file validation, saving to disk, and storing metadata in DB.
 */
@Service
@RequiredArgsConstructor
public class AttachmentServiceImpl implements AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final TicketRepository ticketRepository;

    // Folder where uploaded files will be saved on the server
    private static final String UPLOAD_DIR = "uploads/";

    // Maximum number of attachments allowed per ticket
    private static final int MAX_FILES_PER_TICKET = 3;

    // Allowed file types (only images)
    private static final List<String> ALLOWED_TYPES = List.of(
            "image/jpeg", "image/jpg", "image/png"
    );

    // ─────────────────────────────────────────────────
    // UPLOAD a file and link it to a ticket
    // ─────────────────────────────────────────────────
    @Override
    public AttachmentResponseDto uploadAttachment(Long ticketId, MultipartFile file) {

        // Step 1: Check the ticket exists
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with ID: " + ticketId));

        // Step 2: Check max 3 files per ticket
        int existingCount = attachmentRepository.countByTicketId(ticketId);
        if (existingCount >= MAX_FILES_PER_TICKET) {
            throw new RuntimeException("Maximum " + MAX_FILES_PER_TICKET + " attachments allowed per ticket");
        }

        // Step 3: Validate the file type (only jpg, jpeg, png allowed)
        String fileType = file.getContentType();
        if (fileType == null || !ALLOWED_TYPES.contains(fileType)) {
            throw new RuntimeException("Only JPG, JPEG, and PNG files are allowed");
        }

        // Step 4: Generate a unique file name to avoid overwriting existing files
        // e.g., original name "photo.jpg" → saved as "a1b2c3d4-photo.jpg"
        String originalFileName = file.getOriginalFilename();
        String uniqueFileName = UUID.randomUUID() + "-" + originalFileName;

        // Step 5: Save the file to the "uploads/" folder on disk
        try {
            // Create the uploads folder if it doesn't exist yet
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Write the file bytes to disk
            Path filePath = uploadPath.resolve(uniqueFileName);
            Files.write(filePath, file.getBytes());

        } catch (IOException e) {
            throw new RuntimeException("Failed to save file: " + e.getMessage());
        }

        // Step 6: Save the file metadata (name, path, type) to the database
        Attachment attachment = new Attachment();
        attachment.setFileName(originalFileName);              // Original name shown to user
        attachment.setFilePath(UPLOAD_DIR + uniqueFileName);  // Where file is stored on disk
        attachment.setFileType(fileType);
        attachment.setTicket(ticket);

        Attachment saved = attachmentRepository.save(attachment);
        return mapToDto(saved);
    }

    // ─────────────────────────────────────────────────
    // GET all attachments for a ticket
    // ─────────────────────────────────────────────────
    @Override
    public List<AttachmentResponseDto> getAttachmentsByTicket(Long ticketId) {
        // Check ticket exists
        if (!ticketRepository.existsById(ticketId)) {
            throw new ResourceNotFoundException("Ticket not found with ID: " + ticketId);
        }

        return attachmentRepository.findByTicketId(ticketId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────────
    // DELETE an attachment by ID
    // ─────────────────────────────────────────────────
    @Override
    public void deleteAttachment(Long attachmentId) {
        // Find the attachment record in the DB
        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment not found with ID: " + attachmentId));

        // Delete the actual file from disk
        try {
            Path filePath = Paths.get(attachment.getFilePath());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file from disk: " + e.getMessage());
        }

        // Delete the record from the database
        attachmentRepository.delete(attachment);
    }

    // ─────────────────────────────────────────────────
    // HELPER: Convert Attachment entity → AttachmentResponseDto
    // ─────────────────────────────────────────────────
    private AttachmentResponseDto mapToDto(Attachment attachment) {
        AttachmentResponseDto dto = new AttachmentResponseDto();

        dto.setId(attachment.getId());
        dto.setTicketId(attachment.getTicket().getId());
        dto.setFileName(attachment.getFileName());
        dto.setFileType(attachment.getFileType());
        dto.setFileUrl(attachment.getFilePath()); // Frontend uses this to display/download
        dto.setUploadedAt(attachment.getUploadedAt());

        return dto;
    }
}
