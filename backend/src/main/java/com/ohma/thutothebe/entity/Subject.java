package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

@Data
@Entity
@Table(name = "subjects")
@EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
public class Subject extends BaseEntity {

    @Column(unique = true, nullable = false, length = 10)
    @EqualsAndHashCode.Include
    private String code;

    @Column(nullable = false, length = 100)
    @EqualsAndHashCode.Include
    private String name;

    @Column(length = 500)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(nullable = false)
    private boolean active = true;

    @OneToMany(mappedBy = "subject")
    private Set<Course> courses = new HashSet<>();

    // Override hashCode and equals to prevent circular references
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Subject that = (Subject) o;
        return Objects.equals(getId(), that.getId()) && 
               Objects.equals(code, that.code);
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), code);
    }
} 