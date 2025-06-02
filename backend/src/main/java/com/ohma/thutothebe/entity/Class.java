package com.ohma.thutothebe.entity;

import com.ohma.thutothebe.entity.enums.GradeLevel;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

@Data
@Entity
@Table(name = "classes")
@EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
public class Class extends BaseEntity {
    
    @Column(nullable = false)
    @EqualsAndHashCode.Include
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
    private Set<Student> students = new HashSet<>();
    
    @Column(nullable = false)
    private boolean active = true;

    // Override hashCode and equals to prevent circular references
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Class that = (Class) o;
        return Objects.equals(getId(), that.getId()) && 
               Objects.equals(name, that.name) &&
               Objects.equals(school != null ? school.getId() : null, 
                             that.school != null ? that.school.getId() : null);
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), name, school != null ? school.getId() : null);
    }

    // Helper methods for managing relationships
    public void addTeacher(Teacher teacher) {
        teachers.add(teacher);
    }

    public void removeTeacher(Teacher teacher) {
        teachers.remove(teacher);
    }

    public void addStudent(Student student) {
        students.add(student);
        updateEnrollmentCounts();
    }

    public void removeStudent(Student student) {
        students.remove(student);
        updateEnrollmentCounts();
    }

    private void updateEnrollmentCounts() {
        this.totalEnrolled = students.size();
        this.spotsLeft = capacity - totalEnrolled;
        this.overCapacity = totalEnrolled > capacity;
    }
} 