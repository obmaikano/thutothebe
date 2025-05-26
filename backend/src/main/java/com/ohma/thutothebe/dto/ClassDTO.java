package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.enums.GradeLevel;
import java.util.Set;

public record ClassDTO(
    Long id,
    String name,
    String description,
    GradeLevel gradeLevel,
    Integer capacity,
    Integer totalEnrolled,
    Integer spotsLeft,
    Boolean overCapacity,
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
        if (gradeLevel == null) {
            throw new IllegalArgumentException("Grade level cannot be null");
        }
        if (capacity != null && capacity < 1) {
            throw new IllegalArgumentException("Class capacity must be at least 1");
        }
    }
} 