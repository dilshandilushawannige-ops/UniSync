package com.smartcampus.resource.service;

import com.smartcampus.common.enums.ResourceStatus;
import com.smartcampus.common.enums.ResourceType;
import com.smartcampus.common.exception.ResourceNotFoundException;
import com.smartcampus.resource.dto.ResourceRequestDto;
import com.smartcampus.resource.dto.ResourceResponseDto;
import com.smartcampus.resource.entity.Resource;
import com.smartcampus.resource.repository.ResourceRepository;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;

    @Override
    public ResourceResponseDto createResource(ResourceRequestDto dto) {
        Resource resource = Resource.builder()
                .name(dto.getName())
                .type(dto.getType())
                .capacity(dto.getCapacity())
                .location(dto.getLocation())
                .availabilityWindows(dto.getAvailabilityWindows())
                .status(dto.getStatus() != null ? dto.getStatus() : ResourceStatus.ACTIVE)
                .build();

        Resource savedResource = resourceRepository.save(resource);
        return mapToResponseDto(savedResource);
    }

    @Override
    public ResourceResponseDto getResourceById(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));
        return mapToResponseDto(resource);
    }

    @Override
    public List<ResourceResponseDto> getAllResources() {
        return resourceRepository.findAll()
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public ResourceResponseDto updateResource(Long id, ResourceRequestDto dto) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));

        resource.setName(dto.getName());
        resource.setType(dto.getType());
        resource.setCapacity(dto.getCapacity());
        resource.setLocation(dto.getLocation());
        resource.setAvailabilityWindows(dto.getAvailabilityWindows());
        if (dto.getStatus() != null) {
            resource.setStatus(dto.getStatus());
        }

        Resource updatedResource = resourceRepository.save(resource);
        return mapToResponseDto(updatedResource);
    }

    @Override
    public void deleteResource(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));
        resourceRepository.delete(resource);
    }

    @Override
    public ResourceResponseDto updateStatus(Long id, ResourceStatus status) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));

        resource.setStatus(status);
        Resource updatedResource = resourceRepository.save(resource);
        return mapToResponseDto(updatedResource);
    }

    @Override
    public List<ResourceResponseDto> searchResources(String type, Integer minCapacity, String location) {
        List<Resource> resources = resourceRepository.findAll();

        return resources.stream()
                .filter(r -> type == null || r.getType().toString().equalsIgnoreCase(type))
                .filter(r -> minCapacity == null || r.getCapacity() >= minCapacity)
                .filter(r -> location == null || r.getLocation().toLowerCase().contains(location.toLowerCase()))
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    private ResourceResponseDto mapToResponseDto(Resource resource) {
        return ResourceResponseDto.builder()
                .id(resource.getId())
                .name(resource.getName())
                .type(resource.getType())
                .capacity(resource.getCapacity())
                .location(resource.getLocation())
                .availabilityWindows(resource.getAvailabilityWindows())
                .status(resource.getStatus())
                .createdAt(resource.getCreatedAt())
                .updatedAt(resource.getUpdatedAt())
                .build();
    }
}
