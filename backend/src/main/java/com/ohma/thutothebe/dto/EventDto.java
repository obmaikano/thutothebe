package com.ohma.thutothebe.dto;

import com.ohma.thutothebe.entity.EventType;

import java.time.LocalDateTime;

public record EventDto(
    Long id,
    String title,
    String description,
    LocalDateTime startTime,
    LocalDateTime endTime,
    String location,
    EventType type,
    Long courseId,
    Long createdById,
    boolean isRecurring,
    String recurrenceRule,
    boolean isAllDay,
    String color
) {
    public EventDto {
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
        if (location == null || location.isBlank()) {
            throw new IllegalArgumentException("Location cannot be null or blank");
        }
        if (type == null) {
            throw new IllegalArgumentException("Event type cannot be null");
        }
        if (color == null || color.isBlank()) {
            throw new IllegalArgumentException("Color cannot be null or blank");
        }
    }
} 