package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.EventDto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Compatibility service that provides Event API functionality using CalendarEvent backend
 * This maintains backward compatibility while using the new comprehensive calendar system
 */
public interface EventCompatibilityService extends BaseService<EventDto, Long> {
    
    List<EventDto> getEventsByCourseId(Long courseId);
    
    List<EventDto> getEventsByUserId(Long userId);
    
    List<EventDto> getEventsBetweenDates(LocalDateTime startTime, LocalDateTime endTime);
    
    List<EventDto> getCourseEventsBetweenDates(Long courseId, LocalDateTime startTime, LocalDateTime endTime);
    
    List<EventDto> getAllRecurringEvents();
    
    List<EventDto> generateRecurringEvents(Long eventId, LocalDateTime until);
    
    List<EventDto> getStudentEvents(Long studentId);
    
    List<EventDto> getStudentEventsBetweenDates(Long studentId, LocalDateTime startTime, LocalDateTime endTime);
} 