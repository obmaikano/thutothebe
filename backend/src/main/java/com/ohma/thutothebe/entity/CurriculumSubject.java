package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@Table(name = "curriculum_subjects")
@EqualsAndHashCode(callSuper = true)
public class CurriculumSubject extends BaseEntity {

    @NotNull(message = "Curriculum is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curriculum_id", nullable = false)
    private Curriculum curriculum;

    @NotNull(message = "Subject is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Column(name = "is_core", nullable = false)
    private boolean isCore = true;

    @Column(name = "allocated_hours")
    private Integer allocatedHours;

    @Column(name = "weight_percentage")
    private Double weightPercentage;

    @Column(columnDefinition = "TEXT")
    private String objectives;

    @Column(nullable = false)
    private boolean active = true;
} 