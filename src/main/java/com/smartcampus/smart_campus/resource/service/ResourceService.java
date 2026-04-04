package com.smartcampus.smart_campus.resource.service;

import com.smartcampus.smart_campus.common.enums.ResourceStatus;
import com.smartcampus.smart_campus.common.enums.ResourceType;
import com.smartcampus.smart_campus.resource.dto.ResourceRequestDto;
import com.smartcampus.smart_campus.resource.dto.ResourceResponseDto;
import java.util.List;

public interface ResourceService {

    ResourceResponseDto createResource(ResourceRequestDto dto);

    ResourceResponseDto getResourceById(Long id);

    List<ResourceResponseDto> getAllResources();

    List<ResourceResponseDto> searchResources(ResourceType type, String location, ResourceStatus status, Integer capacity);

    ResourceResponseDto updateResource(Long id, ResourceRequestDto dto);

    void deleteResource(Long id);

    ResourceResponseDto updateStatus(Long id, ResourceStatus status);
}