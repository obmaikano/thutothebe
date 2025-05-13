package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDateTime;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Module extends BaseEntity {
    
    @NotBlank(message = "Code is required")
    @Size(min = 3, max = 20, message = "Code must be between 3 and 20 characters")
    @Column(unique = true)
    private String code;
    
    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    private String title;
    
    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;
    
    @NotNull(message = "Course is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;
    
    private boolean active = true;
    
    @Column(name = "access_count")
    private Long accessCount = 0L;
    
    @Column(name = "last_accessed")
    private LocalDateTime lastAccessed;
} 