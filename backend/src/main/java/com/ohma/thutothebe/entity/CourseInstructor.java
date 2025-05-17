package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@Table(name = "course_instructors", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"course_id", "teacher_id"})
})
@EqualsAndHashCode(callSuper = true)
public class CourseInstructor extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;

    @Column(nullable = false)
    private boolean isPrimary = false;

    @Column(length = 200)
    private String notes;
} 