package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "region_monitoring")
@EqualsAndHashCode(callSuper = true)
public class RegionMonitoring extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_id", nullable = false)
    private Region region;

    @NotNull
    @Column(name = "monitoring_date", nullable = false)
    private LocalDate monitoringDate;

    @Column(name = "total_schools")
    private Integer totalSchools;

    @Column(name = "active_schools")
    private Integer activeSchools;

    @Column(name = "total_teachers")
    private Integer totalTeachers;

    @Column(name = "total_students")
    private Integer totalStudents;

    @Column(name = "total_logins")
    private Integer totalLogins;

    @Column(name = "average_attendance_rate", precision = 5, scale = 2)
    private Double averageAttendanceRate;

    @Column(name = "total_assignment_submissions")
    private Integer totalAssignmentSubmissions;

    @Column(name = "total_assignments_graded")
    private Integer totalAssignmentsGraded;

    @Column(name = "average_grading_turnaround_hours", precision = 8, scale = 2)
    private Double averageGradingTurnaroundHours;

    @Column(name = "average_curriculum_completion_rate", precision = 5, scale = 2)
    private Double averageCurriculumCompletionRate;

    @Column(name = "average_system_uptime_percentage", precision = 5, scale = 2)
    private Double averageSystemUptimePercentage;

    @Column(name = "schools_with_low_usage")
    private Integer schoolsWithLowUsage;

    @Column(name = "schools_with_delayed_grading")
    private Integer schoolsWithDelayedGrading;

    @Column(name = "schools_with_irregular_attendance")
    private Integer schoolsWithIrregularAttendance;

    @Column(name = "total_alerts")
    private Integer totalAlerts;

    @Column(name = "high_performing_schools")
    private Integer highPerformingSchools;

    @Column(name = "low_performing_schools")
    private Integer lowPerformingSchools;

    @Column(name = "average_compliance_score", precision = 5, scale = 2)
    private Double averageComplianceScore;

    @Column(name = "resource_utilization_rate", precision = 5, scale = 2)
    private Double resourceUtilizationRate;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    @Column(name = "active", nullable = false)
    private boolean active = true;
} 