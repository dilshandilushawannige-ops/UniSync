package com.smartcampus.unisync.announcement.dto;

import com.smartcampus.unisync.common.enums.AnnouncementPriority;
import com.smartcampus.unisync.common.enums.AnnouncementStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnnouncementRequestDto {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Message is required")
    private String message;

    @NotNull(message = "Target roles are required")
    private List<String> targetRoles; // ["ALL"] or ["STUDENT", "LECTURER"]

    @NotNull(message = "Priority is required")
    private AnnouncementPriority priority;

    private AnnouncementStatus status = AnnouncementStatus.ACTIVE;
}
