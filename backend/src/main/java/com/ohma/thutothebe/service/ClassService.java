package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.ClassDTO;
import com.ohma.thutothebe.entity.enums.GradeLevel;
import java.util.List;
import java.util.Set;

public interface ClassService extends BaseService<ClassDTO, Long> {
    List<ClassDTO> getClassesBySchoolId(Long schoolId);
    List<ClassDTO> getActiveClasses();
    List<ClassDTO> getActiveClassesBySchoolId(Long schoolId);
    List<ClassDTO> getClassesBySchoolIdAndTeacherId(Long schoolId, Long teacherId);
    List<ClassDTO> getClassesBySchoolIdAndStudentId(Long schoolId, Long studentId);
    List<ClassDTO> getClassesByTeacherId(Long teacherId);
    List<ClassDTO> getActiveClassesByTeacherId(Long teacherId);
    ClassDTO createClass(ClassDTO classDTO);
    ClassDTO updateClass(Long id, ClassDTO classDTO);
    void deleteClass(Long id);
    void deactivateClass(Long id);
    void activateClass(Long id);
    void addTeacherToClass(Long classId, Long teacherId);
    void removeTeacherFromClass(Long classId, Long teacherId);
    void addStudentToClass(Long classId, Long studentId);
    void removeStudentFromClass(Long classId, Long studentId);
    ClassDTO getClassWithStudents(Long id);

    // ==================== MULTI-TENANT SECURITY METHODS ====================
    
    /**
     * Get classes accessible to the current user based on their access scopes
     */
    List<ClassDTO> getClassesByAccessibleScopes(Long userId);
    
    /**
     * Get active classes accessible to the current user based on their access scopes
     */
    List<ClassDTO> getActiveClassesByAccessibleScopes(Long userId);
    
    /**
     * Get classes by school ID with access validation
     */
    List<ClassDTO> getClassesBySchoolIdAndAccessibleScopes(Long schoolId, Long userId);
    
    /**
     * Get classes by region ID with access validation
     */
    List<ClassDTO> getClassesByRegionIdAndAccessibleScopes(Long regionId, Long userId);
    
    /**
     * Get classes by grade level with multi-tenant security
     */
    List<ClassDTO> getClassesByGradeLevelAndAccessibleScopes(GradeLevel gradeLevel, Long userId);
    
    /**
     * Get classes by teacher ID with multi-tenant security
     */
    List<ClassDTO> getClassesByTeacherIdAndAccessibleScopes(Long teacherId, Long userId);
    
    /**
     * Get classes by student ID with multi-tenant security
     */
    List<ClassDTO> getClassesByStudentIdAndAccessibleScopes(Long studentId, Long userId);
    
    /**
     * Get classes by minimum capacity with multi-tenant security
     */
    List<ClassDTO> getClassesByMinCapacityAndAccessibleScopes(Integer minCapacity, Long userId);
    
    /**
     * Get available classes (with spots left) with multi-tenant security
     */
    List<ClassDTO> getAvailableClassesByAccessibleScopes(Long userId);
    
    /**
     * Get classes by over capacity status with multi-tenant security
     */
    List<ClassDTO> getClassesByOverCapacityAndAccessibleScopes(Boolean overCapacity, Long userId);
    
    /**
     * Search classes by name with multi-tenant security
     */
    List<ClassDTO> searchClassesByNameAndAccessibleScopes(String name, Long userId);
    
    /**
     * Get classes by multi-scope access (schools and regions)
     */
    List<ClassDTO> getClassesByMultiScopeAccess(List<Long> schoolIds, List<Long> regionIds);
    
    /**
     * Validate class access for current user
     */
    boolean validateClassAccess(Long classId, Long userId);
    
    /**
     * Check if class name exists within user's accessible schools
     */
    boolean existsByNameAndAccessibleScopes(String name, Long userId);
    
    /**
     * Check if class name exists for specific grade level within user's accessible schools
     */
    boolean existsByNameAndGradeLevelAndAccessibleScopes(String name, GradeLevel gradeLevel, Long userId);
    
    /**
     * Validate business rules for class creation/update
     */
    void validateClassBusinessRules(ClassDTO classDTO, boolean isUpdate, Long userId);
    
    /**
     * Get class statistics by accessible scopes
     */
    Long getClassCountByAccessibleScopes(Long userId);
    
    /**
     * Get total enrollment by accessible scopes
     */
    Long getTotalEnrollmentByAccessibleScopes(Long userId);
    
    /**
     * Get total capacity by accessible scopes
     */
    Long getTotalCapacityByAccessibleScopes(Long userId);
} 