package com.smartcampus.unisync.resource.service;

import com.smartcampus.unisync.common.enums.ResourceStatus;
import com.smartcampus.unisync.resource.dto.ResourceCsvImportResultDto;
import com.smartcampus.unisync.resource.dto.ResourceRequestDto;
import com.smartcampus.unisync.resource.dto.ResourceResponseDto;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public interface ResourceService {

    ResourceResponseDto createResource(ResourceRequestDto dto);

    ResourceResponseDto getResourceById(Long id);

    List<ResourceResponseDto> getAllResources(Long userId);

    ResourceResponseDto updateResource(Long id, ResourceRequestDto dto);

    void deleteResource(Long id);

    ResourceResponseDto updateStatus(Long id, ResourceStatus status);

    List<ResourceResponseDto> searchResources(String type, Integer minCapacity, String location);

    ResourceCsvImportResultDto importResourcesCsv(MultipartFile file);
}
