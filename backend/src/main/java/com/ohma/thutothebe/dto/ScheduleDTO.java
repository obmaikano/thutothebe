package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.DayOfWeek;
import com.ohma.thutothebe.entity.ScheduleStatus;
import com.ohma.thutothebe.entity.ScheduleType;

import java.time.LocalDateTime;
import java.time.LocalTime;

public record ScheduleDTO(
    Long id,
    String title,
    String description,
    LocalTime startTime,
    LocalTime endTime,
    DayOfWeek dayOfWeek,
    LocalDateTime effectiveDate,
    LocalDateTime expiryDate,
    String location,
    ScheduleType type,
    ScheduleStatus status,
    String color,
    boolean isRecurring,
    String recurrenceRule,
    Long courseId,
    String courseName,
    Long classId,
    String className,
    Long schoolId,
    String schoolName,
    Long regionId,
    String regionName,
    Long createdById,
    String createdByName,
    Long teacherId,
    String teacherName,
    Integer scheduleVersion,
    Long parentScheduleId,
    String metadata,
    boolean active
) {
    public ScheduleDTO {
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Title cannot be null or blank");
        }
        if (startTime == null) {
            throw new IllegalArgumentException("Start time cannot be null");
        }
        if (endTime == null) {
            throw new IllegalArgumentException("End time cannot be null");
        }
        if (startTime.isAfter(endTime)) {
            throw new IllegalArgumentException("Start time must be before end time");
        }
        if (dayOfWeek == null) {
            throw new IllegalArgumentException("Day of week cannot be null");
        }
        if (effectiveDate == null) {
            throw new IllegalArgumentException("Effective date cannot be null");
        }
        if (type == null) {
            throw new IllegalArgumentException("Schedule type cannot be null");
        }
        if (status == null) {
            throw new IllegalArgumentException("Schedule status cannot be null");
        }
        if (createdById == null) {
            throw new IllegalArgumentException("Created by ID cannot be null");
        }
    }
} 