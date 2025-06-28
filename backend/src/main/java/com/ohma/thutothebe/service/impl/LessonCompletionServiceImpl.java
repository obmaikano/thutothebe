package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.LessonCompletionDTO;
import com.ohma.thutothebe.entity.LessonCompletion;
import com.ohma.thutothebe.entity.Lesson;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.mapper.LessonCompletionMapper;
import com.ohma.thutothebe.mapper.LessonMapper;
import com.ohma.thutothebe.mapper.UserMapper;
import com.ohma.thutothebe.repository.LessonCompletionRepository;
import com.ohma.thutothebe.service.LessonCompletionService;
import com.ohma.thutothebe.service.LessonService;
import com.ohma.thutothebe.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class LessonCompletionServiceImpl extends BaseServiceImpl<LessonCompletion, LessonCompletionDTO, Long> implements LessonCompletionService {

    private static final String COMPLETION_CACHE = "lessonCompletions";

    private final LessonCompletionRepository lessonCompletionRepository;
    private final LessonCompletionMapper lessonCompletionMapper;
    private final LessonService lessonService;
    private final UserService userService;
    private final LessonMapper lessonMapper;
    private final UserMapper userMapper;

    @Autowired
    public LessonCompletionServiceImpl(LessonCompletionRepository lessonCompletionRepository, 
                                     LessonCompletionMapper lessonCompletionMapper,
                                     LessonService lessonService, UserService userService,
                                     LessonMapper lessonMapper, UserMapper userMapper) {
        super(lessonCompletionRepository);
        this.lessonCompletionRepository = lessonCompletionRepository;
        this.lessonCompletionMapper = lessonCompletionMapper;
        this.lessonService = lessonService;
        this.userService = userService;
        this.lessonMapper = lessonMapper;
        this.userMapper = userMapper;
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = COMPLETION_CACHE, key = "#lessonId + '_lesson'")
    public List<LessonCompletionDTO> findByLessonId(Long lessonId) {
        log.debug("Finding lesson completions by lesson ID: {}", lessonId);
        return lessonCompletionRepository.findByLessonId(lessonId).stream()
            .map(lessonCompletionMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = COMPLETION_CACHE, key = "#lessonId + '_lesson_active_' + #active")
    public List<LessonCompletionDTO> findByLessonIdAndActive(Long lessonId, boolean active) {
        log.debug("Finding lesson completions by lesson ID: {} and active: {}", lessonId, active);
        return lessonCompletionRepository.findByLessonIdAndActive(lessonId, active).stream()
            .map(lessonCompletionMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = COMPLETION_CACHE, key = "#studentId + '_student'")
    public List<LessonCompletionDTO> findByStudentId(Long studentId) {
        log.debug("Finding lesson completions by student ID: {}", studentId);
        return lessonCompletionRepository.findByStudentId(studentId).stream()
            .map(lessonCompletionMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = COMPLETION_CACHE, key = "#studentId + '_student_active_' + #active")
    public List<LessonCompletionDTO> findByStudentIdAndActive(Long studentId, boolean active) {
        log.debug("Finding lesson completions by student ID: {} and active: {}", studentId, active);
        return lessonCompletionRepository.findByStudentIdAndActive(studentId, active).stream()
            .map(lessonCompletionMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = COMPLETION_CACHE, key = "#lessonId + '_' + #studentId + '_lesson_student'")
    public LessonCompletionDTO findByLessonIdAndStudentId(Long lessonId, Long studentId) {
        log.debug("Finding lesson completion by lesson ID: {} and student ID: {}", lessonId, studentId);
        return lessonCompletionRepository.findByLessonIdAndStudentIdAndActive(lessonId, studentId, true)
            .map(lessonCompletionMapper::toDto)
            .orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = COMPLETION_CACHE, key = "#status + '_status'")
    public List<LessonCompletionDTO> findByCompletionStatus(LessonCompletion.CompletionStatus status) {
        log.debug("Finding lesson completions by status: {}", status);
        return lessonCompletionRepository.findByCompletionStatus(status).stream()
            .map(lessonCompletionMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = COMPLETION_CACHE, key = "#studentId + '_student_status_' + #status")
    public List<LessonCompletionDTO> findByStudentIdAndCompletionStatus(Long studentId, LessonCompletion.CompletionStatus status) {
        log.debug("Finding lesson completions by student ID: {} and status: {}", studentId, status);
        return lessonCompletionRepository.findByStudentIdAndCompletionStatus(studentId, status).stream()
            .map(lessonCompletionMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = COMPLETION_CACHE, key = "#lessonId + '_lesson_status_' + #status")
    public List<LessonCompletionDTO> findByLessonIdAndCompletionStatus(Long lessonId, LessonCompletion.CompletionStatus status) {
        log.debug("Finding lesson completions by lesson ID: {} and status: {}", lessonId, status);
        return lessonCompletionRepository.findByLessonIdAndCompletionStatus(lessonId, status).stream()
            .map(lessonCompletionMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = COMPLETION_CACHE, key = "#courseId + '_course'")
    public List<LessonCompletionDTO> findByCourseId(Long courseId) {
        log.debug("Finding lesson completions by course ID: {}", courseId);
        return lessonCompletionRepository.findByCourseId(courseId).stream()
            .map(lessonCompletionMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = COMPLETION_CACHE, key = "#courseId + '_' + #studentId + '_course_student'")
    public List<LessonCompletionDTO> findByCourseIdAndStudentId(Long courseId, Long studentId) {
        log.debug("Finding lesson completions by course ID: {} and student ID: {}", courseId, studentId);
        return lessonCompletionRepository.findByCourseIdAndStudentId(courseId, studentId).stream()
            .map(lessonCompletionMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = COMPLETION_CACHE, key = "#courseId + '_course_status_' + #status")
    public List<LessonCompletionDTO> findByCourseIdAndCompletionStatus(Long courseId, LessonCompletion.CompletionStatus status) {
        log.debug("Finding lesson completions by course ID: {} and status: {}", courseId, status);
        return lessonCompletionRepository.findByCourseIdAndCompletionStatus(courseId, status).stream()
            .map(lessonCompletionMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = COMPLETION_CACHE, key = "#courseId + '_count'")
    public Long countByCourseId(Long courseId) {
        log.debug("Counting lesson completions by course ID: {}", courseId);
        return lessonCompletionRepository.countByCourseId(courseId);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = COMPLETION_CACHE, key = "#courseId + '_count_status_' + #status")
    public Long countByCourseIdAndCompletionStatus(Long courseId, LessonCompletion.CompletionStatus status) {
        log.debug("Counting lesson completions by course ID: {} and status: {}", courseId, status);
        return lessonCompletionRepository.countByCourseIdAndCompletionStatus(courseId, status);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = COMPLETION_CACHE, key = "#courseId + '_' + #studentId + '_count'")
    public Long countByCourseIdAndStudentId(Long courseId, Long studentId) {
        log.debug("Counting lesson completions by course ID: {} and student ID: {}", courseId, studentId);
        return lessonCompletionRepository.countByCourseIdAndStudentId(courseId, studentId);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = COMPLETION_CACHE, key = "#courseId + '_' + #studentId + '_count_status_' + #status")
    public Long countByCourseIdAndStudentIdAndCompletionStatus(Long courseId, Long studentId, LessonCompletion.CompletionStatus status) {
        log.debug("Counting lesson completions by course ID: {}, student ID: {} and status: {}", courseId, studentId, status);
        return lessonCompletionRepository.countByCourseIdAndStudentIdAndCompletionStatus(courseId, studentId, status);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = COMPLETION_CACHE, key = "#courseId + '_avg_completion'")
    public Double getAverageCompletionPercentageByCourseId(Long courseId) {
        log.debug("Getting average completion percentage by course ID: {}", courseId);
        return lessonCompletionRepository.getAverageCompletionPercentageByCourseId(courseId);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = COMPLETION_CACHE, key = "#courseId + '_' + #studentId + '_avg_completion'")
    public Double getAverageCompletionPercentageByCourseIdAndStudentId(Long courseId, Long studentId) {
        log.debug("Getting average completion percentage by course ID: {} and student ID: {}", courseId, studentId);
        return lessonCompletionRepository.getAverageCompletionPercentageByCourseIdAndStudentId(courseId, studentId);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = COMPLETION_CACHE, key = "#courseId + '_avg_score'")
    public Double getAverageScoreByCourseId(Long courseId) {
        log.debug("Getting average score by course ID: {}", courseId);
        return lessonCompletionRepository.getAverageScoreByCourseId(courseId);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = COMPLETION_CACHE, key = "#courseId + '_' + #studentId + '_avg_score'")
    public Double getAverageScoreByCourseIdAndStudentId(Long courseId, Long studentId) {
        log.debug("Getting average score by course ID: {} and student ID: {}", courseId, studentId);
        return lessonCompletionRepository.getAverageScoreByCourseIdAndStudentId(courseId, studentId);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = COMPLETION_CACHE, key = "#startDate + '_' + #endDate + '_completed'")
    public List<LessonCompletionDTO> findByCompletedAtBetween(LocalDateTime startDate, LocalDateTime endDate) {
        log.debug("Finding lesson completions completed between: {} and {}", startDate, endDate);
        return lessonCompletionRepository.findByCompletedAtBetween(startDate, endDate).stream()
            .map(lessonCompletionMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = COMPLETION_CACHE, key = "#courseId + '_completed_' + #startDate + '_' + #endDate")
    public List<LessonCompletionDTO> findByCourseIdAndCompletedAtBetween(Long courseId, LocalDateTime startDate, LocalDateTime endDate) {
        log.debug("Finding lesson completions by course ID: {} completed between: {} and {}", courseId, startDate, endDate);
        return lessonCompletionRepository.findByCourseIdAndCompletedAtBetween(courseId, startDate, endDate).stream()
            .map(lessonCompletionMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    @CacheEvict(value = COMPLETION_CACHE, allEntries = true)
    public LessonCompletionDTO startLesson(Long lessonId, Long studentId) {
        log.info("Starting lesson for lesson ID: {} and student ID: {}", lessonId, studentId);
        
        Lesson lesson = lessonMapper.toEntity(lessonService.getById(lessonId));
        User student = userMapper.toEntity(userService.getById(studentId));
        
        LessonCompletion completion = lessonCompletionRepository.findByLessonIdAndStudentIdAndActive(lessonId, studentId, true)
            .orElseGet(() -> {
                LessonCompletion newCompletion = new LessonCompletion();
                newCompletion.setLesson(lesson);
                newCompletion.setStudent(student);
                newCompletion.setCompletionStatus(LessonCompletion.CompletionStatus.NOT_STARTED);
                newCompletion.setCompletionPercentage(0.0);
                newCompletion.setActive(true);
                return newCompletion;
            });
        
        completion.setCompletionStatus(LessonCompletion.CompletionStatus.IN_PROGRESS);
        completion.setStartedAt(LocalDateTime.now());
        
        LessonCompletion savedCompletion = lessonCompletionRepository.save(completion);
        return lessonCompletionMapper.toDto(savedCompletion);
    }

    @Override
    @Transactional
    @CacheEvict(value = COMPLETION_CACHE, allEntries = true)
    public LessonCompletionDTO updateProgress(Long lessonId, Long studentId, Double completionPercentage, Integer timeSpentMinutes) {
        log.info("Updating progress for lesson ID: {} and student ID: {} to {}%", lessonId, studentId, completionPercentage);
        
        LessonCompletion completion = lessonCompletionRepository.findByLessonIdAndStudentIdAndActive(lessonId, studentId, true)
            .orElseThrow(() -> new IllegalArgumentException("Lesson completion not found for lesson ID: " + lessonId + " and student ID: " + studentId));
        
        completion.setCompletionPercentage(completionPercentage);
        completion.setTimeSpentMinutes(timeSpentMinutes);
        
        if (completionPercentage >= 100.0) {
            completion.setCompletionStatus(LessonCompletion.CompletionStatus.COMPLETED);
            completion.setCompletedAt(LocalDateTime.now());
        } else if (completionPercentage > 0) {
            completion.setCompletionStatus(LessonCompletion.CompletionStatus.IN_PROGRESS);
        }
        
        LessonCompletion savedCompletion = lessonCompletionRepository.save(completion);
        return lessonCompletionMapper.toDto(savedCompletion);
    }

    @Override
    @Transactional
    @CacheEvict(value = COMPLETION_CACHE, allEntries = true)
    public LessonCompletionDTO completeLesson(Long lessonId, Long studentId, Double score, String feedback) {
        log.info("Completing lesson for lesson ID: {} and student ID: {} with score: {}", lessonId, studentId, score);
        
        LessonCompletion completion = lessonCompletionRepository.findByLessonIdAndStudentIdAndActive(lessonId, studentId, true)
            .orElseThrow(() -> new IllegalArgumentException("Lesson completion not found for lesson ID: " + lessonId + " and student ID: " + studentId));
        
        completion.setCompletionStatus(LessonCompletion.CompletionStatus.COMPLETED);
        completion.setCompletionPercentage(100.0);
        completion.setCompletedAt(LocalDateTime.now());
        completion.setScore(score);
        completion.setFeedback(feedback);
        
        LessonCompletion savedCompletion = lessonCompletionRepository.save(completion);
        return lessonCompletionMapper.toDto(savedCompletion);
    }

    @Override
    @Transactional
    @CacheEvict(value = COMPLETION_CACHE, allEntries = true)
    public LessonCompletionDTO markAsExempted(Long lessonId, Long studentId, String reason) {
        log.info("Marking lesson as exempted for lesson ID: {} and student ID: {} with reason: {}", lessonId, studentId, reason);
        
        LessonCompletion completion = lessonCompletionRepository.findByLessonIdAndStudentIdAndActive(lessonId, studentId, true)
            .orElseGet(() -> {
                Lesson lesson = lessonMapper.toEntity(lessonService.getById(lessonId));
                User student = userMapper.toEntity(userService.getById(studentId));
                
                LessonCompletion newCompletion = new LessonCompletion();
                newCompletion.setLesson(lesson);
                newCompletion.setStudent(student);
                newCompletion.setActive(true);
                return newCompletion;
            });
        
        completion.setCompletionStatus(LessonCompletion.CompletionStatus.EXEMPTED);
        completion.setCompletionPercentage(100.0);
        completion.setCompletedAt(LocalDateTime.now());
        completion.setNotes(reason);
        
        LessonCompletion savedCompletion = lessonCompletionRepository.save(completion);
        return lessonCompletionMapper.toDto(savedCompletion);
    }

    @Override
    @Transactional
    @CacheEvict(value = COMPLETION_CACHE, allEntries = true)
    public LessonCompletionDTO updateParticipation(Long lessonId, Long studentId, boolean attendedInPerson, 
                                                  boolean participatedActively, boolean completedAssignments, 
                                                  boolean understoodContent) {
        log.info("Updating participation for lesson ID: {} and student ID: {}", lessonId, studentId);
        
        LessonCompletion completion = lessonCompletionRepository.findByLessonIdAndStudentIdAndActive(lessonId, studentId, true)
            .orElseThrow(() -> new IllegalArgumentException("Lesson completion not found for lesson ID: " + lessonId + " and student ID: " + studentId));
        
        completion.setAttendedInPerson(attendedInPerson);
        completion.setParticipatedActively(participatedActively);
        completion.setCompletedAssignments(completedAssignments);
        completion.setUnderstoodContent(understoodContent);
        
        LessonCompletion savedCompletion = lessonCompletionRepository.save(completion);
        return lessonCompletionMapper.toDto(savedCompletion);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = COMPLETION_CACHE, key = "#studentId + '_' + #courseId + '_progress_analytics'")
    public Map<String, Object> getStudentProgressAnalytics(Long studentId, Long courseId) {
        log.debug("Getting student progress analytics for student ID: {} and course ID: {}", studentId, courseId);
        
        Map<String, Object> analytics = new HashMap<>();
        
        List<LessonCompletionDTO> completions = findByCourseIdAndStudentId(courseId, studentId);
        
        Long totalLessons = countByCourseIdAndStudentId(courseId, studentId);
        Long completedLessons = countByCourseIdAndStudentIdAndCompletionStatus(courseId, studentId, LessonCompletion.CompletionStatus.COMPLETED);
        Long inProgressLessons = countByCourseIdAndStudentIdAndCompletionStatus(courseId, studentId, LessonCompletion.CompletionStatus.IN_PROGRESS);
        Long exemptedLessons = countByCourseIdAndStudentIdAndCompletionStatus(courseId, studentId, LessonCompletion.CompletionStatus.EXEMPTED);
        
        Double averageCompletionPercentage = getAverageCompletionPercentageByCourseIdAndStudentId(courseId, studentId);
        Double averageScore = getAverageScoreByCourseIdAndStudentId(courseId, studentId);
        
        analytics.put("totalLessons", totalLessons);
        analytics.put("completedLessons", completedLessons);
        analytics.put("inProgressLessons", inProgressLessons);
        analytics.put("exemptedLessons", exemptedLessons);
        analytics.put("completionRate", totalLessons > 0 ? (double) completedLessons / totalLessons * 100 : 0.0);
        analytics.put("averageCompletionPercentage", averageCompletionPercentage);
        analytics.put("averageScore", averageScore);
        
        return analytics;
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = COMPLETION_CACHE, key = "#lessonId + '_lesson_completion_analytics'")
    public Map<String, Object> getLessonCompletionAnalytics(Long lessonId) {
        log.debug("Getting lesson completion analytics for lesson ID: {}", lessonId);
        
        Map<String, Object> analytics = new HashMap<>();
        
        List<LessonCompletionDTO> completions = findByLessonId(lessonId);
        
        Long totalStudents = (long) completions.size();
        Long completedStudents = completions.stream()
            .filter(completion -> completion.completionStatus() == LessonCompletion.CompletionStatus.COMPLETED)
            .count();
        Long inProgressStudents = completions.stream()
            .filter(completion -> completion.completionStatus() == LessonCompletion.CompletionStatus.IN_PROGRESS)
            .count();
        Long exemptedStudents = completions.stream()
            .filter(completion -> completion.completionStatus() == LessonCompletion.CompletionStatus.EXEMPTED)
            .count();
        
        Double averageCompletionPercentage = completions.stream()
            .mapToDouble(LessonCompletionDTO::completionPercentage)
            .average()
            .orElse(0.0);
        
        Double averageScore = completions.stream()
            .filter(completion -> completion.score() != null)
            .mapToDouble(LessonCompletionDTO::score)
            .average()
            .orElse(0.0);
        
        analytics.put("totalStudents", totalStudents);
        analytics.put("completedStudents", completedStudents);
        analytics.put("inProgressStudents", inProgressStudents);
        analytics.put("exemptedStudents", exemptedStudents);
        analytics.put("completionRate", totalStudents > 0 ? (double) completedStudents / totalStudents * 100 : 0.0);
        analytics.put("averageCompletionPercentage", averageCompletionPercentage);
        analytics.put("averageScore", averageScore);
        
        return analytics;
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = COMPLETION_CACHE, key = "#courseId + '_course_completion_analytics'")
    public Map<String, Object> getCourseCompletionAnalytics(Long courseId) {
        log.debug("Getting course completion analytics for course ID: {}", courseId);
        
        Map<String, Object> analytics = new HashMap<>();
        
        Long totalCompletions = countByCourseId(courseId);
        Long completedCompletions = countByCourseIdAndCompletionStatus(courseId, LessonCompletion.CompletionStatus.COMPLETED);
        Long inProgressCompletions = countByCourseIdAndCompletionStatus(courseId, LessonCompletion.CompletionStatus.IN_PROGRESS);
        Long exemptedCompletions = countByCourseIdAndCompletionStatus(courseId, LessonCompletion.CompletionStatus.EXEMPTED);
        
        Double averageCompletionPercentage = getAverageCompletionPercentageByCourseId(courseId);
        Double averageScore = getAverageScoreByCourseId(courseId);
        
        analytics.put("totalCompletions", totalCompletions);
        analytics.put("completedCompletions", completedCompletions);
        analytics.put("inProgressCompletions", inProgressCompletions);
        analytics.put("exemptedCompletions", exemptedCompletions);
        analytics.put("completionRate", totalCompletions > 0 ? (double) completedCompletions / totalCompletions * 100 : 0.0);
        analytics.put("averageCompletionPercentage", averageCompletionPercentage);
        analytics.put("averageScore", averageScore);
        
        return analytics;
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = COMPLETION_CACHE, key = "#courseId + '_completion_trends_' + #startDate + '_' + #endDate")
    public Map<String, Object> getCompletionTrends(Long courseId, LocalDateTime startDate, LocalDateTime endDate) {
        log.debug("Getting completion trends for course ID: {} between: {} and {}", courseId, startDate, endDate);
        
        Map<String, Object> trends = new HashMap<>();
        
        List<LessonCompletionDTO> completions = findByCourseIdAndCompletedAtBetween(courseId, startDate, endDate);
        
        // Group completions by date
        Map<String, Long> completionsByDate = completions.stream()
            .collect(Collectors.groupingBy(
                completion -> completion.completedAt().toLocalDate().toString(),
                Collectors.counting()
            ));
        
        trends.put("completionsByDate", completionsByDate);
        trends.put("totalCompletions", (long) completions.size());
        trends.put("averageCompletionsPerDay", completionsByDate.values().stream()
            .mapToLong(Long::longValue)
            .average()
            .orElse(0.0));
        
        return trends;
    }

    @Override
    protected LessonCompletion mapToEntity(LessonCompletionDTO dto) {
        LessonCompletion completion = lessonCompletionMapper.toEntity(dto);
        
        // Set lesson and student relationships
        if (dto.lessonId() != null) {
            Lesson lesson = lessonMapper.toEntity(lessonService.getById(dto.lessonId()));
            completion.setLesson(lesson);
        }
        
        if (dto.studentId() != null) {
            User student = userMapper.toEntity(userService.getById(dto.studentId()));
            completion.setStudent(student);
        }
        
        return completion;
    }

    @Override
    protected LessonCompletionDTO mapToDto(LessonCompletion entity) {
        return lessonCompletionMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(LessonCompletion entity, LessonCompletionDTO dto) {
        lessonCompletionMapper.updateEntity(entity, dto);
        
        // Update relationships if provided
        if (dto.lessonId() != null) {
            Lesson lesson = lessonMapper.toEntity(lessonService.getById(dto.lessonId()));
            entity.setLesson(lesson);
        }
        
        if (dto.studentId() != null) {
            User student = userMapper.toEntity(userService.getById(dto.studentId()));
            entity.setStudent(student);
        }
    }

    @Override
    protected Long extractSchoolId(LessonCompletion entity) {
        return entity.getLesson() != null && entity.getLesson().getCourse() != null && 
               entity.getLesson().getCourse().getClassEntity() != null && 
               entity.getLesson().getCourse().getClassEntity().getSchool() != null ? 
               entity.getLesson().getCourse().getClassEntity().getSchool().getId() : null;
    }

    @Override
    protected Long extractRegionId(LessonCompletion entity) {
        return entity.getLesson() != null && entity.getLesson().getCourse() != null && 
               entity.getLesson().getCourse().getClassEntity() != null && 
               entity.getLesson().getCourse().getClassEntity().getSchool() != null && 
               entity.getLesson().getCourse().getClassEntity().getSchool().getRegion() != null ? 
               entity.getLesson().getCourse().getClassEntity().getSchool().getRegion().getId() : null;
    }
} 