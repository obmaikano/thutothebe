package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.QuestionType;

import java.util.Set;

public record QuestionDTO(
    Long id,
    String text,
    QuestionType type,
    Integer points,
    Long quizId,
    Set<QuestionOptionDTO> options,
    String correctAnswer,
    boolean active
) {
    public QuestionDTO {
        if (text == null || text.isBlank()) {
            throw new IllegalArgumentException("Text cannot be null or blank");
        }
        if (type == null) {
            throw new IllegalArgumentException("Type cannot be null");
        }
        if (points == null || points <= 0) {
            throw new IllegalArgumentException("Points must be greater than 0");
        }
        if (quizId == null) {
            throw new IllegalArgumentException("Quiz ID cannot be null");
        }
    }
} 