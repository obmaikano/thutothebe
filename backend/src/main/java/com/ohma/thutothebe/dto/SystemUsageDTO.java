package com.ohma.thutothebe.dto;

import java.time.LocalDateTime;

public record SystemUsageDTO(
    Long id,
    LocalDateTime timestamp,
    Integer activeUsers,
    Integer totalLogins,
    Integer instructorCount,
    Integer studentCount,
    Integer adminCount,
    String peakModule,
    String peakCourse
) {
    public SystemUsageDTO {
        if (timestamp == null) {
            throw new IllegalArgumentException("Timestamp cannot be null");
        }
        if (activeUsers == null || activeUsers < 0) {
            throw new IllegalArgumentException("Active users must be non-negative");
        }
        if (totalLogins == null || totalLogins < 0) {
            throw new IllegalArgumentException("Total logins must be non-negative");
        }
        if (instructorCount == null || instructorCount < 0) {
            throw new IllegalArgumentException("Instructor count must be non-negative");
        }
        if (studentCount == null || studentCount < 0) {
            throw new IllegalArgumentException("Student count must be non-negative");
        }
        if (adminCount == null || adminCount < 0) {
            throw new IllegalArgumentException("Admin count must be non-negative");
        }
        if (peakModule == null || peakModule.isBlank()) {
            throw new IllegalArgumentException("Peak module cannot be blank");
        }
        if (peakCourse == null || peakCourse.isBlank()) {
            throw new IllegalArgumentException("Peak course cannot be blank");
        }
    }
} 