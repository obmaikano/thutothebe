package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

@Data
@Entity
@Table(name = "regions")
@EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
public class Region extends BaseEntity {
    
    @Column(unique = true, nullable = false)
    @EqualsAndHashCode.Include
    private String code;
    
    @Column(nullable = false)
    @EqualsAndHashCode.Include
    private String name;
    
    private String description;
    
    @OneToMany(mappedBy = "region", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<School> schools = new HashSet<>();
    
    @Column(nullable = false)
    private boolean active = true;

    // Override hashCode and equals to prevent circular references
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Region that = (Region) o;
        return Objects.equals(getId(), that.getId()) && 
               Objects.equals(code, that.code);
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), code);
    }
} 