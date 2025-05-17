package com.ohma.thutothebe.mapper.impl;

import com.ohma.thutothebe.dto.SubjectDTO;
import com.ohma.thutothebe.entity.Subject;
import com.ohma.thutothebe.mapper.SubjectMapper;
import org.springframework.stereotype.Component;

@Component
public class SubjectMapperImpl implements SubjectMapper {

    @Override
    public Subject toEntity(SubjectDTO dto) {
        if (dto == null) {
            return null;
        }
        
        Subject subject = new Subject();
        subject.setId(dto.id());
        subject.setCode(dto.code());
        subject.setName(dto.name());
        subject.setDescription(dto.description());
        subject.setActive(dto.active());
        
        return subject;
    }

    @Override
    public SubjectDTO toDto(Subject entity) {
        if (entity == null) {
            return null;
        }
        
        return new SubjectDTO(
            entity.getId(),
            entity.getCode(),
            entity.getName(),
            entity.getDescription(),
            entity.isActive()
        );
    }
} 