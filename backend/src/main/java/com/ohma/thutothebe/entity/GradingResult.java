package com.ohma.thutothebe.entity;

import com.ohma.thutothebe.entity.enums.GradingStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Entity
@Table(name = "grading_results")
@Data
@EqualsAndHashCode(callSuper = true)
public class GradingResult extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id")
    private Submission submission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_submission_id")
    private QuizSubmission quizSubmission;

    @Column(name = "auto_score")
    private Double autoScore;

    @Column(name = "manual_score")
    private Double manualScore;

    @Column(name = "final_score")
    private Double finalScore;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private GradingStatus status = GradingStatus.PENDING;

    @Column(name = "auto_graded_at")
    private LocalDateTime autoGradedAt;

    @Column(name = "manual_graded_at")
    private LocalDateTime manualGradedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "graded_by")
    private User gradedBy;

    @Column(name = "auto_feedback", columnDefinition = "TEXT")
    private String autoFeedback;

    @Column(name = "manual_feedback", columnDefinition = "TEXT")
    private String manualFeedback;

    @Column(name = "requires_manual_review", nullable = false)
    private boolean requiresManualReview = false;

    @Column(name = "auto_grading_details", columnDefinition = "JSONB")
    private String autoGradingDetails; // JSON with detailed auto-grading breakdown

    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (status == null) {
            status = GradingStatus.PENDING;
        }
    }
} 