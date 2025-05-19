package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.StudentDTO;

import java.util.List;

public interface StudentService extends BaseService<StudentDTO, Long> {
    
    StudentDTO getStudentByStudentId(String studentId);
    
    StudentDTO getStudentByEmail(String email);
    
    StudentDTO getStudentByUserId(Long userId);
    
    List<StudentDTO> getActiveStudents();
    
    List<StudentDTO> getStudentsBySchoolId(Long schoolId);
    
    StudentDTO createStudent(StudentDTO studentDTO);
    
    StudentDTO updateStudent(Long id, StudentDTO studentDTO);
    
    void deleteStudent(Long id);
    
    void activateStudent(Long id);
    
    void deactivateStudent(Long id);
    
    boolean existsByStudentId(String studentId);
    
    boolean existsByEmail(String email);
    
    StudentDTO linkToUser(Long studentId, Long userId);
} 