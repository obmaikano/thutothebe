package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.CalendarEventType;
import com.ohma.thutothebe.entity.CalendarEventPriority;
import com.ohma.thutothebe.entity.CalendarEventScope;
import com.ohma.thutothebe.entity.CalendarEventStatus;
import com.ohma.thutothebe.entity.UserRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.Set;

public record CalendarEventDTO(
    Long id,
    
    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    String title,
    
    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    String description,
    
    @NotNull(message = "Start time is required")
    LocalDateTime startTime,
    
    @NotNull(message = "End time is required")
    LocalDateTime endTime,
    
    @Size(max = 200, message = "Location cannot exceed 200 characters")
    String location,
    
    @NotNull(message = "Event type is required")
    CalendarEventType eventType,
    
    @NotNull(message = "Priority is required")
    CalendarEventPriority priority,
    
    @NotNull(message = "Scope is required")
    CalendarEventScope scope,
    
    boolean isAllDay,
    
    boolean isRecurring,
    
    @Size(max = 500, message = "Recurrence rule cannot exceed 500 characters")
    String recurrenceRule,
    
    LocalDateTime recurrenceEndDate,
    
    @Size(min = 7, max = 7, message = "Color must be a valid hex color code")
    String color,
    
    @NotNull(message = "Status is required")
    CalendarEventStatus status,
    
    @NotNull(message = "Created by user ID is required")
    Long createdById,
    
    String createdByName,
    
    Long schoolId,
    
    String schoolName,
    
    Long regionId,
    
    String regionName,
    
    Long targetClassId,
    
    String targetClassName,
    
    Long courseId,
    
    String courseName,
    
    Set<UserRole> targetRoles,
    
    Set<Long> attendeeIds,
    
    Set<String> attendeeNames,
    
    Set<Long> organizerIds,
    
    Set<String> organizerNames,
    
    boolean requiresApproval,
    
    Long approvedById,
    
    String approvedByName,
    
    LocalDateTime approvedAt,
    
    @Size(max = 1000, message = "Approval notes cannot exceed 1000 characters")
    String approvalNotes,
    
    Integer maxAttendees,
    
    boolean registrationRequired,
    
    LocalDateTime registrationDeadline,
    
    @Size(max = 500, message = "External link cannot exceed 500 characters")
    String externalLink,
    
    @Size(max = 500, message = "Meeting link cannot exceed 500 characters")
    String meetingLink,
    
    @Size(max = 2000, message = "Notes cannot exceed 2000 characters")
    String notes,
    
    boolean isPublic,
    
    Integer reminderMinutes,
    
    boolean active,
    
    Long parentEventId,
    
    LocalDateTime createdAt,
    
    LocalDateTime modifiedAt
) {
    public CalendarEventDTO {
        if (title != null && title.isBlank()) {
            throw new IllegalArgumentException("Title cannot be blank");
        }
        if (startTime != null && endTime != null && startTime.isAfter(endTime)) {
            throw new IllegalArgumentException("Start time must be before end time");
        }
        if (isRecurring && (recurrenceRule == null || recurrenceRule.isBlank())) {
            throw new IllegalArgumentException("Recurrence rule is required for recurring events");
        }
        if (registrationRequired && registrationDeadline != null && registrationDeadline.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Registration deadline cannot be in the past");
        }
        if (maxAttendees != null && maxAttendees < 1) {
            throw new IllegalArgumentException("Maximum attendees must be at least 1");
        }
        if (reminderMinutes != null && reminderMinutes < 0) {
            throw new IllegalArgumentException("Reminder minutes cannot be negative");
        }
        if (color != null && !color.matches("^#[0-9A-Fa-f]{6}$")) {
            throw new IllegalArgumentException("Color must be a valid hex color code (e.g., #3B82F6)");
        }
        
        // Set default values
        if (priority == null) {
            priority = CalendarEventPriority.MEDIUM;
        }
        if (status == null) {
            status = CalendarEventStatus.SCHEDULED;
        }
        if (color == null || color.isBlank()) {
            color = "#3B82F6";
        }
    }
} 