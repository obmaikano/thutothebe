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
    
    // Additional methods expected by tests
    AssignmentDTO publishAssignment(Long assignmentId);
    AssignmentDTO closeAssignment(Long assignmentId);
    AssignmentDTO archiveAssignment(Long assignmentId);
    void updateAssignmentStatistics(Long assignmentId);
    List<AssignmentDTO> getAssignmentsByStatus(String status);
    List<AssignmentDTO> getAssignmentsByCourseAndStatus(Long courseId, String status);

    // ==================== MULTI-TENANT FILTERING METHODS ====================
    
    /**
     * Get assignments filtered by accessible scope IDs based on user's permissions
     * This replaces the unsafe getAll() method
     */
    List<AssignmentDTO> getAssignmentsByAccessibleScopes(Long currentUserId);
    
    /**
     * Get active assignments filtered by accessible scope IDs
     */
    List<AssignmentDTO> getActiveAssignmentsByAccessibleScopes(Long currentUserId);
    
    /**
     * Get assignments by specific school ID (for school-level access)
     */
    List<AssignmentDTO> getAssignmentsBySchoolId(Long schoolId);
    
    /**
     * Get assignments by specific region ID (for regional access)
     */
    List<AssignmentDTO> getAssignmentsByRegionId(Long regionId);
    
    /**
     * Get active assignments by school ID
     */
    List<AssignmentDTO> getActiveAssignmentsBySchoolId(Long schoolId);
    
    /**
     * Get active assignments by region ID
     */
    List<AssignmentDTO> getActiveAssignmentsByRegionId(Long regionId);
    
    /**
     * Get assignments by multiple school IDs (for class-level access across schools)
     */
    List<AssignmentDTO> getAssignmentsBySchoolIds(List<Long> schoolIds);
    
    /**
     * Get assignments by multiple region IDs (for regional access across regions)
     */
    List<AssignmentDTO> getAssignmentsByRegionIds(List<Long> regionIds);
    
    /**
     * Get assignments by specific assignment IDs (for user-level access)
     */
    List<AssignmentDTO> getAssignmentsByAssignmentIds(List<Long> assignmentIds);
    
    /**
     * Get assignments by specific instructor IDs (for user-level access through instructor relationship)
     */
    List<AssignmentDTO> getAssignmentsByInstructorIds(List<Long> instructorIds);
    
    /**
     * Get active assignments by multiple school IDs
     */
    List<AssignmentDTO> getActiveAssignmentsBySchoolIds(List<Long> schoolIds);
    
    /**
     * Get active assignments by multiple region IDs
     */
    List<AssignmentDTO> getActiveAssignmentsByRegionIds(List<Long> regionIds);
    
    /**
     * Get active assignments by specific assignment IDs
     */
    List<AssignmentDTO> getActiveAssignmentsByAssignmentIds(List<Long> assignmentIds);
    
    /**
     * Get active assignments by specific instructor IDs
     */
    List<AssignmentDTO> getActiveAssignmentsByInstructorIds(List<Long> instructorIds);
    
    /**
     * Get assignments by multi-scope access (combines school, region, and instructor level access)
     */
    List<AssignmentDTO> getAssignmentsByMultiScopeAccess(List<Long> schoolIds, List<Long> regionIds, List<Long> instructorIds);
    
    /**
     * Get active assignments by multi-scope access
     */
    List<AssignmentDTO> getActiveAssignmentsByMultiScopeAccess(List<Long> schoolIds, List<Long> regionIds, List<Long> instructorIds);
    
    /**
     * Get assignments by course and accessible scopes (secure course assignments)
     */
    List<AssignmentDTO> getAssignmentsByCourseIdAndAccessibleScopes(Long courseId, Long currentUserId);
    
    /**
     * Get assignments by class and accessible scopes (secure class assignments)
     */
    List<AssignmentDTO> getAssignmentsByClassIdAndAccessibleScopes(Long classId, Long currentUserId);
    
    /**
     * Get assignments by subject and accessible scopes (secure subject assignments)
     */
    List<AssignmentDTO> getAssignmentsBySubjectIdAndAccessibleScopes(Long subjectId, Long currentUserId);
    
    /**
     * Get assignments by teacher and accessible scopes (secure teacher assignments)
     */
    List<AssignmentDTO> getAssignmentsByTeacherIdAndAccessibleScopes(Long teacherId, Long currentUserId);
    
    /**
     * Get assignments by status and accessible scopes (secure status filtering)
     */
    List<AssignmentDTO> getAssignmentsByStatusAndAccessibleScopes(AssignmentStatus status, Long currentUserId);
    
    /**
     * Get assignments by status string and accessible scopes (secure status filtering)
     */
    List<AssignmentDTO> getAssignmentsByStatusAndAccessibleScopes(String status, Long currentUserId);
} 