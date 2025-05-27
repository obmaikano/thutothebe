package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.CalendarEventDTO;
import com.ohma.thutothebe.entity.CalendarEvent;

public interface CalendarEventMapper extends BaseDtoMapper<CalendarEvent, CalendarEventDTO> {
    
    /**
     * Updates an existing entity with data from DTO
     * @param dto The DTO containing updated data
     * @param entity The entity to update
     */
    void updateEntityFromDto(CalendarEventDTO dto, CalendarEvent entity);
} 