package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.QuizSubmissionStatus;

import java.time.LocalDateTime;
import java.util.Set;

public record QuizSubmissionDTO(
    Long id,
    Long quizId,
    Long studentId,
    LocalDateTime startedAt,
    LocalDateTime submittedAt,
    LocalDateTime gradedAt,
    Integer score,
    String feedback,
    QuizSubmissionStatus status,
    Set<QuestionResponseDTO> responses,
    boolean active
) {
    public QuizSubmissionDTO {
        if (quizId == null) {
            throw new IllegalArgumentException("Quiz ID cannot be null");
        }
        if (studentId == null) {
            throw new IllegalArgumentException("Student ID cannot be null");
        }
        if (startedAt == null) {
            throw new IllegalArgumentException("Started at cannot be null");
        }
        if (status == null) {
            throw new IllegalArgumentException("Status cannot be null");
        }
    }
} 