package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.LessonCompletionDTO;
import com.ohma.thutothebe.entity.LessonCompletion;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface LessonCompletionService extends BaseService<LessonCompletionDTO, Long> {

    List<LessonCompletionDTO> findByLessonId(Long lessonId);

    List<LessonCompletionDTO> findByLessonIdAndActive(Long lessonId, boolean active);

    List<LessonCompletionDTO> findByStudentId(Long studentId);

    List<LessonCompletionDTO> findByStudentIdAndActive(Long studentId, boolean active);

    LessonCompletionDTO findByLessonIdAndStudentId(Long lessonId, Long studentId);

    List<LessonCompletionDTO> findByCompletionStatus(LessonCompletion.CompletionStatus status);

    List<LessonCompletionDTO> findByStudentIdAndCompletionStatus(Long studentId, LessonCompletion.CompletionStatus status);

    List<LessonCompletionDTO> findByLessonIdAndCompletionStatus(Long lessonId, LessonCompletion.CompletionStatus status);

    List<LessonCompletionDTO> findByCourseId(Long courseId);

    List<LessonCompletionDTO> findByCourseIdAndStudentId(Long courseId, Long studentId);

    List<LessonCompletionDTO> findByCourseIdAndCompletionStatus(Long courseId, LessonCompletion.CompletionStatus status);

    Long countByCourseId(Long courseId);

    Long countByCourseIdAndCompletionStatus(Long courseId, LessonCompletion.CompletionStatus status);

    Long countByCourseIdAndStudentId(Long courseId, Long studentId);

    Long countByCourseIdAndStudentIdAndCompletionStatus(Long courseId, Long studentId, LessonCompletion.CompletionStatus status);

    Double getAverageCompletionPercentageByCourseId(Long courseId);

    Double getAverageCompletionPercentageByCourseIdAndStudentId(Long courseId, Long studentId);

    Double getAverageScoreByCourseId(Long courseId);

    Double getAverageScoreByCourseIdAndStudentId(Long courseId, Long studentId);

    List<LessonCompletionDTO> findByCompletedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    List<LessonCompletionDTO> findByCourseIdAndCompletedAtBetween(Long courseId, LocalDateTime startDate, LocalDateTime endDate);

    // Lesson completion management methods
    LessonCompletionDTO startLesson(Long lessonId, Long studentId);

    LessonCompletionDTO updateProgress(Long lessonId, Long studentId, Double completionPercentage, Integer timeSpentMinutes);

    LessonCompletionDTO completeLesson(Long lessonId, Long studentId, Double score, String feedback);

    LessonCompletionDTO markAsExempted(Long lessonId, Long studentId, String reason);

    LessonCompletionDTO updateParticipation(Long lessonId, Long studentId, boolean attendedInPerson, 
                                           boolean participatedActively, boolean completedAssignments, 
                                           boolean understoodContent);

    // Analytics methods
    Map<String, Object> getStudentProgressAnalytics(Long studentId, Long courseId);

    Map<String, Object> getLessonCompletionAnalytics(Long lessonId);

    Map<String, Object> getCourseCompletionAnalytics(Long courseId);

    Map<String, Object> getCompletionTrends(Long courseId, LocalDateTime startDate, LocalDateTime endDate);
} 