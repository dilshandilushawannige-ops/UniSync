package com.smartcampus.unisync.attachment.dto;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * DTO used when returning attachment data to the frontend.
 * The frontend uses this to display or download uploaded files.
 */
@Data // Lombok: generates getters, setters, toString
public class AttachmentResponseDto {

    private Long id;               // Attachment ID
    private Long ticketId;         // Which ticket this file belongs to

    private String fileName;       // Original name of the uploaded file (e.g., "photo.jpg")
    private String fileType;       // File MIME type (e.g., "image/jpeg", "application/pdf")
    private String fileUrl;        // URL path to access/download the file

    private LocalDateTime uploadedAt; // When the file was uploaded
}
