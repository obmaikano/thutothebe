package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.StaffDTO;
import com.ohma.thutothebe.entity.Teacher;
import com.ohma.thutothebe.entity.User;

public interface StaffMapper extends BaseDtoMapper<User, StaffDTO> {
    
    /**
     * Convert User entity to StaffDTO, determining if the user is a teacher
     * @param user User entity
     * @param teacher Teacher entity (can be null if user is not a teacher)
     * @return StaffDTO
     */
    StaffDTO toStaffDto(User user, Teacher teacher);
    
    /**
     * Convert StaffDTO to User entity
     * @param dto StaffDTO
     * @return User entity
     */
    User toEntity(StaffDTO dto);
} 