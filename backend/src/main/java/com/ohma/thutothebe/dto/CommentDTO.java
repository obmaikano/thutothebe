package com.ohma.thutothebe.dto;

import java.time.LocalDateTime;

public record CommentDTO(
    Long id,
    String content,
    Long threadId,
    Long authorId,
    Long parentId,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    boolean active
) {
    public CommentDTO {
        if (content == null || content.isBlank()) {
            throw new IllegalArgumentException("Content cannot be null or blank");
        }
        if (threadId == null) {
            throw new IllegalArgumentException("Thread ID cannot be null");
        }
        if (authorId == null) {
            throw new IllegalArgumentException("Author ID cannot be null");
        }
    }
} 