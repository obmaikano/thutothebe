package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.StudentDTO;
import com.ohma.thutothebe.dto.StudentOnboardingDTO;
import com.ohma.thutothebe.entity.enums.StudentStatus;

import java.util.List;

public interface StudentService extends BaseService<StudentDTO, Long> {
    
    StudentDTO getStudentByAdmissionNumber(String admissionNumber);
    
    StudentDTO getStudentByEmail(String email);
    
    StudentDTO getStudentByUserId(Long userId);
    
    List<StudentDTO> getActiveStudents();
    
    List<StudentDTO> getStudentsBySchoolId(Long schoolId);
    
    StudentDTO createStudent(StudentDTO studentDTO);
    
    void activateStudent(Long id);

    StudentDTO updateStudent(Long id, StudentDTO studentDTO);
    
    void deactivateStudent(Long id);
    
    boolean existsByAdmissionNumber(String admissionNumber);
    
    boolean existsByEmail(String email);
    
    StudentDTO linkToUser(Long studentId, Long userId);
    
    StudentDTO onboardStudent(StudentOnboardingDTO onboardingDTO);
    
    List<StudentDTO> getStudentsByClassId(Long classId);
    
    List<StudentDTO> getStudentsEnrolledInClass(Long classId);
    
    List<StudentDTO> getStudentsBySubjectId(Long subjectId);

    List<StudentDTO> getStudentsByCourseId(Long courseId);
    
    List<StudentDTO> getStudentsByTeacherId(Long teacherId);
    
    List<StudentDTO> getActiveStudentsByTeacherId(Long teacherId);
    
    List<StudentDTO> getActiveStudentsBySubjectId(Long subjectId);
    
    List<StudentDTO> getActiveStudentsByCourseId(Long courseId);
    
    List<StudentDTO> getActiveStudentsByClassId(Long classId);
    
    String debugClassEnrollment(Long classId);
    
    void cleanupClassEnrollmentInconsistencies(Long classId);

    // Student-specific methods for student role access
    List<Object> getStudentCourses(Long studentId);
    
    List<Object> getStudentAssignments(Long studentId);
    
    Object getStudentPerformanceAnalytics(Long studentId);
    
    Object getStudentDashboardData(Long studentId);
    
    // Helper method to create student record for user if it doesn't exist
    StudentDTO createStudentForUser(Long userId);

    // ==================== MULTI-TENANT FILTERING METHODS ====================
    
    /**
     * Get students filtered by accessible scope IDs based on user's permissions
     * This replaces the unsafe getAll() method
     */
    List<StudentDTO> getStudentsByAccessibleScopes(Long currentUserId);
    
    /**
     * Get active students filtered by accessible scope IDs
     */
    List<StudentDTO> getActiveStudentsByAccessibleScopes(Long currentUserId);
    
    /**
     * Get students by status filtered by accessible scope IDs
     */
    List<StudentDTO> getStudentsByStatusAndAccessibleScopes(StudentStatus status, Long currentUserId);
    
    /**
     * Get students by specific school ID (for school-level access)
     */
    List<StudentDTO> getStudentsBySchoolIdSecure(Long schoolId);
    
    /**
     * Get students by specific region ID (for regional access)
     */
    List<StudentDTO> getStudentsByRegionId(Long regionId);
    
    /**
     * Get students by status and school ID
     */
    List<StudentDTO> getStudentsByStatusAndSchoolId(StudentStatus status, Long schoolId);
    
    /**
     * Get students by status and region ID
     */
    List<StudentDTO> getStudentsByStatusAndRegionId(StudentStatus status, Long regionId);
    
    /**
     * Get students by multiple school IDs (for class-level access across schools)
     */
    List<StudentDTO> getStudentsBySchoolIds(List<Long> schoolIds);
    
    /**
     * Get students by multiple region IDs (for regional access across regions)
     */
    List<StudentDTO> getStudentsByRegionIds(List<Long> regionIds);
    
    /**
     * Get students by specific student IDs (for user-level access)
     */
    List<StudentDTO> getStudentsByStudentIds(List<Long> studentIds);
    
    /**
     * Get students by status and multiple school IDs
     */
    List<StudentDTO> getStudentsByStatusAndSchoolIds(StudentStatus status, List<Long> schoolIds);
    
    /**
     * Get students by status and multiple region IDs
     */
    List<StudentDTO> getStudentsByStatusAndRegionIds(StudentStatus status, List<Long> regionIds);
    
    /**
     * Get students by status and specific student IDs
     */
    List<StudentDTO> getStudentsByStatusAndStudentIds(StudentStatus status, List<Long> studentIds);
    
    /**
     * Get students by multi-scope access (combines school, region, and student level access)
     */
    List<StudentDTO> getStudentsByMultiScopeAccess(List<Long> schoolIds, List<Long> regionIds, List<Long> studentIds);
    
    /**
     * Get students by status and multi-scope access
     */
    List<StudentDTO> getStudentsByStatusAndMultiScopeAccess(StudentStatus status, List<Long> schoolIds, List<Long> regionIds, List<Long> studentIds);
    
    /**
     * Get students by class and accessible scopes (secure class enrollment)
     */
    List<StudentDTO> getStudentsByClassIdAndAccessibleScopes(Long classId, Long currentUserId);
    
    /**
     * Get students by academic year and accessible scopes
     */
    List<StudentDTO> getStudentsByAcademicYearAndAccessibleScopes(Integer academicYear, Long currentUserId);
    
    /**
     * Get students by subject and accessible scopes (secure subject enrollment)
     */
    List<StudentDTO> getStudentsBySubjectIdAndAccessibleScopes(Long subjectId, Long currentUserId);
    
    /**
     * Get students by course and accessible scopes (secure course enrollment)
     */
    List<StudentDTO> getStudentsByCourseIdAndAccessibleScopes(Long courseId, Long currentUserId);
    
    /**
     * Get students by teacher and accessible scopes (secure teacher-student relationship)
     */
    List<StudentDTO> getStudentsByTeacherIdAndAccessibleScopes(Long teacherId, Long currentUserId);
} 