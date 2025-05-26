package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "grade_reports")
@EqualsAndHashCode(callSuper = true)
public class GradeReport extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id")
    private Class classEntity;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "report_type", nullable = false)
    private GradeReportType reportType;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "term", nullable = false)
    private Term term;

    @Column(name = "academic_year", nullable = false)
    private Integer academicYear;

    @Column(name = "overall_grade", precision = 5, scale = 2)
    private Double overallGrade;

    @Column(name = "overall_percentage", precision = 5, scale = 2)
    private Double overallPercentage;

    @Column(name = "grade_letter")
    private String gradeLetter;

    @Column(name = "rank_in_class")
    private Integer rankInClass;

    @Column(name = "total_students_in_class")
    private Integer totalStudentsInClass;

    @Column(name = "comments", columnDefinition = "TEXT")
    private String comments;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "generated_by", nullable = false)
    private User generatedBy;

    @Column(name = "generated_at", nullable = false)
    private LocalDateTime generatedAt;

    @Column(name = "file_path")
    private String filePath;

    @Column(name = "active", nullable = false)
    private boolean active = true;

    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (generatedAt == null) {
            generatedAt = LocalDateTime.now();
        }
    }
} 