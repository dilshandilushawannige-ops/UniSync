package com.smartcampus.smart_campus.resource.controller;

import com.smartcampus.smart_campus.common.enums.ResourceStatus;
import com.smartcampus.smart_campus.common.enums.ResourceType;
import com.smartcampus.smart_campus.resource.dto.ResourceRequestDto;
import com.smartcampus.smart_campus.resource.dto.ResourceResponseDto;
import com.smartcampus.smart_campus.resource.service.ResourceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "*")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @PostMapping
    public ResponseEntity<ResourceResponseDto> createResource(@Valid @RequestBody ResourceRequestDto dto) {
        return new ResponseEntity<>(resourceService.createResource(dto), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ResourceResponseDto>> getAllResources(
            @RequestParam(required = false) ResourceType type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) ResourceStatus status,
            @RequestParam(required = false) Integer capacity) {
        if (type != null || location != null || status != null || capacity != null) {
            return ResponseEntity.ok(resourceService.searchResources(type, location, status, capacity));
        }
        return ResponseEntity.ok(resourceService.getAllResources());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResourceResponseDto> getResourceById(@PathVariable Long id) {
        return ResponseEntity.ok(resourceService.getResourceById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResourceResponseDto> updateResource(
            @PathVariable Long id,
            @Valid @RequestBody ResourceRequestDto dto) {
        return ResponseEntity.ok(resourceService.updateResource(id, dto));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ResourceResponseDto> updateStatus(
            @PathVariable Long id,
            @RequestParam ResourceStatus status) {
        return ResponseEntity.ok(resourceService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
}