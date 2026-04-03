package com.university.dto;

import com.university.entity.enums.AvailableDay;
import com.university.entity.enums.ResourceStatus;
import com.university.entity.enums.ResourceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.List;

/**
 * DTO for creating or updating Resources
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceRequestDTO {

    @NotBlank(message = "Resource name is required")
    private String name;

    @NotNull(message = "Resource type is required")
    private ResourceType type;

    private String category;

    private String description;

    @NotNull(message = "Capacity is required")
    @Positive(message = "Capacity must be greater than 0")
    private Integer capacity;

    private String location;

    private String availableFrom; // HH:mm format

    private String availableTo; // HH:mm format

    private List<AvailableDay> availableDays;

    @Builder.Default
    private ResourceStatus status = ResourceStatus.AVAILABLE;

    private String imageUrl;
}
