package com.ohma.thutothebe.entity;

import com.ohma.thutothebe.entity.enums.GradingMode;
import com.ohma.thutothebe.entity.enums.SubmissionPhase;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@Entity
@Table(name = "submissions")
@EqualsAndHashCode(callSuper = true)
public class Submission extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_id", nullable = false)
    private Assignment assignment;

    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;

    @Column(name = "phase", nullable = false)
    @Enumerated(EnumType.STRING)
    private SubmissionPhase phase = SubmissionPhase.SUBMISSION;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private SubmissionStatus status;

    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Assessment> assessments = new ArrayList<>();

    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<AssignmentResponse> assignmentResponses = new HashSet<>();

    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GradingResult> gradingResults = new ArrayList<>();

    @Column(name = "auto_score")
    private Double autoScore;

    @Column(name = "manual_score")
    private Double manualScore;

    @Column(name = "final_score")
    private Double finalScore;

    @Column(name = "feedback", columnDefinition = "TEXT")
    private String feedback;

    @Enumerated(EnumType.STRING)
    @Column(name = "grading_mode", nullable = false)
    private GradingMode gradingMode = GradingMode.MANUAL_ONLY;

    @Column(name = "requires_manual_review", nullable = false)
    private boolean requiresManualReview = false;

    @Column(name = "auto_graded_at")
    private LocalDateTime autoGradedAt;

    @Column(name = "manually_graded_at")
    private LocalDateTime manuallyGradedAt;

    @Column(name = "attempt_number", nullable = false)
    private Integer attemptNumber = 1;

    @Column(name = "is_late_submission", nullable = false)
    private boolean isLateSubmission = false;

    // Additional properties expected by tests
    @Column(name = "score")
    private Double score;

    @Column(name = "max_score")
    private Double maxScore;

    @Column(name = "percentage")
    private Double percentage;

    @Column(name = "grade")
    private String grade;

    @Column(name = "comments", columnDefinition = "TEXT")
    private String comments;

    @Column(name = "file_paths", columnDefinition = "TEXT")
    private String filePaths;

    @Column(name = "graded_at")
    private LocalDateTime gradedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "graded_by")
    private User gradedBy;

    @Column(name = "needs_review", nullable = false)
    private boolean needsReview = false;

    @Column(name = "original_file_name")
    private String originalFileName;

    @Column(name = "file_size")
    private String fileSize;

    @Column(name = "auto_graded", nullable = false)
    private boolean autoGraded = false;

    @Column(name = "manually_graded", nullable = false)
    private boolean manuallyGraded = false;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;

    @Column(name = "student_comments", columnDefinition = "TEXT")
    private String studentComments;

    @Column(name = "rubric_scores", columnDefinition = "TEXT")
    private String rubricScores;

    @Column(name = "time_spent")
    private Integer timeSpent;

    @Column(name = "plagiarism_checked", nullable = false)
    private boolean plagiarismChecked = false;

    /**
     * Calculates if this submission can be auto-graded
     */
    public boolean canBeAutoGraded() {
        return assignment != null && assignment.supportsAutoGrading() && 
               (gradingMode == GradingMode.AUTO_ONLY || gradingMode == GradingMode.HYBRID);
    }

    /**
     * Calculates if this submission requires manual grading
     */
    public boolean requiresManualGrading() {
        return assignment != null && assignment.supportsManualGrading() && 
               (gradingMode == GradingMode.MANUAL_ONLY || gradingMode == GradingMode.HYBRID || requiresManualReview);
    }

    /**
     * Checks if grading is complete
     */
    public boolean isGradingComplete() {
        if (gradingMode == GradingMode.AUTO_ONLY) {
            return autoScore != null;
        } else if (gradingMode == GradingMode.MANUAL_ONLY) {
            return manualScore != null;
        } else { // HYBRID
            return autoScore != null && (manualScore != null || !requiresManualReview);
        }
    }

    @PrePersist
    protected void onCreate() {
        super.onCreate();
        // Determine grading mode based on assignment
        if (assignment != null) {
            switch (assignment.getGradingType()) {
                case AUTO -> this.gradingMode = GradingMode.AUTO_ONLY;
                case MANUAL -> this.gradingMode = GradingMode.MANUAL_ONLY;
                case HYBRID -> this.gradingMode = GradingMode.HYBRID;
            }
        }
        
        // Check if submission is late
        if (assignment != null && assignment.getDueDate() != null && submittedAt != null) {
            this.isLateSubmission = submittedAt.isAfter(assignment.getDueDate());
        }
    }
} 