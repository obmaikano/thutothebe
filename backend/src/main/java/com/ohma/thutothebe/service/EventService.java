package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.EventDto;

import java.time.LocalDateTime;
import java.util.List;

public interface EventService extends BaseService<EventDto, Long> {
    
    List<EventDto> getEventsByCourseId(Long courseId);
    
    List<EventDto> getEventsByUserId(Long userId);
    
    List<EventDto> getEventsBetweenDates(LocalDateTime startTime, LocalDateTime endTime);
    
    List<EventDto> getCourseEventsBetweenDates(Long courseId, LocalDateTime startTime, LocalDateTime endTime);
    
    List<EventDto> getAllRecurringEvents();
    
    List<EventDto> generateRecurringEvents(Long eventId, LocalDateTime until);
} 