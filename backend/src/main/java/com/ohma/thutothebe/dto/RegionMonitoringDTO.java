package com.ohma.thutothebe.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Schema(description = "Region monitoring data transfer object")
public record RegionMonitoringDTO(
    @Schema(description = "Unique identifier", example = "1")
    Long id,

    @Schema(description = "Region ID", example = "1")
    Long regionId,

    @Schema(description = "Region name", example = "South East Region")
    String regionName,

    @Schema(description = "Region code", example = "SER001")
    String regionCode,

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Schema(description = "Monitoring date", example = "2024-03-11")
    LocalDate monitoringDate,

    @Schema(description = "Total schools", example = "15")
    Integer totalSchools,

    @Schema(description = "Active schools", example = "14")
    Integer activeSchools,

    @Schema(description = "Total teachers", example = "350")
    Integer totalTeachers,

    @Schema(description = "Total students", example = "6750")
    Integer totalStudents,

    @Schema(description = "Total logins", example = "1850")
    Integer totalLogins,

    @Schema(description = "Average attendance rate percentage", example = "91.2")
    Double averageAttendanceRate,

    @Schema(description = "Total assignment submissions", example = "1125")
    Integer totalAssignmentSubmissions,

    @Schema(description = "Total assignments graded", example = "1020")
    Integer totalAssignmentsGraded,

    @Schema(description = "Average grading turnaround in hours", example = "26.8")
    Double averageGradingTurnaroundHours,

    @Schema(description = "Average curriculum completion rate percentage", example = "76.5")
    Double averageCurriculumCompletionRate,

    @Schema(description = "Average system uptime percentage", example = "98.9")
    Double averageSystemUptimePercentage,

    @Schema(description = "Schools with low usage", example = "2")
    Integer schoolsWithLowUsage,

    @Schema(description = "Schools with delayed grading", example = "3")
    Integer schoolsWithDelayedGrading,

    @Schema(description = "Schools with irregular attendance", example = "1")
    Integer schoolsWithIrregularAttendance,

    @Schema(description = "Total alerts", example = "18")
    Integer totalAlerts,

    @Schema(description = "High performing schools", example = "8")
    Integer highPerformingSchools,

    @Schema(description = "Low performing schools", example = "2")
    Integer lowPerformingSchools,

    @Schema(description = "Average compliance score percentage", example = "83.4")
    Double averageComplianceScore,

    @Schema(description = "Resource utilization rate percentage", example = "78.9")
    Double resourceUtilizationRate,

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Schema(description = "Last updated timestamp", example = "2024-03-11 16:00:00")
    LocalDateTime lastUpdated,

    @Schema(description = "Active status", example = "true")
    boolean active
) {
    public RegionMonitoringDTO {
        if (regionId == null) {
            throw new IllegalArgumentException("Region ID cannot be null");
        }
        if (monitoringDate == null) {
            throw new IllegalArgumentException("Monitoring date cannot be null");
        }
    }
} 