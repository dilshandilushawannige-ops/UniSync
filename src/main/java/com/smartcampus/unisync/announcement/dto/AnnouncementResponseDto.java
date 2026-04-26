package com.smartcampus.unisync.announcement.dto;

import com.smartcampus.unisync.common.enums.AnnouncementPriority;
import com.smartcampus.unisync.common.enums.AnnouncementStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnnouncementResponseDto {

    private Long id;
    private String title;
    private String message;
    private List<String> target; // ["ALL"] or ["STUDENT", "LECTURER"]
    private AnnouncementPriority priority;
    private AnnouncementStatus status;
    private String createdAt; // Formatted as string for frontend
    private LocalDateTime updatedAt;
}
