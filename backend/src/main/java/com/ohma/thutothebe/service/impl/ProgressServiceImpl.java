package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.ProgressDTO;
import com.ohma.thutothebe.entity.Progress;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.exception.ProgressNotFoundException;
import com.ohma.thutothebe.mapper.ProgressMapper;
import com.ohma.thutothebe.mapper.CourseMapper;
import com.ohma.thutothebe.mapper.UserMapper;
import com.ohma.thutothebe.repository.ProgressRepository;
import com.ohma.thutothebe.service.ProgressService;
import com.ohma.thutothebe.service.CourseService;
import com.ohma.thutothebe.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProgressServiceImpl extends BaseServiceImpl<Progress, ProgressDTO, Long> implements ProgressService {

    private final ProgressRepository progressRepository;
    private final ProgressMapper progressMapper;
    private final CourseService courseService;
    private final UserService userService;
    private final CourseMapper courseMapper;
    private final UserMapper userMapper;

    @Autowired
    public ProgressServiceImpl(ProgressRepository progressRepository, ProgressMapper progressMapper,
                             CourseService courseService, UserService userService,
                             CourseMapper courseMapper, UserMapper userMapper) {
        super(progressRepository);
        this.progressRepository = progressRepository;
        this.progressMapper = progressMapper;
        this.courseService = courseService;
        this.userService = userService;
        this.courseMapper = courseMapper;
        this.userMapper = userMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProgressDTO> getByStudent(Long studentId) {
        User student = userMapper.toEntity(userService.getById(studentId));
        return progressRepository.findByStudent(student).stream()
            .map(progressMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProgressDTO> getByCourse(Long courseId) {
        Course course = courseMapper.toEntity(courseService.getById(courseId));
        return progressRepository.findByCourse(course).stream()
            .map(progressMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProgressDTO getByStudentAndCourse(Long studentId, Long courseId) {
        User student = userMapper.toEntity(userService.getById(studentId));
        Course course = courseMapper.toEntity(courseService.getById(courseId));
        return progressRepository.findByStudentAndCourse(student, course)
            .map(progressMapper::toDto)
            .orElseThrow(() -> ProgressNotFoundException.withStudentAndCourse(studentId, courseId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProgressDTO> getActiveByStudent(Long studentId) {
        User student = userMapper.toEntity(userService.getById(studentId));
        return progressRepository.findByStudentAndActive(student, true).stream()
            .map(progressMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProgressDTO> getActiveByCourse(Long courseId) {
        Course course = courseMapper.toEntity(courseService.getById(courseId));
        return progressRepository.findByCourseAndActive(course, true).stream()
            .map(progressMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProgressDTO> getCompletedByStudent(Long studentId) {
        User student = userMapper.toEntity(userService.getById(studentId));
        return progressRepository.findCompletedByStudent(student).stream()
            .map(progressMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProgressDTO> getCompletedByCourse(Long courseId) {
        Course course = courseMapper.toEntity(courseService.getById(courseId));
        return progressRepository.findCompletedByCourse(course).stream()
            .map(progressMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Double getAverageGradeByCourse(Long courseId) {
        Course course = courseMapper.toEntity(courseService.getById(courseId));
        return progressRepository.findAverageGradeByCourse(course);
    }

    @Override
    @Transactional(readOnly = true)
    public Double getAverageCompletionByCourse(Long courseId) {
        Course course = courseMapper.toEntity(courseService.getById(courseId));
        return progressRepository.findAverageCompletionByCourse(course);
    }

    @Override
    @Transactional
    public ProgressDTO updateProgress(Long studentId, Long courseId, Double completionPercentage, Double grade) {
        User student = userMapper.toEntity(userService.getById(studentId));
        Course course = courseMapper.toEntity(courseService.getById(courseId));
        
        Progress progress = progressRepository.findByStudentAndCourse(student, course)
            .orElseGet(() -> {
                Progress newProgress = new Progress();
                newProgress.setStudent(student);
                newProgress.setCourse(course);
                newProgress.setCompletionPercentage(0.0);
                newProgress.setGrade(0.0);
                newProgress.setCompleted(false);
                newProgress.setActive(true);
                return newProgress;
            });
        
        progress.setCompletionPercentage(completionPercentage);
        progress.setGrade(grade);
        progress.setLastActivityAt(LocalDateTime.now());
        
        return progressMapper.toDto(progressRepository.save(progress));
    }

    @Override
    protected Progress mapToEntity(ProgressDTO dto) {
        return progressMapper.toEntity(dto);
    }

    @Override
    protected ProgressDTO mapToDto(Progress entity) {
        return progressMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(Progress entity, ProgressDTO dto) {
        progressMapper.updateEntityFromDto(dto, entity);
    }

    @Override
    protected RuntimeException notFoundException(Long id) {
        return ProgressNotFoundException.withId(id);
    }
} 