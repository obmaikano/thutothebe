package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import com.ohma.thutothebe.entity.enums.GradingStrategy;
import com.ohma.thutothebe.entity.enums.AssessmentStatus;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "assessments")
@EqualsAndHashCode(callSuper = true)
public class Assessment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id", nullable = false)
    private Submission submission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessor_id", nullable = false)
    private User assessor;

    @Column(name = "is_self_assessment", nullable = false)
    private boolean isSelfAssessment;

    @Enumerated(EnumType.STRING)
    @Column(name = "grading_strategy", nullable = false)
    private GradingStrategy gradingStrategy;

    @Column(name = "score")
    private Double score;

    @Column(name = "feedback", columnDefinition = "TEXT")
    private String feedback;

    @Column(name = "rubric_scores", columnDefinition = "JSONB")
    private String rubricScores;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private AssessmentStatus status = AssessmentStatus.PENDING;
} 