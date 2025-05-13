package com.ohma.thutothebe.dto;

public record QuestionOptionDTO(
    Long id,
    String text,
    boolean isCorrect,
    Long questionId,
    boolean active
) {
    public QuestionOptionDTO {
        if (text == null || text.isBlank()) {
            throw new IllegalArgumentException("Text cannot be null or blank");
        }
        if (questionId == null) {
            throw new IllegalArgumentException("Question ID cannot be null");
        }
    }
} 