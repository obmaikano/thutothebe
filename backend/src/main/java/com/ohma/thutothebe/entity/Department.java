package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "departments")
@EqualsAndHashCode(callSuper = true)
public class Department extends BaseEntity {

    @NotBlank(message = "Department name is required")
    @Size(min = 2, max = 100, message = "Department name must be between 2 and 100 characters")
    @Column(nullable = false, length = 100)
    private String name;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    @Column(length = 500)
    private String description;

    @NotNull(message = "School is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id", nullable = false)
    private School school;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_head_id")
    private Teacher departmentHead;

    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Subject> subjects = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "department_teachers",
        joinColumns = @JoinColumn(name = "department_id"),
        inverseJoinColumns = @JoinColumn(name = "teacher_id")
    )
    private Set<Teacher> teachers = new HashSet<>();

    @Column(nullable = false)
    private boolean active = true;

    // Helper methods for managing relationships
    public void addSubject(Subject subject) {
        subjects.add(subject);
        subject.setDepartment(this);
    }

    public void removeSubject(Subject subject) {
        subjects.remove(subject);
        subject.setDepartment(null);
    }

    public void addTeacher(Teacher teacher) {
        teachers.add(teacher);
    }

    public void removeTeacher(Teacher teacher) {
        teachers.remove(teacher);
    }

    public void setDepartmentHead(Teacher teacher) {
        if (teacher != null && teacher.getUser() != null) {
            UserRole role = teacher.getUser().getRole();
            if (role != UserRole.DEPARTMENT_HEAD && role != UserRole.TEACHER && role != UserRole.SENIOR_TEACHER) {
                throw new IllegalArgumentException("Department head must have DEPARTMENT_HEAD, SENIOR_TEACHER, or TEACHER role");
            }
        }
        this.departmentHead = teacher;
        if (teacher != null) {
            addTeacher(teacher); // Automatically add department head to teachers list
        }
    }
} 