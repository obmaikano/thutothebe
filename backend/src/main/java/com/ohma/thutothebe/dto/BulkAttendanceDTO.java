package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.AttendanceStatus;
import com.ohma.thutothebe.entity.AttendanceType;
import com.ohma.thutothebe.entity.Term;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record BulkAttendanceDTO(
    @NotNull(message = "Class ID is required")
    Long classId,
    
    Long courseId,
    
    Long subjectId,
    
    @NotNull(message = "Attendance date is required")
    LocalDate attendanceDate,
    
    @NotNull(message = "Attendance type is required")
    AttendanceType attendanceType,
    
    Integer periodNumber,
    
    LocalTime periodStartTime,
    
    LocalTime periodEndTime,
    
    @NotNull(message = "Academic year is required")
    Integer academicYear,
    
    Term term,
    
    @NotNull(message = "Marked by user ID is required")
    Long markedById,
    
    @NotEmpty(message = "Student attendance records cannot be empty")
    List<StudentAttendanceDTO> studentAttendances
) {
    public record StudentAttendanceDTO(
        @NotNull(message = "Student ID is required")
        Long studentId,
        
        @NotNull(message = "Attendance status is required")
        AttendanceStatus attendanceStatus,
        
        LocalTime arrivalTime,
        
        LocalTime departureTime,
        
        String remarks
    ) {
        public StudentAttendanceDTO {
            if (studentId == null) {
                throw new IllegalArgumentException("Student ID cannot be null");
            }
            if (attendanceStatus == null) {
                throw new IllegalArgumentException("Attendance status cannot be null");
            }
        }
    }
    
    public BulkAttendanceDTO {
        if (classId == null) {
            throw new IllegalArgumentException("Class ID cannot be null");
        }
        if (attendanceDate == null) {
            throw new IllegalArgumentException("Attendance date cannot be null");
        }
        if (attendanceType == null) {
            throw new IllegalArgumentException("Attendance type cannot be null");
        }
        if (academicYear == null) {
            throw new IllegalArgumentException("Academic year cannot be null");
        }
        if (markedById == null) {
            throw new IllegalArgumentException("Marked by user ID cannot be null");
        }
        if (studentAttendances == null || studentAttendances.isEmpty()) {
            throw new IllegalArgumentException("Student attendance records cannot be empty");
        }
        if (academicYear < 2000 || academicYear > 2100) {
            throw new IllegalArgumentException("Academic year must be between 2000 and 2100");
        }
        if (attendanceType == AttendanceType.PERIOD && periodNumber == null) {
            throw new IllegalArgumentException("Period number is required for period-based attendance");
        }
        if (attendanceDate.isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Attendance date cannot be in the future");
        }
    }
} 