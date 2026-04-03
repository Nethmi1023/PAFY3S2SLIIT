package com.university.controller;

import com.university.dto.ResourceRequestDTO;
import com.university.dto.ResourceResponseDTO;
import com.university.entity.enums.ResourceStatus;
import com.university.entity.enums.ResourceType;
import com.university.service.ResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Resource management
 * Handles all HTTP requests related to resources
 */
@RestController
@RequestMapping("/resources")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ResourceController {

    private final ResourceService resourceService;

    /**
     * Create a new resource
     * POST /api/resources
     *
     * @param requestDTO Resource details to create
     * @return Created resource with 201 status
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResourceResponseDTO> createResource(
            @Valid @RequestBody ResourceRequestDTO requestDTO) {
        log.info("POST request to create resource: {}", requestDTO.getName());
        
        ResourceResponseDTO createdResource = resourceService.createResource(requestDTO);
        
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(createdResource);
    }

    /**
     * Get all resources with pagination and sorting
     * GET /api/resources
     *
     * @param pageable Pagination parameters
     * @return Page of resources
     */
    @GetMapping
    public ResponseEntity<Page<ResourceResponseDTO>> getAllResources(
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("GET request to fetch all resources with pagination: {}", pageable);
        
        Page<ResourceResponseDTO> resources = resourceService.getAllResources(pageable);
        
        return ResponseEntity.ok(resources);
    }

    /**
     * Get resource by ID
     * GET /api/resources/{id}
     *
     * @param id Resource ID
     * @return Resource details
     */
    @GetMapping("/{id}")
    public ResponseEntity<ResourceResponseDTO> getResourceById(@PathVariable String id) {
        log.info("GET request to fetch resource with id: {}", id);
        
        ResourceResponseDTO resource = resourceService.getResourceById(id);
        
        return ResponseEntity.ok(resource);
    }

    /**
     * Get all available resources
     * GET /api/resources/available/list
     *
     * @return List of available resources
     */
    @GetMapping("/available/list")
    public ResponseEntity<List<ResourceResponseDTO>> getAvailableResources() {
        log.info("GET request to fetch available resources");
        
        List<ResourceResponseDTO> resources = resourceService.getAvailableResources();
        
        return ResponseEntity.ok(resources);
    }

    /**
     * Update existing resource
     * PUT /api/resources/{id}
     *
     * @param id Resource ID to update
     * @param requestDTO Updated resource details
     * @return Updated resource
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResourceResponseDTO> updateResource(
            @PathVariable String id,
            @Valid @RequestBody ResourceRequestDTO requestDTO) {
        log.info("PUT request to update resource with id: {}", id);
        
        ResourceResponseDTO updatedResource = resourceService.updateResource(id, requestDTO);
        
        return ResponseEntity.ok(updatedResource);
    }

    /**
     * Delete resource
     * DELETE /api/resources/{id}
     *
     * @param id Resource ID to delete
     * @return No content response
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteResource(@PathVariable String id) {
        log.info("DELETE request to delete resource with id: {}", id);
        
        resourceService.deleteResource(id);
        
        return ResponseEntity.noContent().build();
    }

    /**
     * Search resources by keyword
     * GET /api/resources/search?keyword=lab
     *
     * @param keyword Search keyword (name, location, description)
     * @param pageable Pagination parameters
     * @return Page of matching resources
     */
    @GetMapping("/search/keyword")
    public ResponseEntity<Page<ResourceResponseDTO>> searchResources(
            @RequestParam String keyword,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("GET request to search resources with keyword: {}", keyword);
        
        Page<ResourceResponseDTO> resources = resourceService.searchResources(keyword, pageable);
        
        return ResponseEntity.ok(resources);
    }

    /**
     * Filter resources by type
     * GET /api/resources/filter/type?type=LAB
     *
     * @param type Resource type (LAB, HALL, ROOM, EQUIPMENT)
     * @param pageable Pagination parameters
     * @return Page of resources filtered by type
     */
    @GetMapping("/filter/type")
    public ResponseEntity<Page<ResourceResponseDTO>> filterByType(
            @RequestParam ResourceType type,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("GET request to filter resources by type: {}", type);
        
        Page<ResourceResponseDTO> resources = resourceService.filterByType(type, pageable);
        
        return ResponseEntity.ok(resources);
    }

    /**
     * Filter resources by status
     * GET /api/resources/filter/status?status=AVAILABLE
     *
     * @param status Resource status (AVAILABLE, UNAVAILABLE, MAINTENANCE)
     * @param pageable Pagination parameters
     * @return Page of resources filtered by status
     */
    @GetMapping("/filter/status")
    public ResponseEntity<Page<ResourceResponseDTO>> filterByStatus(
            @RequestParam ResourceStatus status,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("GET request to filter resources by status: {}", status);
        
        Page<ResourceResponseDTO> resources = resourceService.filterByStatus(status, pageable);
        
        return ResponseEntity.ok(resources);
    }

    /**
     * Filter resources by location
     * GET /api/resources/filter/location?location=Building%20A
     *
     * @param location Location name
     * @param pageable Pagination parameters
     * @return Page of resources filtered by location
     */
    @GetMapping("/filter/location")
    public ResponseEntity<Page<ResourceResponseDTO>> filterByLocation(
            @RequestParam String location,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("GET request to filter resources by location: {}", location);
        
        Page<ResourceResponseDTO> resources = resourceService.filterByLocation(location, pageable);
        
        return ResponseEntity.ok(resources);
    }

    /**
     * Filter resources by minimum capacity
     * GET /api/resources/filter/capacity?capacity=30
     *
     * @param capacity Minimum capacity
     * @param pageable Pagination parameters
     * @return Page of resources with capacity >= specified value
     */
    @GetMapping("/filter/capacity")
    public ResponseEntity<Page<ResourceResponseDTO>> filterByCapacity(
            @RequestParam Integer capacity,
            @PageableDefault(size = 10, sort = "capacity", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("GET request to filter resources by capacity: {}", capacity);
        
        Page<ResourceResponseDTO> resources = resourceService.filterByCapacity(capacity, pageable);
        
        return ResponseEntity.ok(resources);
    }

    /**
     * Filter resources by type and capacity
     * GET /api/resources/filter/type-capacity?type=LAB&capacity=30
     *
     * @param type Resource type
     * @param capacity Minimum capacity
     * @param pageable Pagination parameters
     * @return Page of resources filtered by type and capacity
     */
    @GetMapping("/filter/type-capacity")
    public ResponseEntity<Page<ResourceResponseDTO>> filterByTypeAndCapacity(
            @RequestParam ResourceType type,
            @RequestParam Integer capacity,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("GET request to filter resources by type: {} and capacity: {}", type, capacity);
        
        Page<ResourceResponseDTO> resources = resourceService.filterByTypeAndCapacity(type, capacity, pageable);
        
        return ResponseEntity.ok(resources);
    }
}
