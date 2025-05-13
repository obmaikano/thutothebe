package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "system_usage")
@EqualsAndHashCode(callSuper = true)
public class SystemUsage extends BaseEntity {
    
    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(nullable = false)
    private Integer activeUsers;

    @Column(nullable = false)
    private Integer totalLogins;

    @Column(nullable = false)
    private Integer instructorCount;

    @Column(nullable = false)
    private Integer studentCount;

    @Column(nullable = false)
    private Integer adminCount;

    @Column(nullable = false)
    private String peakModule;

    @Column(nullable = false)
    private String peakCourse;
} 