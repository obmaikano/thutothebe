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
        // Allow questionId to be null during creation (will be set when creating as part of a question)
    }
} 