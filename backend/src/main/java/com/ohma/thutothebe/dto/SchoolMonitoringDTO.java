package com.ohma.thutothebe.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Schema(description = "School monitoring data transfer object")
public record SchoolMonitoringDTO(
    @Schema(description = "Unique identifier", example = "1")
    Long id,

    @Schema(description = "School ID", example = "1")
    Long schoolId,

    @Schema(description = "School name", example = "Gaborone Primary School")
    String schoolName,

    @Schema(description = "School code", example = "GPS001")
    String schoolCode,

    @Schema(description = "Region ID", example = "1")
    Long regionId,

    @Schema(description = "Region name", example = "South East Region")
    String regionName,

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Schema(description = "Monitoring date", example = "2024-03-11")
    LocalDate monitoringDate,

    @Schema(description = "Total active teachers", example = "25")
    Integer totalActiveTeachers,

    @Schema(description = "Total active students", example = "450")
    Integer totalActiveStudents,

    @Schema(description = "Total logins", example = "120")
    Integer totalLogins,

    @Schema(description = "Teacher logins", example = "25")
    Integer teacherLogins,

    @Schema(description = "Student logins", example = "85")
    Integer studentLogins,

    @Schema(description = "Admin logins", example = "10")
    Integer adminLogins,

    @Schema(description = "Attendance rate percentage", example = "92.5")
    Double attendanceRate,

    @Schema(description = "Assignment submissions", example = "75")
    Integer assignmentSubmissions,

    @Schema(description = "Assignments graded", example = "68")
    Integer assignmentsGraded,

    @Schema(description = "Average grading turnaround in hours", example = "24.5")
    Double averageGradingTurnaroundHours,

    @Schema(description = "Curriculum completion rate percentage", example = "78.3")
    Double curriculumCompletionRate,

    @Schema(description = "System uptime percentage", example = "99.2")
    Double systemUptimePercentage,

    @Schema(description = "Peak usage hour (0-23)", example = "10")
    Integer peakUsageHour,

    @Schema(description = "Total announcements", example = "15")
    Integer totalAnnouncements,

    @Schema(description = "Announcements acknowledged", example = "12")
    Integer announcementsAcknowledged,

    @Schema(description = "Forum posts", example = "35")
    Integer forumPosts,

    @Schema(description = "Quiz submissions", example = "42")
    Integer quizSubmissions,

    @Schema(description = "Document uploads", example = "18")
    Integer documentUploads,

    @Schema(description = "Document downloads", example = "156")
    Integer documentDownloads,

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Schema(description = "Last activity timestamp", example = "2024-03-11 15:30:00")
    LocalDateTime lastActivityTimestamp,

    @Schema(description = "Compliance score percentage", example = "85.7")
    Double complianceScore,

    @Schema(description = "Alert count", example = "3")
    Integer alertCount,

    @Schema(description = "Active status", example = "true")
    boolean active
) {
    public SchoolMonitoringDTO {
        if (schoolId == null) {
            throw new IllegalArgumentException("School ID cannot be null");
        }
        if (monitoringDate == null) {
            throw new IllegalArgumentException("Monitoring date cannot be null");
        }
    }
} 