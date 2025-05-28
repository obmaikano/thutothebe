package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.AttendanceStatus;
import com.ohma.thutothebe.entity.AttendanceType;
import com.ohma.thutothebe.entity.Term;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record AttendanceRecordDTO(
    Long id,
    
    @NotNull(message = "Student entity ID is required")
    Long studentEntityId,
    
    Long studentUserId, // Optional - for students with user accounts
    
    String studentName,
    
    @NotNull(message = "Class ID is required")
    Long classId,
    
    String className,
    
    Long courseId,
    
    String courseName,
    
    Long subjectId,
    
    String subjectName,
    
    @NotNull(message = "Marked by user ID is required")
    Long markedById,
    
    String markedByName,
    
    @NotNull(message = "Attendance date is required")
    @PastOrPresent(message = "Attendance date cannot be in the future")
    LocalDate attendanceDate,
    
    @NotNull(message = "Attendance status is required")
    AttendanceStatus attendanceStatus,
    
    @NotNull(message = "Attendance type is required")
    AttendanceType attendanceType,
    
    Integer periodNumber,
    
    LocalTime periodStartTime,
    
    LocalTime periodEndTime,
    
    LocalDateTime markedAt,
    
    LocalTime arrivalTime,
    
    LocalTime departureTime,
    
    String remarks,
    
    @NotNull(message = "Academic year is required")
    Integer academicYear,
    
    Term term,
    
    boolean isModified,
    
    String modifiedReason,
    
    Long modifiedById,
    
    String modifiedByName,
    
    LocalDateTime modifiedAt,
    
    boolean active,
    
    LocalDateTime createdAt,
    
    LocalDateTime modifiedAtBase
) {
    public AttendanceRecordDTO {
        if (studentEntityId == null) {
            throw new IllegalArgumentException("Student entity ID cannot be null");
        }
        if (classId == null) {
            throw new IllegalArgumentException("Class ID cannot be null");
        }
        if (markedById == null) {
            throw new IllegalArgumentException("Marked by user ID cannot be null");
        }
        if (attendanceDate == null) {
            throw new IllegalArgumentException("Attendance date cannot be null");
        }
        if (attendanceStatus == null) {
            throw new IllegalArgumentException("Attendance status cannot be null");
        }
        if (attendanceType == null) {
            throw new IllegalArgumentException("Attendance type cannot be null");
        }
        if (academicYear == null) {
            throw new IllegalArgumentException("Academic year cannot be null");
        }
        if (academicYear < 2000 || academicYear > 2100) {
            throw new IllegalArgumentException("Academic year must be between 2000 and 2100");
        }
        if (attendanceType == AttendanceType.PERIOD && periodNumber == null) {
            throw new IllegalArgumentException("Period number is required for period-based attendance");
        }
        if (attendanceDate != null && attendanceDate.isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Attendance date cannot be in the future");
        }
    }
    
    // Convenience method to get the student ID for backward compatibility
    public Long studentId() {
        return studentUserId != null ? studentUserId : studentEntityId;
    }
} 