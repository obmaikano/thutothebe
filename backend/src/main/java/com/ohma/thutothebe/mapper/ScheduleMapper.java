package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.ScheduleDTO;
import com.ohma.thutothebe.entity.Schedule;

public interface ScheduleMapper extends BaseDtoMapper<Schedule, ScheduleDTO> {
    
    /**
     * Updates an existing entity with data from DTO
     * @param dto The DTO containing updated data
     * @param entity The entity to update
     */
    void updateEntityFromDto(ScheduleDTO dto, Schedule entity);
} 