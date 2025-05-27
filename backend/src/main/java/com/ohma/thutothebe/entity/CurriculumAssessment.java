package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "curriculum_assessments")
@EqualsAndHashCode(callSuper = true)
public class CurriculumAssessment extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curriculum_id", nullable = false)
    private Curriculum curriculum;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curriculum_unit_id")
    private CurriculumUnit curriculumUnit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curriculum_topic_id")
    private CurriculumTopic curriculumTopic;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessment_id", nullable = false)
    private Assessment assessment;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "assessment_purpose", nullable = false)
    private AssessmentPurpose assessmentPurpose;

    @Column(name = "weight_percentage")
    private Double weightPercentage;

    @Column(name = "is_mandatory", nullable = false)
    private boolean isMandatory = true;

    @Column(name = "sequence_order")
    private Integer sequenceOrder;

    @Column(name = "prerequisite_assessments", columnDefinition = "TEXT")
    private String prerequisiteAssessments; // JSON array of assessment IDs

    @Column(name = "learning_objectives_covered", columnDefinition = "TEXT")
    private String learningObjectivesCovered; // JSON array

    @Column(name = "competencies_assessed", columnDefinition = "TEXT")
    private String competenciesAssessed; // JSON array

    @Column(name = "alignment_notes", columnDefinition = "TEXT")
    private String alignmentNotes;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "linked_by", nullable = false)
    private User linkedBy;

    @Column(name = "linked_at", nullable = false)
    private LocalDateTime linkedAt;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (linkedAt == null) {
            linkedAt = LocalDateTime.now();
        }
    }

    public enum AssessmentPurpose {
        DIAGNOSTIC,           // Pre-learning assessment
        FORMATIVE,           // During learning assessment
        SUMMATIVE,           // End of learning assessment
        COMPETENCY_BASED,    // Competency evaluation
        CERTIFICATION,       // Certification assessment
        PLACEMENT,           // Student placement
        PROGRESS_MONITORING, // Ongoing progress tracking
        FINAL_EVALUATION     // Final course evaluation
    }
} 