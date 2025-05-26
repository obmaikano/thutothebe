package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.ScheduleHistoryDTO;
import com.ohma.thutothebe.entity.ScheduleHistory;

public interface ScheduleHistoryMapper extends BaseDtoMapper<ScheduleHistory, ScheduleHistoryDTO> {
    
    /**
     * Updates an existing entity with data from DTO
     * @param dto The DTO containing updated data
     * @param entity The entity to update
     */
    void updateEntityFromDto(ScheduleHistoryDTO dto, ScheduleHistory entity);
} 