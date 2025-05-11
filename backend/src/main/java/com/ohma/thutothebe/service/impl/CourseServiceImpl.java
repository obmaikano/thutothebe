package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.CourseDTO;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.exception.CourseNotFoundException;
import com.ohma.thutothebe.exception.UserNotFoundException;
import com.ohma.thutothebe.mapper.CourseMapper;
import com.ohma.thutothebe.repository.CourseRepository;
import com.ohma.thutothebe.repository.UserRepository;
import com.ohma.thutothebe.service.CourseService;
import com.ohma.thutothebe.util.LoggingUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
public class CourseServiceImpl extends BaseServiceImpl<Course, CourseDTO, Long> implements CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final CourseMapper courseMapper;

    @Autowired
    public CourseServiceImpl(CourseRepository courseRepository, UserRepository userRepository, CourseMapper courseMapper) {
        super(courseRepository);
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.courseMapper = courseMapper;
    }

    @Override
    protected Course mapToEntity(CourseDTO dto) {
        Course course = courseMapper.toEntity(dto);
        if (dto.teacherId() != null) {
            User teacher = userRepository.findById(dto.teacherId())
                .orElseThrow(() -> UserNotFoundException.withId(dto.teacherId()));
            course.setTeacher(teacher);
        }
        if (dto.studentIds() != null) {
            course.setStudents(dto.studentIds().stream()
                .map(id -> userRepository.findById(id)
                    .orElseThrow(() -> UserNotFoundException.withId(id)))
                .collect(Collectors.toSet()));
        }
        return course;
    }

    @Override
    protected CourseDTO mapToDto(Course entity) {
        return courseMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(Course entity, CourseDTO dto) {
        courseMapper.updateEntityFromDto(dto, entity);
        if (dto.teacherId() != null) {
            User teacher = userRepository.findById(dto.teacherId())
                .orElseThrow(() -> UserNotFoundException.withId(dto.teacherId()));
            entity.setTeacher(teacher);
        }
        if (dto.studentIds() != null) {
            entity.setStudents(dto.studentIds().stream()
                .map(id -> userRepository.findById(id)
                    .orElseThrow(() -> UserNotFoundException.withId(id)))
                .collect(Collectors.toSet()));
        }
    }

    @Override
    @Transactional(readOnly = true)
    public CourseDTO getCourseByCode(String code) {
        return courseRepository.findByCode(code)
            .map(courseMapper::toDto)
            .orElseThrow(() -> CourseNotFoundException.withCode(code));
    }

    @Override
    @Transactional(readOnly = true)
    public Set<CourseDTO> getCoursesByTeacher(User teacher) {
        return courseRepository.findByTeacher(teacher).stream()
            .map(courseMapper::toDto)
            .collect(Collectors.toSet());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> findByEnrolledStudentId(Long studentId) {
        return courseRepository.findByEnrolledStudentId(studentId).stream()
            .map(courseMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Set<CourseDTO> getActiveCourses() {
        return courseRepository.findByActiveTrue().stream()
            .map(courseMapper::toDto)
            .collect(Collectors.toSet());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> findByInstructorId(Long instructorId) {
        return courseRepository.findByInstructorId(instructorId).stream()
            .map(courseMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CourseDTO enrollStudent(Long courseId, Long studentId) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new IllegalArgumentException("Course not found with id: " + courseId));
        
        User student = userRepository.findById(studentId)
            .orElseThrow(() -> new IllegalArgumentException("Student not found with id: " + studentId));

        course.getStudents().add(student);
        Course savedCourse = courseRepository.save(course);
        return courseMapper.toDto(savedCourse);
    }

    @Override
    @Transactional
    public CourseDTO unenrollStudent(Long courseId, Long studentId) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new IllegalArgumentException("Course not found with id: " + courseId));
        
        User student = userRepository.findById(studentId)
            .orElseThrow(() -> new IllegalArgumentException("Student not found with id: " + studentId));

        course.getStudents().remove(student);
        Course savedCourse = courseRepository.save(course);
        return courseMapper.toDto(savedCourse);
    }

    @Override
    public boolean existsByCode(String code) {
        return courseRepository.existsByCode(code);
    }

    @Override
    protected RuntimeException notFoundException(Long id) {
        return CourseNotFoundException.withId(id);
    }
} 