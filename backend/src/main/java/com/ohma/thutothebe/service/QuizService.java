package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.QuizDTO;
import com.ohma.thutothebe.dto.CreateQuizDTO;
import com.ohma.thutothebe.entity.QuizStatus;

import java.util.List;

public interface QuizService extends BaseService<QuizDTO, Long> {
    QuizDTO getByCode(String code);
    List<QuizDTO> getByCourseId(Long courseId);
    List<QuizDTO> getByInstructorId(Long instructorId);
    List<QuizDTO> getByStatus(QuizStatus status);
    List<QuizDTO> getByCourseIdAndStatus(Long courseId, QuizStatus status);
    List<QuizDTO> getActiveByCourseId(Long courseId);
    boolean existsByCode(String code);
    
    /**
     * Create a new quiz using CreateQuizDTO
     * @param createQuizDTO the quiz creation data
     * @return the created quiz
     */
    QuizDTO createQuiz(CreateQuizDTO createQuizDTO);

    // ==================== MULTI-TENANT FILTERING METHODS ====================
    
    /**
     * Get quizzes filtered by accessible scope IDs based on user's permissions
     * This replaces the unsafe getAll() method
     */
    List<QuizDTO> getQuizzesByAccessibleScopes(Long currentUserId);
    
    /**
     * Get active quizzes filtered by accessible scope IDs
     */
    List<QuizDTO> getActiveQuizzesByAccessibleScopes(Long currentUserId);
    
    /**
     * Get quizzes by specific school ID (for school-level access)
     */
    List<QuizDTO> getQuizzesBySchoolId(Long schoolId);
    
    /**
     * Get quizzes by specific region ID (for regional access)
     */
    List<QuizDTO> getQuizzesByRegionId(Long regionId);
    
    /**
     * Get active quizzes by school ID
     */
    List<QuizDTO> getActiveQuizzesBySchoolId(Long schoolId);
    
    /**
     * Get active quizzes by region ID
     */
    List<QuizDTO> getActiveQuizzesByRegionId(Long regionId);
    
    /**
     * Get quizzes by multiple school IDs (for class-level access across schools)
     */
    List<QuizDTO> getQuizzesBySchoolIds(List<Long> schoolIds);
    
    /**
     * Get quizzes by multiple region IDs (for regional access across regions)
     */
    List<QuizDTO> getQuizzesByRegionIds(List<Long> regionIds);
    
    /**
     * Get quizzes by specific quiz IDs (for user-level access)
     */
    List<QuizDTO> getQuizzesByQuizIds(List<Long> quizIds);
    
    /**
     * Get quizzes by specific instructor IDs (for user-level access through instructor relationship)
     */
    List<QuizDTO> getQuizzesByInstructorIds(List<Long> instructorIds);
    
    /**
     * Get active quizzes by multiple school IDs
     */
    List<QuizDTO> getActiveQuizzesBySchoolIds(List<Long> schoolIds);
    
    /**
     * Get active quizzes by multiple region IDs
     */
    List<QuizDTO> getActiveQuizzesByRegionIds(List<Long> regionIds);
    
    /**
     * Get active quizzes by specific quiz IDs
     */
    List<QuizDTO> getActiveQuizzesByQuizIds(List<Long> quizIds);
    
    /**
     * Get active quizzes by specific instructor IDs
     */
    List<QuizDTO> getActiveQuizzesByInstructorIds(List<Long> instructorIds);
    
    /**
     * Get quizzes by multi-scope access (combines school, region, and instructor level access)
     */
    List<QuizDTO> getQuizzesByMultiScopeAccess(List<Long> schoolIds, List<Long> regionIds, List<Long> instructorIds);
    
    /**
     * Get active quizzes by multi-scope access
     */
    List<QuizDTO> getActiveQuizzesByMultiScopeAccess(List<Long> schoolIds, List<Long> regionIds, List<Long> instructorIds);
    
    /**
     * Get quizzes by course and accessible scopes (secure course quizzes)
     */
    List<QuizDTO> getQuizzesByCourseIdAndAccessibleScopes(Long courseId, Long currentUserId);
    
    /**
     * Get quizzes by class and accessible scopes (secure class quizzes)
     */
    List<QuizDTO> getQuizzesByClassIdAndAccessibleScopes(Long classId, Long currentUserId);
    
    /**
     * Get quizzes by subject and accessible scopes (secure subject quizzes)
     */
    List<QuizDTO> getQuizzesBySubjectIdAndAccessibleScopes(Long subjectId, Long currentUserId);
    
    /**
     * Get quizzes by teacher and accessible scopes (secure teacher quizzes)
     */
    List<QuizDTO> getQuizzesByTeacherIdAndAccessibleScopes(Long teacherId, Long currentUserId);
    
    /**
     * Get quizzes by status and accessible scopes (secure status filtering)
     */
    List<QuizDTO> getQuizzesByStatusAndAccessibleScopes(QuizStatus status, Long currentUserId);
    
    /**
     * Get quizzes by status string and accessible scopes (secure status filtering)
     */
    List<QuizDTO> getQuizzesByStatusAndAccessibleScopes(String status, Long currentUserId);
} 