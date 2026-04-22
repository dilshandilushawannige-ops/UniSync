package com.smartcampus.unisync.resource.dto;

import com.smartcampus.unisync.common.enums.ResourceStatus;
import com.smartcampus.unisync.common.enums.ResourceType;
import java.time.LocalDateTime;
import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceResponseDto {

    private Long id;

    private String name;

    private ResourceType type;

    private Integer capacity;

    private String location;

    private String description;

    private LocalTime availableFrom;

    private LocalTime availableTo;

    private String visibleTo;

    private String assignedUsers;

    private ResourceStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
