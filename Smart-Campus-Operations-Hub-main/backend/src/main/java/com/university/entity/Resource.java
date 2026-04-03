package com.university.entity;

import com.university.entity.enums.AvailableDay;
import com.university.entity.enums.ResourceStatus;
import com.university.entity.enums.ResourceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

/**
 * Resource Document representing facilities/resources in the university
 */
@Document(collection = "resources")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resource {

    @Id
    private String id;

    @NotBlank(message = "Resource name must not be empty")
    private String name;

    private ResourceType type;

    private String category;

    private String description;

    @Positive(message = "Capacity must be greater than 0")
    private Integer capacity;

    private String location;

    private LocalTime availableFrom;

    private LocalTime availableTo;

    private List<AvailableDay> availableDays;

    @Builder.Default
    private ResourceStatus status = ResourceStatus.AVAILABLE;

    private String imageUrl;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    /**
     * Validate that availableFrom is before availableTo
     */
    public void validateTimes() {
        if (availableFrom != null && availableTo != null) {
            if (availableFrom.isAfter(availableTo)) {
                throw new IllegalArgumentException("availableFrom must be before availableTo");
            }
        }
    }

    /**
     * Update the updatedAt timestamp
     */
    public void updateTimestamp() {
        this.updatedAt = LocalDateTime.now();
    }
}
