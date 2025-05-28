package com.ohma.thutothebe.entity;

import com.ohma.thutothebe.entity.enums.GradingType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "quizzes")
@Data
@EqualsAndHashCode(callSuper = true)
public class Quiz extends BaseEntity implements Gradable {

    @NotBlank
    @Column(unique = true)
    private String code;

    @NotBlank
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
    private LocalDateTime startDate;

    @NotNull
    private LocalDateTime endDate;

    @NotNull
    private Integer timeLimit; // in minutes

    @NotNull
    private Integer totalPoints;

    @NotNull
    @Enumerated(EnumType.STRING)
    private QuizStatus status = QuizStatus.DRAFT;

    @Enumerated(EnumType.STRING)
    @Column(name = "grading_type", nullable = false)
    private GradingType gradingType = GradingType.AUTO;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Question> questions = new HashSet<>();

    @Column(name = "auto_grade_immediately", nullable = false)
    private boolean autoGradeImmediately = true;

    @Column(name = "show_results_immediately", nullable = false)
    private boolean showResultsImmediately = true;

    @Column(name = "max_attempts")
    private Integer maxAttempts = 1;

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

    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (status == null) {
            status = QuizStatus.DRAFT;
        }
        // Quizzes are typically auto-graded by default
        if (gradingType == null) {
            gradingType = GradingType.AUTO;
        }
    }
} 