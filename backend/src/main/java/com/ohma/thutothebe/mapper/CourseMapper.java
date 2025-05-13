package com.ohma.thutothebe.mapper;

import com.ohma.thutothebe.dto.CourseDTO;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.User;
import org.apache.catalina.mapper.Mapper;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class CourseMapper implements BaseDtoMapper<Course, CourseDTO> {

    @Override
    public CourseDTO toDto(Course course) {
        if (course == null) {
            return null;
        }

        return new CourseDTO(
            course.getId(),
            course.getCode(),
            course.getName(),
            course.getDescription(),
            course.getTeacher() != null ? course.getTeacher().getId() : null,
            course.getStudents() != null ? 
                course.getStudents().stream()
                    .map(student -> student.getId())
                    .collect(Collectors.toSet()) : 
                null,
            course.isActive(),
            course.getVersion()
        );
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
        course.setDescription(dto.description());
        course.setActive(dto.active());
        course.setVersion(dto.version());
        return course;
    }

    public void updateEntityFromDto(CourseDTO dto, Course course) {
        if (dto == null || course == null) {
            return;
        }

        course.setName(dto.name());
        course.setDescription(dto.description());
        course.setActive(dto.active());
        course.setCode(dto.code());
        course.setVersion(dto.version());

        if (dto.teacherId() != null) {
            User instructor = new User();
            instructor.setId(dto.teacherId());
            course.setTeacher(instructor);
        }

        if (dto.studentIds() != null) {
            Set<User> students = dto.studentIds().stream()
                    .map(id -> {
                        User student = new User();
                        student.setId(id);
                        return student;
                    })
                    .collect(Collectors.toSet());
            course.setStudents(students);
        }
    }
} 