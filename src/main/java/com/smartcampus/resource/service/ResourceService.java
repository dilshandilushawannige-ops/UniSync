package com.smartcampus.resource.service;

import com.smartcampus.common.enums.ResourceStatus;
import com.smartcampus.resource.dto.ResourceRequestDto;
import com.smartcampus.resource.dto.ResourceResponseDto;
import java.util.List;

public interface ResourceService {

    ResourceResponseDto createResource(ResourceRequestDto dto);

    ResourceResponseDto getResourceById(Long id);

    List<ResourceResponseDto> getAllResources();

    ResourceResponseDto updateResource(Long id, ResourceRequestDto dto);

    void deleteResource(Long id);

    ResourceResponseDto updateStatus(Long id, ResourceStatus status);

    List<ResourceResponseDto> searchResources(String type, Integer minCapacity, String location);
}
