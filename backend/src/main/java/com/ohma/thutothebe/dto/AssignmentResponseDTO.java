package com.ohma.thutothebe.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record AssignmentResponseDTO(
        Long id,
        @NotNull Long submissionId,
        @NotNull Long assignmentQuestionId,
        String responseText,
        Long selectedOptionId,
        Boolean isCorrect,
        Double pointsEarned,
        boolean autoGraded,
        LocalDateTime autoGradedAt,
        String manualFeedback,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime modifiedAt
) {
    public AssignmentResponseDTO {
        if (pointsEarned != null && pointsEarned < 0) {
            throw new IllegalArgumentException("Points earned cannot be negative");
        }
    }
} 