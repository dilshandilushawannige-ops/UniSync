package com.smartcampus.unisync.resource.service;

import com.smartcampus.unisync.common.enums.ResourceStatus;
import com.smartcampus.unisync.resource.dto.ResourceRequestDto;
import com.smartcampus.unisync.resource.dto.ResourceResponseDto;
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
