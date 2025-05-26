package com.ohma.thutothebe.entity;

import com.ohma.thutothebe.entity.enums.GradeLevel;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "classes")
@EqualsAndHashCode(callSuper = true)
public class Class extends BaseEntity {
    
    @Column(nullable = false)
    private String name;
    
    @Column
    private String description;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "grade_level", nullable = false)
    private GradeLevel gradeLevel;
    
    @Min(value = 1, message = "Class capacity must be at least 1")
    @Column(name = "capacity", nullable = false)
    private Integer capacity = 30;
    
    @Min(value = 0, message = "Total enrolled cannot be negative")
    @Column(name = "total_enrolled", nullable = false)
    private Integer totalEnrolled = 0;
    
    @Column(name = "spots_left", nullable = false)
    private Integer spotsLeft = 30;
    
    @Column(name = "over_capacity", nullable = false)
    private Boolean overCapacity = false;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id", nullable = false)
    private School school;
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "class_teachers",
        joinColumns = @JoinColumn(name = "class_id"),
        inverseJoinColumns = @JoinColumn(name = "teacher_id")
    )
    private Set<Teacher> teachers = new HashSet<>();
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "class_students",
        joinColumns = @JoinColumn(name = "class_id"),
        inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    private Set<User> students = new HashSet<>();
    
    @Column(nullable = false)
    private boolean active = true;
    
    @PrePersist
    @PreUpdate
    private void calculateCapacityFields() {
        if (students != null) {
            this.totalEnrolled = students.size();
        } else {
            this.totalEnrolled = 0;
        }
        
        this.spotsLeft = Math.max(0, this.capacity - this.totalEnrolled);
        this.overCapacity = this.totalEnrolled > this.capacity;
    }
} 