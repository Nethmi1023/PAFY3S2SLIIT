package com.university.repository;

import com.university.entity.Resource;
import com.university.entity.enums.ResourceStatus;
import com.university.entity.enums.ResourceType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * MongoDB Repository for Resource Document
 */
@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {

    /**
     * Find resources by type
     */
    Page<Resource> findByType(ResourceType type, Pageable pageable);

    /**
     * Find resources by status
     */
    Page<Resource> findByStatus(ResourceStatus status, Pageable pageable);

    /**
     * Find resources by location (case-insensitive)
     */
    Page<Resource> findByLocationIgnoreCase(String location, Pageable pageable);

    /**
     * Find resources by category
     */
    Page<Resource> findByCategory(String category, Pageable pageable);

    /**
     * Find resources by capacity greater than or equal to specified value
     */
    Page<Resource> findByCapacityGreaterThanEqual(Integer capacity, Pageable pageable);

    /**
     * Search resources by name, location, or description (MongoDB query)
     */
    @Query("{ $or: [ { 'name': { $regex: ?0, $options: 'i' } }, { 'location': { $regex: ?0, $options: 'i' } }, { 'description': { $regex: ?0, $options: 'i' } } ] }")
    Page<Resource> searchResources(String keyword, Pageable pageable);

    /**
     * Find resources by type and status
     */
    Page<Resource> findByTypeAndStatus(ResourceType type, ResourceStatus status, Pageable pageable);

    /**
     * Find resources by type and capacity greater than or equal to
     */
    Page<Resource> findByTypeAndCapacityGreaterThanEqual(ResourceType type, Integer capacity, Pageable pageable);

    /**
     * Check if resource exists by name (case-insensitive)
     */
    boolean existsByNameIgnoreCase(String name);

    /**
     * Get all resources by type
     */
    List<Resource> findByType(ResourceType type);

    /**
     * Get all available resources
     */
    List<Resource> findByStatus(ResourceStatus status);
}
