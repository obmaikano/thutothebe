package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.SubmissionStatus;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record SubmissionDTO(
    Long id,
    @NotNull Long assignmentId,
    @NotNull Long studentId,
    String content,
    String fileUrl,
    @NotNull LocalDateTime submittedAt,
    LocalDateTime gradedAt,
    Integer score,
    String feedback,
    SubmissionStatus status
) {
    public SubmissionDTO {
        if (assignmentId == null) {
            throw new IllegalArgumentException("Assignment ID cannot be null");
        }
        if (studentId == null) {
            throw new IllegalArgumentException("Student ID cannot be null");
        }
        if (submittedAt == null) {
            throw new IllegalArgumentException("Submission date cannot be null");
        }
        if (score != null && score < 0) {
            throw new IllegalArgumentException("Score cannot be negative");
        }
    }
} 