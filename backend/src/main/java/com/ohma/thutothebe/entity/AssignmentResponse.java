package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Entity
@Table(name = "assignment_responses")
@Data
@EqualsAndHashCode(callSuper = true)
public class AssignmentResponse extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id")
    private Submission submission;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_question_id")
    private AssignmentQuestion assignmentQuestion;

    @Column(name = "response_text", columnDefinition = "TEXT")
    private String responseText;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "selected_option_id")
    private AssignmentQuestionOption selectedOption;

    @Column(name = "is_correct")
    private Boolean isCorrect;

    @Column(name = "points_earned")
    private Double pointsEarned;

    @Column(name = "auto_graded", nullable = false)
    private boolean autoGraded = false;

    @Column(name = "auto_graded_at")
    private LocalDateTime autoGradedAt;

    @Column(name = "manual_feedback", columnDefinition = "TEXT")
    private String manualFeedback;

    private boolean active = true;

    @PrePersist
    protected void onCreate() {
        super.onCreate();
    }
} 