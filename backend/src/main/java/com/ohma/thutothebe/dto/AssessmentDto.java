package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.enums.AssessmentStatus;
import com.ohma.thutothebe.entity.enums.GradingStrategy;

import java.time.LocalDateTime;

public record AssessmentDto(
    Long id,
    Long submissionId,
    Long assessorId,
    boolean isSelfAssessment,
    GradingStrategy gradingStrategy,
    Double score,
    String feedback,
    String rubricScores,
    LocalDateTime submittedAt,
    AssessmentStatus status,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public AssessmentDto {
        if (submissionId == null) {
            throw new IllegalArgumentException("Submission ID cannot be null");
        }
        if (assessorId == null) {
            throw new IllegalArgumentException("Assessor ID cannot be null");
        }
        if (gradingStrategy == null) {
            throw new IllegalArgumentException("Grading strategy cannot be null");
        }
    }
} 