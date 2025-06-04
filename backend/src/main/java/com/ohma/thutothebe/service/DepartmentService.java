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

    // ==================== MULTI-TENANT SECURITY METHODS ====================
    
    /**
     * Get departments accessible to the current user based on their access scopes
     */
    List<DepartmentDTO> getDepartmentsByAccessibleScopes(Long userId);
    
    /**
     * Get active departments accessible to the current user based on their access scopes
     */
    List<DepartmentDTO> getActiveDepartmentsByAccessibleScopes(Long userId);
    
    /**
     * Get departments by school ID with access validation
     */
    List<DepartmentDTO> getDepartmentsBySchoolIdAndAccessibleScopes(Long schoolId, Long userId);
    
    /**
     * Get departments by region ID with access validation
     */
    List<DepartmentDTO> getDepartmentsByRegionIdAndAccessibleScopes(Long regionId, Long userId);
    
    /**
     * Get department by department head ID with multi-tenant security
     */
    DepartmentDTO getDepartmentByDepartmentHeadIdAndAccessibleScopes(Long departmentHeadId, Long userId);
    
    /**
     * Get departments by teacher ID with multi-tenant security
     */
    List<DepartmentDTO> getDepartmentsByTeacherIdAndAccessibleScopes(Long teacherId, Long userId);
    
    /**
     * Get department by subject ID with multi-tenant security
     */
    DepartmentDTO getDepartmentBySubjectIdAndAccessibleScopes(Long subjectId, Long userId);
    
    /**
     * Search departments by name with multi-tenant security
     */
    List<DepartmentDTO> searchDepartmentsByNameAndAccessibleScopes(String name, Long userId);
    
    /**
     * Get departments without head with multi-tenant security
     */
    List<DepartmentDTO> getDepartmentsWithoutHeadByAccessibleScopes(Long userId);
    
    /**
     * Get departments with subjects with multi-tenant security
     */
    List<DepartmentDTO> getDepartmentsWithSubjectsByAccessibleScopes(Long userId);
    
    /**
     * Get departments by multi-scope access (schools and regions)
     */
    List<DepartmentDTO> getDepartmentsByMultiScopeAccess(List<Long> schoolIds, List<Long> regionIds);
    
    /**
     * Validate department access for current user
     */
    boolean validateDepartmentAccess(Long departmentId, Long userId);
    
    /**
     * Check if department name exists within user's accessible schools
     */
    boolean existsByNameAndAccessibleScopes(String name, Long userId);
    
    /**
     * Check if department head exists within user's accessible schools
     */
    boolean existsByDepartmentHeadIdAndAccessibleScopes(Long departmentHeadId, Long userId);
    
    /**
     * Check if teacher exists in departments within user's accessible schools
     */
    boolean existsByTeacherIdAndAccessibleScopes(Long teacherId, Long userId);
    
    /**
     * Check if subject exists in departments within user's accessible schools
     */
    boolean existsBySubjectIdAndAccessibleScopes(Long subjectId, Long userId);
    
    /**
     * Validate business rules for department creation/update
     */
    void validateDepartmentBusinessRules(DepartmentDTO departmentDTO, boolean isUpdate, Long userId);
    
    /**
     * Get department statistics by accessible scopes
     */
    Long getDepartmentCountByAccessibleScopes(Long userId);
    
    /**
     * Get departments with head count by accessible scopes
     */
    Long getDepartmentsWithHeadCountByAccessibleScopes(Long userId);
    
    /**
     * Get departments without head count by accessible scopes
     */
    Long getDepartmentsWithoutHeadCountByAccessibleScopes(Long userId);
    
    /**
     * Get departments with subjects count by accessible scopes
     */
    Long getDepartmentsWithSubjectsCountByAccessibleScopes(Long userId);
    
    /**
     * Get departments with teachers count by accessible scopes
     */
    Long getDepartmentsWithTeachersCountByAccessibleScopes(Long userId);
} 