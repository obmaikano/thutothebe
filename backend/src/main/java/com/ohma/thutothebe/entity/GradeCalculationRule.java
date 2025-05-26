package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@Table(name = "grade_calculation_rules")
@EqualsAndHashCode(callSuper = true)
public class GradeCalculationRule extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "grade_type", nullable = false)
    private GradeType gradeType;

    @NotNull
    @DecimalMin(value = "0.0", message = "Weight cannot be negative")
    @DecimalMax(value = "100.0", message = "Weight cannot exceed 100%")
    @Column(name = "weight_percentage", nullable = false)
    private Double weightPercentage;

    @NotNull
    @DecimalMin(value = "0.0", message = "Passing grade cannot be negative")
    @DecimalMax(value = "100.0", message = "Passing grade cannot exceed 100")
    @Column(name = "passing_grade", nullable = false)
    private Double passingGrade = 50.0;

    @Column(name = "description")
    private String description;

    @Column(name = "active", nullable = false)
    private boolean active = true;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "term", nullable = false)
    private Term term;

    @Column(name = "academic_year", nullable = false)
    private Integer academicYear;
} 