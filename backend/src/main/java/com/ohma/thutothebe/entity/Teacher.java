package com.ohma.thutothebe.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "teachers")
@EqualsAndHashCode(callSuper = true)
public class Teacher extends BaseEntity {

    @Column(unique = true, nullable = false, length = 20)
    private String staffId;

    @Column(nullable = false, length = 100)
    private String firstName;

    @Column(nullable = false, length = 100)
    private String lastName;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(length = 200)
    private String qualification;

    @Column(nullable = false)
    private boolean active = true;

    @OneToMany(mappedBy = "teacher")
    private Set<CourseInstructor> courseInstructors = new HashSet<>();
} 