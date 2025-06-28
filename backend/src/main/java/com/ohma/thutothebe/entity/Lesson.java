package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "lessons")
@EqualsAndHashCode(callSuper = true)
public class Lesson extends BaseEntity {

    @NotBlank(message = "Lesson title is required")
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "Course is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @NotNull(message = "Instructor is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instructor_id", nullable = false)
    private User instructor;

    @Column(name = "lesson_order", nullable = false)
    private Integer lessonOrder;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(name = "estimated_duration_minutes")
    private Integer estimatedDurationMinutes;

    @Column(name = "scheduled_date")
    private LocalDateTime scheduledDate;

    @Column(name = "completed_date")
    private LocalDateTime completedDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "lesson_status", nullable = false)
    private LessonStatus status = LessonStatus.PLANNED;

    @Column(columnDefinition = "TEXT")
    private String objectives;

    @Column(columnDefinition = "TEXT")
    private String materials;

    @Column(columnDefinition = "TEXT")
    private String activities;

    @Column(columnDefinition = "TEXT")
    private String assessment;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "is_mandatory", nullable = false)
    private boolean isMandatory = true;

    @Column(name = "prerequisites", columnDefinition = "TEXT")
    private String prerequisites; // JSON array of lesson IDs

    @Column(name = "learning_outcomes", columnDefinition = "TEXT")
    private String learningOutcomes; // JSON array

    @Column(nullable = false)
    private boolean active = true;

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<LessonCompletion> lessonCompletions = new HashSet<>();

    public enum LessonStatus {
        PLANNED,      // Lesson is planned but not yet scheduled
        SCHEDULED,    // Lesson is scheduled for a specific date/time
        IN_PROGRESS,  // Lesson is currently being taught
        COMPLETED,    // Lesson has been completed
        CANCELLED,    // Lesson was cancelled
        POSTPONED     // Lesson was postponed to a later date
    }
} 