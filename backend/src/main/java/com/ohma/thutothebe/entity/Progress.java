package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "progress")
@EqualsAndHashCode(callSuper = true)
public class Progress extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(name = "completion_percentage")
    private Double completionPercentage;

    private Double grade;

    private boolean completed;

    private boolean active = true;

    @Column(name = "last_activity_at")
    private LocalDateTime lastActivityAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        if (completionPercentage >= 100.0) {
            completed = true;
            completedAt = LocalDateTime.now();
        }
    }
} 