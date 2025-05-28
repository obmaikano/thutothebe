package com.ohma.thutothebe.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "monitoring_alerts")
@EqualsAndHashCode(callSuper = true)
public class MonitoringAlert extends BaseEntity {

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "alert_type", nullable = false)
    private MonitoringAlertType alertType;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "severity", nullable = false)
    private MonitoringAlertSeverity severity;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "scope", nullable = false)
    private MonitoringScope scope;

    @Column(name = "scope_id")
    private Long scopeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id")
    private School school;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_id")
    private Region region;

    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "threshold_value", precision = 10, scale = 2)
    private Double thresholdValue;

    @Column(name = "actual_value", precision = 10, scale = 2)
    private Double actualValue;

    @Column(name = "metric_name")
    private String metricName;

    @NotNull
    @Column(name = "alert_timestamp", nullable = false)
    private LocalDateTime alertTimestamp;

    @Column(name = "acknowledged")
    private boolean acknowledged = false;

    @Column(name = "acknowledged_by")
    private String acknowledgedBy;

    @Column(name = "acknowledged_at")
    private LocalDateTime acknowledgedAt;

    @Column(name = "resolved")
    private boolean resolved = false;

    @Column(name = "resolved_by")
    private String resolvedBy;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    private String resolutionNotes;

    @Column(name = "notification_sent")
    private boolean notificationSent = false;

    @Column(name = "notification_sent_at")
    private LocalDateTime notificationSentAt;

    @Column(name = "active", nullable = false)
    private boolean active = true;

    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (alertTimestamp == null) {
            alertTimestamp = LocalDateTime.now();
        }
    }
} 