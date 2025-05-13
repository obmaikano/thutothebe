package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@Table(name = "grade_categories")
@EqualsAndHashCode(callSuper = true)
public class GradeCategory extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private Double weight;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "min_grade")
    private Double minGrade;

    @Column(name = "max_grade")
    private Double maxGrade;

    @Column(name = "passing_grade")
    private Double passingGrade;
} 