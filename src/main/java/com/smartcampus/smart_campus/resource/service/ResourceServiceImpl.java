package com.smartcampus.smart_campus.resource.service;

import com.smartcampus.smart_campus.common.enums.ResourceStatus;
import com.smartcampus.smart_campus.common.enums.ResourceType;
import com.smartcampus.smart_campus.resource.dto.ResourceRequestDto;
import com.smartcampus.smart_campus.resource.dto.ResourceResponseDto;
import com.smartcampus.smart_campus.resource.entity.Resource;
import com.smartcampus.smart_campus.resource.repository.ResourceRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceServiceImpl(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    @Override
    public ResourceResponseDto createResource(ResourceRequestDto dto) {
        Resource resource = new Resource();
        mapDtoToEntity(dto, resource);
        return mapEntityToDto(resourceRepository.save(resource));
    }

    @Override
    public ResourceResponseDto getResourceById(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with id: " + id));
        return mapEntityToDto(resource);
    }

    @Override
    public List<ResourceResponseDto> getAllResources() {
        return resourceRepository.findAll()
                .stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ResourceResponseDto> searchResources(ResourceType type, String location, ResourceStatus status, Integer capacity) {
        return resourceRepository.searchResources(type, location, status, capacity)
                .stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ResourceResponseDto updateResource(Long id, ResourceRequestDto dto) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with id: " + id));
        mapDtoToEntity(dto, resource);
        return mapEntityToDto(resourceRepository.save(resource));
    }

    @Override
    public void deleteResource(Long id) {
        if (!resourceRepository.existsById(id)) {
            throw new RuntimeException("Resource not found with id: " + id);
        }
        resourceRepository.deleteById(id);
    }

    @Override
    public ResourceResponseDto updateStatus(Long id, ResourceStatus status) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with id: " + id));
        resource.setStatus(status);
        return mapEntityToDto(resourceRepository.save(resource));
    }

    private void mapDtoToEntity(ResourceRequestDto dto, Resource resource) {
        resource.setName(dto.getName());
        resource.setType(dto.getType());
        resource.setCapacity(dto.getCapacity());
        resource.setLocation(dto.getLocation());
        resource.setDescription(dto.getDescription());
        resource.setStatus(dto.getStatus() != null ? dto.getStatus() : ResourceStatus.ACTIVE);
        resource.setAvailableFrom(dto.getAvailableFrom());
        resource.setAvailableTo(dto.getAvailableTo());
        resource.setImageUrl(dto.getImageUrl());
    }

    private ResourceResponseDto mapEntityToDto(Resource resource) {
        ResourceResponseDto dto = new ResourceResponseDto();
        dto.setId(resource.getId());
        dto.setName(resource.getName());
        dto.setType(resource.getType());
        dto.setCapacity(resource.getCapacity());
        dto.setLocation(resource.getLocation());
        dto.setDescription(resource.getDescription());
        dto.setStatus(resource.getStatus());
        dto.setAvailableFrom(resource.getAvailableFrom());
        dto.setAvailableTo(resource.getAvailableTo());
        dto.setImageUrl(resource.getImageUrl());
        dto.setCreatedAt(resource.getCreatedAt());
        dto.setUpdatedAt(resource.getUpdatedAt());
        return dto;
    }
}