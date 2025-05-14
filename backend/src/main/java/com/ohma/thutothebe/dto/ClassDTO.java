package com.ohma.thutothebe.dto;

import java.util.Set;

public record ClassDTO(
    Long id,
    String name,
    String description,
    Long schoolId,
    Set<Long> teacherIds,
    Set<Long> studentIds,
    boolean active
) {
    public ClassDTO {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Class name cannot be null or blank");
        }
        if (schoolId == null) {
            throw new IllegalArgumentException("School ID cannot be null");
        }
    }
} 