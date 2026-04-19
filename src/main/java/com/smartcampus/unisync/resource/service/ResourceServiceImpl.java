package com.smartcampus.unisync.resource.service;

import com.smartcampus.unisync.common.enums.ResourceStatus;
import com.smartcampus.unisync.common.exception.ResourceNotFoundException;
import com.smartcampus.unisync.resource.dto.ResourceRequestDto;
import com.smartcampus.unisync.resource.dto.ResourceResponseDto;
import com.smartcampus.unisync.resource.entity.Resource;
import com.smartcampus.unisync.resource.repository.ResourceRepository;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;

    @Override
    public ResourceResponseDto createResource(ResourceRequestDto dto) {
        Resource resource = new Resource();
        mapDtoToEntity(dto, resource);
        if (resource.getStatus() == null) {
            resource.setStatus(ResourceStatus.ACTIVE);
        }

        Resource savedResource = resourceRepository.save(resource);
        return mapToResponseDto(savedResource);
    }

    @Override
    public ResourceResponseDto getResourceById(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with ID: " + id));
        return mapToResponseDto(resource);
    }

    @Override
    public List<ResourceResponseDto> getAllResources(Long userId) {
        List<Resource> resources = resourceRepository.findAll();

        if (userId == null) {
            return resources.stream()
                    .map(this::mapToResponseDto)
                    .collect(Collectors.toList());
        }

        return resources.stream()
                .filter(resource -> isVisibleToAll(resource) || isAssignedToUser(resource, userId))
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public ResourceResponseDto updateResource(Long id, ResourceRequestDto dto) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with ID: " + id));

        mapDtoToEntity(dto, resource);

        Resource updatedResource = resourceRepository.save(resource);
        return mapToResponseDto(updatedResource);
    }

    @Override
    public void deleteResource(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with ID: " + id));
        resourceRepository.delete(resource);
    }

    @Override
    public ResourceResponseDto updateStatus(Long id, ResourceStatus status) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with ID: " + id));

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
                .description(resource.getDescription())
                .availableFrom(resource.getAvailableFrom())
                .availableTo(resource.getAvailableTo())
                .visibleTo(resource.getVisibleTo())
                .assignedUsers(resource.getAssignedUsers())
                .status(resource.getStatus())
                .createdAt(resource.getCreatedAt())
                .updatedAt(resource.getUpdatedAt())
                .build();
    }

    private void mapDtoToEntity(ResourceRequestDto dto, Resource resource) {
        resource.setName(dto.getName());
        resource.setType(dto.getType());
        resource.setCapacity(dto.getCapacity());
        resource.setLocation(dto.getLocation());
        resource.setDescription(dto.getDescription());
        resource.setAvailableFrom(dto.getAvailableFrom());
        resource.setAvailableTo(dto.getAvailableTo());
        resource.setVisibleTo(normalizeVisibleTo(dto.getVisibleTo()));
        resource.setAssignedUsers(dto.getAssignedUsers());
        if (dto.getStatus() != null) {
            resource.setStatus(dto.getStatus());
        }
    }

    private boolean isVisibleToAll(Resource resource) {
        return normalizeVisibleTo(resource.getVisibleTo()).equalsIgnoreCase("ALL");
    }

    private String normalizeVisibleTo(String visibleTo) {
        if (visibleTo == null || visibleTo.isBlank()) {
            return "ALL";
        }

        return visibleTo.trim().toUpperCase();
    }

    private boolean isAssignedToUser(Resource resource, Long userId) {
        if (resource.getAssignedUsers() == null || resource.getAssignedUsers().isBlank()) {
            return false;
        }

        return Arrays.stream(resource.getAssignedUsers().split(","))
                .map(String::trim)
                .filter(id -> !id.isBlank())
                .map(this::safeParseLong)
                .filter(Objects::nonNull)
                .anyMatch(assignedUserId -> assignedUserId.equals(userId));
    }

    private Long safeParseLong(String value) {
        try {
            return Long.parseLong(value);
        } catch (NumberFormatException ex) {
            return null;
        }
    }
}
