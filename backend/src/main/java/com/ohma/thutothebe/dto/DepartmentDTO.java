package com.ohma.thutothebe.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.Set;

public record DepartmentDTO(
    Long id,
    
    @NotBlank(message = "Department name is required")
    @Size(min = 2, max = 100, message = "Department name must be between 2 and 100 characters")
    String name,
    
    @Size(max = 500, message = "Description cannot exceed 500 characters")
    String description,
    
    @NotNull(message = "School ID is required")
    Long schoolId,
    
    String schoolName,
    
    Long departmentHeadId,
    
    String departmentHeadName,
    
    Set<Long> subjectIds,
    
    Set<String> subjectNames,
    
    Set<Long> teacherIds,
    
    Set<String> teacherNames,
    
    boolean active,
    
    LocalDateTime createdAt,
    
    LocalDateTime modifiedAt
) {
    public DepartmentDTO {
        if (name != null) {
            name = name.trim();
        }
        if (description != null) {
            description = description.trim();
        }
        if (schoolName != null) {
            schoolName = schoolName.trim();
        }
        if (departmentHeadName != null) {
            departmentHeadName = departmentHeadName.trim();
        }
        if (name != null && name.isBlank()) {
            throw new IllegalArgumentException("Department name cannot be blank");
        }
        if (schoolId != null && schoolId <= 0) {
            throw new IllegalArgumentException("School ID must be positive");
        }
        if (departmentHeadId != null && departmentHeadId <= 0) {
            throw new IllegalArgumentException("Department head ID must be positive");
        }
    }
} 