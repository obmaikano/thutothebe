package com.ohma.thutothebe.dto;

import java.time.LocalDateTime;

public record StudentPerformanceDTO(
    Long id,
    Long studentId,
    Long courseId,
    Double averageGrade,
    Integer totalSubmissions,
    Integer forumPosts,
    Integer loginCount,
    Long timeSpentMinutes,
    LocalDateTime lastUpdated
) {
    public StudentPerformanceDTO {
        if (studentId == null) {
            throw new IllegalArgumentException("Student ID cannot be null");
        }
        if (courseId == null) {
            throw new IllegalArgumentException("Course ID cannot be null");
        }
        if (averageGrade == null || averageGrade < 0 || averageGrade > 100) {
            throw new IllegalArgumentException("Average grade must be between 0 and 100");
        }
        if (totalSubmissions == null || totalSubmissions < 0) {
            throw new IllegalArgumentException("Total submissions must be non-negative");
        }
        if (forumPosts == null || forumPosts < 0) {
            throw new IllegalArgumentException("Forum posts must be non-negative");
        }
        if (loginCount == null || loginCount < 0) {
            throw new IllegalArgumentException("Login count must be non-negative");
        }
        if (timeSpentMinutes == null || timeSpentMinutes < 0) {
            throw new IllegalArgumentException("Time spent must be non-negative");
        }
    }
} 