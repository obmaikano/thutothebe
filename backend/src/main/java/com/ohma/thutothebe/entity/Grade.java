package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "grades")
@EqualsAndHashCode(callSuper = true)
public class Grade extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessment_id")
    private Assessment assessment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_id")
    private Assignment assignment;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "grade_type", nullable = false)
    private GradeType gradeType;

    @NotNull
    @DecimalMin(value = "0.0", message = "Grade cannot be negative")
    @DecimalMax(value = "100.0", message = "Grade cannot exceed 100")
    @Column(name = "score", nullable = false, precision = 5, scale = 2)
    private Double score;

    @Column(name = "max_score", precision = 5, scale = 2)
    private Double maxScore = 100.0;

    @Column(name = "weight", precision = 5, scale = 2)
    private Double weight = 1.0;

    @Column(name = "feedback", columnDefinition = "TEXT")
    private String feedback;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "graded_by", nullable = false)
    private User gradedBy;

    @Column(name = "graded_at", nullable = false)
    private LocalDateTime gradedAt;

    @Column(name = "is_final", nullable = false)
    private boolean isFinal = false;

    @Column(name = "is_moderated", nullable = false)
    private boolean isModerated = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "moderated_by")
    private User moderatedBy;

    @Column(name = "moderated_at")
    private LocalDateTime moderatedAt;

    @Column(name = "moderation_notes", columnDefinition = "TEXT")
    private String moderationNotes;

    @Column(name = "original_score", precision = 5, scale = 2)
    private Double originalScore;

    @Column(name = "active", nullable = false)
    private boolean active = true;

    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (gradedAt == null) {
            gradedAt = LocalDateTime.now();
        }
    }
} 