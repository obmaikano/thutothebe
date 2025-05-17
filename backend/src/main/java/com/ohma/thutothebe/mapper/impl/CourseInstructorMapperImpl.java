package com.ohma.thutothebe.mapper.impl;

import com.ohma.thutothebe.dto.CourseInstructorDTO;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.CourseInstructor;
import com.ohma.thutothebe.entity.Teacher;
import com.ohma.thutothebe.mapper.CourseInstructorMapper;
import org.springframework.stereotype.Component;

@Component
public class CourseInstructorMapperImpl implements CourseInstructorMapper {

    @Override
    public CourseInstructor toEntity(CourseInstructorDTO dto) {
        if (dto == null) {
            return null;
        }
        
        CourseInstructor courseInstructor = new CourseInstructor();
        courseInstructor.setId(dto.id());
        courseInstructor.setPrimary(dto.isPrimary());
        courseInstructor.setNotes(dto.notes());
        
        if (dto.courseId() != null) {
            Course course = new Course();
            course.setId(dto.courseId());
            courseInstructor.setCourse(course);
        }
        
        if (dto.teacherId() != null) {
            Teacher teacher = new Teacher();
            teacher.setId(dto.teacherId());
            courseInstructor.setTeacher(teacher);
        }
        
        return courseInstructor;
    }

    @Override
    public CourseInstructorDTO toDto(CourseInstructor entity) {
        if (entity == null) {
            return null;
        }
        
        return new CourseInstructorDTO(
            entity.getId(),
            entity.getCourse() != null ? entity.getCourse().getId() : null,
            entity.getTeacher() != null ? entity.getTeacher().getId() : null,
            entity.isPrimary(),
            entity.getNotes()
        );
    }
} 