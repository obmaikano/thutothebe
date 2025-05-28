package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "school_monitoring")
@EqualsAndHashCode(callSuper = true)
public class SchoolMonitoring extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id", nullable = false)
    private School school;

    @NotNull
    @Column(name = "monitoring_date", nullable = false)
    private LocalDate monitoringDate;

    @Column(name = "total_active_teachers")
    private Integer totalActiveTeachers;

    @Column(name = "total_active_students")
    private Integer totalActiveStudents;

    @Column(name = "total_logins")
    private Integer totalLogins;

    @Column(name = "teacher_logins")
    private Integer teacherLogins;

    @Column(name = "student_logins")
    private Integer studentLogins;

    @Column(name = "admin_logins")
    private Integer adminLogins;

    @Column(name = "attendance_rate", precision = 5, scale = 2)
    private Double attendanceRate;

    @Column(name = "assignment_submissions")
    private Integer assignmentSubmissions;

    @Column(name = "assignments_graded")
    private Integer assignmentsGraded;

    @Column(name = "average_grading_turnaround_hours", precision = 8, scale = 2)
    private Double averageGradingTurnaroundHours;

    @Column(name = "curriculum_completion_rate", precision = 5, scale = 2)
    private Double curriculumCompletionRate;

    @Column(name = "system_uptime_percentage", precision = 5, scale = 2)
    private Double systemUptimePercentage;

    @Column(name = "peak_usage_hour")
    private Integer peakUsageHour;

    @Column(name = "total_announcements")
    private Integer totalAnnouncements;

    @Column(name = "announcements_acknowledged")
    private Integer announcementsAcknowledged;

    @Column(name = "forum_posts")
    private Integer forumPosts;

    @Column(name = "quiz_submissions")
    private Integer quizSubmissions;

    @Column(name = "document_uploads")
    private Integer documentUploads;

    @Column(name = "document_downloads")
    private Integer documentDownloads;

    @Column(name = "last_activity_timestamp")
    private LocalDateTime lastActivityTimestamp;

    @Column(name = "compliance_score", precision = 5, scale = 2)
    private Double complianceScore;

    @Column(name = "alert_count")
    private Integer alertCount;

    @Column(name = "active", nullable = false)
    private boolean active = true;
} 