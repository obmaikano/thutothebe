package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.CurriculumAssessment;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public record CurriculumAssessmentDTO(
    Long id,
    
    @NotNull(message = "Curriculum ID is required")
    Long curriculumId,
    String curriculumTitle,
    
    Long curriculumUnitId,
    String curriculumUnitTitle,
    
    Long curriculumTopicId,
    String curriculumTopicTitle,
    
    @NotNull(message = "Assessment ID is required")
    Long assessmentId,
    String assessmentTitle,
    
    @NotNull(message = "Assessment purpose is required")
    CurriculumAssessment.AssessmentPurpose assessmentPurpose,
    
    Double weightPercentage,
    boolean isMandatory,
    Integer sequenceOrder,
    List<Long> prerequisiteAssessments,
    List<String> learningObjectivesCovered,
    List<String> competenciesAssessed,
    String alignmentNotes,
    
    @NotNull(message = "Linked by ID is required")
    Long linkedById,
    String linkedByName,
    
    LocalDateTime linkedAt,
    boolean isActive
) {
    public CurriculumAssessmentDTO {
        if (weightPercentage != null && (weightPercentage < 0 || weightPercentage > 100)) {
            throw new IllegalArgumentException("Weight percentage must be between 0 and 100");
        }
        if (sequenceOrder != null && sequenceOrder < 0) {
            throw new IllegalArgumentException("Sequence order cannot be negative");
        }
    }
} 