package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.AttendanceSummary.AttendanceSummaryType;
import com.ohma.thutothebe.entity.Term;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record AttendanceSummaryDTO(
    Long id,
    
    @NotNull(message = "Student ID is required")
    Long studentId,
    
    String studentName,
    
    @NotNull(message = "Class ID is required")
    Long classId,
    
    String className,
    
    Long courseId,
    
    String courseName,
    
    Long subjectId,
    
    String subjectName,
    
    @NotNull(message = "Academic year is required")
    Integer academicYear,
    
    Term term,
    
    @NotNull(message = "Summary type is required")
    AttendanceSummaryType summaryType,
    
    Integer totalDays,
    
    Integer presentDays,
    
    Integer absentExcusedDays,
    
    Integer absentUnexcusedDays,
    
    Integer lateDays,
    
    Integer earlyDepartureDays,
    
    Double attendancePercentage,
    
    LocalDate periodFrom,
    
    LocalDate periodTo,
    
    LocalDate lastCalculatedDate,
    
    boolean active,
    
    LocalDateTime createdAt,
    
    LocalDateTime modifiedAt
) {
    public AttendanceSummaryDTO {
        if (studentId == null) {
            throw new IllegalArgumentException("Student ID cannot be null");
        }
        if (classId == null) {
            throw new IllegalArgumentException("Class ID cannot be null");
        }
        if (academicYear == null) {
            throw new IllegalArgumentException("Academic year cannot be null");
        }
        if (summaryType == null) {
            throw new IllegalArgumentException("Summary type cannot be null");
        }
        if (academicYear < 2000 || academicYear > 2100) {
            throw new IllegalArgumentException("Academic year must be between 2000 and 2100");
        }
    }
    
    // Helper methods
    public Integer getTotalAbsentDays() {
        return (absentExcusedDays != null ? absentExcusedDays : 0) + 
               (absentUnexcusedDays != null ? absentUnexcusedDays : 0);
    }
    
    public Double getAbsenteeismRate() {
        if (totalDays != null && totalDays > 0) {
            return (getTotalAbsentDays().doubleValue() / totalDays.doubleValue()) * 100.0;
        }
        return 0.0;
    }
} 