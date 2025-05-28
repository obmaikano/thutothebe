package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.enums.GradingStatus;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record GradingResultDTO(
        Long id,
        Long submissionId,
        Long quizSubmissionId,
        Double autoScore,
        Double manualScore,
        Double finalScore,
        @NotNull GradingStatus status,
        LocalDateTime autoGradedAt,
        LocalDateTime manualGradedAt,
        Long gradedById,
        String gradedByName,
        String autoFeedback,
        String manualFeedback,
        boolean requiresManualReview,
        String autoGradingDetails,
        LocalDateTime createdAt,
        LocalDateTime modifiedAt
) {
    public GradingResultDTO {
        if (status == null) {
            status = GradingStatus.PENDING;
        }
    }
} 