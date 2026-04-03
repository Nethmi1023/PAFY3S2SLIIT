package com.university.entity.enums;

/**
 * Enum for Resource Types
 */
public enum ResourceType {
    LAB("Laboratory"),
    HALL("Hall"),
    ROOM("Room"),
    EQUIPMENT("Equipment");

    private final String displayName;

    ResourceType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
