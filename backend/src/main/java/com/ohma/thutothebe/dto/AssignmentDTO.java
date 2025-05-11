package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.AssignmentStatus;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record AssignmentDTO(
    Long id,
    @NotNull String title,
    @NotNull String description,
    @NotNull Long courseId,
    @NotNull Long instructorId,
    @NotNull LocalDateTime dueDate,
    @NotNull AssignmentStatus status
) {
    public AssignmentDTO {
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Title cannot be null or blank");
        }
        if (description == null || description.isBlank()) {
            throw new IllegalArgumentException("Description cannot be null or blank");
        }
        if (courseId == null) {
            throw new IllegalArgumentException("Course ID cannot be null");
        }
        if (instructorId == null) {
            throw new IllegalArgumentException("Instructor ID cannot be null");
        }
        if (dueDate == null) {
            throw new IllegalArgumentException("Due date cannot be null");
        }
        if (status == null) {
            throw new IllegalArgumentException("Status cannot be null");
        }
    }
} 