package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.QuizStatus;
import com.ohma.thutothebe.entity.enums.GradingType;

import java.time.LocalDateTime;
import java.util.Set;

public record QuizDTO(
    Long id,
    String code,
    String title,
    String description,
    Long courseId,
    Long instructorId,
    LocalDateTime startDate,
    LocalDateTime endDate,
    Integer timeLimit,
    Integer totalPoints,
    QuizStatus status,
    GradingType gradingType,
    boolean autoGradeImmediately,
    boolean showResultsImmediately,
    Integer maxAttempts,
    Set<QuestionDTO> questions,
    boolean active
) {
    public QuizDTO {
        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException("Code cannot be null or blank");
        }
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Title cannot be null or blank");
        }
        if (courseId == null) {
            throw new IllegalArgumentException("Course ID cannot be null");
        }
        if (instructorId == null) {
            throw new IllegalArgumentException("Instructor ID cannot be null");
        }
        if (startDate == null) {
            throw new IllegalArgumentException("Start date cannot be null");
        }
        if (endDate == null) {
            throw new IllegalArgumentException("End date cannot be null");
        }
        if (timeLimit == null || timeLimit <= 0) {
            throw new IllegalArgumentException("Time limit must be greater than 0");
        }
        if (totalPoints == null || totalPoints < 0) {
            throw new IllegalArgumentException("Total points must be greater than 0");
        }
        if (status == null) {
            throw new IllegalArgumentException("Status cannot be null");
        }
        if (gradingType == null) {
            gradingType = GradingType.AUTO;
        }
        if (maxAttempts == null || maxAttempts <= 0) {
            maxAttempts = 1;
        }
    }
} 