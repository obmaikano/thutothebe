package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.CourseDTO;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.exception.CourseNotFoundException;
import com.ohma.thutothebe.exception.UserNotFoundException;
import com.ohma.thutothebe.mapper.CourseMapper;
import com.ohma.thutothebe.repository.CourseRepository;
import com.ohma.thutothebe.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CourseServiceImplTest {

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CourseMapper courseMapper;

    @InjectMocks
    private CourseServiceImpl courseService;

    private Course course;
    private CourseDTO courseDTO;
    private User teacher;
    private User student;
    private Set<User> students;

    @BeforeEach
    void setUp() {
        teacher = new User();
        teacher.setId(1L);

        student = new User();
        student.setId(2L);

        students = new HashSet<>();
        students.add(student);

        course = new Course();
        course.setId(1L);
        course.setCode("CS101");
        course.setName("Introduction to Computer Science");
        course.setTeacher(teacher);
        course.setStudents(students);
        course.setActive(true);

        courseDTO = new CourseDTO(
            1L,
            "CS101",
            "Introduction to Computer Science",
            "Basic computer science concepts",
            1L,
            Set.of(2L),
            true,
                1L
        );
    }

    @Test
    void createCourse_Success() {
        when(courseMapper.toEntity(any(CourseDTO.class))).thenReturn(course);
        when(courseRepository.save(any(Course.class))).thenReturn(course);
        when(courseMapper.toDto(any(Course.class))).thenReturn(courseDTO);
        when(userRepository.findById(teacher.getId())).thenReturn(Optional.of(teacher));
        when(userRepository.findById(student.getId())).thenReturn(Optional.of(student));

        CourseDTO result = courseService.create(courseDTO);

        assertNotNull(result);
        assertEquals(courseDTO.code(), result.code());
        assertEquals(courseDTO.name(), result.name());
        verify(courseRepository).save(any(Course.class));
    }

    @Test
    void getCourseById_Success() {
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        when(courseMapper.toDto(any(Course.class))).thenReturn(courseDTO);

        CourseDTO result = courseService.getById(1L);

        assertNotNull(result);
        assertEquals(courseDTO.id(), result.id());
        assertEquals(courseDTO.code(), result.code());
    }

    @Test
    void getCourseById_NotFound() {
        when(courseRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(CourseNotFoundException.class, () -> courseService.getById(1L));
    }

    @Test
    void getCourseByCode_ShouldReturnCourse() {
        when(courseRepository.findByCode("CS101")).thenReturn(Optional.of(course));
        when(courseMapper.toDto(course)).thenReturn(courseDTO);

        CourseDTO result = courseService.getCourseByCode("CS101");

        assertNotNull(result);
        assertEquals("CS101", result.code());
        verify(courseRepository).findByCode("CS101");
    }

    @Test
    void getCourseByCode_NotFound() {
        when(courseRepository.findByCode("CS101")).thenReturn(Optional.empty());

        assertThrows(CourseNotFoundException.class, () -> courseService.getCourseByCode("CS101"));
    }

    @Test
    void getCoursesByTeacher_ShouldReturnCourses() {
        List<Course> courses = List.of(course);
        when(courseRepository.findByTeacher(teacher)).thenReturn(courses);
        when(courseMapper.toDto(course)).thenReturn(courseDTO);

        Set<CourseDTO> results = courseService.getCoursesByTeacher(teacher);

        assertNotNull(results);
        assertFalse(results.isEmpty());
        assertEquals(1, results.size());
        verify(courseRepository).findByTeacher(teacher);
    }

    @Test
    void getActiveCourses_ShouldReturnActiveCourses() {
        Set<Course> courses = Set.of(course);
        when(courseRepository.findByActiveTrue()).thenReturn(courses);
        when(courseMapper.toDto(course)).thenReturn(courseDTO);

        Set<CourseDTO> results = courseService.getActiveCourses();

        assertNotNull(results);
        assertFalse(results.isEmpty());
        assertEquals(1, results.size());
        verify(courseRepository).findByActiveTrue();
    }

    @Test
    void updateCourse_Success() {
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        when(courseRepository.save(any(Course.class))).thenReturn(course);
        when(courseMapper.toDto(any(Course.class))).thenReturn(courseDTO);
        when(userRepository.findById(teacher.getId())).thenReturn(Optional.of(teacher));
        when(userRepository.findById(student.getId())).thenReturn(Optional.of(student));

        CourseDTO result = courseService.update(1L, courseDTO);

        assertNotNull(result);
        assertEquals(courseDTO.code(), result.code());
        verify(courseRepository).save(any(Course.class));
    }

    @Test
    void updateCourse_NotFound() {
        when(courseRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(CourseNotFoundException.class, () -> courseService.update(1L, courseDTO));
    }

    @Test
    void deleteCourse_Success() {
        when(courseRepository.existsById(1L)).thenReturn(true);
        doNothing().when(courseRepository).deleteById(1L);

        assertDoesNotThrow(() -> courseService.delete(1L));
        verify(courseRepository).deleteById(1L);
    }

    @Test
    void deleteCourse_NotFound() {
        when(courseRepository.existsById(1L)).thenReturn(false);

        assertThrows(CourseNotFoundException.class, () -> courseService.delete(1L));
    }

    @Test
    void existsByCode_Success() {
        when(courseRepository.existsByCode("CS101")).thenReturn(true);

        boolean result = courseService.existsByCode("CS101");

        assertTrue(result);
    }

    @Test
    void existsByCode_NotFound() {
        when(courseRepository.existsByCode("CS101")).thenReturn(false);

        boolean result = courseService.existsByCode("CS101");

        assertFalse(result);
    }

    @Test
    void enrollStudent_ShouldAddStudentToCourse() {
        User newStudent = new User();
        newStudent.setId(3L);
        when(userRepository.findById(3L)).thenReturn(Optional.of(newStudent));
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        when(courseRepository.save(any(Course.class))).thenReturn(course);
        when(courseMapper.toDto(course)).thenReturn(courseDTO);

        CourseDTO result = courseService.enrollStudent(1L, 3L);

        assertNotNull(result);
        verify(courseRepository).save(any(Course.class));
    }

    @Test
    void unenrollStudent_ShouldRemoveStudentFromCourse() {
        when(userRepository.findById(2L)).thenReturn(Optional.of(student));
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        when(courseRepository.save(any(Course.class))).thenReturn(course);
        when(courseMapper.toDto(course)).thenReturn(courseDTO);

        CourseDTO result = courseService.unenrollStudent(1L, 2L);

        assertNotNull(result);
        verify(courseRepository).save(any(Course.class));
    }
} 