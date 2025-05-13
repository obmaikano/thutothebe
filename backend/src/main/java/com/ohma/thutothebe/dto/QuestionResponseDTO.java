package com.ohma.thutothebe.dto;

import java.util.Set;

public record QuestionResponseDTO(
    Long id,
    Long submissionId,
    Long questionId,
    String textResponse,
    Set<Long> selectedOptionIds,
    Integer pointsAwarded,
    String feedback,
    boolean active
) {
    public QuestionResponseDTO {
        if (submissionId == null) {
            throw new IllegalArgumentException("Submission ID cannot be null");
        }
        if (questionId == null) {
            throw new IllegalArgumentException("Question ID cannot be null");
        }
    }
} 