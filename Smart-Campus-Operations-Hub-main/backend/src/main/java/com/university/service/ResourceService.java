package com.university.service;

import com.university.dto.ResourceRequestDTO;
import com.university.dto.ResourceResponseDTO;
import com.university.entity.Resource;
import com.university.entity.enums.ResourceStatus;
import com.university.entity.enums.ResourceType;
import com.university.exception.ResourceNotFoundException;
import com.university.exception.ResourceValidationException;
import com.university.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Service class for Resource management
 * Contains business logic for CRUD operations and search functionality
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    /**
     * Create a new resource
     */
    public ResourceResponseDTO createResource(ResourceRequestDTO dto) {
        log.debug("Creating new resource: {}", dto.getName());
        
        // Validate request
        validateResourceRequest(dto);

        // Check if resource with same name already exists
        if (resourceRepository.existsByNameIgnoreCase(dto.getName())) {
            throw new ResourceValidationException("Resource with name '" + dto.getName() + "' already exists");
        }

        // Convert DTO to Entity
        Resource resource = mapDTOToEntity(dto);

        // Save to database
        Resource savedResource = resourceRepository.save(resource);
        log.info("Resource created successfully with id: {}", savedResource.getId());

        return mapEntityToDTO(savedResource);
    }

    /**
     * Get resource by ID
     */
    @Transactional(readOnly = true)
    public ResourceResponseDTO getResourceById(String id) {
        log.debug("Fetching resource with id: {}", id);
        
        Resource resource = resourceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(id));

        return mapEntityToDTO(resource);
    }

    /**
     * Get all resources with pagination and sorting
     */
    @Transactional(readOnly = true)
    public Page<ResourceResponseDTO> getAllResources(Pageable pageable) {
        log.debug("Fetching all resources with pagination: {}", pageable);
        
        return resourceRepository.findAll(pageable)
            .map(this::mapEntityToDTO);
    }

    /**
     * Get all available resources
     */
    @Transactional(readOnly = true)
    public List<ResourceResponseDTO> getAvailableResources() {
        log.debug("Fetching all available resources");
        
        return resourceRepository.findByStatus(ResourceStatus.AVAILABLE)
            .stream()
            .map(this::mapEntityToDTO)
            .toList();
    }

    /**
     * Update existing resource
     */
    public ResourceResponseDTO updateResource(String id, ResourceRequestDTO dto) {
        log.debug("Updating resource with id: {}", id);
        
        // Validate request
        validateResourceRequest(dto);

        // Find existing resource
        Resource resource = resourceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(id));

        // Update resource fields
        updateResourceFields(resource, dto);
        
        // Update timestamp
        resource.updateTimestamp();

        // Save updated resource
        Resource updatedResource = resourceRepository.save(resource);
        log.info("Resource updated successfully with id: {}", id);

        return mapEntityToDTO(updatedResource);
    }

    /**
     * Delete resource by ID
     */
    public void deleteResource(String id) {
        log.debug("Deleting resource with id: {}", id);
        
        if (!resourceRepository.existsById(id)) {
            throw new ResourceNotFoundException(id);
        }

        resourceRepository.deleteById(id);
        log.info("Resource deleted successfully with id: {}", id);
    }

    /**
     * Search resources by keyword (name, location, description)
     */
    @Transactional(readOnly = true)
    public Page<ResourceResponseDTO> searchResources(String keyword, Pageable pageable) {
        log.debug("Searching resources with keyword: {}", keyword);
        
        return resourceRepository.searchResources(keyword, pageable)
            .map(this::mapEntityToDTO);
    }

    /**
     * Filter resources by type
     */
    @Transactional(readOnly = true)
    public Page<ResourceResponseDTO> filterByType(ResourceType type, Pageable pageable) {
        log.debug("Filtering resources by type: {}", type);
        
        return resourceRepository.findByType(type, pageable)
            .map(this::mapEntityToDTO);
    }

    /**
     * Filter resources by status
     */
    @Transactional(readOnly = true)
    public Page<ResourceResponseDTO> filterByStatus(ResourceStatus status, Pageable pageable) {
        log.debug("Filtering resources by status: {}", status);
        
        return resourceRepository.findByStatus(status, pageable)
            .map(this::mapEntityToDTO);
    }

    /**
     * Filter resources by location
     */
    @Transactional(readOnly = true)
    public Page<ResourceResponseDTO> filterByLocation(String location, Pageable pageable) {
        log.debug("Filtering resources by location: {}", location);
        
        return resourceRepository.findByLocationIgnoreCase(location, pageable)
            .map(this::mapEntityToDTO);
    }

    /**
     * Filter resources by minimum capacity
     */
    @Transactional(readOnly = true)
    public Page<ResourceResponseDTO> filterByCapacity(Integer minCapacity, Pageable pageable) {
        log.debug("Filtering resources by minimum capacity: {}", minCapacity);
        
        return resourceRepository.findByCapacityGreaterThanEqual(minCapacity, pageable)
            .map(this::mapEntityToDTO);
    }

    /**
     * Filter resources by type and capacity
     */
    @Transactional(readOnly = true)
    public Page<ResourceResponseDTO> filterByTypeAndCapacity(ResourceType type, Integer minCapacity, Pageable pageable) {
        log.debug("Filtering resources by type: {} and capacity: {}", type, minCapacity);
        
        return resourceRepository.findByTypeAndCapacityGreaterThanEqual(type, minCapacity, pageable)
            .map(this::mapEntityToDTO);
    }

    /**
     * Validate resource request DTO
     */
    private void validateResourceRequest(ResourceRequestDTO dto) {
        // Validate times if both are provided
        if (dto.getAvailableFrom() != null && dto.getAvailableTo() != null) {
            try {
                LocalTime fromTime = LocalTime.parse(dto.getAvailableFrom(), TIME_FORMATTER);
                LocalTime toTime = LocalTime.parse(dto.getAvailableTo(), TIME_FORMATTER);

                if (fromTime.isAfter(toTime) || fromTime.equals(toTime)) {
                    throw new ResourceValidationException(
                        "availableFrom must be before availableTo (format: HH:mm)"
                    );
                }
            } catch (Exception e) {
                throw new ResourceValidationException(
                    "Invalid time format. Use HH:mm format (e.g., 08:00, 17:30)"
                );
            }
        }
    }

    /**
     * Map Resource Entity to Response DTO
     */
    private ResourceResponseDTO mapEntityToDTO(Resource resource) {
        return ResourceResponseDTO.builder()
            .id(resource.getId())
            .name(resource.getName())
            .type(resource.getType())
            .category(resource.getCategory())
            .description(resource.getDescription())
            .capacity(resource.getCapacity())
            .location(resource.getLocation())
            .availableFrom(resource.getAvailableFrom() != null 
                ? resource.getAvailableFrom().format(TIME_FORMATTER) 
                : null)
            .availableTo(resource.getAvailableTo() != null 
                ? resource.getAvailableTo().format(TIME_FORMATTER) 
                : null)
            .availableDays(resource.getAvailableDays())
            .status(resource.getStatus())
            .imageUrl(resource.getImageUrl())
            .createdAt(resource.getCreatedAt())
            .updatedAt(resource.getUpdatedAt())
            .build();
    }

    /**
     * Map Request DTO to Resource Entity
     */
    private Resource mapDTOToEntity(ResourceRequestDTO dto) {
        Resource resource = new Resource();
        updateResourceFields(resource, dto);
        return resource;
    }

    /**
     * Update resource fields from DTO
     */
    private void updateResourceFields(Resource resource, ResourceRequestDTO dto) {
        resource.setName(dto.getName());
        resource.setType(dto.getType());
        resource.setCategory(dto.getCategory());
        resource.setDescription(dto.getDescription());
        resource.setCapacity(dto.getCapacity());
        resource.setLocation(dto.getLocation());
        resource.setAvailableDays(dto.getAvailableDays());
        resource.setStatus(dto.getStatus() != null ? dto.getStatus() : ResourceStatus.AVAILABLE);
        resource.setImageUrl(dto.getImageUrl());

        // Parse time strings to LocalTime
        if (dto.getAvailableFrom() != null) {
            resource.setAvailableFrom(LocalTime.parse(dto.getAvailableFrom(), TIME_FORMATTER));
        }
        if (dto.getAvailableTo() != null) {
            resource.setAvailableTo(LocalTime.parse(dto.getAvailableTo(), TIME_FORMATTER));
        }
    }
}
