package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.AssignmentDTO;
import com.ohma.thutothebe.entity.Assignment;
import com.ohma.thutothebe.entity.AssignmentStatus;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.exception.AssignmentNotFoundException;
import com.ohma.thutothebe.mapper.AssignmentMapper;
import com.ohma.thutothebe.mapper.CourseMapper;
import com.ohma.thutothebe.mapper.UserMapper;
import com.ohma.thutothebe.repository.AssignmentRepository;
import com.ohma.thutothebe.repository.CourseRepository;
import com.ohma.thutothebe.service.CourseService;
import com.ohma.thutothebe.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.lenient;

@ExtendWith(MockitoExtension.class)
class AssignmentServiceImplTest {

    @Mock
    private AssignmentRepository assignmentRepository;

    @Mock
    private AssignmentMapper assignmentMapper;

    @Mock
    private CourseService courseService;

    @Mock
    private UserService userService;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private CourseMapper courseMapper;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private AssignmentServiceImpl assignmentService;

    private Assignment assignment;
    private AssignmentDTO assignmentDTO;
    private Course course;
    private User instructor;
    private com.ohma.thutothebe.dto.CourseDTO courseDTO;
    private com.ohma.thutothebe.dto.UserDTO instructorDTO;

    @BeforeEach
    void setUp() {
        course = new Course();
        course.setId(1L);
        course.setName("Test Course");

        instructor = new User();
        instructor.setId(1L);
        instructor.setUsername("testInstructor");

        courseDTO = new com.ohma.thutothebe.dto.CourseDTO(
            1L, "CODE1", "Test Course", "desc", 1L, java.util.Set.of(), true, 1L
        );
        instructorDTO = new com.ohma.thutothebe.dto.UserDTO(
            1L, "First", "Last", "email@test.com", "password", com.ohma.thutothebe.entity.UserRole.TEACHER
        );

        assignment = new Assignment();
        assignment.setId(1L);
        assignment.setTitle("Test Assignment");
        assignment.setDescription("Test Description");
        assignment.setCourse(course);
        assignment.setInstructor(instructor);
        assignment.setStatus(AssignmentStatus.ACTIVE);
        assignment.setDueDate(LocalDateTime.now().plusDays(7));

        assignmentDTO = new AssignmentDTO(
            1L,
            "Test Assignment",
            "Test Description",
            1L,
            1L,
            LocalDateTime.now().plusDays(7),
            AssignmentStatus.ACTIVE
        );

        lenient().when(courseMapper.toEntity(any())).thenReturn(course);
        lenient().when(userService.getById(anyLong())).thenReturn(instructorDTO);
        lenient().when(userMapper.toEntity(any())).thenReturn(instructor);
    }

    @Test
    void whenGetById_thenReturnAssignment() {
        when(assignmentRepository.findById(1L)).thenReturn(Optional.of(assignment));
        when(assignmentMapper.toDto(assignment)).thenReturn(assignmentDTO);

        AssignmentDTO result = assignmentService.getById(1L);

        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(1L);
        assertThat(result.title()).isEqualTo("Test Assignment");
        verify(assignmentRepository).findById(1L);
    }

    @Test
    void whenGetById_thenThrowException() {
        when(assignmentRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> assignmentService.getById(1L))
            .isInstanceOf(AssignmentNotFoundException.class)
            .hasMessageContaining("Assignment not found with id: 1");
    }

    @Test
    void whenGetAll_thenReturnAllAssignments() {
        List<Assignment> assignments = Arrays.asList(assignment);
        List<AssignmentDTO> assignmentDTOs = Arrays.asList(assignmentDTO);

        when(assignmentRepository.findAll()).thenReturn(assignments);
        when(assignmentMapper.toDto(any(Assignment.class))).thenReturn(assignmentDTO);

        List<AssignmentDTO> results = assignmentService.getAll();

        assertThat(results).hasSize(1);
        assertThat(results.get(0).id()).isEqualTo(1L);
        verify(assignmentRepository).findAll();
    }

    @Test
    void whenCreate_thenReturnCreatedAssignment() {
        when(assignmentMapper.toEntity(any(AssignmentDTO.class))).thenReturn(assignment);
        when(assignmentRepository.save(any(Assignment.class))).thenReturn(assignment);
        when(assignmentMapper.toDto(assignment)).thenReturn(assignmentDTO);

        AssignmentDTO result = assignmentService.create(assignmentDTO);

        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(1L);
        verify(assignmentRepository).save(any(Assignment.class));
    }

    @Test
    void whenUpdate_thenReturnUpdatedAssignment() {
        when(assignmentRepository.findById(1L)).thenReturn(Optional.of(assignment));
        when(assignmentMapper.toEntity(any(AssignmentDTO.class))).thenReturn(assignment);
        when(assignmentRepository.save(any(Assignment.class))).thenReturn(assignment);
        when(assignmentMapper.toDto(assignment)).thenReturn(assignmentDTO);

        AssignmentDTO result = assignmentService.update(1L, assignmentDTO);

        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(1L);
        verify(assignmentRepository).save(any(Assignment.class));
    }

    @Test
    void whenDelete_thenDeleteAssignment() {
        when(assignmentRepository.existsById(1L)).thenReturn(true);
        doNothing().when(assignmentRepository).deleteById(1L);

        assignmentService.delete(1L);

        verify(assignmentRepository).deleteById(1L);
    }

    @Test
    void whenGetAssignmentsByCourse_thenReturnAssignments() {
        List<Assignment> assignments = Arrays.asList(assignment);
        List<AssignmentDTO> assignmentDTOs = Arrays.asList(assignmentDTO);

        when(assignmentRepository.findByCourse(course)).thenReturn(assignments);
        when(assignmentMapper.toDto(any(Assignment.class))).thenReturn(assignmentDTO);

        List<AssignmentDTO> results = assignmentService.getAssignmentsByCourse(course);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).id()).isEqualTo(1L);
        verify(assignmentRepository).findByCourse(course);
    }

    @Test
    void whenGetActive_thenReturnActiveAssignments() {
        List<Assignment> assignments = Arrays.asList(assignment);
        List<AssignmentDTO> assignmentDTOs = Arrays.asList(assignmentDTO);

        when(assignmentRepository.findByActive(true)).thenReturn(assignments);
        when(assignmentMapper.toDto(any(Assignment.class))).thenReturn(assignmentDTO);

        List<AssignmentDTO> results = assignmentService.getActive();

        assertThat(results).hasSize(1);
        assertThat(results.get(0).id()).isEqualTo(1L);
        verify(assignmentRepository).findByActive(true);
    }

    @Test
    void whenGetActiveByCourse_thenReturnActiveAssignments() {
        List<Assignment> assignments = Arrays.asList(assignment);
        List<AssignmentDTO> assignmentDTOs = Arrays.asList(assignmentDTO);

        lenient().when(courseService.getById(anyLong())).thenReturn(courseDTO);
        lenient().when(courseMapper.toEntity(any())).thenReturn(course);
        lenient().when(assignmentRepository.findActiveByCourse(any(Course.class))).thenReturn(assignments);
        lenient().when(assignmentMapper.toDto(any(Assignment.class))).thenReturn(assignmentDTO);

        List<AssignmentDTO> results = assignmentService.getActiveByCourse(course.getId());

        assertThat(results).hasSize(1);
        assertThat(results.get(0).id()).isEqualTo(1L);
    }
} 