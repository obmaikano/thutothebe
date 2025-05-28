package com.ohma.thutothebe.entity;

import com.ohma.thutothebe.entity.enums.GradingType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "assignments")
@EqualsAndHashCode(callSuper = true)
public class Assignment extends BaseEntity implements Gradable {

    @NotNull
    @Column(unique = true)
    private String code;

    @NotNull
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instructor_id")
    private User instructor;

    @NotNull
    private LocalDateTime dueDate;

    @NotNull
    private Integer totalPoints;

    @NotNull
    @Enumerated(EnumType.STRING)
    private AssignmentStatus status = AssignmentStatus.DRAFT;

    @Enumerated(EnumType.STRING)
    @Column(name = "grading_type", nullable = false)
    private GradingType gradingType = GradingType.MANUAL;

    @OneToMany(mappedBy = "assignment", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<AssignmentQuestion> questions = new HashSet<>();

    @Column(name = "auto_grade_immediately", nullable = false)
    private boolean autoGradeImmediately = false;

    @Column(name = "allow_late_submissions", nullable = false)
    private boolean allowLateSubmissions = true;

    @Column(name = "max_attempts")
    private Integer maxAttempts;

    private boolean active = true;

    @Override
    public GradingType getGradingType() {
        return this.gradingType;
    }

    @Override
    public boolean supportsAutoGrading() {
        return gradingType == GradingType.AUTO || gradingType == GradingType.HYBRID;
    }

    @Override
    public boolean supportsManualGrading() {
        return gradingType == GradingType.MANUAL || gradingType == GradingType.HYBRID;
    }

    @Override
    public Integer getTotalPoints() {
        return this.totalPoints;
    }

    /**
     * Calculates if this assignment has any auto-gradable questions
     */
    public boolean hasAutoGradableQuestions() {
        return questions != null && questions.stream().anyMatch(AssignmentQuestion::isAutoGradable);
    }

    /**
     * Calculates total points from auto-gradable questions
     */
    public Integer getAutoGradablePoints() {
        if (questions == null) return 0;
        return questions.stream()
                .filter(AssignmentQuestion::isAutoGradable)
                .mapToInt(AssignmentQuestion::getPoints)
                .sum();
    }

    /**
     * Calculates total points from manual-gradable questions
     */
    public Integer getManualGradablePoints() {
        if (questions == null) return 0;
        return questions.stream()
                .filter(q -> !q.isAutoGradable())
                .mapToInt(AssignmentQuestion::getPoints)
                .sum();
    }

    @PrePersist
    protected void onCreate() {
        super.onCreate();
        // Auto-determine grading type based on questions
        if (hasAutoGradableQuestions() && getManualGradablePoints() > 0) {
            this.gradingType = GradingType.HYBRID;
        } else if (hasAutoGradableQuestions()) {
            this.gradingType = GradingType.AUTO;
        } else {
            this.gradingType = GradingType.MANUAL;
        }
    }
} 