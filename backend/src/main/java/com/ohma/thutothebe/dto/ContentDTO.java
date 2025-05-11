package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.ContentType;
import java.time.LocalDateTime;

public record ContentDTO(
    Long id,
    String title,
    String description,
    ContentType type,
    String url,
    Long courseId,
    Long createdById,
    LocalDateTime createdAt,
    boolean active
) {
    public ContentDTO {
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Title cannot be null or blank");
        }
        if (type == null) {
            throw new IllegalArgumentException("Content type cannot be null");
        }
        if (url == null || url.isBlank()) {
            throw new IllegalArgumentException("URL cannot be null or blank");
        }
        if (courseId == null) {
            throw new IllegalArgumentException("Course ID cannot be null");
        }
        if (createdById == null) {
            throw new IllegalArgumentException("Creator ID cannot be null");
        }
    }
} 