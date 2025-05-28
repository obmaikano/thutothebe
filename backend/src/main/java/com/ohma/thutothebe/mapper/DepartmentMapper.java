package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.DepartmentDTO;
import com.ohma.thutothebe.entity.Department;
import org.springframework.stereotype.Component;

@Component
public interface DepartmentMapper extends BaseDtoMapper<Department, DepartmentDTO> {
    
    /**
     * Updates an existing Department entity with data from DepartmentDTO
     * @param entity The existing department entity to update
     * @param dto The DepartmentDTO containing updated data
     */
    void updateEntityFromDto(Department entity, DepartmentDTO dto);
} 