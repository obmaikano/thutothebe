package com.ohma.thutothebe.dto;

import java.time.LocalDateTime;

public record ProgressDTO(
    Long id,
    Long studentId,
    Long courseId,
    Double completionPercentage,
    Double grade,
    boolean completed,
    boolean active,
    LocalDateTime lastActivityAt,
    LocalDateTime completedAt
) {
    public ProgressDTO {
        if (studentId == null) {
            throw new IllegalArgumentException("Student ID cannot be null");
        }
        if (courseId == null) {
            throw new IllegalArgumentException("Course ID cannot be null");
        }
        if (completionPercentage == null || completionPercentage < 0 || completionPercentage > 100) {
            throw new IllegalArgumentException("Completion percentage must be between 0 and 100");
        }
        if (grade == null || grade < 0 || grade > 100) {
            throw new IllegalArgumentException("Grade must be between 0 and 100");
        }
    }
} 