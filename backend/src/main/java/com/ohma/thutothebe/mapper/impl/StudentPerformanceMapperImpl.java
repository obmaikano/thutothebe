package com.ohma.thutothebe.mapper.impl;

import com.ohma.thutothebe.dto.StudentPerformanceDTO;
import com.ohma.thutothebe.entity.StudentPerformance;
import com.ohma.thutothebe.mapper.StudentPerformanceMapper;
import org.springframework.stereotype.Component;

@Component
public class StudentPerformanceMapperImpl implements StudentPerformanceMapper {

    @Override
    public StudentPerformanceDTO toDto(StudentPerformance entity) {
        if (entity == null) {
            return null;
        }
        return new StudentPerformanceDTO(
            entity.getId(),
            entity.getStudent().getId(),
            entity.getCourse().getId(),
            entity.getAverageGrade(),
            entity.getTotalSubmissions(),
            entity.getForumPosts(),
            entity.getLoginCount(),
            entity.getTimeSpentMinutes(),
            entity.getLastUpdated()
        );
    }

    @Override
    public StudentPerformance toEntity(StudentPerformanceDTO dto) {
        if (dto == null) {
            return null;
        }
        StudentPerformance entity = new StudentPerformance();
        entity.setId(dto.id());
        entity.setAverageGrade(dto.averageGrade());
        entity.setTotalSubmissions(dto.totalSubmissions());
        entity.setForumPosts(dto.forumPosts());
        entity.setLoginCount(dto.loginCount());
        entity.setTimeSpentMinutes(dto.timeSpentMinutes());
        entity.setLastUpdated(dto.lastUpdated());
        return entity;
    }
} 