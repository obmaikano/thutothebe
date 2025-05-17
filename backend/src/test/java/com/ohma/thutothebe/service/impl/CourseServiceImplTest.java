package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.CourseDTO;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.CourseInstructor;
import com.ohma.thutothebe.entity.CourseType;
import com.ohma.thutothebe.entity.Subject;
import com.ohma.thutothebe.entity.Teacher;
import com.ohma.thutothebe.entity.Term;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.CourseMapper;
import com.ohma.thutothebe.repository.ClassRepository;
import com.ohma.thutothebe.repository.CourseInstructorRepository;
import com.ohma.thutothebe.repository.CourseRepository;
import com.ohma.thutothebe.repository.SubjectRepository;
import com.ohma.thutothebe.repository.TeacherRepository;
import com.ohma.thutothebe.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CourseServiceImplTest {

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private SubjectRepository subjectRepository;

    @Mock
    private ClassRepository classRepository;

    @Mock
    private TeacherRepository teacherRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CourseInstructorRepository courseInstructorRepository;

    @Mock
    private CourseMapper courseMapper;

    @InjectMocks
    private CourseServiceImpl courseService;

    private Course course;
    private CourseDTO courseDTO;
    private Subject subject;
    private com.ohma.thutothebe.entity.Class classEntity;
    private Teacher teacher;
    private User user;
    private CourseInstructor courseInstructor;

    @BeforeEach
    void setUp() {
        // Setup test data
        subject = new Subject();
        subject.setId(1L);
        subject.setCode("MATH");
        subject.setName("Mathematics");
        
        classEntity = new com.ohma.thutothebe.entity.Class();
        classEntity.setId(1L);
        classEntity.setName("Class 1A");
        
        teacher = new Teacher();
        teacher.setId(1L);
        teacher.setStaffId("TCH001");
        teacher.setFirstName("John");
        teacher.setLastName("Doe");
        
        user = new User();
        user.setId(1L);
        
        course = new Course();
        course.setId(1L);
        course.setCode("MATH101");
        course.setName("Mathematics 101");
        course.setSubject(subject);
        course.setClassEntity(classEntity);
        course.setTerm(Term.FIRST_TERM);
        course.setYear(2023);
        course.setActive(true);
        course.setType(CourseType.CORE);
        
        courseInstructor = new CourseInstructor();
        courseInstructor.setId(1L);
        courseInstructor.setCourse(course);
        courseInstructor.setTeacher(teacher);
        courseInstructor.setPrimary(true);
        
        Set<Long> instructorIds = new HashSet<>();
        instructorIds.add(1L);
        
        courseDTO = new CourseDTO(
                1L,
                "MATH101",
                "Mathematics 101",
                1L,
                1L,
                Term.FIRST_TERM,
                2023,
                true,
                CourseType.CORE,
                instructorIds
        );
    }

    @Test
    @DisplayName("Test getCourseByCode when course exists")
    void getCourseByCode_ShouldReturnCourse_WhenExists() {
        // Arrange
        when(courseRepository.findByCode(anyString())).thenReturn(Optional.of(course));
        when(courseMapper.toDto(any(Course.class))).thenReturn(courseDTO);

        // Act
        CourseDTO result = courseService.getCourseByCode("MATH101");

        // Assert
        assertNotNull(result);
        assertEquals("MATH101", result.code());
        assertEquals("Mathematics 101", result.name());
        verify(courseRepository, times(1)).findByCode("MATH101");
    }

    @Test
    @DisplayName("Test getCourseByCode when course does not exist")
    void getCourseByCode_ShouldThrowException_WhenNotFound() {
        // Arrange
        when(courseRepository.findByCode(anyString())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> courseService.getCourseByCode("NONEXISTENT"));
        verify(courseRepository, times(1)).findByCode("NONEXISTENT");
    }

    @Test
    @DisplayName("Test getActiveCourses")
    void getActiveCourses_ShouldReturnActiveCourses() {
        // Arrange
        List<Course> activeCourses = Arrays.asList(course);
        when(courseRepository.findByActive(true)).thenReturn(activeCourses);
        when(courseMapper.toDto(any(Course.class))).thenReturn(courseDTO);

        // Act
        Set<CourseDTO> result = courseService.getActiveCourses();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("MATH101", result.iterator().next().code());
        verify(courseRepository, times(1)).findByActive(true);
    }

    @Test
    @DisplayName("Test getCoursesBySubjectId")
    void getCoursesBySubjectId_ShouldReturnCourses() {
        // Arrange
        List<Course> courses = Arrays.asList(course);
        when(subjectRepository.findById(anyLong())).thenReturn(Optional.of(subject));
        when(courseRepository.findBySubject(any(Subject.class))).thenReturn(courses);
        when(courseMapper.toDto(any(Course.class))).thenReturn(courseDTO);

        // Act
        List<CourseDTO> result = courseService.getCoursesBySubjectId(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("MATH101", result.get(0).code());
        verify(subjectRepository, times(1)).findById(1L);
        verify(courseRepository, times(1)).findBySubject(any(Subject.class));
    }

    @Test
    @DisplayName("Test getActiveCoursesbySubjectId")
    void getActiveCoursesbySubjectId_ShouldReturnActiveCourses() {
        // Arrange
        List<Course> courses = Arrays.asList(course);
        when(courseRepository.findBySubjectIdAndActive(anyLong(), anyBoolean())).thenReturn(courses);
        when(courseMapper.toDto(any(Course.class))).thenReturn(courseDTO);

        // Act
        List<CourseDTO> result = courseService.getActiveCoursesbySubjectId(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("MATH101", result.get(0).code());
        verify(courseRepository, times(1)).findBySubjectIdAndActive(1L, true);
    }

    @Test
    @DisplayName("Test getCoursesByClassId")
    void getCoursesByClassId_ShouldReturnCourses() {
        // Arrange
        List<Course> courses = Arrays.asList(course);
        when(courseRepository.findByClassEntityId(anyLong())).thenReturn(courses);
        when(courseMapper.toDto(any(Course.class))).thenReturn(courseDTO);

        // Act
        List<CourseDTO> result = courseService.getCoursesByClassId(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("MATH101", result.get(0).code());
        verify(courseRepository, times(1)).findByClassEntityId(1L);
    }

    @Test
    @DisplayName("Test getCoursesByTeacherId")
    void getCoursesByTeacherId_ShouldReturnCourses() {
        // Arrange
        List<Course> courses = Arrays.asList(course);
        when(courseRepository.findByTeacherId(anyLong())).thenReturn(courses);
        when(courseMapper.toDto(any(Course.class))).thenReturn(courseDTO);

        // Act
        List<CourseDTO> result = courseService.getCoursesByTeacherId(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("MATH101", result.get(0).code());
        verify(courseRepository, times(1)).findByTeacherId(1L);
    }

    @Test
    @DisplayName("Test getCoursesByTerm")
    void getCoursesByTerm_ShouldReturnCourses() {
        // Arrange
        List<Course> courses = Arrays.asList(course);
        when(courseRepository.findByTerm(any(Term.class))).thenReturn(courses);
        when(courseMapper.toDto(any(Course.class))).thenReturn(courseDTO);

        // Act
        List<CourseDTO> result = courseService.getCoursesByTerm(Term.FIRST_TERM);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("MATH101", result.get(0).code());
        verify(courseRepository, times(1)).findByTerm(Term.FIRST_TERM);
    }

    @Test
    @DisplayName("Test getCoursesByYear")
    void getCoursesByYear_ShouldReturnCourses() {
        // Arrange
        List<Course> courses = Arrays.asList(course);
        when(courseRepository.findByYear(anyInt())).thenReturn(courses);
        when(courseMapper.toDto(any(Course.class))).thenReturn(courseDTO);

        // Act
        List<CourseDTO> result = courseService.getCoursesByYear(2023);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("MATH101", result.get(0).code());
        verify(courseRepository, times(1)).findByYear(2023);
    }

    @Test
    @DisplayName("Test createCourse when code is unique")
    void createCourse_ShouldCreateNewCourse_WhenCodeIsUnique() {
        // Arrange
        when(courseRepository.existsByCode(anyString())).thenReturn(false);
        when(subjectRepository.findById(anyLong())).thenReturn(Optional.of(subject));
        when(classRepository.findById(anyLong())).thenReturn(Optional.of(classEntity));
        when(teacherRepository.findById(anyLong())).thenReturn(Optional.of(teacher));
        when(courseMapper.toEntity(any(CourseDTO.class))).thenReturn(course);
        when(courseRepository.save(any(Course.class))).thenReturn(course);
        when(courseMapper.toDto(any(Course.class))).thenReturn(courseDTO);

        // Act
        CourseDTO result = courseService.createCourse(courseDTO);

        // Assert
        assertNotNull(result);
        assertEquals("MATH101", result.code());
        assertEquals("Mathematics 101", result.name());
        verify(courseRepository, times(1)).existsByCode("MATH101");
        verify(subjectRepository, times(1)).findById(1L);
        verify(classRepository, times(1)).findById(1L);
        verify(courseRepository, times(1)).save(any(Course.class));
    }

    @Test
    @DisplayName("Test createCourse when code already exists")
    void createCourse_ShouldThrowException_WhenCodeExists() {
        // Arrange
        when(courseRepository.existsByCode(anyString())).thenReturn(true);

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> courseService.createCourse(courseDTO));
        verify(courseRepository, times(1)).existsByCode("MATH101");
        verify(subjectRepository, never()).findById(anyLong());
        verify(classRepository, never()).findById(anyLong());
        verify(courseRepository, never()).save(any(Course.class));
    }

    @Test
    @DisplayName("Test updateCourse when course exists")
    void updateCourse_ShouldUpdateExistingCourse_WhenExists() {
        // Arrange
        when(courseRepository.findById(anyLong())).thenReturn(Optional.of(course));
        when(subjectRepository.findById(anyLong())).thenReturn(Optional.of(subject));
        when(classRepository.findById(anyLong())).thenReturn(Optional.of(classEntity));
        when(courseRepository.save(any(Course.class))).thenReturn(course);
        when(courseMapper.toDto(any(Course.class))).thenReturn(courseDTO);

        // Act
        CourseDTO result = courseService.updateCourse(1L, courseDTO);

        // Assert
        assertNotNull(result);
        verify(courseRepository, times(1)).findById(1L);
        verify(subjectRepository, times(1)).findById(1L);
        verify(classRepository, times(1)).findById(1L);
        verify(courseRepository, times(1)).save(any(Course.class));
    }

    @Test
    @DisplayName("Test updateCourse when course does not exist")
    void updateCourse_ShouldThrowException_WhenNotFound() {
        // Arrange
        when(courseRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> courseService.updateCourse(1L, courseDTO));
        verify(courseRepository, times(1)).findById(1L);
        verify(courseRepository, never()).save(any(Course.class));
    }

    @Test
    @DisplayName("Test deleteCourse when course exists")
    void deleteCourse_ShouldDeleteCourse_WhenExists() {
        // Arrange
        when(courseRepository.findById(anyLong())).thenReturn(Optional.of(course));
        doNothing().when(courseRepository).deleteById(anyLong());

        // Act
        courseService.deleteCourse(1L);

        // Assert
        verify(courseRepository, times(1)).findById(1L);
        verify(courseRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Test deleteCourse when course does not exist")
    void deleteCourse_ShouldThrowException_WhenNotFound() {
        // Arrange
        when(courseRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> courseService.deleteCourse(1L));
        verify(courseRepository, times(1)).findById(1L);
        verify(courseRepository, never()).deleteById(anyLong());
    }

    @Test
    @DisplayName("Test deactivateCourse when course exists")
    void deactivateCourse_ShouldDeactivateCourse_WhenExists() {
        // Arrange
        when(courseRepository.findById(anyLong())).thenReturn(Optional.of(course));
        when(courseRepository.save(any(Course.class))).thenReturn(course);

        // Act
        courseService.deactivateCourse(1L);

        // Assert
        assertFalse(course.isActive());
        verify(courseRepository, times(1)).findById(1L);
        verify(courseRepository, times(1)).save(course);
    }

    @Test
    @DisplayName("Test deactivateCourse when course does not exist")
    void deactivateCourse_ShouldThrowException_WhenNotFound() {
        // Arrange
        when(courseRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> courseService.deactivateCourse(1L));
        verify(courseRepository, times(1)).findById(1L);
        verify(courseRepository, never()).save(any(Course.class));
    }

    @Test
    @DisplayName("Test activateCourse when course exists")
    void activateCourse_ShouldActivateCourse_WhenExists() {
        // Arrange
        Course inactiveCourse = new Course();
        inactiveCourse.setId(1L);
        inactiveCourse.setActive(false);

        when(courseRepository.findById(anyLong())).thenReturn(Optional.of(inactiveCourse));
        when(courseRepository.save(any(Course.class))).thenReturn(inactiveCourse);

        // Act
        courseService.activateCourse(1L);

        // Assert
        assertTrue(inactiveCourse.isActive());
        verify(courseRepository, times(1)).findById(1L);
        verify(courseRepository, times(1)).save(inactiveCourse);
    }

    @Test
    @DisplayName("Test activateCourse when course does not exist")
    void activateCourse_ShouldThrowException_WhenNotFound() {
        // Arrange
        when(courseRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> courseService.activateCourse(1L));
        verify(courseRepository, times(1)).findById(1L);
        verify(courseRepository, never()).save(any(Course.class));
    }

    @Test
    @DisplayName("Test addInstructorToCourse when course and teacher exist")
    void addInstructorToCourse_ShouldAddInstructor_WhenCourseAndTeacherExist() {
        // Arrange
        when(courseRepository.findById(anyLong())).thenReturn(Optional.of(course));
        when(teacherRepository.findById(anyLong())).thenReturn(Optional.of(teacher));
        when(courseInstructorRepository.existsByCourseIdAndTeacherId(anyLong(), anyLong())).thenReturn(false);
        when(courseInstructorRepository.save(any(CourseInstructor.class))).thenReturn(courseInstructor);

        // Act
        courseService.addInstructorToCourse(1L, 1L, true);

        // Assert
        verify(courseRepository, times(1)).findById(1L);
        verify(teacherRepository, times(1)).findById(1L);
        verify(courseInstructorRepository, times(1)).existsByCourseIdAndTeacherId(1L, 1L);
        verify(courseInstructorRepository, times(1)).save(any(CourseInstructor.class));
    }

    @Test
    @DisplayName("Test addInstructorToCourse when instructor already exists")
    void addInstructorToCourse_ShouldThrowException_WhenInstructorAlreadyExists() {
        // Arrange
        when(courseRepository.findById(anyLong())).thenReturn(Optional.of(course));
        when(teacherRepository.findById(anyLong())).thenReturn(Optional.of(teacher));
        when(courseInstructorRepository.existsByCourseIdAndTeacherId(anyLong(), anyLong())).thenReturn(true);

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> courseService.addInstructorToCourse(1L, 1L, true));
        verify(courseRepository, times(1)).findById(1L);
        verify(teacherRepository, times(1)).findById(1L);
        verify(courseInstructorRepository, times(1)).existsByCourseIdAndTeacherId(1L, 1L);
        verify(courseInstructorRepository, never()).save(any(CourseInstructor.class));
    }

    @Test
    @DisplayName("Test removeInstructorFromCourse when course instructor exists")
    void removeInstructorFromCourse_ShouldRemoveInstructor_WhenExists() {
        // Arrange
        when(courseInstructorRepository.findByCourseIdAndTeacherId(anyLong(), anyLong())).thenReturn(Optional.of(courseInstructor));
        doNothing().when(courseInstructorRepository).delete(any(CourseInstructor.class));

        // Act
        courseService.removeInstructorFromCourse(1L, 1L);

        // Assert
        verify(courseInstructorRepository, times(1)).findByCourseIdAndTeacherId(1L, 1L);
        verify(courseInstructorRepository, times(1)).delete(courseInstructor);
    }

    @Test
    @DisplayName("Test removeInstructorFromCourse when course instructor does not exist")
    void removeInstructorFromCourse_ShouldThrowException_WhenNotFound() {
        // Arrange
        when(courseInstructorRepository.findByCourseIdAndTeacherId(anyLong(), anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> courseService.removeInstructorFromCourse(1L, 1L));
        verify(courseInstructorRepository, times(1)).findByCourseIdAndTeacherId(1L, 1L);
        verify(courseInstructorRepository, never()).delete(any(CourseInstructor.class));
    }

    @Test
    @DisplayName("Test existsByCode when code exists")
    void existsByCode_ShouldReturnTrue_WhenCodeExists() {
        // Arrange
        when(courseRepository.existsByCode(anyString())).thenReturn(true);

        // Act
        boolean result = courseService.existsByCode("MATH101");

        // Assert
        assertTrue(result);
        verify(courseRepository, times(1)).existsByCode("MATH101");
    }

    @Test
    @DisplayName("Test existsByCode when code does not exist")
    void existsByCode_ShouldReturnFalse_WhenCodeDoesNotExist() {
        // Arrange
        when(courseRepository.existsByCode(anyString())).thenReturn(false);

        // Act
        boolean result = courseService.existsByCode("NONEXISTENT");

        // Assert
        assertFalse(result);
        verify(courseRepository, times(1)).existsByCode("NONEXISTENT");
    }

    @Test
    @DisplayName("Test getCoursesByType")
    void getCoursesByType_ShouldReturnCourses() {
        // Arrange
        List<Course> courses = Arrays.asList(course);
        when(courseRepository.findByType(any(CourseType.class))).thenReturn(courses);
        when(courseMapper.toDto(any(Course.class))).thenReturn(courseDTO);

        // Act
        List<CourseDTO> result = courseService.getCoursesByType(CourseType.CORE);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("MATH101", result.get(0).code());
        assertEquals(CourseType.CORE, result.get(0).type());
        verify(courseRepository, times(1)).findByType(CourseType.CORE);
    }
} 