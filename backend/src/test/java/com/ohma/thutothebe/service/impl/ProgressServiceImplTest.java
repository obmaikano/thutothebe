package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.ProgressDTO;
import com.ohma.thutothebe.dto.CourseDTO;
import com.ohma.thutothebe.dto.UserDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.exception.ProgressNotFoundException;
import com.ohma.thutothebe.mapper.ProgressMapper;
import com.ohma.thutothebe.mapper.CourseMapper;
import com.ohma.thutothebe.mapper.UserMapper;
import com.ohma.thutothebe.repository.ProgressRepository;
import com.ohma.thutothebe.service.CourseService;
import com.ohma.thutothebe.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProgressServiceImplTest {

    @Mock
    private ProgressRepository progressRepository;

    @Mock
    private ProgressMapper progressMapper;

    @Mock
    private CourseService courseService;

    @Mock
    private UserService userService;

    @Mock
    private CourseMapper courseMapper;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private ProgressServiceImpl progressService;

    private User testStudent;
    private Course testCourse;
    private Progress testProgress;
    private ProgressDTO testProgressDTO;
    private UserDTO testStudentDTO;
    private CourseDTO testCourseDTO;

    @BeforeEach
    void setUp() {
        // Setup test student
        testStudent = new User();
        testStudent.setId(1L);
        testStudent.setFirstName("John");
        testStudent.setLastName("Doe");

        testStudentDTO = new UserDTO();

        testStudentDTO.setId(2L);
        testStudentDTO.setFirstName("Jane");
        testStudentDTO.setLastName("Doe");
        testStudentDTO.setEmail("john.doe@example.com");
        testStudentDTO.setPassword("password");

        // Setup test course
        testCourse = new Course();
        testCourse.setId(1L);
        testCourse.setName("Test Course");

        testCourseDTO = new CourseDTO(
            1L,
            "TEST101",
            "Test Course",
            1L,             // subjectId
            1L,             // classId
            Term.FIRST_TERM,
            2023,           // year
            true,           // active
                CourseType.CORE,
            new HashSet<>(Arrays.asList(1L)) // instructorIds
        );

        // Setup test progress
        testProgress = new Progress();
        testProgress.setId(1L);
        testProgress.setStudent(testStudent);
        testProgress.setCourse(testCourse);
        testProgress.setCompletionPercentage(75.0);
        testProgress.setGrade(85.0);
        testProgress.setCompleted(false);
        testProgress.setActive(true);
        testProgress.setLastActivityAt(LocalDateTime.now());

        testProgressDTO = new ProgressDTO(
            1L,
            1L,
            1L,
            75.0,
            85.0,
            false,
            true,
            LocalDateTime.now(),
            null
        );
    }

    @Test
    void getByStudent_ShouldReturnProgressList() {
        // Arrange
        when(userService.getById(1L)).thenReturn(testStudentDTO);
        when(userMapper.toEntity(testStudentDTO)).thenReturn(testStudent);
        when(progressRepository.findByStudent(testStudent)).thenReturn(Arrays.asList(testProgress));
        when(progressMapper.toDto(testProgress)).thenReturn(testProgressDTO);

        // Act
        List<ProgressDTO> result = progressService.getByStudent(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testProgressDTO, result.get(0));
        verify(userService).getById(1L);
        verify(userMapper).toEntity(testStudentDTO);
        verify(progressRepository).findByStudent(testStudent);
        verify(progressMapper).toDto(testProgress);
    }

    @Test
    void getByCourse_ShouldReturnProgressList() {
        // Arrange
        when(courseService.getById(1L)).thenReturn(testCourseDTO);
        when(courseMapper.toEntity(testCourseDTO)).thenReturn(testCourse);
        when(progressRepository.findByCourse(testCourse)).thenReturn(Arrays.asList(testProgress));
        when(progressMapper.toDto(testProgress)).thenReturn(testProgressDTO);

        // Act
        List<ProgressDTO> result = progressService.getByCourse(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testProgressDTO, result.get(0));
        verify(courseService).getById(1L);
        verify(courseMapper).toEntity(testCourseDTO);
        verify(progressRepository).findByCourse(testCourse);
        verify(progressMapper).toDto(testProgress);
    }

    @Test
    void getByStudentAndCourse_ShouldReturnProgress() {
        // Arrange
        when(userService.getById(1L)).thenReturn(testStudentDTO);
        when(userMapper.toEntity(testStudentDTO)).thenReturn(testStudent);
        when(courseService.getById(1L)).thenReturn(testCourseDTO);
        when(courseMapper.toEntity(testCourseDTO)).thenReturn(testCourse);
        when(progressRepository.findByStudentAndCourse(testStudent, testCourse)).thenReturn(Optional.of(testProgress));
        when(progressMapper.toDto(testProgress)).thenReturn(testProgressDTO);

        // Act
        ProgressDTO result = progressService.getByStudentAndCourse(1L, 1L);

        // Assert
        assertNotNull(result);
        assertEquals(testProgressDTO, result);
        verify(userService).getById(1L);
        verify(userMapper).toEntity(testStudentDTO);
        verify(courseService).getById(1L);
        verify(courseMapper).toEntity(testCourseDTO);
        verify(progressRepository).findByStudentAndCourse(testStudent, testCourse);
        verify(progressMapper).toDto(testProgress);
    }

    @Test
    void getByStudentAndCourse_WhenNotFound_ShouldThrowException() {
        // Arrange
        when(userService.getById(1L)).thenReturn(testStudentDTO);
        when(userMapper.toEntity(testStudentDTO)).thenReturn(testStudent);
        when(courseService.getById(1L)).thenReturn(testCourseDTO);
        when(courseMapper.toEntity(testCourseDTO)).thenReturn(testCourse);
        when(progressRepository.findByStudentAndCourse(testStudent, testCourse)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ProgressNotFoundException.class, () -> 
            progressService.getByStudentAndCourse(1L, 1L)
        );
        verify(userService).getById(1L);
        verify(userMapper).toEntity(testStudentDTO);
        verify(courseService).getById(1L);
        verify(courseMapper).toEntity(testCourseDTO);
        verify(progressRepository).findByStudentAndCourse(testStudent, testCourse);
        verify(progressMapper, never()).toDto(any());
    }

    @Test
    void getActiveByStudent_ShouldReturnActiveProgressList() {
        // Arrange
        when(userService.getById(1L)).thenReturn(testStudentDTO);
        when(userMapper.toEntity(testStudentDTO)).thenReturn(testStudent);
        when(progressRepository.findByStudentAndActive(testStudent, true)).thenReturn(Arrays.asList(testProgress));
        when(progressMapper.toDto(testProgress)).thenReturn(testProgressDTO);

        // Act
        List<ProgressDTO> result = progressService.getActiveByStudent(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testProgressDTO, result.get(0));
        verify(userService).getById(1L);
        verify(userMapper).toEntity(testStudentDTO);
        verify(progressRepository).findByStudentAndActive(testStudent, true);
        verify(progressMapper).toDto(testProgress);
    }

    @Test
    void getActiveByCourse_ShouldReturnActiveProgressList() {
        // Arrange
        when(courseService.getById(1L)).thenReturn(testCourseDTO);
        when(courseMapper.toEntity(testCourseDTO)).thenReturn(testCourse);
        when(progressRepository.findByCourseAndActive(testCourse, true)).thenReturn(Arrays.asList(testProgress));
        when(progressMapper.toDto(testProgress)).thenReturn(testProgressDTO);

        // Act
        List<ProgressDTO> result = progressService.getActiveByCourse(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testProgressDTO, result.get(0));
        verify(courseService).getById(1L);
        verify(courseMapper).toEntity(testCourseDTO);
        verify(progressRepository).findByCourseAndActive(testCourse, true);
        verify(progressMapper).toDto(testProgress);
    }

    @Test
    void getCompletedByStudent_ShouldReturnCompletedProgressList() {
        // Arrange
        when(userService.getById(1L)).thenReturn(testStudentDTO);
        when(userMapper.toEntity(testStudentDTO)).thenReturn(testStudent);
        when(progressRepository.findCompletedByStudent(testStudent)).thenReturn(Arrays.asList(testProgress));
        when(progressMapper.toDto(testProgress)).thenReturn(testProgressDTO);

        // Act
        List<ProgressDTO> result = progressService.getCompletedByStudent(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testProgressDTO, result.get(0));
        verify(userService).getById(1L);
        verify(userMapper).toEntity(testStudentDTO);
        verify(progressRepository).findCompletedByStudent(testStudent);
        verify(progressMapper).toDto(testProgress);
    }

    @Test
    void getCompletedByCourse_ShouldReturnCompletedProgressList() {
        // Arrange
        when(courseService.getById(1L)).thenReturn(testCourseDTO);
        when(courseMapper.toEntity(testCourseDTO)).thenReturn(testCourse);
        when(progressRepository.findCompletedByCourse(testCourse)).thenReturn(Arrays.asList(testProgress));
        when(progressMapper.toDto(testProgress)).thenReturn(testProgressDTO);

        // Act
        List<ProgressDTO> result = progressService.getCompletedByCourse(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testProgressDTO, result.get(0));
        verify(courseService).getById(1L);
        verify(courseMapper).toEntity(testCourseDTO);
        verify(progressRepository).findCompletedByCourse(testCourse);
        verify(progressMapper).toDto(testProgress);
    }

    @Test
    void getAverageGradeByCourse_ShouldReturnAverage() {
        // Arrange
        when(courseService.getById(1L)).thenReturn(testCourseDTO);
        when(courseMapper.toEntity(testCourseDTO)).thenReturn(testCourse);
        when(progressRepository.findAverageGradeByCourse(testCourse)).thenReturn(85.0);

        // Act
        Double result = progressService.getAverageGradeByCourse(1L);

        // Assert
        assertNotNull(result);
        assertEquals(85.0, result);
        verify(courseService).getById(1L);
        verify(courseMapper).toEntity(testCourseDTO);
        verify(progressRepository).findAverageGradeByCourse(testCourse);
    }

    @Test
    void getAverageCompletionByCourse_ShouldReturnAverage() {
        // Arrange
        when(courseService.getById(1L)).thenReturn(testCourseDTO);
        when(courseMapper.toEntity(testCourseDTO)).thenReturn(testCourse);
        when(progressRepository.findAverageCompletionByCourse(testCourse)).thenReturn(75.0);

        // Act
        Double result = progressService.getAverageCompletionByCourse(1L);

        // Assert
        assertNotNull(result);
        assertEquals(75.0, result);
        verify(courseService).getById(1L);
        verify(courseMapper).toEntity(testCourseDTO);
        verify(progressRepository).findAverageCompletionByCourse(testCourse);
    }

    @Test
    void updateProgress_WhenExisting_ShouldUpdateProgress() {
        // Arrange
        when(userService.getById(1L)).thenReturn(testStudentDTO);
        when(userMapper.toEntity(testStudentDTO)).thenReturn(testStudent);
        when(courseService.getById(1L)).thenReturn(testCourseDTO);
        when(courseMapper.toEntity(testCourseDTO)).thenReturn(testCourse);
        when(progressRepository.findByStudentAndCourse(testStudent, testCourse)).thenReturn(Optional.of(testProgress));
        when(progressRepository.save(testProgress)).thenReturn(testProgress);
        when(progressMapper.toDto(testProgress)).thenReturn(testProgressDTO);

        // Act
        ProgressDTO result = progressService.updateProgress(1L, 1L, 80.0, 90.0);

        // Assert
        assertNotNull(result);
        assertEquals(testProgressDTO, result);
        assertEquals(80.0, testProgress.getCompletionPercentage());
        assertEquals(90.0, testProgress.getGrade());
        assertNotNull(testProgress.getLastActivityAt());
        verify(userService).getById(1L);
        verify(userMapper).toEntity(testStudentDTO);
        verify(courseService).getById(1L);
        verify(courseMapper).toEntity(testCourseDTO);
        verify(progressRepository).findByStudentAndCourse(testStudent, testCourse);
        verify(progressRepository).save(testProgress);
        verify(progressMapper).toDto(testProgress);
    }

    @Test
    void updateProgress_WhenNew_ShouldCreateProgress() {
        // Arrange
        when(userService.getById(1L)).thenReturn(testStudentDTO);
        when(userMapper.toEntity(testStudentDTO)).thenReturn(testStudent);
        when(courseService.getById(1L)).thenReturn(testCourseDTO);
        when(courseMapper.toEntity(testCourseDTO)).thenReturn(testCourse);
        when(progressRepository.findByStudentAndCourse(testStudent, testCourse)).thenReturn(Optional.empty());
        when(progressRepository.save(any(Progress.class))).thenAnswer(i -> i.getArgument(0));
        when(progressMapper.toDto(any(Progress.class))).thenReturn(testProgressDTO);

        // Act
        ProgressDTO result = progressService.updateProgress(1L, 1L, 80.0, 90.0);

        // Assert
        assertNotNull(result);
        assertEquals(testProgressDTO, result);
        verify(userService).getById(1L);
        verify(userMapper).toEntity(testStudentDTO);
        verify(courseService).getById(1L);
        verify(courseMapper).toEntity(testCourseDTO);
        verify(progressRepository).findByStudentAndCourse(testStudent, testCourse);
        verify(progressRepository).save(any(Progress.class));
        verify(progressMapper).toDto(any(Progress.class));
    }

    @Test
    void create_ShouldCreateProgress() {
        // Arrange
        when(progressMapper.toEntity(testProgressDTO)).thenReturn(testProgress);
        when(progressRepository.save(testProgress)).thenReturn(testProgress);
        when(progressMapper.toDto(testProgress)).thenReturn(testProgressDTO);

        // Act
        ProgressDTO result = progressService.create(testProgressDTO);

        // Assert
        assertNotNull(result);
        assertEquals(testProgressDTO, result);
        verify(progressMapper).toEntity(testProgressDTO);
        verify(progressRepository).save(testProgress);
        verify(progressMapper).toDto(testProgress);
    }

    @Test
    void getById_ShouldReturnProgress() {
        // Arrange
        when(progressRepository.findById(1L)).thenReturn(Optional.of(testProgress));
        when(progressMapper.toDto(testProgress)).thenReturn(testProgressDTO);

        // Act
        ProgressDTO result = progressService.getById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(testProgressDTO, result);
        verify(progressRepository).findById(1L);
        verify(progressMapper).toDto(testProgress);
    }

    @Test
    void getById_WhenNotFound_ShouldThrowException() {
        // Arrange
        when(progressRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ProgressNotFoundException.class, () -> 
            progressService.getById(1L)
        );
        verify(progressRepository).findById(1L);
        verify(progressMapper, never()).toDto(any());
    }

    @Test
    void getAll_ShouldReturnAllProgress() {
        // Arrange
        when(progressRepository.findAll()).thenReturn(Arrays.asList(testProgress));
        when(progressMapper.toDto(testProgress)).thenReturn(testProgressDTO);

        // Act
        List<ProgressDTO> result = progressService.getAll();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testProgressDTO, result.get(0));
        verify(progressRepository).findAll();
        verify(progressMapper).toDto(testProgress);
    }

    @Test
    void getAll_WithPageable_ShouldReturnPagedProgress() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Page<Progress> progressPage = new PageImpl<>(Arrays.asList(testProgress));
        when(progressRepository.findAll(pageable)).thenReturn(progressPage);
        when(progressMapper.toDto(testProgress)).thenReturn(testProgressDTO);

        // Act
        Page<ProgressDTO> result = progressService.getAll(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(testProgressDTO, result.getContent().get(0));
        verify(progressRepository).findAll(pageable);
        verify(progressMapper).toDto(testProgress);
    }

    @Test
    void update_ShouldUpdateProgress() {
        // Arrange
        when(progressRepository.findById(1L)).thenReturn(Optional.of(testProgress));
        when(progressRepository.save(testProgress)).thenReturn(testProgress);
        when(progressMapper.toDto(testProgress)).thenReturn(testProgressDTO);

        // Act
        ProgressDTO result = progressService.update(1L, testProgressDTO);

        // Assert
        assertNotNull(result);
        assertEquals(testProgressDTO, result);
        verify(progressRepository).findById(1L);
        verify(progressMapper).updateEntityFromDto(testProgressDTO, testProgress);
        verify(progressRepository).save(testProgress);
        verify(progressMapper).toDto(testProgress);
    }

    @Test
    void update_WhenNotFound_ShouldThrowException() {
        // Arrange
        when(progressRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ProgressNotFoundException.class, () -> 
            progressService.update(1L, testProgressDTO)
        );
        verify(progressRepository).findById(1L);
        verify(progressMapper, never()).updateEntityFromDto(any(), any());
        verify(progressRepository, never()).save(any());
    }

    @Test
    void delete_ShouldDeleteProgress() {
        // Arrange
        when(progressRepository.existsById(1L)).thenReturn(true);

        // Act
        progressService.delete(1L);

        // Assert
        verify(progressRepository).existsById(1L);
        verify(progressRepository).deleteById(1L);
    }

    @Test
    void delete_WhenNotFound_ShouldThrowException() {
        // Arrange
        when(progressRepository.existsById(1L)).thenReturn(false);

        // Act & Assert
        assertThrows(ProgressNotFoundException.class, () -> 
            progressService.delete(1L)
        );
        verify(progressRepository).existsById(1L);
        verify(progressRepository, never()).deleteById(any());
    }
}