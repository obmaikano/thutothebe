package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.AssignmentDTO;
import com.ohma.thutothebe.entity.AssignmentStatus;
import com.ohma.thutothebe.entity.Course;

import java.util.List;

public interface AssignmentService extends BaseService<AssignmentDTO, Long> {
    List<AssignmentDTO> getByCourse(Long courseId);
    List<AssignmentDTO> getByStatus(AssignmentStatus status);
    List<AssignmentDTO> getActive();
    List<AssignmentDTO> getActiveByCourse(Long courseId);
    AssignmentDTO getAssignmentByCode(String code);
    List<AssignmentDTO> getAssignmentsByCourse(Course course);
    List<AssignmentDTO> getAssignmentsByTeacher(Long teacherId);
    List<AssignmentDTO> getActiveAssignmentsByTeacher(Long teacherId);
    List<AssignmentDTO> getAssignmentsByInstructor(Long instructorId);
    List<AssignmentDTO> getActiveAssignmentsByInstructor(Long instructorId);
} 