package com.ohma.thutothebe.mapper.impl;

import com.ohma.thutothebe.dto.CourseDTO;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.Subject;
import com.ohma.thutothebe.entity.Class;
import com.ohma.thutothebe.mapper.CourseMapper;
import com.ohma.thutothebe.repository.CourseInstructorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.stream.Collectors;

@Component
public class CourseMapperImpl implements CourseMapper {

    private final CourseInstructorRepository courseInstructorRepository;

    @Autowired
    public CourseMapperImpl(CourseInstructorRepository courseInstructorRepository) {
        this.courseInstructorRepository = courseInstructorRepository;
    }

    @Override
    public Course toEntity(CourseDTO dto) {
        if (dto == null) {
            return null;
        }
        
        Course course = new Course();
        course.setId(dto.id());
        course.setCode(dto.code());
        course.setName(dto.name());
        course.setYear(dto.year());
        course.setTerm(dto.term());
        course.setActive(dto.active());
        
        if (dto.subjectId() != null) {
            Subject subject = new Subject();
            subject.setId(dto.subjectId());
            course.setSubject(subject);
        }
        
        if (dto.classId() != null) {
            Class classEntity = new Class();
            classEntity.setId(dto.classId());
            course.setClassEntity(classEntity);
        }
        
        return course;
    }

    @Override
    public CourseDTO toDto(Course entity) {
        if (entity == null) {
            return null;
        }
        
        // Get instructor IDs for this course
        var instructorIds = courseInstructorRepository.findByCourseId(entity.getId())
            .stream()
            .map(ci -> ci.getTeacher().getId())
            .collect(Collectors.toSet());
        
        return new CourseDTO(
            entity.getId(),
            entity.getCode(),
            entity.getName(),
            entity.getSubject() != null ? entity.getSubject().getId() : null,
            entity.getClassEntity() != null ? entity.getClassEntity().getId() : null,
            entity.getTerm(),
            entity.getYear(),
            entity.isActive(),
            instructorIds
        );
    }
    
    @Override
    public void updateEntityFromDto(CourseDTO dto, Course course) {
        if (dto == null || course == null) {
            return;
        }
        
        course.setCode(dto.code());
        course.setName(dto.name());
        course.setTerm(dto.term());
        course.setYear(dto.year());
        course.setActive(dto.active());
        
        if (dto.subjectId() != null) {
            Subject subject = new Subject();
            subject.setId(dto.subjectId());
            course.setSubject(subject);
        }
        
        if (dto.classId() != null) {
            Class classEntity = new Class();
            classEntity.setId(dto.classId());
            course.setClassEntity(classEntity);
        }
    }
} 