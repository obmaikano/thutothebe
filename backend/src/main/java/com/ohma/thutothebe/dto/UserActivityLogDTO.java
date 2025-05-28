package com.ohma.thutothebe.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ohma.thutothebe.entity.UserActivityType;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "User activity log data transfer object")
public record UserActivityLogDTO(
    @Schema(description = "Unique identifier", example = "1")
    Long id,

    @Schema(description = "User ID", example = "1")
    Long userId,

    @Schema(description = "Username", example = "john.doe")
    String username,

    @Schema(description = "User role", example = "TEACHER")
    String userRole,

    @Schema(description = "School ID", example = "1")
    Long schoolId,

    @Schema(description = "School name", example = "Gaborone Primary School")
    String schoolName,

    @Schema(description = "Region ID", example = "1")
    Long regionId,

    @Schema(description = "Region name", example = "South East Region")
    String regionName,

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Schema(description = "Activity timestamp", example = "2024-03-11 14:30:00")
    LocalDateTime activityTimestamp,

    @Schema(description = "Activity type")
    UserActivityType activityType,

    @Schema(description = "Module name", example = "Assignments")
    String moduleName,

    @Schema(description = "Feature name", example = "Grade Assignment")
    String featureName,

    @Schema(description = "Action performed", example = "Submitted grade for assignment")
    String actionPerformed,

    @Schema(description = "Session ID", example = "sess_123456789")
    String sessionId,

    @Schema(description = "IP address", example = "192.168.1.100")
    String ipAddress,

    @Schema(description = "User agent", example = "Mozilla/5.0...")
    String userAgent,

    @Schema(description = "Duration in minutes", example = "15")
    Integer durationMinutes,

    @Schema(description = "Success status", example = "true")
    boolean success,

    @Schema(description = "Error message", example = "Network timeout")
    String errorMessage,

    @Schema(description = "Additional data", example = "{\"assignmentId\": 123}")
    String additionalData
) {
    public UserActivityLogDTO {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (activityType == null) {
            throw new IllegalArgumentException("Activity type cannot be null");
        }
        if (activityTimestamp == null) {
            throw new IllegalArgumentException("Activity timestamp cannot be null");
        }
    }
} 