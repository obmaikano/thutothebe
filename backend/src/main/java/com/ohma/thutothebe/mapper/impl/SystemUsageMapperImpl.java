package com.ohma.thutothebe.mapper.impl;

import com.ohma.thutothebe.dto.SystemUsageDTO;
import com.ohma.thutothebe.entity.SystemUsage;
import com.ohma.thutothebe.mapper.SystemUsageMapper;
import org.springframework.stereotype.Component;

@Component
public class SystemUsageMapperImpl implements SystemUsageMapper {

    @Override
    public SystemUsageDTO toDto(SystemUsage entity) {
        if (entity == null) {
            return null;
        }

        return new SystemUsageDTO(
            entity.getId(),
            entity.getTimestamp(),
            entity.getActiveUsers(),
            entity.getTotalLogins(),
            entity.getInstructorCount(),
            entity.getStudentCount(),
            entity.getAdminCount(),
            entity.getPeakModule(),
            entity.getPeakCourse()
        );
    }

    @Override
    public SystemUsage toEntity(SystemUsageDTO dto) {
        if (dto == null) {
            return null;
        }

        SystemUsage entity = new SystemUsage();
        entity.setId(dto.id());
        entity.setTimestamp(dto.timestamp());
        entity.setActiveUsers(dto.activeUsers());
        entity.setTotalLogins(dto.totalLogins());
        entity.setInstructorCount(dto.instructorCount());
        entity.setStudentCount(dto.studentCount());
        entity.setAdminCount(dto.adminCount());
        entity.setPeakModule(dto.peakModule());
        entity.setPeakCourse(dto.peakCourse());
        return entity;
    }
} 