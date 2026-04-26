package com.smartcampus.unisync.resource.service;

import com.smartcampus.unisync.common.enums.ResourceStatus;
import com.smartcampus.unisync.common.enums.ResourceType;
import com.smartcampus.unisync.common.exception.ResourceNotFoundException;
import com.smartcampus.unisync.resource.dto.ResourceCsvImportResultDto;
import com.smartcampus.unisync.resource.dto.ResourceRequestDto;
import com.smartcampus.unisync.resource.dto.ResourceResponseDto;
import com.smartcampus.unisync.resource.entity.Resource;
import com.smartcampus.unisync.resource.repository.ResourceRepository;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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

    @Override
    public ResourceCsvImportResultDto importResourcesCsv(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResourceCsvImportResultDto.builder()
                    .totalRows(0)
                    .created(0)
                    .failed(1)
                    .errors(List.of(ResourceCsvImportResultDto.RowError.builder()
                            .rowNumber(0)
                            .message("CSV file is required.")
                            .raw("")
                            .build()))
                    .build();
        }

        String originalFilename = file.getOriginalFilename() == null ? "" : file.getOriginalFilename().toLowerCase();
        if (!originalFilename.endsWith(".csv")) {
            return ResourceCsvImportResultDto.builder()
                    .totalRows(0)
                    .created(0)
                    .failed(1)
                    .errors(List.of(ResourceCsvImportResultDto.RowError.builder()
                            .rowNumber(0)
                            .message("Only .csv files are supported.")
                            .raw(originalFilename)
                            .build()))
                    .build();
        }

        ResourceCsvImportResultDto result = ResourceCsvImportResultDto.builder()
                .totalRows(0)
                .created(0)
                .failed(0)
                .errors(new ArrayList<>())
                .build();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8));
             CSVParser parser = CSVFormat.DEFAULT
                     .withHeader()
                     .withSkipHeaderRecord(true)
                     .withIgnoreEmptyLines(true)
                     .withTrim(true)
                     .parse(reader)) {

            int rowNumber = 1;
            for (CSVRecord record : parser) {
                rowNumber++;
                result.setTotalRows(result.getTotalRows() + 1);
                try {
                    ResourceRequestDto dto = mapCsvToDto(record);
                    createResource(dto);
                    result.setCreated(result.getCreated() + 1);
                } catch (Exception ex) {
                    result.setFailed(result.getFailed() + 1);
                    result.getErrors().add(ResourceCsvImportResultDto.RowError.builder()
                            .rowNumber(rowNumber)
                            .message(ex.getMessage() == null ? "Invalid row data." : ex.getMessage())
                            .raw(record.toString())
                            .build());
                }
            }
        } catch (IOException ex) {
            result.setFailed(1);
            result.getErrors().add(ResourceCsvImportResultDto.RowError.builder()
                    .rowNumber(0)
                    .message("Failed to read CSV file.")
                    .raw(ex.getMessage())
                    .build());
        }

        return result;
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

    private ResourceRequestDto mapCsvToDto(CSVRecord record) {
        String name = required(record, "name");
        ResourceType type = parseEnum(record, "type", ResourceType.class);
        Integer capacity = parseInt(required(record, "capacity"), "capacity");
        String location = required(record, "location");
        String description = optional(record, "description");
        LocalTime availableFrom = parseTime(required(record, "availableFrom"), "availableFrom");
        LocalTime availableTo = parseTime(required(record, "availableTo"), "availableTo");
        ResourceStatus status = parseEnumOptional(record, "status", ResourceStatus.class);
        String visibleTo = optional(record, "visibleTo");
        String assignedUsers = optional(record, "assignedUsers");

        if (capacity < 1) {
            throw new IllegalArgumentException("capacity must be at least 1");
        }

        if (availableFrom != null && availableTo != null && !availableFrom.isBefore(availableTo)) {
            throw new IllegalArgumentException("availableFrom must be before availableTo");
        }

        return new ResourceRequestDto(
                name,
                type,
                capacity,
                location,
                (description == null || description.isBlank()) ? null : description,
                availableFrom,
                availableTo,
                (visibleTo == null || visibleTo.isBlank()) ? null : visibleTo,
                (assignedUsers == null || assignedUsers.isBlank()) ? null : assignedUsers,
                status
        );
    }

    private String required(CSVRecord record, String key) {
        String value = optional(record, key);
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(key + " is required");
        }
        return value.trim();
    }

    private String optional(CSVRecord record, String key) {
        if (record == null || record.getParser() == null || record.getParser().getHeaderMap() == null) {
            return null;
        }
        if (!record.getParser().getHeaderMap().containsKey(key)) {
            return null;
        }
        return record.get(key);
    }

    private Integer parseInt(String value, String key) {
        try {
            return Integer.parseInt(value.trim());
        } catch (Exception ex) {
            throw new IllegalArgumentException(key + " must be a number");
        }
    }

    private LocalTime parseTime(String value, String key) {
        String trimmed = value.trim();
        try {
            if (trimmed.matches("^\\d{2}:\\d{2}$")) {
                return LocalTime.parse(trimmed);
            }
            if (trimmed.matches("^\\d{2}:\\d{2}:\\d{2}$")) {
                return LocalTime.parse(trimmed);
            }
        } catch (Exception ignored) {
            // handled below
        }
        throw new IllegalArgumentException(key + " must be HH:mm or HH:mm:ss");
    }

    private <T extends Enum<T>> T parseEnum(CSVRecord record, String key, Class<T> enumType) {
        String value = required(record, key);
        try {
            return Enum.valueOf(enumType, value.trim().toUpperCase());
        } catch (Exception ex) {
            throw new IllegalArgumentException(key + " is invalid");
        }
    }

    private <T extends Enum<T>> T parseEnumOptional(CSVRecord record, String key, Class<T> enumType) {
        String value = optional(record, key);
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return Enum.valueOf(enumType, value.trim().toUpperCase());
        } catch (Exception ex) {
            throw new IllegalArgumentException(key + " is invalid");
        }
    }
}
