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
    
    List<TeacherDTO> getTeachersByClassId(Long classId);
    
    TeacherDTO linkToUser(Long teacherId, Long userId);

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
     * Get teachers by multiple school IDs (for class-level access across schools)
     */
    List<TeacherDTO> getTeachersBySchoolIds(List<Long> schoolIds);
    
    /**
     * Get teachers by multiple region IDs (for regional access across regions)
     */
    List<TeacherDTO> getTeachersByRegionIds(List<Long> regionIds);
    
    /**
     * Get teachers by specific teacher IDs (for user-level access)
     */
    List<TeacherDTO> getTeachersByTeacherIds(List<Long> teacherIds);
    
    /**
     * Get teachers by specific user IDs (for user-level access through user relationship)
     */
    List<TeacherDTO> getTeachersByUserIds(List<Long> userIds);
    
    /**
     * Get active teachers by multiple school IDs
     */
    List<TeacherDTO> getActiveTeachersBySchoolIds(List<Long> schoolIds);
    
    /**
     * Get active teachers by multiple region IDs
     */
    List<TeacherDTO> getActiveTeachersByRegionIds(List<Long> regionIds);
    
    /**
     * Get active teachers by specific teacher IDs
     */
    List<TeacherDTO> getActiveTeachersByTeacherIds(List<Long> teacherIds);
    
    /**
     * Get active teachers by specific user IDs
     */
    List<TeacherDTO> getActiveTeachersByUserIds(List<Long> userIds);
    
    /**
     * Get teachers by multi-scope access (combines school, region, and user level access)
     */
    List<TeacherDTO> getTeachersByMultiScopeAccess(List<Long> schoolIds, List<Long> regionIds, List<Long> userIds);
    
    /**
     * Get active teachers by multi-scope access
     */
    List<TeacherDTO> getActiveTeachersByMultiScopeAccess(List<Long> schoolIds, List<Long> regionIds, List<Long> userIds);
    
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