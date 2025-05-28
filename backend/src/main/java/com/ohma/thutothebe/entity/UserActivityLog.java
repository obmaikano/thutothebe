package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "user_activity_logs")
@EqualsAndHashCode(callSuper = true)
public class UserActivityLog extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @Column(name = "activity_timestamp", nullable = false)
    private LocalDateTime activityTimestamp;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "activity_type", nullable = false)
    private UserActivityType activityType;

    @Column(name = "module_name")
    private String moduleName;

    @Column(name = "feature_name")
    private String featureName;

    @Column(name = "action_performed")
    private String actionPerformed;

    @Column(name = "session_id")
    private String sessionId;

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "user_agent", columnDefinition = "TEXT")
    private String userAgent;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(name = "success")
    private boolean success = true;

    @Column(name = "error_message")
    private String errorMessage;

    @Column(name = "additional_data", columnDefinition = "TEXT")
    private String additionalData;

    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (activityTimestamp == null) {
            activityTimestamp = LocalDateTime.now();
        }
    }
} 