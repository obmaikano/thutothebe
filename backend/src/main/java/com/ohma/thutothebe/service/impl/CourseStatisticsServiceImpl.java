package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.CourseStatisticsDTO;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.CourseStatistics;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.CourseStatisticsMapper;
import com.ohma.thutothebe.repository.CourseRepository;
import com.ohma.thutothebe.repository.CourseStatisticsRepository;
import com.ohma.thutothebe.service.CourseStatisticsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class CourseStatisticsServiceImpl extends BaseServiceImpl<CourseStatistics, CourseStatisticsDTO, Long> implements CourseStatisticsService {

    private final CourseStatisticsRepository courseStatisticsRepository;
    private final CourseRepository courseRepository;
    private final CourseStatisticsMapper courseStatisticsMapper;

    @Autowired
    public CourseStatisticsServiceImpl(
            CourseStatisticsRepository courseStatisticsRepository,
            CourseRepository courseRepository,
            CourseStatisticsMapper courseStatisticsMapper) {
        super(courseStatisticsRepository);
        this.courseStatisticsRepository = courseStatisticsRepository;
        this.courseRepository = courseRepository;
        this.courseStatisticsMapper = courseStatisticsMapper;
    }

    @Override
    protected CourseStatisticsDTO mapToDto(CourseStatistics entity) {
        return courseStatisticsMapper.toDto(entity);
    }

    @Override
    protected CourseStatistics mapToEntity(CourseStatisticsDTO dto) {
        return courseStatisticsMapper.toEntity(dto);
    }

    @Override
    protected void updateEntity(CourseStatistics entity, CourseStatisticsDTO dto) {
        entity.setCurrentEnrollment(dto.currentEnrollment());
        entity.setTotalEnrollment(dto.totalEnrollment());
        entity.setAverageGrade(dto.averageGrade());
        entity.setCompletionRate(dto.completionRate());
        entity.setDropoutRate(dto.dropoutRate());
        entity.setLastUpdated(dto.lastUpdated());
    }

    @Override
    public CourseStatisticsDTO getCurrentStatistics(Long courseId) {
        CourseStatistics statistics = courseStatisticsRepository.findByCourseId(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course statistics not found for course ID: " + courseId));
        return courseStatisticsMapper.toDto(statistics);
    }

    @Override
    public List<CourseStatisticsDTO> getHistoricalStatistics(Long courseId) {
        List<CourseStatistics> statistics = courseStatisticsRepository.findHistoricalByCourseId(courseId);
        return statistics.stream()
                .map(courseStatisticsMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<CourseStatisticsDTO> getStatisticsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        List<CourseStatistics> statistics = courseStatisticsRepository.findByDateRange(startDate, endDate);
        return statistics.stream()
                .map(courseStatisticsMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updateStatistics(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with ID: " + courseId));

        CourseStatistics statistics = courseStatisticsRepository.findByCourseId(courseId)
                .orElse(new CourseStatistics());

        // Calculate statistics
        statistics.setCourse(course);
        statistics.setCurrentEnrollment(calculateCurrentEnrollment(course));
        statistics.setTotalEnrollment(calculateTotalEnrollment(course));
        statistics.setAverageGrade(calculateAverageGrade(course));
        statistics.setCompletionRate(calculateCompletionRate(course));
        statistics.setDropoutRate(calculateDropoutRate(course));
        statistics.setLastUpdated(LocalDateTime.now());

        courseStatisticsRepository.save(statistics);
        log.info("Updated statistics for course: {}", courseId);
    }

    @Override
    @Transactional
    public void updateAllCourseStatistics() {
        List<Course> courses = courseRepository.findAll();
        for (Course course : courses) {
            try {
                updateStatistics(course.getId());
            } catch (Exception e) {
                log.error("Error updating statistics for course {}: {}", course.getId(), e.getMessage());
            }
        }
    }

    private Integer calculateCurrentEnrollment(Course course) {
        // Implementation to calculate current enrollment
        return 0; // Placeholder
    }

    private Integer calculateTotalEnrollment(Course course) {
        // Implementation to calculate total enrollment
        return 0; // Placeholder
    }

    private Double calculateAverageGrade(Course course) {
        // Implementation to calculate average grade
        return 0.0; // Placeholder
    }

    private Double calculateCompletionRate(Course course) {
        // Implementation to calculate completion rate
        return 0.0; // Placeholder
    }

    private Double calculateDropoutRate(Course course) {
        // Implementation to calculate dropout rate
        return 0.0; // Placeholder
    }
} 