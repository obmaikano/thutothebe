package com.ohma.thutothebe.dto;

import java.util.Set;

public record CourseDTO(
    Long id,
    String code,
    String name,
    String description,
    Long teacherId,
    Set<Long> studentIds,
    boolean active,
    Long version
) {
    public CourseDTO {
        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException("Course code cannot be null or blank");
        }
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Course name cannot be null or blank");
        }
        if (teacherId == null) {
            throw new IllegalArgumentException("Teacher ID cannot be null");
        }
        if (studentIds == null) {
            studentIds = Set.of();
        }
    }
} 