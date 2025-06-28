package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.CreateLessonRequest;
import com.ohma.thutothebe.dto.LessonDTO;
import com.ohma.thutothebe.dto.UpdateLessonRequest;
import com.ohma.thutothebe.entity.Lesson;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface LessonService extends BaseService<LessonDTO, Long> {

    // Additional methods for controller
    List<LessonDTO> getAllLessons();
    
    LessonDTO getLessonById(Long id);
    
    LessonDTO createLesson(CreateLessonRequest request);
    
    LessonDTO updateLesson(Long id, UpdateLessonRequest request);
    
    void deleteLesson(Long id);

    List<LessonDTO> findByCourseId(Long courseId);

    List<LessonDTO> findByCourseIdAndActive(Long courseId, boolean active);

    List<LessonDTO> findByInstructorId(Long instructorId);

    List<LessonDTO> findByInstructorIdAndActive(Long instructorId, boolean active);

    List<LessonDTO> findByStatus(Lesson.LessonStatus status);

    List<LessonDTO> findByStatusAndActive(Lesson.LessonStatus status, boolean active);

    List<LessonDTO> findByScheduledDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    List<LessonDTO> findByCourseIdAndStatus(Long courseId, Lesson.LessonStatus status);

    LessonDTO findByCourseIdAndLessonOrder(Long courseId, Integer lessonOrder);

    Long countByCourseId(Long courseId);

    Long countByCourseIdAndStatus(Long courseId, Lesson.LessonStatus status);

    Integer getMaxLessonOrderByCourseId(Long courseId);

    List<LessonDTO> findByCourseIdAndScheduledDateBetween(Long courseId, LocalDateTime startDate, LocalDateTime endDate);

    List<LessonDTO> findByInstructorIdAndScheduledDateBetween(Long instructorId, LocalDateTime startDate, LocalDateTime endDate);

    List<LessonDTO> findMandatoryLessonsByCourseId(Long courseId);

    List<LessonDTO> findCompletedLessonsByCourseId(Long courseId);

    // Lesson management methods
    LessonDTO scheduleLesson(Long lessonId, LocalDateTime scheduledDate);

    LessonDTO startLesson(Long lessonId);

    LessonDTO completeLesson(Long lessonId);

    LessonDTO cancelLesson(Long lessonId, String reason);

    LessonDTO postponeLesson(Long lessonId, LocalDateTime newScheduledDate);

    // Lesson reordering
    LessonDTO updateLessonOrder(Long lessonId, Integer newOrder);

    List<LessonDTO> reorderLessons(Long courseId, List<Long> lessonIds);

    // Lesson analytics
    Map<String, Object> getLessonAnalytics(Long courseId);

    Map<String, Object> getInstructorLessonAnalytics(Long instructorId, LocalDateTime startDate, LocalDateTime endDate);
    
    // Additional methods for controller with string parameters
    List<LessonDTO> getLessonsByCourseId(Long courseId);
    
    List<LessonDTO> getLessonsByCourseIdAndActive(Long courseId, Boolean active);
    
    List<LessonDTO> getLessonsByInstructorId(Long instructorId);
    
    List<LessonDTO> getLessonsByStatus(String status);
    
    List<LessonDTO> getLessonsByCourseIdAndStatus(Long courseId, String status);
    
    LessonDTO getLessonByCourseIdAndLessonOrder(Long courseId, Integer lessonOrder);
    
    Long countLessonsByCourseId(Long courseId);
    
    Long countLessonsByCourseIdAndStatus(Long courseId, String status);
    
    List<LessonDTO> getLessonsByCourseIdAndScheduledDateBetween(Long courseId, String startDate, String endDate);
    
    List<LessonDTO> getLessonsByInstructorIdAndScheduledDateBetween(Long instructorId, String startDate, String endDate);
    
    List<LessonDTO> getMandatoryLessonsByCourseId(Long courseId);
    
    List<LessonDTO> getCompletedLessonsByCourseId(Long courseId);
    
    LessonDTO scheduleLesson(Long lessonId, String scheduledDate);
    
    LessonDTO postponeLesson(Long lessonId, String newScheduledDate);
    
    Map<String, Object> getInstructorLessonAnalytics(Long instructorId, String startDate, String endDate);
} 