package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.DepartmentDTO;

import java.util.List;

public interface DepartmentService extends BaseService<DepartmentDTO, Long> {
    
    List<DepartmentDTO> getDepartmentsBySchoolId(Long schoolId);
    
    List<DepartmentDTO> getActiveDepartmentsBySchoolId(Long schoolId);
    
    List<DepartmentDTO> getActiveDepartments();
    
    DepartmentDTO getDepartmentByNameAndSchoolId(String name, Long schoolId);
    
    DepartmentDTO getDepartmentByDepartmentHeadId(Long departmentHeadId);
    
    List<DepartmentDTO> getDepartmentsByTeacherId(Long teacherId);
    
    DepartmentDTO getDepartmentBySubjectId(Long subjectId);
    
    DepartmentDTO assignDepartmentHead(Long departmentId, Long userId);
    
    DepartmentDTO removeDepartmentHead(Long departmentId);
    
    DepartmentDTO assignTeacherToDepartment(Long departmentId, Long teacherId);
    
    DepartmentDTO removeTeacherFromDepartment(Long departmentId, Long teacherId);
    
    DepartmentDTO assignSubjectToDepartment(Long departmentId, Long subjectId);
    
    DepartmentDTO removeSubjectFromDepartment(Long departmentId, Long subjectId);
    
    void activateDepartment(Long departmentId);
    
    void deactivateDepartment(Long departmentId);
    
    Long countActiveDepartmentsBySchoolId(Long schoolId);
    
    boolean existsByNameAndSchoolId(String name, Long schoolId);
    
    boolean existsByDepartmentHeadId(Long departmentHeadId);
    
    List<DepartmentDTO> getDepartmentsWithoutHead(Long schoolId);
    
    List<DepartmentDTO> getDepartmentsWithSubjects(Long schoolId);
} 