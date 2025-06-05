package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

@Data
@Entity
@Table(name = "schools")
@EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
public class School extends BaseEntity {
    
    @Column(nullable = false, unique = true)
    @EqualsAndHashCode.Include
    private String code;
    
    @Column(nullable = false)
    @EqualsAndHashCode.Include
    private String name;
    
    @Column
    private String description;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_id", nullable = false)
    private Region region;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_head_id")
    private User schoolHead;
    
    @OneToMany(mappedBy = "school", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Class> classes = new HashSet<>();
    
    @OneToMany(mappedBy = "school", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<User> users = new HashSet<>();
    
    @OneToMany(mappedBy = "school", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Teacher> teachers = new HashSet<>();
    
    @OneToMany(mappedBy = "school", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Student> students = new HashSet<>();
    
    @OneToMany(mappedBy = "school", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Department> departments = new HashSet<>();
    
    @Column(nullable = false)
    private boolean active = true;

    // Override hashCode and equals to prevent circular references
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        School that = (School) o;
        return Objects.equals(getId(), that.getId()) && 
               Objects.equals(code, that.code);
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), code);
    }

    // Helper methods for managing relationships
    public void addTeacher(Teacher teacher) {
        teachers.add(teacher);
        teacher.setSchool(this);
    }

    public void removeTeacher(Teacher teacher) {
        teachers.remove(teacher);
        teacher.setSchool(null);
    }

    public void addStudent(Student student) {
        students.add(student);
        student.setSchool(this);
    }

    public void removeStudent(Student student) {
        students.remove(student);
        student.setSchool(null);
    }

    public void addDepartment(Department department) {
        departments.add(department);
        department.setSchool(this);
    }

    public void removeDepartment(Department department) {
        departments.remove(department);
        department.setSchool(null);
    }

    public void setSchoolHead(User user) {
        if (user != null) {
            UserRole role = user.getRole();
            if (role != UserRole.SCHOOL_HEAD && role != UserRole.SCHOOL_ADMIN && role != UserRole.DIRECTOR) {
                throw new IllegalArgumentException("School head must have SCHOOL_HEAD, SCHOOL_ADMIN, or DIRECTOR role");
            }
        }
        this.schoolHead = user;
    }
} 