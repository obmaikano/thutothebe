package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.TeacherDTO;
import com.ohma.thutothebe.dto.TeacherOnboardingDTO;

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
    
    List<TeacherDTO> getTeachersByClassId(Long classId);
    
    TeacherDTO linkToUser(Long teacherId, Long userId);
    
    /**
     * Onboard a new teacher by creating both user account and teacher profile
     * @param onboardingDTO Teacher onboarding data including user credentials
     * @return Created teacher DTO
     */
    TeacherDTO onboardTeacher(TeacherOnboardingDTO onboardingDTO);

    // ==================== MULTI-TENANT FILTERING METHODS ====================
    
    /**
     * Get teachers filtered by accessible scope IDs based on user's permissions
     * This replaces the unsafe getAll() method
     */
    List<TeacherDTO> getTeachersByAccessibleScopes(Long currentUserId);
    
    /**
     * Get active teachers filtered by accessible scope IDs
     */
    List<TeacherDTO> getActiveTeachersByAccessibleScopes(Long currentUserId);
    
    /**
     * Get teachers by specific school ID (for school-level access)
     */
    List<TeacherDTO> getTeachersBySchoolIdSecure(Long schoolId);
    
    /**
     * Get teachers by specific region ID (for regional access)
     */
    List<TeacherDTO> getTeachersByRegionId(Long regionId);
    
    /**
     * Get active teachers by school ID
     */
    List<TeacherDTO> getActiveTeachersBySchoolId(Long schoolId);
    
    /**
     * Get active teachers by region ID
     */
    List<TeacherDTO> getActiveTeachersByRegionId(Long regionId);
    
    /**
     * Get teachers by department ID
     */
    List<TeacherDTO> getTeachersByDepartmentId(Long departmentId);
    
    /**
     * Get teachers by department ID with accessible scope filtering
     */
    List<TeacherDTO> getTeachersByDepartmentIdAndAccessibleScopes(Long departmentId, Long currentUserId);
    
    /**
     * Get teachers by school ID with accessible scope filtering
     */
    List<TeacherDTO> getTeachersBySchoolIdAndAccessibleScopes(Long schoolId, Long currentUserId);
    
    /**
     * Get teachers by region ID with accessible scope filtering
     */
    List<TeacherDTO> getTeachersByRegionIdAndAccessibleScopes(Long regionId, Long currentUserId);
    
    /**
     * Get teachers by course and accessible scopes (secure course instruction)
     */
    List<TeacherDTO> getTeachersByCourseIdAndAccessibleScopes(Long courseId, Long currentUserId);
    
    /**
     * Get teachers by class and accessible scopes (secure class instruction)
     */
    List<TeacherDTO> getTeachersByClassIdAndAccessibleScopes(Long classId, Long currentUserId);
    
    /**
     * Get teachers by subject and accessible scopes (secure subject instruction)
     */
    List<TeacherDTO> getTeachersBySubjectIdAndAccessibleScopes(Long subjectId, Long currentUserId);
} 