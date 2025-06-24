package com.ohma.thutothebe.mapper.impl;

import com.ohma.thutothebe.dto.StaffDTO;
import com.ohma.thutothebe.entity.School;
import com.ohma.thutothebe.entity.Teacher;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.mapper.StaffMapper;
import com.ohma.thutothebe.repository.SchoolRepository;
import org.springframework.stereotype.Component;

@Component
public class StaffMapperImpl implements StaffMapper {

    private final SchoolRepository schoolRepository;

    public StaffMapperImpl(SchoolRepository schoolRepository) {
        this.schoolRepository = schoolRepository;
    }

    @Override
    public StaffDTO toDto(User entity) {
        if (entity == null) {
            return null;
        }
        
        return new StaffDTO(
            entity.getId(),
            entity.getUsername(),
            entity.getFirstName(),
            entity.getLastName(),
            entity.getEmail(),
            entity.getRole(),
            entity.getQualification(),
            null, // staffId will be set by toStaffDto method
            entity.getSchool() != null ? entity.getSchool().getId() : null,
            entity.getRegion() != null ? entity.getRegion().getId() : null,
            entity.isActive(),
            false, // isTeacher will be set by toStaffDto method
            entity.getLastLoginTime(),
            entity.getCreatedAt(),
            entity.getModifiedAt()
        );
    }

    @Override
    public User toEntity(StaffDTO dto) {
        if (dto == null) {
            return null;
        }
        
        User user = new User();
        user.setId(dto.id());
        user.setUsername(dto.username());
        user.setFirstName(dto.firstName());
        user.setLastName(dto.lastName());
        user.setEmail(dto.email());
        user.setRole(dto.role());
        user.setQualification(dto.qualification());
        user.setActive(dto.active());
        
        if (dto.schoolId() != null) {
            schoolRepository.findById(dto.schoolId()).ifPresent(user::setSchool);
        }
        
        return user;
    }

    @Override
    public StaffDTO toStaffDto(User user, Teacher teacher) {
        if (user == null) {
            return null;
        }
        
        boolean isTeacher = teacher != null;
        String staffId = isTeacher ? teacher.getStaffId() : null;
        
        return new StaffDTO(
            user.getId(),
            user.getUsername(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            user.getRole(),
            user.getQualification(),
            staffId,
            user.getSchool() != null ? user.getSchool().getId() : null,
            user.getRegion() != null ? user.getRegion().getId() : null,
            user.isActive(),
            isTeacher,
            user.getLastLoginTime(),
            user.getCreatedAt(),
            user.getModifiedAt()
        );
    }
} 