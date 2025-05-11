package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "assignments")
@EqualsAndHashCode(callSuper = true)
public class Assignment extends BaseEntity {

    @NotNull
    @Column(unique = true)
    private String code;

    @NotNull
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instructor_id")
    private User instructor;

    @NotNull
    private LocalDateTime dueDate;

    @NotNull
    private Integer totalPoints;

    @NotNull
    @Enumerated(EnumType.STRING)
    private AssignmentStatus status = AssignmentStatus.DRAFT;

    private boolean active = true;
} 