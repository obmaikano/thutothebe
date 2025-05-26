package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.ScheduleHistoryAction;

import java.time.LocalDateTime;

public record ScheduleHistoryDTO(
    Long id,
    Long scheduleId,
    ScheduleHistoryAction action,
    String changedBy,
    LocalDateTime changeTimestamp,
    String oldValues,
    String newValues,
    String reason,
    String ipAddress,
    String userAgent,
    Integer scheduleVersion
) {
    public ScheduleHistoryDTO {
        if (scheduleId == null) {
            throw new IllegalArgumentException("Schedule ID cannot be null");
        }
        if (action == null) {
            throw new IllegalArgumentException("Action cannot be null");
        }
        if (changedBy == null || changedBy.isBlank()) {
            throw new IllegalArgumentException("Changed by cannot be null or blank");
        }
        if (changeTimestamp == null) {
            throw new IllegalArgumentException("Change timestamp cannot be null");
        }
    }
} 