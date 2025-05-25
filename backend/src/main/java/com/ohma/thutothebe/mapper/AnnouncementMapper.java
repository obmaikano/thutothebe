package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.AnnouncementDTO;
import com.ohma.thutothebe.entity.Announcement;

public interface AnnouncementMapper extends BaseDtoMapper<Announcement, AnnouncementDTO> {
    
    /**
     * Updates an existing entity with data from the DTO
     * @param entity The entity to update
     * @param dto The DTO containing the new data
     */
    void updateEntityFromDto(AnnouncementDTO dto, Announcement entity);
    
    /**
     * Converts an entity to DTO with user-specific read/acknowledgment status
     * @param entity The entity to convert
     * @param userId The ID of the user for whom to check read/acknowledgment status
     * @return The DTO with user-specific flags
     */
    AnnouncementDTO toDtoWithUserStatus(Announcement entity, Long userId);
} 