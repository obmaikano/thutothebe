package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.GradeCategoryDTO;
import com.ohma.thutothebe.entity.GradeCategory;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.exception.CourseNotFoundException;
import com.ohma.thutothebe.exception.GradeCategoryNotFoundException;
import com.ohma.thutothebe.mapper.GradeCategoryMapper;
import com.ohma.thutothebe.mapper.CourseMapper;
import com.ohma.thutothebe.repository.CourseRepository;
import com.ohma.thutothebe.repository.GradeCategoryRepository;
import com.ohma.thutothebe.service.GradeCategoryService;
import com.ohma.thutothebe.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GradeCategoryServiceImpl extends BaseServiceImpl<GradeCategory, GradeCategoryDTO, Long> implements GradeCategoryService {

    private final GradeCategoryRepository gradeCategoryRepository;
    private final GradeCategoryMapper gradeCategoryMapper;
    private final CourseRepository courseRepository;

    @Autowired
    public GradeCategoryServiceImpl(GradeCategoryRepository gradeCategoryRepository,
                                  GradeCategoryMapper gradeCategoryMapper,
                                    CourseRepository courseRepository) {
        super(gradeCategoryRepository);
        this.gradeCategoryRepository = gradeCategoryRepository;
        this.gradeCategoryMapper = gradeCategoryMapper;
        this.courseRepository = courseRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<GradeCategoryDTO> getByCourse(Long courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new CourseNotFoundException("Course not found with id: " + courseId));
        return gradeCategoryRepository.findByCourse(course).stream()
            .map(gradeCategoryMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<GradeCategoryDTO> getActiveByCourse(Long courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new CourseNotFoundException("Course not found with id: " + courseId));
        return gradeCategoryRepository.findByCourseAndActive(course, true).stream()
            .map(gradeCategoryMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Double getTotalWeightByCourse(Long courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new CourseNotFoundException("Course not found with id: " + courseId));
        return gradeCategoryRepository.findTotalWeightByCourse(course);
    }

    @Override
    @Transactional(readOnly = true)
    public Double getAveragePassingGradeByCourse(Long courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new CourseNotFoundException("Course not found with id: " + courseId));
        return gradeCategoryRepository.findAveragePassingGradeByCourse(course);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!gradeCategoryRepository.existsById(id)) {
            throw GradeCategoryNotFoundException.withId(id);
        }
        gradeCategoryRepository.deleteById(id);
    }

    @Override
    protected GradeCategory mapToEntity(GradeCategoryDTO dto) {
        return gradeCategoryMapper.toEntity(dto);
    }

    @Override
    protected GradeCategoryDTO mapToDto(GradeCategory entity) {
        return gradeCategoryMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(GradeCategory entity, GradeCategoryDTO dto) {
        gradeCategoryMapper.updateEntityFromDto(dto, entity);
    }

    @Override
    protected RuntimeException notFoundException(Long id) {
        return GradeCategoryNotFoundException.withId(id);
    }
} 