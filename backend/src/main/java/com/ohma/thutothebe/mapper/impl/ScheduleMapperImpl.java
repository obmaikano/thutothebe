package com.ohma.thutothebe.mapper.impl;

import com.ohma.thutothebe.dto.ScheduleDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.mapper.ScheduleMapper;
import com.ohma.thutothebe.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ScheduleMapperImpl implements ScheduleMapper {

    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private ClassRepository classRepository;
    
    @Autowired
    private SchoolRepository schoolRepository;
    
    @Autowired
    private RegionRepository regionRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Override
    public ScheduleDTO toDto(Schedule entity) {
        if (entity == null) {
            return null;
        }

        return new ScheduleDTO(
            entity.getId(),
            entity.getTitle(),
            entity.getDescription(),
            entity.getStartTime(),
            entity.getEndTime(),
            entity.getDayOfWeek(),
            entity.getEffectiveDate(),
            entity.getExpiryDate(),
            entity.getLocation(),
            entity.getType(),
            entity.getStatus(),
            entity.getColor(),
            entity.isRecurring(),
            entity.getRecurrenceRule(),
            entity.getCourse() != null ? entity.getCourse().getId() : null,
            entity.getCourse() != null ? entity.getCourse().getName() : null,
            entity.getClassEntity() != null ? entity.getClassEntity().getId() : null,
            entity.getClassEntity() != null ? entity.getClassEntity().getName() : null,
            entity.getSchool() != null ? entity.getSchool().getId() : null,
            entity.getSchool() != null ? entity.getSchool().getName() : null,
            entity.getRegion() != null ? entity.getRegion().getId() : null,
            entity.getRegion() != null ? entity.getRegion().getName() : null,
            entity.getCreatedBy() != null ? entity.getCreatedBy().getId() : null,
            entity.getCreatedBy() != null ? (entity.getCreatedBy().getFirstName() + " " + entity.getCreatedBy().getLastName()) : null,
            entity.getTeacher() != null ? entity.getTeacher().getId() : null,
            entity.getTeacher() != null ? (entity.getTeacher().getFirstName() + " " + entity.getTeacher().getLastName()) : null,
            entity.getScheduleVersion(),
            entity.getParentScheduleId(),
            entity.getMetadata(),
            entity.isActive()
        );
    }

    @Override
    public Schedule toEntity(ScheduleDTO dto) {
        if (dto == null) {
            return null;
        }

        Schedule entity = new Schedule();
        updateEntityFromDto(dto, entity);
        return entity;
    }

    @Override
    public void updateEntityFromDto(ScheduleDTO dto, Schedule entity) {
        if (dto == null || entity == null) {
            return;
        }

        entity.setTitle(dto.title());
        entity.setDescription(dto.description());
        entity.setStartTime(dto.startTime());
        entity.setEndTime(dto.endTime());
        entity.setDayOfWeek(dto.dayOfWeek());
        entity.setEffectiveDate(dto.effectiveDate());
        entity.setExpiryDate(dto.expiryDate());
        entity.setLocation(dto.location());
        entity.setType(dto.type());
        entity.setStatus(dto.status());
        entity.setColor(dto.color());
        entity.setRecurring(dto.isRecurring());
        entity.setRecurrenceRule(dto.recurrenceRule());
        entity.setScheduleVersion(dto.scheduleVersion());
        entity.setParentScheduleId(dto.parentScheduleId());
        entity.setMetadata(dto.metadata());
        entity.setActive(dto.active());

        // Set relationships
        if (dto.courseId() != null) {
            courseRepository.findById(dto.courseId()).ifPresent(entity::setCourse);
        } else {
            entity.setCourse(null);
        }

        if (dto.classId() != null) {
            classRepository.findById(dto.classId()).ifPresent(entity::setClassEntity);
        } else {
            entity.setClassEntity(null);
        }

        if (dto.schoolId() != null) {
            schoolRepository.findById(dto.schoolId()).ifPresent(entity::setSchool);
        } else {
            entity.setSchool(null);
        }

        if (dto.regionId() != null) {
            regionRepository.findById(dto.regionId()).ifPresent(entity::setRegion);
        } else {
            entity.setRegion(null);
        }

        if (dto.createdById() != null) {
            userRepository.findById(dto.createdById()).ifPresent(entity::setCreatedBy);
        }

        if (dto.teacherId() != null) {
            userRepository.findById(dto.teacherId()).ifPresent(entity::setTeacher);
        } else {
            entity.setTeacher(null);
        }
    }
} 