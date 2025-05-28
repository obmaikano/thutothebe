package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.QuestionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.Set;

public record AssignmentQuestionDTO(
        Long id,
        @NotBlank String text,
        @NotNull QuestionType type,
        @NotNull Integer points,
        @NotNull Long assignmentId,
        boolean autoGradable,
        Set<AssignmentQuestionOptionDTO> options,
        String correctAnswer,
        Integer orderIndex,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime modifiedAt
) {
    public AssignmentQuestionDTO {
        if (text != null && text.isBlank()) {
            throw new IllegalArgumentException("Question text cannot be blank");
        }
        if (points != null && points <= 0) {
            throw new IllegalArgumentException("Points must be greater than 0");
        }
    }
} 