package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "course_statistics")
@EqualsAndHashCode(callSuper = true)
public class CourseStatistics extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false)
    private Integer currentEnrollment;

    @Column(nullable = false)
    private Integer totalEnrollment;

    @Column(nullable = false)
    private Double averageGrade;

    @Column(nullable = false)
    private Double completionRate;

    @Column(nullable = false)
    private Double dropoutRate;

    @Column(nullable = false)
    private LocalDateTime lastUpdated;
} 