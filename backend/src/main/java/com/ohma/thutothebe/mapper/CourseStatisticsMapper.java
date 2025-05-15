package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.CourseStatisticsDTO;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.CourseStatistics;
import com.ohma.thutothebe.repository.CourseRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class CourseStatisticsMapper implements BaseDtoMapper<CourseStatistics, CourseStatisticsDTO> {

    private final CourseRepository courseRepository;

    public CourseStatisticsMapper(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Override
    public CourseStatisticsDTO toDto(CourseStatistics entity) {
        if (entity == null) {
            return null;
        }

        return new CourseStatisticsDTO(
                entity.getId(),
                entity.getCourse() != null ? entity.getCourse().getId() : null,
                entity.getCurrentEnrollment(),
                entity.getTotalEnrollment(),
                entity.getAverageGrade(),
                entity.getCompletionRate(),
                entity.getDropoutRate(),
                entity.getLastUpdated()
        );
    }

    @Override
    public CourseStatistics toEntity(CourseStatisticsDTO dto) {
        if (dto == null) {
            return null;
        }

        CourseStatistics entity = new CourseStatistics();
        entity.setId(dto.id());

        // Fetch course from repository
        Optional<Course> courseOptional = courseRepository.findById(dto.courseId());
        if (courseOptional.isEmpty()) {
            throw new IllegalArgumentException("Course with ID " + dto.courseId() + " not found");
        }

        entity.setCourse(courseOptional.get());
        entity.setCurrentEnrollment(dto.currentEnrollment());
        entity.setTotalEnrollment(dto.totalEnrollment());
        entity.setAverageGrade(dto.averageGrade());
        entity.setCompletionRate(dto.completionRate());
        entity.setDropoutRate(dto.dropoutRate());
        entity.setLastUpdated(dto.lastUpdated());

        return entity;
    }
}