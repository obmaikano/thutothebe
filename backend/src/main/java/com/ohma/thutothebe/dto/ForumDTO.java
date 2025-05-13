package com.ohma.thutothebe.dto;

public record ForumDTO(
    Long id,
    String title,
    String description,
    Long courseId,
    boolean active
) {
    public ForumDTO {
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Title cannot be null or blank");
        }
        if (courseId == null) {
            throw new IllegalArgumentException("Course ID cannot be null");
        }
    }
} 