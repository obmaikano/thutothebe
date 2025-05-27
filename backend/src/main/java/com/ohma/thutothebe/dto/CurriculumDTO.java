package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.CurriculumStatus;
import com.ohma.thutothebe.entity.CurriculumType;
import com.ohma.thutothebe.entity.enums.GradeLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

public record CurriculumDTO(
    Long id,
    
    @NotBlank(message = "Curriculum title is required")
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    String title,
    
    String description,
    
    @NotNull(message = "Curriculum type is required")
    CurriculumType curriculumType,
    
    @NotNull(message = "Grade level is required")
    GradeLevel gradeLevel,
    
    @NotNull(message = "Status is required")
    CurriculumStatus status,
    
    @NotNull(message = "Academic year is required")
    Integer academicYear,
    
    LocalDate effectiveDate,
    
    LocalDate expiryDate,
    
    String learningOutcomes,
    
    Integer durationWeeks,
    
    Integer totalHours,
    
    Long regionId,
    
    String regionName,
    
    Long schoolId,
    
    String schoolName,
    
    @NotNull(message = "Created by is required")
    Long createdById,
    
    String createdByName,
    
    Long approvedById,
    
    String approvedByName,
    
    LocalDate approvedAt,
    
    Set<Long> subjectIds,
    
    Set<String> subjectNames,
    
    boolean active,
    
    Integer curriculumVersion,
    
    String metadata,
    
    LocalDateTime createdAt,
    
    LocalDateTime modifiedAt
) {
    public CurriculumDTO {
        if (title != null && title.isBlank()) {
            throw new IllegalArgumentException("Title cannot be blank");
        }
        if (academicYear != null && academicYear < 1900) {
            throw new IllegalArgumentException("Academic year must be valid");
        }
        if (durationWeeks != null && durationWeeks <= 0) {
            throw new IllegalArgumentException("Duration weeks must be positive");
        }
        if (totalHours != null && totalHours <= 0) {
            throw new IllegalArgumentException("Total hours must be positive");
        }
        if (status == null) {
            status = CurriculumStatus.DRAFT;
        }
    }
} 