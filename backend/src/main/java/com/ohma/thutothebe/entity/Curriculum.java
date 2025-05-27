package com.ohma.thutothebe.entity;

import com.ohma.thutothebe.entity.enums.GradeLevel;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "curricula")
@EqualsAndHashCode(callSuper = true)
public class Curriculum extends BaseEntity {

    @NotBlank(message = "Curriculum title is required")
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "Curriculum type is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "curriculum_type", nullable = false)
    private CurriculumType curriculumType;

    @NotNull(message = "Grade level is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "grade_level", nullable = false)
    private GradeLevel gradeLevel;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CurriculumStatus status = CurriculumStatus.DRAFT;

    @Column(name = "academic_year", nullable = false)
    private Integer academicYear;

    @Column(name = "effective_date")
    private LocalDate effectiveDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(columnDefinition = "TEXT")
    private String learningOutcomes;

    @Column(name = "duration_weeks")
    private Integer durationWeeks;

    @Column(name = "total_hours")
    private Integer totalHours;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_id")
    private Region region;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id")
    private School school;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    @Column(name = "approved_at")
    private LocalDate approvedAt;

    @OneToMany(mappedBy = "curriculum", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<CurriculumSubject> curriculumSubjects = new HashSet<>();

    @OneToMany(mappedBy = "curriculum", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<CurriculumUnit> curriculumUnits = new HashSet<>();

    @OneToMany(mappedBy = "curriculum", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<CurriculumTeacher> curriculumTeachers = new HashSet<>();

    @OneToMany(mappedBy = "curriculum", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<CurriculumProgress> curriculumProgress = new HashSet<>();

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "curriculum_version")
    private Integer curriculumVersion = 1;

    @Column(columnDefinition = "TEXT")
    private String metadata;
} 