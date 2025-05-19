package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.enums.StudentStatus;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.Set;

public record StudentOnboardingDTO(
    @NotNull(message = "Student ID is required")
    Long studentId,
    
    @NotNull(message = "Class ID is required")
    Long classId,
    
    @NotEmpty(message = "At least one subject must be selected")
    Set<Long> subjectIds,
    
    @NotNull(message = "Status is required")
    StudentStatus status,
    
    String onboardingNotes
) {} 