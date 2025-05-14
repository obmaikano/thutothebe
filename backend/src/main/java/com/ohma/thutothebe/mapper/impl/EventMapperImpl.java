package com.ohma.thutothebe.mapper.impl;

import com.ohma.thutothebe.dto.EventDto;
import com.ohma.thutothebe.entity.Event;
import com.ohma.thutothebe.mapper.EventMapper;
import org.springframework.stereotype.Component;

@Component
public class EventMapperImpl implements EventMapper {
    
    @Override
    public EventDto toDto(Event entity) {
        if (entity == null) {
            return null;
        }
        
        return new EventDto(
            entity.getId(),
            entity.getTitle(),
            entity.getDescription(),
            entity.getStartTime(),
            entity.getEndTime(),
            entity.getLocation(),
            entity.getType(),
            entity.getCourse() != null ? entity.getCourse().getId() : null,
            entity.getCreatedBy() != null ? entity.getCreatedBy().getId() : null,
            entity.isRecurring(),
            entity.getRecurrenceRule(),
            entity.isAllDay(),
            entity.getColor()
        );
    }
    
    @Override
    public Event toEntity(EventDto dto) {
        if (dto == null) {
            return null;
        }
        
        Event event = new Event();
        event.setId(dto.id());
        event.setTitle(dto.title());
        event.setDescription(dto.description());
        event.setStartTime(dto.startTime());
        event.setEndTime(dto.endTime());
        event.setLocation(dto.location());
        event.setType(dto.type());
        event.setRecurring(dto.isRecurring());
        event.setRecurrenceRule(dto.recurrenceRule());
        event.setAllDay(dto.isAllDay());
        event.setColor(dto.color());
        
        return event;
    }
} 