package com.ohma.thutothebe.dto;

import java.time.LocalDateTime;

public record CourseStatisticsDTO(
    Long id,
    Long courseId,
    Integer currentEnrollment,
    Integer totalEnrollment,
    Double averageGrade,
    Double completionRate,
    Double dropoutRate,
    LocalDateTime lastUpdated
) {
    public CourseStatisticsDTO {
        if (courseId == null) {
            throw new IllegalArgumentException("Course ID cannot be null");
        }
        if (currentEnrollment == null || currentEnrollment < 0) {
            throw new IllegalArgumentException("Current enrollment must be non-negative");
        }
        if (totalEnrollment == null || totalEnrollment < 0) {
            throw new IllegalArgumentException("Total enrollment must be non-negative");
        }
        if (averageGrade == null || averageGrade < 0 || averageGrade > 100) {
            throw new IllegalArgumentException("Average grade must be between 0 and 100");
        }
        if (completionRate == null || completionRate < 0 || completionRate > 100) {
            throw new IllegalArgumentException("Completion rate must be between 0 and 100");
        }
        if (dropoutRate == null || dropoutRate < 0 || dropoutRate > 100) {
            throw new IllegalArgumentException("Dropout rate must be between 0 and 100");
        }
    }
} 