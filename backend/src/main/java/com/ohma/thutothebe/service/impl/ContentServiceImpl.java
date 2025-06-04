package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.ContentDTO;
import com.ohma.thutothebe.entity.Content;
import com.ohma.thutothebe.entity.ContentType;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.exception.ContentNotFoundException;
import com.ohma.thutothebe.mapper.ContentMapper;
import com.ohma.thutothebe.mapper.CourseMapper;
import com.ohma.thutothebe.repository.ContentRepository;
import com.ohma.thutothebe.service.ContentService;
import com.ohma.thutothebe.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContentServiceImpl extends BaseServiceImpl<Content, ContentDTO, Long> implements ContentService {

    private final ContentRepository contentRepository;
    private final ContentMapper contentMapper;
    private final CourseService courseService;
    private final CourseMapper courseMapper;

    @Autowired
    public ContentServiceImpl(ContentRepository contentRepository, ContentMapper contentMapper,
                            CourseService courseService, CourseMapper courseMapper) {
        super(contentRepository);
        this.contentRepository = contentRepository;
        this.contentMapper = contentMapper;
        this.courseService = courseService;
        this.courseMapper = courseMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContentDTO> getByCourse(Long courseId) {
        Course course = courseMapper.toEntity(courseService.getById(courseId));
        return contentRepository.findByCourse(course).stream()
            .map(contentMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContentDTO> getByType(Long courseId, ContentType type) {
        Course course = courseMapper.toEntity(courseService.getById(courseId));
        return contentRepository.findByCourseAndType(course, type).stream()
            .map(contentMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContentDTO> getActiveByCourse(Long courseId) {
        Course course = courseMapper.toEntity(courseService.getById(courseId));
        return contentRepository.findByCourseAndActive(course, true).stream()
            .map(contentMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContentDTO> getActiveByType(Long courseId, ContentType type) {
        Course course = courseMapper.toEntity(courseService.getById(courseId));
        return contentRepository.findActiveByCourseAndType(course, type).stream()
            .map(contentMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByTitleAndCourse(String title, Long courseId) {
        Course course = courseMapper.toEntity(courseService.getById(courseId));
        return contentRepository.existsByTitleAndCourse(title, course);
    }

    @Override
    protected Content mapToEntity(ContentDTO dto) {
        return contentMapper.toEntity(dto);
    }

    @Override
    protected ContentDTO mapToDto(Content entity) {
        return contentMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(Content entity, ContentDTO dto) {
        contentMapper.updateEntityFromDto(dto, entity);
    }

    @Override
    protected RuntimeException notFoundException(Long id) {
        return ContentNotFoundException.withId(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContentDTO> getContentByTeacher(Long teacherId) {
        return contentRepository.findByTeacherId(teacherId).stream()
            .map(contentMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContentDTO> getActiveContentByTeacher(Long teacherId) {
        return contentRepository.findByTeacherIdAndActive(teacherId, true).stream()
            .map(contentMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContentDTO> getContentByTeacherAndType(Long teacherId, ContentType type) {
        return contentRepository.findByTeacherIdAndType(teacherId, type).stream()
            .map(contentMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContentDTO> getContentByCreator(Long userId) {
        return contentRepository.findByCreatedById(userId).stream()
            .map(contentMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContentDTO> getActiveContentByCreator(Long userId) {
        return contentRepository.findByCreatedByIdAndActive(userId, true).stream()
            .map(contentMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    protected Long extractSchoolId(Content entity) {
        return entity.getCourse() != null && entity.getCourse().getClassEntity() != null && entity.getCourse().getClassEntity().getSchool() != null 
            ? entity.getCourse().getClassEntity().getSchool().getId() : null;
    }
    
    @Override
    protected Long extractRegionId(Content entity) {
        return entity.getCourse() != null && entity.getCourse().getClassEntity() != null && entity.getCourse().getClassEntity().getSchool() != null && entity.getCourse().getClassEntity().getSchool().getRegion() != null 
            ? entity.getCourse().getClassEntity().getSchool().getRegion().getId() : null;
    }
} 