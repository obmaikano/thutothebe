package com.ohma.thutothebe.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ohma.thutothebe.entity.MonitoringAlertSeverity;
import com.ohma.thutothebe.entity.MonitoringAlertType;
import com.ohma.thutothebe.entity.MonitoringScope;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "Monitoring alert data transfer object")
public record MonitoringAlertDTO(
    @Schema(description = "Unique identifier", example = "1")
    Long id,

    @Schema(description = "Alert type")
    MonitoringAlertType alertType,

    @Schema(description = "Alert severity")
    MonitoringAlertSeverity severity,

    @Schema(description = "Alert scope")
    MonitoringScope scope,

    @Schema(description = "Scope ID", example = "1")
    Long scopeId,

    @Schema(description = "School ID", example = "1")
    Long schoolId,

    @Schema(description = "School name", example = "Gaborone Primary School")
    String schoolName,

    @Schema(description = "Region ID", example = "1")
    Long regionId,

    @Schema(description = "Region name", example = "South East Region")
    String regionName,

    @Schema(description = "Alert title", example = "Low Usage Alert")
    String title,

    @Schema(description = "Alert description", example = "School usage has dropped below threshold")
    String description,

    @Schema(description = "Threshold value", example = "80.0")
    Double thresholdValue,

    @Schema(description = "Actual value", example = "65.5")
    Double actualValue,

    @Schema(description = "Metric name", example = "daily_login_rate")
    String metricName,

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Schema(description = "Alert timestamp", example = "2024-03-11 14:30:00")
    LocalDateTime alertTimestamp,

    @Schema(description = "Acknowledged status", example = "false")
    boolean acknowledged,

    @Schema(description = "Acknowledged by", example = "admin@school.edu")
    String acknowledgedBy,

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Schema(description = "Acknowledged at", example = "2024-03-11 15:00:00")
    LocalDateTime acknowledgedAt,

    @Schema(description = "Resolved status", example = "false")
    boolean resolved,

    @Schema(description = "Resolved by", example = "admin@school.edu")
    String resolvedBy,

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Schema(description = "Resolved at", example = "2024-03-11 16:00:00")
    LocalDateTime resolvedAt,

    @Schema(description = "Resolution notes", example = "Issue resolved by system restart")
    String resolutionNotes,

    @Schema(description = "Notification sent status", example = "true")
    boolean notificationSent,

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Schema(description = "Notification sent at", example = "2024-03-11 14:35:00")
    LocalDateTime notificationSentAt,

    @Schema(description = "Active status", example = "true")
    boolean active
) {
    public MonitoringAlertDTO {
        if (alertType == null) {
            throw new IllegalArgumentException("Alert type cannot be null");
        }
        if (severity == null) {
            throw new IllegalArgumentException("Severity cannot be null");
        }
        if (scope == null) {
            throw new IllegalArgumentException("Scope cannot be null");
        }
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Title cannot be null or empty");
        }
    }
} 