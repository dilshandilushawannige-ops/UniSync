package com.smartcampus.unisync.resource.controller;

import com.smartcampus.unisync.common.enums.ResourceStatus;
import com.smartcampus.unisync.resource.dto.ResourceRequestDto;
import com.smartcampus.unisync.resource.dto.ResourceResponseDto;
import com.smartcampus.unisync.resource.service.ResourceService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    /**
     * GET /api/resources
     * Retrieve all resources
     *
     * @return List of ResourceResponseDto with HTTP 200
     */
    @GetMapping
    public ResponseEntity<List<ResourceResponseDto>> getAllResources() {
        List<ResourceResponseDto> resources = resourceService.getAllResources();
        return ResponseEntity.ok(resources);
    }

    /**
     * GET /api/resources/search
     * Search resources with optional filters
     *
     * @param type optional resource type filter
     * @param minCapacity optional minimum capacity filter
     * @param location optional location filter
     * @return List of matching ResourceResponseDto with HTTP 200
     */
    @GetMapping("/search")
    public ResponseEntity<List<ResourceResponseDto>> searchResources(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) String location) {
        List<ResourceResponseDto> resources = resourceService.searchResources(type, minCapacity, location);
        return ResponseEntity.ok(resources);
    }

    /**
     * GET /api/resources/{id}
     * Retrieve a resource by ID
     *
     * @param id the resource ID
     * @return ResourceResponseDto with HTTP 200, or 404 if not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<ResourceResponseDto> getResourceById(@PathVariable Long id) {
        ResourceResponseDto resource = resourceService.getResourceById(id);
        return ResponseEntity.ok(resource);
    }

    /**
     * POST /api/resources
     * Create a new resource (ADMIN only)
     *
     * @param requestDto the resource request data
     * @return created ResourceResponseDto with HTTP 201
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResourceResponseDto> createResource(@Valid @RequestBody ResourceRequestDto requestDto) {
        ResourceResponseDto createdResource = resourceService.createResource(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdResource);
    }

    /**
     * PUT /api/resources/{id}
     * Update an existing resource (ADMIN only)
     *
     * @param id the resource ID
     * @param requestDto the updated resource data
     * @return updated ResourceResponseDto with HTTP 200
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResourceResponseDto> updateResource(
            @PathVariable Long id,
            @Valid @RequestBody ResourceRequestDto requestDto) {
        ResourceResponseDto updatedResource = resourceService.updateResource(id, requestDto);
        return ResponseEntity.ok(updatedResource);
    }

    /**
     * DELETE /api/resources/{id}
     * Delete a resource (ADMIN only)
     *
     * @param id the resource ID
     * @return HTTP 204 No Content
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * PATCH /api/resources/{id}/status
     * Update only the status of a resource (ADMIN only)
     *
     * @param id the resource ID
     * @param status the new resource status
     * @return updated ResourceResponseDto with HTTP 200
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResourceResponseDto> updateResourceStatus(
            @PathVariable Long id,
            @RequestParam ResourceStatus status) {
        ResourceResponseDto updatedResource = resourceService.updateStatus(id, status);
        return ResponseEntity.ok(updatedResource);
    }
}
