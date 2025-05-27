package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "curriculum_units")
@EqualsAndHashCode(callSuper = true)
public class CurriculumUnit extends BaseEntity {

    @NotNull(message = "Curriculum is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curriculum_id", nullable = false)
    private Curriculum curriculum;

    @NotBlank(message = "Unit title is required")
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "unit_order", nullable = false)
    private Integer unitOrder;

    @Column(name = "duration_weeks")
    private Integer durationWeeks;

    @Column(name = "allocated_hours")
    private Integer allocatedHours;

    @Column(columnDefinition = "TEXT")
    private String learningObjectives;

    @Column(columnDefinition = "TEXT")
    private String assessmentCriteria;

    @OneToMany(mappedBy = "curriculumUnit", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<CurriculumTopic> curriculumTopics = new HashSet<>();

    @Column(nullable = false)
    private boolean active = true;
} 