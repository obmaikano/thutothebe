package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Entity
@Table(name = "attendance_records", 
       uniqueConstraints = {
           @UniqueConstraint(columnNames = {"student_id", "attendance_date", "course_id", "period_number", "attendance_type"})
       })
@EqualsAndHashCode(callSuper = true)
public class AttendanceRecord extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

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
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "marked_by", nullable = false)
    private User markedBy;

    @NotNull
    @Column(name = "attendance_date", nullable = false)
    private LocalDate attendanceDate;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "attendance_status", nullable = false)
    private AttendanceStatus attendanceStatus;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "attendance_type", nullable = false)
    private AttendanceType attendanceType;

    @Column(name = "period_number")
    private Integer periodNumber;

    @Column(name = "period_start_time")
    private LocalTime periodStartTime;

    @Column(name = "period_end_time")
    private LocalTime periodEndTime;

    @Column(name = "marked_at", nullable = false)
    private LocalDateTime markedAt;

    @Column(name = "arrival_time")
    private LocalTime arrivalTime;

    @Column(name = "departure_time")
    private LocalTime departureTime;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "academic_year", nullable = false)
    private Integer academicYear;

    @Enumerated(EnumType.STRING)
    @Column(name = "term")
    private Term term;

    @Column(name = "is_modified", nullable = false)
    private boolean isModified = false;

    @Column(name = "modified_reason")
    private String modifiedReason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "modified_by")
    private User modifiedBy;

    @Column(name = "modified_at")
    private LocalDateTime modifiedAt;

    @Column(name = "active", nullable = false)
    private boolean active = true;

    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (markedAt == null) {
            markedAt = LocalDateTime.now();
        }
        if (academicYear == null) {
            academicYear = LocalDate.now().getYear();
        }
    }
} 