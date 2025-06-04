package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.CourseDTO;
import com.ohma.thutothebe.entity.CourseType;
import com.ohma.thutothebe.entity.Term;
import com.ohma.thutothebe.entity.User;

import java.util.List;
import java.util.Set;

public interface CourseService extends BaseService<CourseDTO, Long> {
    CourseDTO getCourseByCode(String code);
    Set<CourseDTO> getCoursesByTeacher(User teacher);
    List<CourseDTO> findByEnrolledStudentId(Long studentId);
    Set<CourseDTO> getActiveCourses();
    List<CourseDTO> findByInstructorId(Long instructorId);
    CourseDTO enrollStudent(Long courseId, Long studentId);
    CourseDTO unenrollStudent(Long courseId, Long studentId);
    boolean existsByCode(String code);
    List<CourseDTO> getCoursesBySubjectId(Long subjectId);
    List<CourseDTO> getActiveCoursesbySubjectId(Long subjectId);
    List<CourseDTO> getCoursesByClassId(Long classId);
    List<CourseDTO> getActiveCoursesByClassId(Long classId);
    List<CourseDTO> getCoursesByTeacherId(Long teacherId);
    List<CourseDTO> getActiveCoursesByTeacherId(Long teacherId);
    List<CourseDTO> getCoursesByTerm(Term term);
    List<CourseDTO> getCoursesByYear(Integer year);
    List<CourseDTO> getCoursesByType(CourseType type);
    List<CourseDTO> getActiveCoursesByType(CourseType type);
    CourseDTO createCourse(CourseDTO courseDTO);
    CourseDTO updateCourse(Long id, CourseDTO courseDTO);
    void deleteCourse(Long id);
    void activateCourse(Long id);
    void deactivateCourse(Long id);
    void addInstructorToCourse(Long courseId, Long teacherId, boolean isPrimary);
    void removeInstructorFromCourse(Long courseId, Long teacherId);

    // ==================== MULTI-TENANT SECURITY METHODS ====================
    
    /**
     * Get courses accessible to the current user based on their access scopes
     */
    List<CourseDTO> getCoursesByAccessibleScopes(Long userId);
    
    /**
     * Get active courses accessible to the current user based on their access scopes
     */
    List<CourseDTO> getActiveCoursesByAccessibleScopes(Long userId);
    
    /**
     * Get courses by school ID with access validation
     */
    List<CourseDTO> getCoursesBySchoolIdAndAccessibleScopes(Long schoolId, Long userId);
    
    /**
     * Get courses by region ID with access validation
     */
    List<CourseDTO> getCoursesByRegionIdAndAccessibleScopes(Long regionId, Long userId);
    
    /**
     * Get courses by subject ID with multi-tenant security
     */
    List<CourseDTO> getCoursesBySubjectIdAndAccessibleScopes(Long subjectId, Long userId);
    
    /**
     * Get courses by teacher ID with multi-tenant security
     */
    List<CourseDTO> getCoursesByTeacherIdAndAccessibleScopes(Long teacherId, Long userId);
    
    /**
     * Get courses by class ID with multi-tenant security
     */
    List<CourseDTO> getCoursesByClassIdAndAccessibleScopes(Long classId, Long userId);
    
    /**
     * Get courses by term with multi-tenant security
     */
    List<CourseDTO> getCoursesByTermAndAccessibleScopes(Term term, Long userId);
    
    /**
     * Get courses by year with multi-tenant security
     */
    List<CourseDTO> getCoursesByYearAndAccessibleScopes(Integer year, Long userId);
    
    /**
     * Get courses by type with multi-tenant security
     */
    List<CourseDTO> getCoursesByTypeAndAccessibleScopes(CourseType type, Long userId);
    
    /**
     * Get courses by multi-scope access (schools and regions)
     */
    List<CourseDTO> getCoursesByMultiScopeAccess(List<Long> schoolIds, List<Long> regionIds);
    
    /**
     * Validate course access for current user
     */
    boolean validateCourseAccess(Long courseId, Long userId);
    
    /**
     * Check if course code exists within user's accessible schools
     */
    boolean existsByCodeAndAccessibleScopes(String code, Long userId);
    
    /**
     * Validate business rules for course creation/update
     */
    void validateCourseBusinessRules(CourseDTO courseDTO, boolean isUpdate, Long userId);
} 