package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.AssignmentDTO;
import com.ohma.thutothebe.entity.AssignmentStatus;
import com.ohma.thutothebe.entity.Course;

import java.util.List;

public interface AssignmentService extends BaseService<AssignmentDTO, Long> {
    AssignmentDTO getById(Long id);
    List<AssignmentDTO> getAll();
    AssignmentDTO create(AssignmentDTO dto);
    AssignmentDTO update(Long id, AssignmentDTO dto);
    void delete(Long id);
    List<AssignmentDTO> getByCourse(Long courseId);
    List<AssignmentDTO> getByStatus(AssignmentStatus status);
    List<AssignmentDTO> getActive();
    List<AssignmentDTO> getActiveByCourse(Long courseId);
    AssignmentDTO getAssignmentByCode(String code);
    List<AssignmentDTO> getAssignmentsByCourse(Course course);
} 