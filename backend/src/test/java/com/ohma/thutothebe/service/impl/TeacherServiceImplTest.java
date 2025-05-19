package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.TeacherDTO;
import com.ohma.thutothebe.entity.CourseInstructor;
import com.ohma.thutothebe.entity.Teacher;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.TeacherMapper;
import com.ohma.thutothebe.repository.CourseInstructorRepository;
import com.ohma.thutothebe.repository.TeacherRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TeacherServiceImplTest {

    @Mock
    private TeacherRepository teacherRepository;

    @Mock
    private CourseInstructorRepository courseInstructorRepository;

    @Mock
    private TeacherMapper teacherMapper;

    @InjectMocks
    private TeacherServiceImpl teacherService;

    private Teacher teacher;
    private TeacherDTO teacherDTO;
    private CourseInstructor courseInstructor;

    @BeforeEach
    void setUp() {
        // Setup test data
        teacher = new Teacher();
        teacher.setId(1L);
        teacher.setStaffId("TCH001");
        teacher.setFirstName("John");
        teacher.setLastName("Doe");
        teacher.setEmail("john.doe@example.com");
        teacher.setQualification("PhD in Education");
        teacher.setActive(true);

        teacherDTO = new TeacherDTO(
                1L,
                "TCH001",
                "John",
                "Doe",
                "john.doe@example.com",
                "PhD in Education",
                1L,
                1L,
                true
        );

        courseInstructor = new CourseInstructor();
        courseInstructor.setId(1L);
        courseInstructor.setTeacher(teacher);
    }

    @Test
    @DisplayName("Test getTeacherByStaffId when teacher exists")
    void getTeacherByStaffId_ShouldReturnTeacher_WhenExists() {
        // Arrange
        when(teacherRepository.findByStaffId(anyString())).thenReturn(Optional.of(teacher));
        when(teacherMapper.toDto(any(Teacher.class))).thenReturn(teacherDTO);

        // Act
        TeacherDTO result = teacherService.getTeacherByStaffId("TCH001");

        // Assert
        assertNotNull(result);
        assertEquals("TCH001", result.staffId());
        assertEquals("John", result.firstName());
        verify(teacherRepository, times(1)).findByStaffId("TCH001");
    }

    @Test
    @DisplayName("Test getTeacherByStaffId when teacher does not exist")
    void getTeacherByStaffId_ShouldThrowException_WhenNotFound() {
        // Arrange
        when(teacherRepository.findByStaffId(anyString())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> teacherService.getTeacherByStaffId("NONEXISTENT"));
        verify(teacherRepository, times(1)).findByStaffId("NONEXISTENT");
    }

    @Test
    @DisplayName("Test getTeacherByEmail when teacher exists")
    void getTeacherByEmail_ShouldReturnTeacher_WhenExists() {
        // Arrange
        when(teacherRepository.findByEmail(anyString())).thenReturn(Optional.of(teacher));
        when(teacherMapper.toDto(any(Teacher.class))).thenReturn(teacherDTO);

        // Act
        TeacherDTO result = teacherService.getTeacherByEmail("john.doe@example.com");

        // Assert
        assertNotNull(result);
        assertEquals("john.doe@example.com", result.email());
        assertEquals("John", result.firstName());
        verify(teacherRepository, times(1)).findByEmail("john.doe@example.com");
    }

    @Test
    @DisplayName("Test getTeacherByEmail when teacher does not exist")
    void getTeacherByEmail_ShouldThrowException_WhenNotFound() {
        // Arrange
        when(teacherRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> teacherService.getTeacherByEmail("nonexistent@example.com"));
        verify(teacherRepository, times(1)).findByEmail("nonexistent@example.com");
    }

    @Test
    @DisplayName("Test getActiveTeachers")
    void getActiveTeachers_ShouldReturnActiveTeachers() {
        // Arrange
        List<Teacher> activeTeachers = Arrays.asList(teacher);
        when(teacherRepository.findByActive(true)).thenReturn(activeTeachers);
        when(teacherMapper.toDto(any(Teacher.class))).thenReturn(teacherDTO);

        // Act
        List<TeacherDTO> result = teacherService.getActiveTeachers();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("TCH001", result.get(0).staffId());
        verify(teacherRepository, times(1)).findByActive(true);
    }

    @Test
    @DisplayName("Test createTeacher when staffId and email are unique")
    void createTeacher_ShouldCreateNewTeacher_WhenStaffIdAndEmailAreUnique() {
        // Arrange
        when(teacherRepository.existsByStaffId(anyString())).thenReturn(false);
        when(teacherRepository.existsByEmail(anyString())).thenReturn(false);
        when(teacherMapper.toEntity(any(TeacherDTO.class))).thenReturn(teacher);
        when(teacherRepository.save(any(Teacher.class))).thenReturn(teacher);
        when(teacherMapper.toDto(any(Teacher.class))).thenReturn(teacherDTO);

        // Act
        TeacherDTO result = teacherService.createTeacher(teacherDTO);

        // Assert
        assertNotNull(result);
        assertEquals("TCH001", result.staffId());
        assertEquals("john.doe@example.com", result.email());
        verify(teacherRepository, times(1)).existsByStaffId("TCH001");
        verify(teacherRepository, times(1)).existsByEmail("john.doe@example.com");
        verify(teacherRepository, times(1)).save(any(Teacher.class));
    }

    @Test
    @DisplayName("Test createTeacher when staffId already exists")
    void createTeacher_ShouldThrowException_WhenStaffIdExists() {
        // Arrange
        when(teacherRepository.existsByStaffId(anyString())).thenReturn(true);

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> teacherService.createTeacher(teacherDTO));
        verify(teacherRepository, times(1)).existsByStaffId("TCH001");
        verify(teacherRepository, never()).existsByEmail(anyString());
        verify(teacherRepository, never()).save(any(Teacher.class));
    }

    @Test
    @DisplayName("Test createTeacher when email already exists")
    void createTeacher_ShouldThrowException_WhenEmailExists() {
        // Arrange
        when(teacherRepository.existsByStaffId(anyString())).thenReturn(false);
        when(teacherRepository.existsByEmail(anyString())).thenReturn(true);

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> teacherService.createTeacher(teacherDTO));
        verify(teacherRepository, times(1)).existsByStaffId("TCH001");
        verify(teacherRepository, times(1)).existsByEmail("john.doe@example.com");
        verify(teacherRepository, never()).save(any(Teacher.class));
    }

    @Test
    @DisplayName("Test updateTeacher when teacher exists and staffId and email are unique")
    void updateTeacher_ShouldUpdateTeacher_WhenExistsAndStaffIdAndEmailAreUnique() {
        // Arrange
        when(teacherRepository.findById(anyLong())).thenReturn(Optional.of(teacher));
        when(teacherMapper.toEntity(any(TeacherDTO.class))).thenReturn(teacher);
        when(teacherRepository.save(any(Teacher.class))).thenReturn(teacher);
        when(teacherMapper.toDto(any(Teacher.class))).thenReturn(teacherDTO);

        // Act
        TeacherDTO updatedDTO = new TeacherDTO(
                1L,
                "TCH001",
                "John",
                "Doe",
                "john.doe@example.com",
                "Updated qualification",
                1L,
                1L,
                true
        );
        TeacherDTO result = teacherService.updateTeacher(1L, updatedDTO);

        // Assert
        assertNotNull(result);
        verify(teacherRepository, times(1)).findById(1L);
        verify(teacherRepository, times(1)).save(any(Teacher.class));
    }

    @Test
    @DisplayName("Test updateTeacher when teacher does not exist")
    void updateTeacher_ShouldThrowException_WhenNotFound() {
        // Arrange
        when(teacherRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        TeacherDTO updatedDTO = new TeacherDTO(
                1L,
                "TCH001",
                "John",
                "Doe",
                "john.doe@example.com",
                "Updated qualification",
                1L,
                1L,
                true
        );
        assertThrows(ResourceNotFoundException.class, () -> teacherService.updateTeacher(1L, updatedDTO));
        verify(teacherRepository, times(1)).findById(1L);
        verify(teacherRepository, never()).save(any(Teacher.class));
    }

    @Test
    @DisplayName("Test updateTeacher when staffId already exists for another teacher")
    void updateTeacher_ShouldThrowException_WhenStaffIdExistsForAnotherTeacher() {
        // Arrange
        Teacher existingTeacher = new Teacher();
        existingTeacher.setId(1L);
        existingTeacher.setStaffId("TCH001");
        existingTeacher.setEmail("john.doe@example.com");

        when(teacherRepository.findById(anyLong())).thenReturn(Optional.of(existingTeacher));
        when(teacherRepository.existsByStaffId("TCH002")).thenReturn(true);

        // Act & Assert
        TeacherDTO updatedDTO = new TeacherDTO(
                1L,
                "TCH002",
                "John",
                "Doe",
                "john.doe@example.com",
                "Updated qualification",
                1L,
                1L,
                true
        );
        assertThrows(IllegalArgumentException.class, () -> teacherService.updateTeacher(1L, updatedDTO));
        verify(teacherRepository, times(1)).findById(1L);
        verify(teacherRepository, times(1)).existsByStaffId("TCH002");
        verify(teacherRepository, never()).save(any(Teacher.class));
    }

    @Test
    @DisplayName("Test updateTeacher when email already exists for another teacher")
    void updateTeacher_ShouldThrowException_WhenEmailExistsForAnotherTeacher() {
        // Arrange
        Teacher existingTeacher = new Teacher();
        existingTeacher.setId(1L);
        existingTeacher.setStaffId("TCH001");
        existingTeacher.setEmail("john.doe@example.com");

        when(teacherRepository.findById(anyLong())).thenReturn(Optional.of(existingTeacher));
        when(teacherRepository.existsByEmail("new.email@example.com")).thenReturn(true);

        // Act & Assert
        TeacherDTO updatedDTO = new TeacherDTO(
                1L,
                "TCH001",
                "John",
                "Doe",
                "new.email@example.com",
                "Updated qualification",
                1L,
                1L,
                true
        );
        assertThrows(IllegalArgumentException.class, () -> teacherService.updateTeacher(1L, updatedDTO));
        verify(teacherRepository, times(1)).findById(1L);
        verify(teacherRepository, times(1)).existsByEmail("new.email@example.com");
        verify(teacherRepository, never()).save(any(Teacher.class));
    }

    @Test
    @DisplayName("Test deleteTeacher when teacher exists")
    void deleteTeacher_ShouldDeleteTeacher_WhenExists() {
        // Arrange
        when(teacherRepository.existsById(anyLong())).thenReturn(true);
        doNothing().when(teacherRepository).deleteById(anyLong());

        // Act
        teacherService.deleteTeacher(1L);

        // Assert
        verify(teacherRepository, times(1)).existsById(1L);
        verify(teacherRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Test deleteTeacher when teacher does not exist")
    void deleteTeacher_ShouldThrowException_WhenNotFound() {
        // Arrange
        when(teacherRepository.existsById(anyLong())).thenReturn(false);

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> teacherService.deleteTeacher(1L));
        verify(teacherRepository, times(1)).existsById(1L);
        verify(teacherRepository, never()).deleteById(anyLong());
    }

    @Test
    @DisplayName("Test activateTeacher when teacher exists")
    void activateTeacher_ShouldActivateTeacher_WhenExists() {
        // Arrange
        Teacher inactiveTeacher = new Teacher();
        inactiveTeacher.setId(1L);
        inactiveTeacher.setActive(false);

        when(teacherRepository.findById(anyLong())).thenReturn(Optional.of(inactiveTeacher));
        when(teacherRepository.save(any(Teacher.class))).thenReturn(inactiveTeacher);

        // Act
        teacherService.activateTeacher(1L);

        // Assert
        assertTrue(inactiveTeacher.isActive());
        verify(teacherRepository, times(1)).findById(1L);
        verify(teacherRepository, times(1)).save(inactiveTeacher);
    }

    @Test
    @DisplayName("Test activateTeacher when teacher does not exist")
    void activateTeacher_ShouldThrowException_WhenNotFound() {
        // Arrange
        when(teacherRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> teacherService.activateTeacher(1L));
        verify(teacherRepository, times(1)).findById(1L);
        verify(teacherRepository, never()).save(any(Teacher.class));
    }

    @Test
    @DisplayName("Test deactivateTeacher when teacher exists")
    void deactivateTeacher_ShouldDeactivateTeacher_WhenExists() {
        // Arrange
        when(teacherRepository.findById(anyLong())).thenReturn(Optional.of(teacher));
        when(teacherRepository.save(any(Teacher.class))).thenReturn(teacher);

        // Act
        teacherService.deactivateTeacher(1L);

        // Assert
        assertFalse(teacher.isActive());
        verify(teacherRepository, times(1)).findById(1L);
        verify(teacherRepository, times(1)).save(teacher);
    }

    @Test
    @DisplayName("Test deactivateTeacher when teacher does not exist")
    void deactivateTeacher_ShouldThrowException_WhenNotFound() {
        // Arrange
        when(teacherRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> teacherService.deactivateTeacher(1L));
        verify(teacherRepository, times(1)).findById(1L);
        verify(teacherRepository, never()).save(any(Teacher.class));
    }

    @Test
    @DisplayName("Test existsByStaffId when staffId exists")
    void existsByStaffId_ShouldReturnTrue_WhenStaffIdExists() {
        // Arrange
        when(teacherRepository.existsByStaffId(anyString())).thenReturn(true);

        // Act
        boolean result = teacherService.existsByStaffId("TCH001");

        // Assert
        assertTrue(result);
        verify(teacherRepository, times(1)).existsByStaffId("TCH001");
    }

    @Test
    @DisplayName("Test existsByStaffId when staffId does not exist")
    void existsByStaffId_ShouldReturnFalse_WhenStaffIdDoesNotExist() {
        // Arrange
        when(teacherRepository.existsByStaffId(anyString())).thenReturn(false);

        // Act
        boolean result = teacherService.existsByStaffId("NONEXISTENT");

        // Assert
        assertFalse(result);
        verify(teacherRepository, times(1)).existsByStaffId("NONEXISTENT");
    }

    @Test
    @DisplayName("Test existsByEmail when email exists")
    void existsByEmail_ShouldReturnTrue_WhenEmailExists() {
        // Arrange
        when(teacherRepository.existsByEmail(anyString())).thenReturn(true);

        // Act
        boolean result = teacherService.existsByEmail("john.doe@example.com");

        // Assert
        assertTrue(result);
        verify(teacherRepository, times(1)).existsByEmail("john.doe@example.com");
    }

    @Test
    @DisplayName("Test existsByEmail when email does not exist")
    void existsByEmail_ShouldReturnFalse_WhenEmailDoesNotExist() {
        // Arrange
        when(teacherRepository.existsByEmail(anyString())).thenReturn(false);

        // Act
        boolean result = teacherService.existsByEmail("nonexistent@example.com");

        // Assert
        assertFalse(result);
        verify(teacherRepository, times(1)).existsByEmail("nonexistent@example.com");
    }

    @Test
    @DisplayName("Test getTeachersByCourseId")
    void getTeachersByCourseId_ShouldReturnTeachers() {
        // Arrange
        List<CourseInstructor> courseInstructors = Arrays.asList(courseInstructor);
        when(courseInstructorRepository.findByCourseId(anyLong())).thenReturn(courseInstructors);
        when(teacherMapper.toDto(any(Teacher.class))).thenReturn(teacherDTO);

        // Act
        List<TeacherDTO> result = teacherService.getTeachersByCourseId(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("TCH001", result.get(0).staffId());
        verify(courseInstructorRepository, times(1)).findByCourseId(1L);
    }
} 