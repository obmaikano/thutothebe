package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "curriculum_analytics")
@EqualsAndHashCode(callSuper = true)
public class CurriculumAnalytics extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curriculum_id", nullable = false)
    private Curriculum curriculum;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id")
    private School school;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_id")
    private Region region;

    @NotNull
    @Column(name = "report_date", nullable = false)
    private LocalDate reportDate;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "analytics_type", nullable = false)
    private AnalyticsType analyticsType;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "aggregation_level", nullable = false)
    private AggregationLevel aggregationLevel;

    // Implementation Progress Metrics
    @Column(name = "total_schools")
    private Integer totalSchools;

    @Column(name = "schools_started")
    private Integer schoolsStarted;

    @Column(name = "schools_completed")
    private Integer schoolsCompleted;

    @Column(name = "overall_progress_percentage")
    private Double overallProgressPercentage;

    // Teacher Metrics
    @Column(name = "total_teachers")
    private Integer totalTeachers;

    @Column(name = "teachers_trained")
    private Integer teachersTrained;

    @Column(name = "teachers_implementing")
    private Integer teachersImplementing;

    @Column(name = "teacher_readiness_score")
    private Double teacherReadinessScore;

    // Student Metrics
    @Column(name = "total_students")
    private Integer totalStudents;

    @Column(name = "students_enrolled")
    private Integer studentsEnrolled;

    @Column(name = "student_performance_average")
    private Double studentPerformanceAverage;

    @Column(name = "completion_rate")
    private Double completionRate;

    // Resource Metrics
    @Column(name = "resources_available")
    private Integer resourcesAvailable;

    @Column(name = "resources_utilized")
    private Integer resourcesUtilized;

    @Column(name = "resource_utilization_rate")
    private Double resourceUtilizationRate;

    // Assessment Metrics
    @Column(name = "assessments_conducted")
    private Integer assessmentsConducted;

    @Column(name = "average_assessment_score")
    private Double averageAssessmentScore;

    @Column(name = "assessment_completion_rate")
    private Double assessmentCompletionRate;

    // Time Metrics
    @Column(name = "planned_duration_weeks")
    private Integer plannedDurationWeeks;

    @Column(name = "actual_duration_weeks")
    private Integer actualDurationWeeks;

    @Column(name = "time_efficiency_ratio")
    private Double timeEfficiencyRatio;

    // Quality Metrics
    @Column(name = "quality_score")
    private Double qualityScore;

    @Column(name = "alignment_score")
    private Double alignmentScore;

    @Column(name = "effectiveness_rating")
    private Double effectivenessRating;

    // Challenges and Issues
    @Column(name = "challenges_identified")
    private Integer challengesIdentified;

    @Column(name = "issues_resolved")
    private Integer issuesResolved;

    @Column(name = "risk_level")
    private String riskLevel; // LOW, MEDIUM, HIGH, CRITICAL

    // Additional Metrics (JSON)
    @Column(name = "detailed_metrics", columnDefinition = "JSONB")
    private String detailedMetrics;

    @Column(name = "trend_data", columnDefinition = "JSONB")
    private String trendData;

    @Column(name = "comparative_data", columnDefinition = "JSONB")
    private String comparativeData;

    // Metadata
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "generated_by", nullable = false)
    private User generatedBy;

    @Column(name = "generated_at", nullable = false)
    private LocalDateTime generatedAt;

    @Column(name = "data_source")
    private String dataSource;

    @Column(name = "calculation_method")
    private String calculationMethod;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (generatedAt == null) {
            generatedAt = LocalDateTime.now();
        }
        if (reportDate == null) {
            reportDate = LocalDate.now();
        }
    }

    public enum AnalyticsType {
        IMPLEMENTATION_PROGRESS,
        PERFORMANCE_ANALYSIS,
        RESOURCE_UTILIZATION,
        TEACHER_EFFECTIVENESS,
        STUDENT_OUTCOMES,
        COMPARATIVE_ANALYSIS,
        TREND_ANALYSIS,
        QUALITY_ASSESSMENT,
        COMPLIANCE_MONITORING,
        IMPACT_EVALUATION
    }

    public enum AggregationLevel {
        NATIONAL,
        REGIONAL,
        SCHOOL,
        CLASS,
        INDIVIDUAL
    }
} 