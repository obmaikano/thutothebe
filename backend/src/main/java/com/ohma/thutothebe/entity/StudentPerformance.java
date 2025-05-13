package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "student_performance")
@EqualsAndHashCode(callSuper = true)
public class StudentPerformance extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false)
    private Double averageGrade;

    @Column(nullable = false)
    private Integer totalSubmissions;

    @Column(nullable = false)
    private Integer forumPosts;

    @Column(nullable = false)
    private Integer loginCount;

    @Column(nullable = false)
    private Long timeSpentMinutes;

    @Column(nullable = false)
    private LocalDateTime lastUpdated;
} 