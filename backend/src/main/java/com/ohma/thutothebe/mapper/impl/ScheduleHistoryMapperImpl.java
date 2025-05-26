package com.ohma.thutothebe.mapper.impl;

import com.ohma.thutothebe.dto.ScheduleHistoryDTO;
import com.ohma.thutothebe.entity.ScheduleHistory;
import com.ohma.thutothebe.mapper.ScheduleHistoryMapper;
import com.ohma.thutothebe.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ScheduleHistoryMapperImpl implements ScheduleHistoryMapper {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Override
    public ScheduleHistoryDTO toDto(ScheduleHistory entity) {
        if (entity == null) {
            return null;
        }

        return new ScheduleHistoryDTO(
            entity.getId(),
            entity.getSchedule() != null ? entity.getSchedule().getId() : null,
            entity.getAction(),
            entity.getChangedBy(),
            entity.getChangeTimestamp(),
            entity.getOldValues(),
            entity.getNewValues(),
            entity.getReason(),
            entity.getIpAddress(),
            entity.getUserAgent(),
            entity.getScheduleVersion()
        );
    }

    @Override
    public ScheduleHistory toEntity(ScheduleHistoryDTO dto) {
        if (dto == null) {
            return null;
        }

        ScheduleHistory entity = new ScheduleHistory();
        updateEntityFromDto(dto, entity);
        return entity;
    }

    @Override
    public void updateEntityFromDto(ScheduleHistoryDTO dto, ScheduleHistory entity) {
        if (dto == null || entity == null) {
            return;
        }

        entity.setAction(dto.action());
        entity.setChangedBy(dto.changedBy());
        entity.setChangeTimestamp(dto.changeTimestamp());
        entity.setOldValues(dto.oldValues());
        entity.setNewValues(dto.newValues());
        entity.setReason(dto.reason());
        entity.setIpAddress(dto.ipAddress());
        entity.setUserAgent(dto.userAgent());
        entity.setScheduleVersion(dto.scheduleVersion());

        // Set schedule relationship
        if (dto.scheduleId() != null) {
            scheduleRepository.findById(dto.scheduleId()).ifPresent(entity::setSchedule);
        }
    }
} 