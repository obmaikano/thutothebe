package com.ohma.thutothebe.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record AssignmentQuestionOptionDTO(
        Long id,
        @NotBlank String text,
        @NotNull boolean isCorrect,
        @NotNull Long assignmentQuestionId,
        Integer orderIndex,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime modifiedAt
) {
    public AssignmentQuestionOptionDTO {
        if (text != null && text.isBlank()) {
            throw new IllegalArgumentException("Option text cannot be blank");
        }
    }
} 