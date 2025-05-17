package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.CourseDTO;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.entity.Teacher;
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
import java.util.Collections;
import java.util.stream.Collectors;
import com.ohma.thutothebe.entity.Subject;
import com.ohma.thutothebe.entity.Term;
import com.ohma.thutothebe.repository.ClassRepository;
import com.ohma.thutothebe.repository.SubjectRepository;
import com.ohma.thutothebe.repository.CourseInstructorRepository;
import com.ohma.thutothebe.entity.CourseInstructor;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.repository.TeacherRepository;
import com.ohma.thutothebe.entity.CourseType;

@Slf4j
@Service
public class CourseServiceImpl extends BaseServiceImpl<Course, CourseDTO, Long> implements CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final CourseMapper courseMapper;
    private final SubjectRepository subjectRepository;
    private final ClassRepository classRepository;
    private final CourseInstructorRepository courseInstructorRepository;
    private final TeacherRepository teacherRepository;

    @Autowired
    public CourseServiceImpl(CourseRepository courseRepository, UserRepository userRepository, CourseMapper courseMapper,
                           SubjectRepository subjectRepository, ClassRepository classRepository,
                           CourseInstructorRepository courseInstructorRepository, TeacherRepository teacherRepository) {
        super(courseRepository);
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.courseMapper = courseMapper;
        this.subjectRepository = subjectRepository;
        this.classRepository = classRepository;
        this.courseInstructorRepository = courseInstructorRepository;
        this.teacherRepository = teacherRepository;
    }

    @Override
    protected Course mapToEntity(CourseDTO dto) {
        return courseMapper.toEntity(dto);
    }

    @Override
    protected CourseDTO mapToDto(Course entity) {
        return courseMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(Course entity, CourseDTO dto) {
        courseMapper.updateEntityFromDto(dto, entity);
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
        List<Course> courses = courseRepository.findByTeacherId(teacher.getId());
        return courses.stream()
            .map(courseMapper::toDto)
            .collect(Collectors.toSet());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> findByEnrolledStudentId(Long studentId) {
        // Since there's no direct repository method, we need to implement a workaround
        // For now, we'll return an empty list
        return Collections.emptyList();
    }

    @Override
    @Transactional(readOnly = true)
    public Set<CourseDTO> getActiveCourses() {
        return courseRepository.findByActive(true).stream()
            .map(courseMapper::toDto)
            .collect(Collectors.toSet());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> findByInstructorId(Long instructorId) {
        List<Course> courses = courseRepository.findByTeacherId(instructorId);
        return courses.stream()
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

        // This method should be implemented when the Course entity has a students collection
        // For now, return the course DTO
        return courseMapper.toDto(course);
    }

    @Override
    @Transactional
    public CourseDTO unenrollStudent(Long courseId, Long studentId) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new IllegalArgumentException("Course not found with id: " + courseId));
        
        User student = userRepository.findById(studentId)
            .orElseThrow(() -> new IllegalArgumentException("Student not found with id: " + studentId));

        // This method should be implemented when the Course entity has a students collection
        // For now, return the course DTO
        return courseMapper.toDto(course);
    }

    @Override
    public boolean existsByCode(String code) {
        return courseRepository.existsByCode(code);
    }

    @Override
    protected RuntimeException notFoundException(Long id) {
        return CourseNotFoundException.withId(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getCoursesBySubjectId(Long subjectId) {
        Subject subject = subjectRepository.findById(subjectId)
            .orElseThrow(() -> new ResourceNotFoundException("Subject", "id", subjectId));
        return courseRepository.findBySubject(subject).stream()
            .map(courseMapper::toDto)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getActiveCoursesbySubjectId(Long subjectId) {
        return courseRepository.findBySubjectIdAndActive(subjectId, true).stream()
            .map(courseMapper::toDto)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getCoursesByClassId(Long classId) {
        return courseRepository.findByClassEntityId(classId).stream()
            .map(courseMapper::toDto)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getActiveCoursesByClassId(Long classId) {
        return courseRepository.findByClassEntityIdAndActive(classId, true).stream()
            .map(courseMapper::toDto)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getCoursesByTeacherId(Long teacherId) {
        return courseRepository.findByTeacherId(teacherId).stream()
            .map(courseMapper::toDto)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getActiveCoursesByTeacherId(Long teacherId) {
        return courseRepository.findByTeacherId(teacherId).stream()
            .filter(Course::isActive)
            .map(courseMapper::toDto)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getCoursesByTerm(Term term) {
        return courseRepository.findByTerm(term).stream()
            .map(courseMapper::toDto)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getCoursesByYear(Integer year) {
        log.debug("Getting courses for year: {}", year);
        return courseRepository.findByYear(year).stream()
                .map(courseMapper::toDto)
                .toList();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getCoursesByType(CourseType type) {
        log.debug("Getting courses for type: {}", type);
        return courseRepository.findByType(type).stream()
                .map(courseMapper::toDto)
                .toList();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getActiveCoursesByType(CourseType type) {
        log.debug("Getting active courses for type: {}", type);
        return courseRepository.findByTypeAndActive(type, true).stream()
                .map(courseMapper::toDto)
                .toList();
    }
    
    @Override
    @Transactional
    public CourseDTO createCourse(CourseDTO courseDTO) {
        if (courseRepository.existsByCode(courseDTO.code())) {
            throw new IllegalArgumentException("Course with code " + courseDTO.code() + " already exists");
        }
        Course course = mapToEntity(courseDTO);
        Course savedCourse = courseRepository.save(course);
        return mapToDto(savedCourse);
    }
    
    @Override
    @Transactional
    public CourseDTO updateCourse(Long id, CourseDTO courseDTO) {
        Course existingCourse = courseRepository.findById(id)
            .orElseThrow(() -> CourseNotFoundException.withId(id));
        updateEntity(existingCourse, courseDTO);
        Course updatedCourse = courseRepository.save(existingCourse);
        return mapToDto(updatedCourse);
    }
    
    @Override
    @Transactional
    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw CourseNotFoundException.withId(id);
        }
        courseRepository.deleteById(id);
    }
    
    @Override
    @Transactional
    public void activateCourse(Long id) {
        Course course = courseRepository.findById(id)
            .orElseThrow(() -> CourseNotFoundException.withId(id));
        course.setActive(true);
        courseRepository.save(course);
    }
    
    @Override
    @Transactional
    public void deactivateCourse(Long id) {
        Course course = courseRepository.findById(id)
            .orElseThrow(() -> CourseNotFoundException.withId(id));
        course.setActive(false);
        courseRepository.save(course);
    }
    
    @Override
    @Transactional
    public void addInstructorToCourse(Long courseId, Long teacherId, boolean isPrimary) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));
        
        Teacher teacher = teacherRepository.findById(teacherId)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher", "id", teacherId));
        
        if (courseInstructorRepository.existsByCourseIdAndTeacherId(courseId, teacherId)) {
            throw new IllegalArgumentException("Teacher is already an instructor for this course");
        }
        
        CourseInstructor courseInstructor = new CourseInstructor();
        courseInstructor.setCourse(course);
        courseInstructor.setTeacher(teacher);
        courseInstructor.setPrimary(isPrimary);
        
        courseInstructorRepository.save(courseInstructor);
    }
    
    @Override
    @Transactional
    public void removeInstructorFromCourse(Long courseId, Long teacherId) {
        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Course", "id", courseId);
        }
        
        if (!userRepository.existsById(teacherId)) {
            throw new ResourceNotFoundException("Teacher", "id", teacherId);
        }
        
        if (!courseInstructorRepository.existsByCourseIdAndTeacherId(courseId, teacherId)) {
            throw new IllegalArgumentException("Teacher is not an instructor for this course");
        }
        
        courseInstructorRepository.deleteByCourseIdAndTeacherId(courseId, teacherId);
    }
} 