package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "lesson_completions")
@EqualsAndHashCode(callSuper = true)
public class LessonCompletion extends BaseEntity {

    @NotNull(message = "Lesson is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @NotNull(message = "Student is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @NotNull(message = "Completion status is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "completion_status", nullable = false)
    private CompletionStatus completionStatus = CompletionStatus.NOT_STARTED;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "time_spent_minutes")
    private Integer timeSpentMinutes;

    @Column(name = "completion_percentage")
    private Double completionPercentage = 0.0;

    @Column(name = "score")
    private Double score;

    @Column(name = "max_score")
    private Double maxScore = 100.0;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "attended_in_person", nullable = false)
    private boolean attendedInPerson = false;

    @Column(name = "participated_actively", nullable = false)
    private boolean participatedActively = false;

    @Column(name = "completed_assignments", nullable = false)
    private boolean completedAssignments = false;

    @Column(name = "understood_content", nullable = false)
    private boolean understoodContent = false;

    @Column(nullable = false)
    private boolean active = true;

    public enum CompletionStatus {
        NOT_STARTED,    // Student hasn't started the lesson
        IN_PROGRESS,    // Student is currently working on the lesson
        COMPLETED,      // Student has completed the lesson
        PARTIALLY_COMPLETED, // Student has completed some parts but not all
        FAILED,         // Student failed to complete the lesson requirements
        EXEMPTED        // Student was exempted from this lesson
    }
} 