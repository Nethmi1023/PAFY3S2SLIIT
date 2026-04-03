package com.university.dto;

import com.university.entity.enums.AvailableDay;
import com.university.entity.enums.ResourceStatus;
import com.university.entity.enums.ResourceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for returning Resource responses
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceResponseDTO {

    private String id;
    private String name;
    private ResourceType type;
    private String category;
    private String description;
    private Integer capacity;
    private String location;
    private String availableFrom;
    private String availableTo;
    private List<AvailableDay> availableDays;
    private ResourceStatus status;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
