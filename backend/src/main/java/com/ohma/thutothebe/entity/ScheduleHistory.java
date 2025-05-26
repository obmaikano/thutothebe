package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "schedule_histories")
public class ScheduleHistory extends BaseEntity {
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id", nullable = false)
    private Schedule schedule;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ScheduleHistoryAction action;
    
    @NotBlank
    @Column(name = "changed_by", nullable = false)
    private String changedBy;
    
    @NotNull
    @Column(name = "change_timestamp", nullable = false)
    private LocalDateTime changeTimestamp;
    
    @Column(name = "old_values", columnDefinition = "TEXT")
    private String oldValues; // JSON string of old values
    
    @Column(name = "new_values", columnDefinition = "TEXT")
    private String newValues; // JSON string of new values
    
    @Column(columnDefinition = "TEXT")
    private String reason;
    
    @Column(name = "ip_address")
    private String ipAddress;
    
    @Column(name = "user_agent")
    private String userAgent;
    
    @Column(name = "schedule_version")
    private Integer scheduleVersion;
} 