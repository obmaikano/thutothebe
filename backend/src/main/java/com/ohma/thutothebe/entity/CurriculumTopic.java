package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@Table(name = "curriculum_topics")
@EqualsAndHashCode(callSuper = true)
public class CurriculumTopic extends BaseEntity {

    @NotNull(message = "Curriculum unit is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curriculum_unit_id", nullable = false)
    private CurriculumUnit curriculumUnit;

    @NotBlank(message = "Topic title is required")
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "topic_order", nullable = false)
    private Integer topicOrder;

    @Column(name = "duration_hours")
    private Integer durationHours;

    @Column(columnDefinition = "TEXT")
    private String learningObjectives;

    @Column(columnDefinition = "TEXT")
    private String activities;

    @Column(columnDefinition = "TEXT")
    private String resources;

    @Column(columnDefinition = "TEXT")
    private String assessmentMethods;

    @Column(nullable = false)
    private boolean active = true;
} 