package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "regions")
@EqualsAndHashCode(callSuper = true)
public class Region extends BaseEntity {
    
    @Column(unique = true, nullable = false)
    private String code;
    
    @Column(nullable = false)
    private String name;
    
    private String description;
    
    @OneToMany(mappedBy = "region", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<School> schools = new HashSet<>();
    
    @Column(nullable = false)
    private boolean active = true;
} 