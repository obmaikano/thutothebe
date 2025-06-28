package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.CreateLessonRequest;
import com.ohma.thutothebe.dto.LessonDTO;
import com.ohma.thutothebe.dto.UpdateLessonRequest;
import com.ohma.thutothebe.entity.Lesson;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.mapper.LessonMapper;
import com.ohma.thutothebe.mapper.CourseMapper;
import com.ohma.thutothebe.mapper.UserMapper;
import com.ohma.thutothebe.repository.LessonRepository;
import com.ohma.thutothebe.repository.CourseRepository;
import com.ohma.thutothebe.repository.UserRepository;
import com.ohma.thutothebe.service.LessonService;
import com.ohma.thutothebe.service.CourseService;
import com.ohma.thutothebe.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class LessonServiceImpl extends BaseServiceImpl<Lesson, LessonDTO, Long> implements LessonService {

    private static final String LESSON_CACHE = "lessons";

    private final LessonRepository lessonRepository;
    private final LessonMapper lessonMapper;
    private final CourseService courseService;
    private final UserService userService;
    private final CourseMapper courseMapper;
    private final UserMapper userMapper;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    @Autowired
    public LessonServiceImpl(LessonRepository lessonRepository, LessonMapper lessonMapper,
                           CourseService courseService, UserService userService,
                           CourseMapper courseMapper, UserMapper userMapper,
                           CourseRepository courseRepository, UserRepository userRepository) {
        super(lessonRepository);
        this.lessonRepository = lessonRepository;
        this.lessonMapper = lessonMapper;
        this.courseService = courseService;
        this.userService = userService;
        this.courseMapper = courseMapper;
        this.userMapper = userMapper;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = LESSON_CACHE, key = "#courseId + '_course'")
    public List<LessonDTO> findByCourseId(Long courseId) {
        log.debug("Finding lessons by course ID: {}", courseId);
        return lessonRepository.findByCourseIdOrderByLessonOrder(courseId).stream()
            .map(lessonMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = LESSON_CACHE, key = "#courseId + '_course_active_' + #active")
    public List<LessonDTO> findByCourseIdAndActive(Long courseId, boolean active) {
        log.debug("Finding lessons by course ID: {} and active: {}", courseId, active);
        return lessonRepository.findByCourseIdAndActiveOrderByLessonOrder(courseId, active).stream()
            .map(lessonMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = LESSON_CACHE, key = "#instructorId + '_instructor'")
    public List<LessonDTO> findByInstructorId(Long instructorId) {
        log.debug("Finding lessons by instructor ID: {}", instructorId);
        return lessonRepository.findByInstructorIdOrderByScheduledDate(instructorId).stream()
            .map(lessonMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = LESSON_CACHE, key = "#instructorId + '_instructor_active_' + #active")
    public List<LessonDTO> findByInstructorIdAndActive(Long instructorId, boolean active) {
        log.debug("Finding lessons by instructor ID: {} and active: {}", instructorId, active);
        return lessonRepository.findByInstructorIdAndActiveOrderByScheduledDate(instructorId, active).stream()
            .map(lessonMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = LESSON_CACHE, key = "#status + '_status'")
    public List<LessonDTO> findByStatus(Lesson.LessonStatus status) {
        log.debug("Finding lessons by status: {}", status);
        return lessonRepository.findByStatus(status).stream()
            .map(lessonMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = LESSON_CACHE, key = "#status + '_status_active_' + #active")
    public List<LessonDTO> findByStatusAndActive(Lesson.LessonStatus status, boolean active) {
        log.debug("Finding lessons by status: {} and active: {}", status, active);
        return lessonRepository.findByStatusAndActive(status, active).stream()
            .map(lessonMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = LESSON_CACHE, key = "#startDate + '_' + #endDate + '_scheduled'")
    public List<LessonDTO> findByScheduledDateBetween(LocalDateTime startDate, LocalDateTime endDate) {
        log.debug("Finding lessons scheduled between: {} and {}", startDate, endDate);
        return lessonRepository.findByScheduledDateBetween(startDate, endDate).stream()
            .map(lessonMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = LESSON_CACHE, key = "#courseId + '_course_status_' + #status")
    public List<LessonDTO> findByCourseIdAndStatus(Long courseId, Lesson.LessonStatus status) {
        log.debug("Finding lessons by course ID: {} and status: {}", courseId, status);
        return lessonRepository.findByCourseIdAndStatus(courseId, status).stream()
            .map(lessonMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = LESSON_CACHE, key = "#courseId + '_course_order_' + #lessonOrder")
    public LessonDTO findByCourseIdAndLessonOrder(Long courseId, Integer lessonOrder) {
        log.debug("Finding lesson by course ID: {} and lesson order: {}", courseId, lessonOrder);
        return lessonRepository.findByCourseIdAndLessonOrder(courseId, lessonOrder)
            .map(lessonMapper::toDto)
            .orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = LESSON_CACHE, key = "#courseId + '_count'")
    public Long countByCourseId(Long courseId) {
        log.debug("Counting lessons by course ID: {}", courseId);
        return lessonRepository.countByCourseId(courseId);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = LESSON_CACHE, key = "#courseId + '_count_status_' + #status")
    public Long countByCourseIdAndStatus(Long courseId, Lesson.LessonStatus status) {
        log.debug("Counting lessons by course ID: {} and status: {}", courseId, status);
        return lessonRepository.countByCourseIdAndStatus(courseId, status);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = LESSON_CACHE, key = "#courseId + '_max_order'")
    public Integer getMaxLessonOrderByCourseId(Long courseId) {
        log.debug("Getting max lesson order by course ID: {}", courseId);
        return lessonRepository.getMaxLessonOrderByCourseId(courseId);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = LESSON_CACHE, key = "#courseId + '_scheduled_' + #startDate + '_' + #endDate")
    public List<LessonDTO> findByCourseIdAndScheduledDateBetween(Long courseId, LocalDateTime startDate, LocalDateTime endDate) {
        log.debug("Finding lessons by course ID: {} scheduled between: {} and {}", courseId, startDate, endDate);
        return lessonRepository.findByCourseIdAndScheduledDateBetween(courseId, startDate, endDate).stream()
            .map(lessonMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = LESSON_CACHE, key = "#instructorId + '_scheduled_' + #startDate + '_' + #endDate")
    public List<LessonDTO> findByInstructorIdAndScheduledDateBetween(Long instructorId, LocalDateTime startDate, LocalDateTime endDate) {
        log.debug("Finding lessons by instructor ID: {} scheduled between: {} and {}", instructorId, startDate, endDate);
        return lessonRepository.findByInstructorIdAndScheduledDateBetween(instructorId, startDate, endDate).stream()
            .map(lessonMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = LESSON_CACHE, key = "#courseId + '_mandatory'")
    public List<LessonDTO> findMandatoryLessonsByCourseId(Long courseId) {
        log.debug("Finding mandatory lessons by course ID: {}", courseId);
        return lessonRepository.findMandatoryLessonsByCourseId(courseId).stream()
            .map(lessonMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = LESSON_CACHE, key = "#courseId + '_completed'")
    public List<LessonDTO> findCompletedLessonsByCourseId(Long courseId) {
        log.debug("Finding completed lessons by course ID: {}", courseId);
        return lessonRepository.findCompletedLessonsByCourseId(courseId).stream()
            .map(lessonMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    @CacheEvict(value = LESSON_CACHE, allEntries = true)
    public LessonDTO scheduleLesson(Long lessonId, LocalDateTime scheduledDate) {
        log.info("Scheduling lesson ID: {} for date: {}", lessonId, scheduledDate);
        
        Lesson lesson = lessonRepository.findById(lessonId)
            .orElseThrow(() -> new IllegalArgumentException("Lesson not found with ID: " + lessonId));
        
        lesson.setScheduledDate(scheduledDate);
        lesson.setStatus(Lesson.LessonStatus.SCHEDULED);
        
        Lesson savedLesson = lessonRepository.save(lesson);
        return lessonMapper.toDto(savedLesson);
    }

    @Override
    @Transactional
    @CacheEvict(value = LESSON_CACHE, allEntries = true)
    public LessonDTO startLesson(Long lessonId) {
        log.info("Starting lesson ID: {}", lessonId);
        
        Lesson lesson = lessonRepository.findById(lessonId)
            .orElseThrow(() -> new IllegalArgumentException("Lesson not found with ID: " + lessonId));
        
        lesson.setStatus(Lesson.LessonStatus.IN_PROGRESS);
        
        Lesson savedLesson = lessonRepository.save(lesson);
        return lessonMapper.toDto(savedLesson);
    }

    @Override
    @Transactional
    @CacheEvict(value = LESSON_CACHE, allEntries = true)
    public LessonDTO completeLesson(Long lessonId) {
        log.info("Completing lesson ID: {}", lessonId);
        
        Lesson lesson = lessonRepository.findById(lessonId)
            .orElseThrow(() -> new IllegalArgumentException("Lesson not found with ID: " + lessonId));
        
        lesson.setStatus(Lesson.LessonStatus.COMPLETED);
        lesson.setCompletedDate(LocalDateTime.now());
        
        Lesson savedLesson = lessonRepository.save(lesson);
        return lessonMapper.toDto(savedLesson);
    }

    @Override
    @Transactional
    @CacheEvict(value = LESSON_CACHE, allEntries = true)
    public LessonDTO cancelLesson(Long lessonId, String reason) {
        log.info("Cancelling lesson ID: {} with reason: {}", lessonId, reason);
        
        Lesson lesson = lessonRepository.findById(lessonId)
            .orElseThrow(() -> new IllegalArgumentException("Lesson not found with ID: " + lessonId));
        
        lesson.setStatus(Lesson.LessonStatus.CANCELLED);
        lesson.setNotes(lesson.getNotes() != null ? lesson.getNotes() + "\nCancelled: " + reason : "Cancelled: " + reason);
        
        Lesson savedLesson = lessonRepository.save(lesson);
        return lessonMapper.toDto(savedLesson);
    }

    @Override
    @Transactional
    @CacheEvict(value = LESSON_CACHE, allEntries = true)
    public LessonDTO postponeLesson(Long lessonId, LocalDateTime newScheduledDate) {
        log.info("Postponing lesson ID: {} to date: {}", lessonId, newScheduledDate);
        
        Lesson lesson = lessonRepository.findById(lessonId)
            .orElseThrow(() -> new IllegalArgumentException("Lesson not found with ID: " + lessonId));
        
        lesson.setScheduledDate(newScheduledDate);
        lesson.setStatus(Lesson.LessonStatus.POSTPONED);
        
        Lesson savedLesson = lessonRepository.save(lesson);
        return lessonMapper.toDto(savedLesson);
    }

    @Override
    @Transactional
    @CacheEvict(value = LESSON_CACHE, allEntries = true)
    public LessonDTO updateLessonOrder(Long lessonId, Integer newOrder) {
        log.info("Updating lesson order for lesson ID: {} to order: {}", lessonId, newOrder);
        
        Lesson lesson = lessonRepository.findById(lessonId)
            .orElseThrow(() -> new IllegalArgumentException("Lesson not found with ID: " + lessonId));
        
        lesson.setLessonOrder(newOrder);
        
        Lesson savedLesson = lessonRepository.save(lesson);
        return lessonMapper.toDto(savedLesson);
    }

    @Override
    @Transactional
    @CacheEvict(value = LESSON_CACHE, allEntries = true)
    public List<LessonDTO> reorderLessons(Long courseId, List<Long> lessonIds) {
        log.info("Reordering lessons for course ID: {}", courseId);
        
        List<LessonDTO> reorderedLessons = new ArrayList<>();
        for (int i = 0; i < lessonIds.size(); i++) {
            LessonDTO lesson = updateLessonOrder(lessonIds.get(i), i + 1);
            reorderedLessons.add(lesson);
        }
        
        return reorderedLessons;
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = LESSON_CACHE, key = "#courseId + '_analytics'")
    public Map<String, Object> getLessonAnalytics(Long courseId) {
        log.debug("Getting lesson analytics for course ID: {}", courseId);
        
        Map<String, Object> analytics = new HashMap<>();
        
        Long totalLessons = countByCourseId(courseId);
        Long plannedLessons = countByCourseIdAndStatus(courseId, Lesson.LessonStatus.PLANNED);
        Long scheduledLessons = countByCourseIdAndStatus(courseId, Lesson.LessonStatus.SCHEDULED);
        Long inProgressLessons = countByCourseIdAndStatus(courseId, Lesson.LessonStatus.IN_PROGRESS);
        Long completedLessons = countByCourseIdAndStatus(courseId, Lesson.LessonStatus.COMPLETED);
        Long cancelledLessons = countByCourseIdAndStatus(courseId, Lesson.LessonStatus.CANCELLED);
        
        analytics.put("totalLessons", totalLessons);
        analytics.put("plannedLessons", plannedLessons);
        analytics.put("scheduledLessons", scheduledLessons);
        analytics.put("inProgressLessons", inProgressLessons);
        analytics.put("completedLessons", completedLessons);
        analytics.put("cancelledLessons", cancelledLessons);
        analytics.put("completionRate", totalLessons > 0 ? (double) completedLessons / totalLessons * 100 : 0.0);
        
        return analytics;
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = LESSON_CACHE, key = "#instructorId + '_instructor_analytics_' + #startDate + '_' + #endDate")
    public Map<String, Object> getInstructorLessonAnalytics(Long instructorId, LocalDateTime startDate, LocalDateTime endDate) {
        log.debug("Getting instructor lesson analytics for instructor ID: {} between: {} and {}", instructorId, startDate, endDate);
        
        Map<String, Object> analytics = new HashMap<>();
        
        List<LessonDTO> lessons = findByInstructorIdAndScheduledDateBetween(instructorId, startDate, endDate);
        
        Long totalLessons = (long) lessons.size();
        Long completedLessons = lessons.stream()
            .filter(lesson -> lesson.status() == Lesson.LessonStatus.COMPLETED)
            .count();
        Long cancelledLessons = lessons.stream()
            .filter(lesson -> lesson.status() == Lesson.LessonStatus.CANCELLED)
            .count();
        
        analytics.put("totalLessons", totalLessons);
        analytics.put("completedLessons", completedLessons);
        analytics.put("cancelledLessons", cancelledLessons);
        analytics.put("completionRate", totalLessons > 0 ? (double) completedLessons / totalLessons * 100 : 0.0);
        analytics.put("cancellationRate", totalLessons > 0 ? (double) cancelledLessons / totalLessons * 100 : 0.0);
        
        return analytics;
    }

    @Override
    protected Lesson mapToEntity(LessonDTO dto) {
        Lesson lesson = lessonMapper.toEntity(dto);
        
        // Set course and instructor relationships
        if (dto.courseId() != null) {
            Course course = courseMapper.toEntity(courseService.getById(dto.courseId()));
            lesson.setCourse(course);
        }
        
        if (dto.instructorId() != null) {
            User instructor = userMapper.toEntity(userService.getById(dto.instructorId()));
            lesson.setInstructor(instructor);
        }
        
        return lesson;
    }

    @Override
    protected LessonDTO mapToDto(Lesson entity) {
        return lessonMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(Lesson entity, LessonDTO dto) {
        lessonMapper.updateEntity(entity, dto);
        
        // Update relationships if provided
        if (dto.courseId() != null) {
            Course course = courseMapper.toEntity(courseService.getById(dto.courseId()));
            entity.setCourse(course);
        }
        
        if (dto.instructorId() != null) {
            User instructor = userMapper.toEntity(userService.getById(dto.instructorId()));
            entity.setInstructor(instructor);
        }
    }

    @Override
    protected Long extractSchoolId(Lesson entity) {
        return entity.getCourse() != null && entity.getCourse().getClassEntity() != null && 
               entity.getCourse().getClassEntity().getSchool() != null ? 
               entity.getCourse().getClassEntity().getSchool().getId() : null;
    }

    @Override
    protected Long extractRegionId(Lesson entity) {
        return entity.getCourse() != null && entity.getCourse().getClassEntity() != null && 
               entity.getCourse().getClassEntity().getSchool() != null && 
               entity.getCourse().getClassEntity().getSchool().getRegion() != null ? 
               entity.getCourse().getClassEntity().getSchool().getRegion().getId() : null;
    }

    // Additional methods for controller
    @Override
    @Transactional(readOnly = true)
    public List<LessonDTO> getAllLessons() {
        log.debug("Getting all lessons");
        return lessonRepository.findAll().stream()
            .map(lessonMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public LessonDTO getLessonById(Long id) {
        log.debug("Getting lesson by ID: {}", id);
        return lessonRepository.findById(id)
            .map(lessonMapper::toDto)
            .orElse(null);
    }

    @Override
    @Transactional
    @CacheEvict(value = LESSON_CACHE, allEntries = true)
    public LessonDTO createLesson(CreateLessonRequest request) {
        log.debug("Creating lesson with request: {}", request);
        
        // Use repositories directly to get entities
        Course course = courseRepository.findById(request.courseId())
            .orElseThrow(() -> new IllegalArgumentException("Course not found with ID: " + request.courseId()));
        
        User instructor = userRepository.findById(request.instructorId())
            .orElseThrow(() -> new IllegalArgumentException("Instructor not found with ID: " + request.instructorId()));
        
        Lesson lesson = new Lesson();
        lesson.setTitle(request.title());
        lesson.setDescription(request.description());
        lesson.setCourse(course);
        lesson.setInstructor(instructor);
        lesson.setLessonOrder(request.lessonOrder());
        lesson.setDurationMinutes(request.durationMinutes());
        lesson.setEstimatedDurationMinutes(request.estimatedDurationMinutes());
        lesson.setScheduledDate(request.scheduledDate());
        lesson.setObjectives(request.objectives());
        lesson.setMaterials(request.materials());
        lesson.setActivities(request.activities());
        lesson.setAssessment(request.assessment());
        lesson.setNotes(request.notes());
        lesson.setMandatory(request.isMandatory() != null ? request.isMandatory() : false);
        lesson.setActive(true);
        lesson.setStatus(Lesson.LessonStatus.PLANNED);
        
        Lesson savedLesson = lessonRepository.save(lesson);
        return lessonMapper.toDto(savedLesson);
    }

    @Override
    @Transactional
    @CacheEvict(value = LESSON_CACHE, allEntries = true)
    public LessonDTO updateLesson(Long id, UpdateLessonRequest request) {
        log.debug("Updating lesson with ID: {} and request: {}", id, request);
        
        Lesson lesson = lessonRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Lesson not found with ID: " + id));
        
        if (request.title() != null) {
            lesson.setTitle(request.title());
        }
        if (request.description() != null) {
            lesson.setDescription(request.description());
        }
        if (request.lessonOrder() != null) {
            lesson.setLessonOrder(request.lessonOrder());
        }
        if (request.durationMinutes() != null) {
            lesson.setDurationMinutes(request.durationMinutes());
        }
        if (request.estimatedDurationMinutes() != null) {
            lesson.setEstimatedDurationMinutes(request.estimatedDurationMinutes());
        }
        if (request.scheduledDate() != null) {
            lesson.setScheduledDate(request.scheduledDate());
        }
        if (request.objectives() != null) {
            lesson.setObjectives(request.objectives());
        }
        if (request.materials() != null) {
            lesson.setMaterials(request.materials());
        }
        if (request.activities() != null) {
            lesson.setActivities(request.activities());
        }
        if (request.assessment() != null) {
            lesson.setAssessment(request.assessment());
        }
        if (request.notes() != null) {
            lesson.setNotes(request.notes());
        }
        if (request.isMandatory() != null) {
            lesson.setMandatory(request.isMandatory());
        }
        if (request.active() != null) {
            lesson.setActive(request.active());
        }
        
        Lesson updatedLesson = lessonRepository.save(lesson);
        return lessonMapper.toDto(updatedLesson);
    }

    @Override
    @Transactional
    @CacheEvict(value = LESSON_CACHE, allEntries = true)
    public void deleteLesson(Long id) {
        log.debug("Deleting lesson with ID: {}", id);
        lessonRepository.deleteById(id);
    }

    // Additional methods for controller with string parameters
    @Override
    @Transactional(readOnly = true)
    public List<LessonDTO> getLessonsByCourseId(Long courseId) {
        return findByCourseId(courseId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LessonDTO> getLessonsByCourseIdAndActive(Long courseId, Boolean active) {
        return findByCourseIdAndActive(courseId, active);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LessonDTO> getLessonsByInstructorId(Long instructorId) {
        return findByInstructorId(instructorId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LessonDTO> getLessonsByStatus(String status) {
        try {
            Lesson.LessonStatus lessonStatus = Lesson.LessonStatus.valueOf(status.toUpperCase());
            return findByStatus(lessonStatus);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid lesson status: " + status);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<LessonDTO> getLessonsByCourseIdAndStatus(Long courseId, String status) {
        try {
            Lesson.LessonStatus lessonStatus = Lesson.LessonStatus.valueOf(status.toUpperCase());
            return findByCourseIdAndStatus(courseId, lessonStatus);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid lesson status: " + status);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public LessonDTO getLessonByCourseIdAndLessonOrder(Long courseId, Integer lessonOrder) {
        return findByCourseIdAndLessonOrder(courseId, lessonOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public Long countLessonsByCourseId(Long courseId) {
        return countByCourseId(courseId);
    }

    @Override
    @Transactional(readOnly = true)
    public Long countLessonsByCourseIdAndStatus(Long courseId, String status) {
        try {
            Lesson.LessonStatus lessonStatus = Lesson.LessonStatus.valueOf(status.toUpperCase());
            return countByCourseIdAndStatus(courseId, lessonStatus);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid lesson status: " + status);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<LessonDTO> getLessonsByCourseIdAndScheduledDateBetween(Long courseId, String startDate, String endDate) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
            LocalDateTime start = LocalDateTime.parse(startDate, formatter);
            LocalDateTime end = LocalDateTime.parse(endDate, formatter);
            return findByCourseIdAndScheduledDateBetween(courseId, start, end);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid date format. Use ISO format (yyyy-MM-ddTHH:mm:ss)");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<LessonDTO> getLessonsByInstructorIdAndScheduledDateBetween(Long instructorId, String startDate, String endDate) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
            LocalDateTime start = LocalDateTime.parse(startDate, formatter);
            LocalDateTime end = LocalDateTime.parse(endDate, formatter);
            return findByInstructorIdAndScheduledDateBetween(instructorId, start, end);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid date format. Use ISO format (yyyy-MM-ddTHH:mm:ss)");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<LessonDTO> getMandatoryLessonsByCourseId(Long courseId) {
        return findMandatoryLessonsByCourseId(courseId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LessonDTO> getCompletedLessonsByCourseId(Long courseId) {
        return findCompletedLessonsByCourseId(courseId);
    }

    @Override
    @Transactional
    @CacheEvict(value = LESSON_CACHE, allEntries = true)
    public LessonDTO scheduleLesson(Long lessonId, String scheduledDate) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
            LocalDateTime date = LocalDateTime.parse(scheduledDate, formatter);
            return scheduleLesson(lessonId, date);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid date format. Use ISO format (yyyy-MM-ddTHH:mm:ss)");
        }
    }

    @Override
    @Transactional
    @CacheEvict(value = LESSON_CACHE, allEntries = true)
    public LessonDTO postponeLesson(Long lessonId, String newScheduledDate) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
            LocalDateTime date = LocalDateTime.parse(newScheduledDate, formatter);
            return postponeLesson(lessonId, date);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid date format. Use ISO format (yyyy-MM-ddTHH:mm:ss)");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getInstructorLessonAnalytics(Long instructorId, String startDate, String endDate) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
            LocalDateTime start = LocalDateTime.parse(startDate, formatter);
            LocalDateTime end = LocalDateTime.parse(endDate, formatter);
            return getInstructorLessonAnalytics(instructorId, start, end);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid date format. Use ISO format (yyyy-MM-ddTHH:mm:ss)");
        }
    }
} 