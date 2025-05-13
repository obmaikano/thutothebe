package com.ohma.thutothebe.dto;

import java.time.LocalDateTime;

public record ThreadDTO(
    Long id,
    String title,
    String content,
    Long forumId,
    Long authorId,
    boolean pinned,
    LocalDateTime lastActivityAt,
    boolean active
) {
    public ThreadDTO {
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Title cannot be null or blank");
        }
        if (content == null || content.isBlank()) {
            throw new IllegalArgumentException("Content cannot be null or blank");
        }
        if (forumId == null) {
            throw new IllegalArgumentException("Forum ID cannot be null");
        }
        if (authorId == null) {
            throw new IllegalArgumentException("Author ID cannot be null");
        }
    }
} 