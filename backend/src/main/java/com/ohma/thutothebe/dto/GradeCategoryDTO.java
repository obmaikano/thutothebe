package com.ohma.thutothebe.dto;

public record GradeCategoryDTO(
    Long id,
    String name,
    String description,
    Double weight,
    Long courseId,
    boolean active,
    Double minGrade,
    Double maxGrade,
    Double passingGrade
) {
    public GradeCategoryDTO {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Name cannot be null or blank");
        }
        if (description == null || description.isBlank()) {
            throw new IllegalArgumentException("Description cannot be null or blank");
        }
        if (weight == null || weight <= 0 || weight > 100) {
            throw new IllegalArgumentException("Weight must be between 0 and 100");
        }
        if (courseId == null) {
            throw new IllegalArgumentException("Course ID cannot be null");
        }
        if (minGrade != null && (minGrade < 0 || minGrade > 100)) {
            throw new IllegalArgumentException("Minimum grade must be between 0 and 100");
        }
        if (maxGrade != null && (maxGrade < 0 || maxGrade > 100)) {
            throw new IllegalArgumentException("Maximum grade must be between 0 and 100");
        }
        if (passingGrade != null && (passingGrade < 0 || passingGrade > 100)) {
            throw new IllegalArgumentException("Passing grade must be between 0 and 100");
        }
        if (minGrade != null && maxGrade != null && minGrade > maxGrade) {
            throw new IllegalArgumentException("Minimum grade cannot be greater than maximum grade");
        }
        if (passingGrade != null && minGrade != null && passingGrade < minGrade) {
            throw new IllegalArgumentException("Passing grade cannot be less than minimum grade");
        }
        if (passingGrade != null && maxGrade != null && passingGrade > maxGrade) {
            throw new IllegalArgumentException("Passing grade cannot be greater than maximum grade");
        }
    }
} 