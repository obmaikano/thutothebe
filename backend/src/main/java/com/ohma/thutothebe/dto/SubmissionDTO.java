package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.SubmissionStatus;
import com.ohma.thutothebe.entity.enums.SubmissionPhase;

import java.time.LocalDateTime;
import java.util.List;

public record SubmissionDTO(
    Long id,
    Long studentId,
    Long courseId,
    Long assignmentId,
    String content,
    LocalDateTime submittedAt,
    SubmissionPhase phase,
    SubmissionStatus status,
    List<AssessmentDto> assessments,
    Double finalScore,
    String feedback,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    Double score,
    Double maxScore,
    Double percentage,
    String grade,
    String comments,
    String filePaths,
    LocalDateTime gradedAt,
    Long gradedBy,
    Integer attemptNumber,
    Boolean isLateSubmission,
    Boolean needsReview,
    String originalFileName,
    String fileSize,
    Boolean autoGraded,
    Boolean manuallyGraded,
    LocalDateTime reviewedAt,
    Long reviewedBy,
    String studentComments,
    String rubricScores,
    Integer timeSpent,
    Boolean plagiarismChecked
) {
    public SubmissionDTO {
        if (studentId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (courseId == null) {
            throw new IllegalArgumentException("Course ID cannot be null");
        }
        if (content == null || content.isBlank()) {
            throw new IllegalArgumentException("Content cannot be null or blank");
        }
        if (submittedAt == null) {
            throw new IllegalArgumentException("Submission date cannot be null");
        }
        if (phase == null) {
            throw new IllegalArgumentException("Phase cannot be null");
        }
    }
} 