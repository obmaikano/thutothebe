package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "attendance_summaries",
       uniqueConstraints = {
           @UniqueConstraint(columnNames = {"student_entity_id", "class_id", "course_id", "academic_year", "term", "summary_type"})
       })
@EqualsAndHashCode(callSuper = true)
public class AttendanceSummary extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_entity_id", nullable = false)
    private Student studentEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_user_id", nullable = true)
    private User studentUser;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false)
    private Class classEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id")
    private Subject subject;

    @NotNull
    @Column(name = "academic_year", nullable = false)
    private Integer academicYear;

    @Enumerated(EnumType.STRING)
    @Column(name = "term")
    private Term term;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "summary_type", nullable = false)
    private AttendanceSummaryType summaryType;

    @Column(name = "total_days", nullable = false)
    private Integer totalDays = 0;

    @Column(name = "present_days", nullable = false)
    private Integer presentDays = 0;

    @Column(name = "absent_excused_days", nullable = false)
    private Integer absentExcusedDays = 0;

    @Column(name = "absent_unexcused_days", nullable = false)
    private Integer absentUnexcusedDays = 0;

    @Column(name = "late_days", nullable = false)
    private Integer lateDays = 0;

    @Column(name = "early_departure_days", nullable = false)
    private Integer earlyDepartureDays = 0;

    @Column(name = "attendance_percentage", nullable = false)
    private Double attendancePercentage = 0.0;

    @Column(name = "period_from")
    private LocalDate periodFrom;

    @Column(name = "period_to")
    private LocalDate periodTo;

    @Column(name = "last_calculated_date")
    private LocalDate lastCalculatedDate;

    @Column(name = "active", nullable = false)
    private boolean active = true;

    public enum AttendanceSummaryType {
        DAILY,
        WEEKLY,
        MONTHLY,
        TERM,
        ANNUAL,
        COURSE_SPECIFIC
    }

    // Helper methods for calculations
    public Integer getTotalAbsentDays() {
        return absentExcusedDays + absentUnexcusedDays;
    }

    public void calculateAttendancePercentage() {
        if (totalDays > 0) {
            this.attendancePercentage = (presentDays.doubleValue() / totalDays.doubleValue()) * 100.0;
        } else {
            this.attendancePercentage = 0.0;
        }
    }

    @PrePersist
    @PreUpdate
    protected void onSave() {
        calculateAttendancePercentage();
        if (lastCalculatedDate == null) {
            lastCalculatedDate = LocalDate.now();
        }
    }
} 