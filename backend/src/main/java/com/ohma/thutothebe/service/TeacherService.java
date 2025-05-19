package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.TeacherDTO;

import java.util.List;

public interface TeacherService extends BaseService<TeacherDTO, Long> {
    
    TeacherDTO getTeacherByStaffId(String staffId);
    
    TeacherDTO getTeacherByEmail(String email);
    
    TeacherDTO getTeacherByUserId(Long userId);
    
    List<TeacherDTO> getActiveTeachers();
    
    List<TeacherDTO> getTeachersBySchoolId(Long schoolId);
    
    TeacherDTO createTeacher(TeacherDTO teacherDTO);
    
    TeacherDTO updateTeacher(Long id, TeacherDTO teacherDTO);
    
    void deleteTeacher(Long id);
    
    void activateTeacher(Long id);
    
    void deactivateTeacher(Long id);
    
    boolean existsByStaffId(String staffId);
    
    boolean existsByEmail(String email);
    
    List<TeacherDTO> getTeachersByCourseId(Long courseId);
    
    TeacherDTO linkToUser(Long teacherId, Long userId);
} 