package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.DepartmentDTO;
import com.ohma.thutothebe.entity.Department;
import com.ohma.thutothebe.entity.School;
import com.ohma.thutothebe.entity.Subject;
import com.ohma.thutothebe.entity.Teacher;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.entity.UserRole;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.DepartmentMapper;
import com.ohma.thutothebe.repository.DepartmentRepository;
import com.ohma.thutothebe.repository.SubjectRepository;
import com.ohma.thutothebe.repository.TeacherRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DepartmentServiceImplTest {

    @Mock
    private DepartmentRepository departmentRepository;

    @Mock
    private DepartmentMapper departmentMapper;

    @Mock
    private TeacherRepository teacherRepository;

    @Mock
    private SubjectRepository subjectRepository;

    @InjectMocks
    private DepartmentServiceImpl departmentService;

    private Department department;
    private DepartmentDTO departmentDTO;
    private School school;
    private Teacher departmentHead;
    private Teacher teacher;
    private Subject subject;
    private User user;

    @BeforeEach
    void setUp() {
        // Create test school
        school = new School();
        school.setId(1L);
        school.setName("Test School");

        // Create test user
        user = new User();
        user.setId(1L);
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setRole(UserRole.TEACHER);

        // Create test department head
        departmentHead = new Teacher();
        departmentHead.setId(1L);
        departmentHead.setFirstName("John");
        departmentHead.setLastName("Doe");
        departmentHead.setUser(user);

        // Create test teacher
        teacher = new Teacher();
        teacher.setId(2L);
        teacher.setFirstName("Jane");
        teacher.setLastName("Smith");

        // Create test subject
        subject = new Subject();
        subject.setId(1L);
        subject.setName("Mathematics");

        // Create test department
        department = new Department();
        department.setId(1L);
        department.setName("Science Department");
        department.setDescription("Science subjects");
        department.setSchool(school);
        department.setDepartmentHead(departmentHead);
        department.setTeachers(new HashSet<>(Arrays.asList(teacher)));
        department.setSubjects(new HashSet<>(Arrays.asList(subject)));
        department.setActive(true);
        department.setCreatedAt(LocalDateTime.now());
        department.setModifiedAt(LocalDateTime.now());

        // Create test DTO
        departmentDTO = new DepartmentDTO(
                1L,
                "Science Department",
                "Science subjects",
                1L,
                "Test School",
                1L,
                "John Doe",
                Set.of(1L),
                Set.of("Mathematics"),
                Set.of(2L),
                Set.of("Jane Smith"),
                true,
                LocalDateTime.now(),
                LocalDateTime.now()
        );
    }

    @Test
    void testGetDepartmentsBySchoolId() {
        // Given
        Long schoolId = 1L;
        List<Department> departments = Arrays.asList(department);
        when(departmentRepository.findBySchoolId(schoolId)).thenReturn(departments);
        when(departmentMapper.toDto(department)).thenReturn(departmentDTO);

        // When
        List<DepartmentDTO> result = departmentService.getDepartmentsBySchoolId(schoolId);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(departmentDTO, result.get(0));
        verify(departmentRepository).findBySchoolId(schoolId);
        verify(departmentMapper).toDto(department);
    }

    @Test
    void testGetActiveDepartmentsBySchoolId() {
        // Given
        Long schoolId = 1L;
        List<Department> departments = Arrays.asList(department);
        when(departmentRepository.findBySchoolIdAndActiveTrue(schoolId)).thenReturn(departments);
        when(departmentMapper.toDto(department)).thenReturn(departmentDTO);

        // When
        List<DepartmentDTO> result = departmentService.getActiveDepartmentsBySchoolId(schoolId);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(departmentDTO, result.get(0));
        verify(departmentRepository).findBySchoolIdAndActiveTrue(schoolId);
        verify(departmentMapper).toDto(department);
    }

    @Test
    void testGetActiveDepartments() {
        // Given
        List<Department> departments = Arrays.asList(department);
        when(departmentRepository.findByActiveTrue()).thenReturn(departments);
        when(departmentMapper.toDto(department)).thenReturn(departmentDTO);

        // When
        List<DepartmentDTO> result = departmentService.getActiveDepartments();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(departmentDTO, result.get(0));
        verify(departmentRepository).findByActiveTrue();
        verify(departmentMapper).toDto(department);
    }

    @Test
    void testGetDepartmentByNameAndSchoolId() {
        // Given
        String name = "Science Department";
        Long schoolId = 1L;
        when(departmentRepository.findByNameAndSchoolId(name, schoolId)).thenReturn(Optional.of(department));
        when(departmentMapper.toDto(department)).thenReturn(departmentDTO);

        // When
        DepartmentDTO result = departmentService.getDepartmentByNameAndSchoolId(name, schoolId);

        // Then
        assertNotNull(result);
        assertEquals(departmentDTO, result);
        verify(departmentRepository).findByNameAndSchoolId(name, schoolId);
        verify(departmentMapper).toDto(department);
    }

    @Test
    void testGetDepartmentByNameAndSchoolId_NotFound() {
        // Given
        String name = "Non-existent Department";
        Long schoolId = 1L;
        when(departmentRepository.findByNameAndSchoolId(name, schoolId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class, 
                () -> departmentService.getDepartmentByNameAndSchoolId(name, schoolId));
        verify(departmentRepository).findByNameAndSchoolId(name, schoolId);
    }

    @Test
    void testGetDepartmentByDepartmentHeadId() {
        // Given
        Long departmentHeadId = 1L;
        when(departmentRepository.findByDepartmentHeadId(departmentHeadId)).thenReturn(Optional.of(department));
        when(departmentMapper.toDto(department)).thenReturn(departmentDTO);

        // When
        DepartmentDTO result = departmentService.getDepartmentByDepartmentHeadId(departmentHeadId);

        // Then
        assertNotNull(result);
        assertEquals(departmentDTO, result);
        verify(departmentRepository).findByDepartmentHeadId(departmentHeadId);
        verify(departmentMapper).toDto(department);
    }

    @Test
    void testGetDepartmentByDepartmentHeadId_NotFound() {
        // Given
        Long departmentHeadId = 999L;
        when(departmentRepository.findByDepartmentHeadId(departmentHeadId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class, 
                () -> departmentService.getDepartmentByDepartmentHeadId(departmentHeadId));
        verify(departmentRepository).findByDepartmentHeadId(departmentHeadId);
    }

    @Test
    void testGetDepartmentsByTeacherId() {
        // Given
        Long teacherId = 2L;
        List<Department> departments = Arrays.asList(department);
        when(departmentRepository.findByTeacherId(teacherId)).thenReturn(departments);
        when(departmentMapper.toDto(department)).thenReturn(departmentDTO);

        // When
        List<DepartmentDTO> result = departmentService.getDepartmentsByTeacherId(teacherId);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(departmentDTO, result.get(0));
        verify(departmentRepository).findByTeacherId(teacherId);
        verify(departmentMapper).toDto(department);
    }

    @Test
    void testGetDepartmentBySubjectId() {
        // Given
        Long subjectId = 1L;
        when(departmentRepository.findBySubjectId(subjectId)).thenReturn(Optional.of(department));
        when(departmentMapper.toDto(department)).thenReturn(departmentDTO);

        // When
        DepartmentDTO result = departmentService.getDepartmentBySubjectId(subjectId);

        // Then
        assertNotNull(result);
        assertEquals(departmentDTO, result);
        verify(departmentRepository).findBySubjectId(subjectId);
        verify(departmentMapper).toDto(department);
    }

    @Test
    void testGetDepartmentBySubjectId_NotFound() {
        // Given
        Long subjectId = 999L;
        when(departmentRepository.findBySubjectId(subjectId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class, 
                () -> departmentService.getDepartmentBySubjectId(subjectId));
        verify(departmentRepository).findBySubjectId(subjectId);
    }

    @Test
    void testAssignDepartmentHead() {
        // Given
        Long departmentId = 1L;
        Long teacherId = 1L;
        
        when(departmentRepository.findById(departmentId)).thenReturn(Optional.of(department));
        when(teacherRepository.findById(teacherId)).thenReturn(Optional.of(departmentHead));
        when(departmentRepository.existsByDepartmentHeadId(teacherId)).thenReturn(false);
        when(departmentRepository.save(any(Department.class))).thenReturn(department);
        when(departmentMapper.toDto(department)).thenReturn(departmentDTO);

        // When
        DepartmentDTO result = departmentService.assignDepartmentHead(departmentId, teacherId);

        // Then
        assertNotNull(result);
        assertEquals(departmentDTO, result);
        verify(departmentRepository).findById(departmentId);
        verify(teacherRepository).findById(teacherId);
        verify(departmentRepository).existsByDepartmentHeadId(teacherId);
        verify(departmentRepository).save(department);
        verify(departmentMapper).toDto(department);
    }

    @Test
    void testAssignDepartmentHead_DepartmentNotFound() {
        // Given
        Long departmentId = 999L;
        Long teacherId = 1L;
        when(departmentRepository.findById(departmentId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class, 
                () -> departmentService.assignDepartmentHead(departmentId, teacherId));
        verify(departmentRepository).findById(departmentId);
    }

    @Test
    void testAssignDepartmentHead_TeacherNotFound() {
        // Given
        Long departmentId = 1L;
        Long teacherId = 999L;
        when(departmentRepository.findById(departmentId)).thenReturn(Optional.of(department));
        when(teacherRepository.findById(teacherId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class, 
                () -> departmentService.assignDepartmentHead(departmentId, teacherId));
        verify(departmentRepository).findById(departmentId);
        verify(teacherRepository).findById(teacherId);
    }

    @Test
    void testAssignDepartmentHead_AlreadyDepartmentHead() {
        // Given
        Long departmentId = 1L;
        Long teacherId = 1L;
        when(departmentRepository.findById(departmentId)).thenReturn(Optional.of(department));
        when(teacherRepository.findById(teacherId)).thenReturn(Optional.of(departmentHead));
        when(departmentRepository.existsByDepartmentHeadId(teacherId)).thenReturn(true);

        // When & Then
        assertThrows(IllegalArgumentException.class, 
                () -> departmentService.assignDepartmentHead(departmentId, teacherId));
        verify(departmentRepository).findById(departmentId);
        verify(teacherRepository).findById(teacherId);
        verify(departmentRepository).existsByDepartmentHeadId(teacherId);
    }

    @Test
    void testRemoveDepartmentHead() {
        // Given
        Long departmentId = 1L;
        when(departmentRepository.findById(departmentId)).thenReturn(Optional.of(department));
        when(departmentRepository.save(any(Department.class))).thenReturn(department);
        when(departmentMapper.toDto(department)).thenReturn(departmentDTO);

        // When
        DepartmentDTO result = departmentService.removeDepartmentHead(departmentId);

        // Then
        assertNotNull(result);
        assertEquals(departmentDTO, result);
        verify(departmentRepository).findById(departmentId);
        verify(departmentRepository).save(department);
        verify(departmentMapper).toDto(department);
    }

    @Test
    void testAssignTeacherToDepartment() {
        // Given
        Long departmentId = 1L;
        Long teacherId = 2L;
        when(departmentRepository.findById(departmentId)).thenReturn(Optional.of(department));
        when(teacherRepository.findById(teacherId)).thenReturn(Optional.of(teacher));
        when(departmentRepository.save(any(Department.class))).thenReturn(department);
        when(departmentMapper.toDto(department)).thenReturn(departmentDTO);

        // When
        DepartmentDTO result = departmentService.assignTeacherToDepartment(departmentId, teacherId);

        // Then
        assertNotNull(result);
        assertEquals(departmentDTO, result);
        verify(departmentRepository).findById(departmentId);
        verify(teacherRepository).findById(teacherId);
        verify(departmentRepository).save(department);
        verify(departmentMapper).toDto(department);
    }

    @Test
    void testRemoveTeacherFromDepartment() {
        // Given
        Long departmentId = 1L;
        Long teacherId = 2L;
        when(departmentRepository.findById(departmentId)).thenReturn(Optional.of(department));
        when(teacherRepository.findById(teacherId)).thenReturn(Optional.of(teacher));
        when(departmentRepository.save(any(Department.class))).thenReturn(department);
        when(departmentMapper.toDto(department)).thenReturn(departmentDTO);

        // When
        DepartmentDTO result = departmentService.removeTeacherFromDepartment(departmentId, teacherId);

        // Then
        assertNotNull(result);
        assertEquals(departmentDTO, result);
        verify(departmentRepository).findById(departmentId);
        verify(teacherRepository).findById(teacherId);
        verify(departmentRepository).save(department);
        verify(departmentMapper).toDto(department);
    }

    @Test
    void testRemoveTeacherFromDepartment_CannotRemoveDepartmentHead() {
        // Given
        Long departmentId = 1L;
        Long teacherId = 1L; // Same as department head
        when(departmentRepository.findById(departmentId)).thenReturn(Optional.of(department));
        when(teacherRepository.findById(teacherId)).thenReturn(Optional.of(departmentHead));

        // When & Then
        assertThrows(IllegalArgumentException.class, 
                () -> departmentService.removeTeacherFromDepartment(departmentId, teacherId));
        verify(departmentRepository).findById(departmentId);
        verify(teacherRepository).findById(teacherId);
    }

    @Test
    void testAssignSubjectToDepartment() {
        // Given
        Long departmentId = 1L;
        Long subjectId = 1L;
        when(departmentRepository.findById(departmentId)).thenReturn(Optional.of(department));
        when(subjectRepository.findById(subjectId)).thenReturn(Optional.of(subject));
        when(departmentRepository.save(any(Department.class))).thenReturn(department);
        when(departmentMapper.toDto(department)).thenReturn(departmentDTO);

        // When
        DepartmentDTO result = departmentService.assignSubjectToDepartment(departmentId, subjectId);

        // Then
        assertNotNull(result);
        assertEquals(departmentDTO, result);
        verify(departmentRepository).findById(departmentId);
        verify(subjectRepository).findById(subjectId);
        verify(departmentRepository).save(department);
        verify(departmentMapper).toDto(department);
    }

    @Test
    void testRemoveSubjectFromDepartment() {
        // Given
        Long departmentId = 1L;
        Long subjectId = 1L;
        when(departmentRepository.findById(departmentId)).thenReturn(Optional.of(department));
        when(subjectRepository.findById(subjectId)).thenReturn(Optional.of(subject));
        when(departmentRepository.save(any(Department.class))).thenReturn(department);
        when(departmentMapper.toDto(department)).thenReturn(departmentDTO);

        // When
        DepartmentDTO result = departmentService.removeSubjectFromDepartment(departmentId, subjectId);

        // Then
        assertNotNull(result);
        assertEquals(departmentDTO, result);
        verify(departmentRepository).findById(departmentId);
        verify(subjectRepository).findById(subjectId);
        verify(departmentRepository).save(department);
        verify(departmentMapper).toDto(department);
    }

    @Test
    void testActivateDepartment() {
        // Given
        Long departmentId = 1L;
        when(departmentRepository.findById(departmentId)).thenReturn(Optional.of(department));
        when(departmentRepository.save(any(Department.class))).thenReturn(department);

        // When
        departmentService.activateDepartment(departmentId);

        // Then
        verify(departmentRepository).findById(departmentId);
        verify(departmentRepository).save(department);
        assertTrue(department.isActive());
    }

    @Test
    void testDeactivateDepartment() {
        // Given
        Long departmentId = 1L;
        when(departmentRepository.findById(departmentId)).thenReturn(Optional.of(department));
        when(departmentRepository.save(any(Department.class))).thenReturn(department);

        // When
        departmentService.deactivateDepartment(departmentId);

        // Then
        verify(departmentRepository).findById(departmentId);
        verify(departmentRepository).save(department);
        assertFalse(department.isActive());
    }

    @Test
    void testCountActiveDepartmentsBySchoolId() {
        // Given
        Long schoolId = 1L;
        Long expectedCount = 5L;
        when(departmentRepository.countBySchoolIdAndActiveTrue(schoolId)).thenReturn(expectedCount);

        // When
        Long result = departmentService.countActiveDepartmentsBySchoolId(schoolId);

        // Then
        assertEquals(expectedCount, result);
        verify(departmentRepository).countBySchoolIdAndActiveTrue(schoolId);
    }

    @Test
    void testExistsByNameAndSchoolId() {
        // Given
        String name = "Science Department";
        Long schoolId = 1L;
        when(departmentRepository.existsByNameAndSchoolId(name, schoolId)).thenReturn(true);

        // When
        boolean result = departmentService.existsByNameAndSchoolId(name, schoolId);

        // Then
        assertTrue(result);
        verify(departmentRepository).existsByNameAndSchoolId(name, schoolId);
    }

    @Test
    void testExistsByDepartmentHeadId() {
        // Given
        Long departmentHeadId = 1L;
        when(departmentRepository.existsByDepartmentHeadId(departmentHeadId)).thenReturn(true);

        // When
        boolean result = departmentService.existsByDepartmentHeadId(departmentHeadId);

        // Then
        assertTrue(result);
        verify(departmentRepository).existsByDepartmentHeadId(departmentHeadId);
    }

    @Test
    void testGetDepartmentsWithoutHead() {
        // Given
        Long schoolId = 1L;
        Department deptWithoutHead = new Department();
        deptWithoutHead.setId(2L);
        deptWithoutHead.setName("Math Department");
        deptWithoutHead.setDepartmentHead(null);
        deptWithoutHead.setActive(true);
        
        List<Department> departments = Arrays.asList(department, deptWithoutHead);
        when(departmentRepository.findBySchoolIdAndActiveTrue(schoolId)).thenReturn(departments);
        when(departmentMapper.toDto(deptWithoutHead)).thenReturn(departmentDTO);

        // When
        List<DepartmentDTO> result = departmentService.getDepartmentsWithoutHead(schoolId);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(departmentRepository).findBySchoolIdAndActiveTrue(schoolId);
        verify(departmentMapper).toDto(deptWithoutHead);
    }

    @Test
    void testGetDepartmentsWithSubjects() {
        // Given
        Long schoolId = 1L;
        List<Department> departments = Arrays.asList(department);
        when(departmentRepository.findBySchoolIdAndActiveTrue(schoolId)).thenReturn(departments);
        when(departmentMapper.toDto(department)).thenReturn(departmentDTO);

        // When
        List<DepartmentDTO> result = departmentService.getDepartmentsWithSubjects(schoolId);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(departmentDTO, result.get(0));
        verify(departmentRepository).findBySchoolIdAndActiveTrue(schoolId);
        verify(departmentMapper).toDto(department);
    }

    @Test
    void testCreate_DuplicateName() {
        // Given
        when(departmentRepository.existsByNameAndSchoolId(departmentDTO.name(), departmentDTO.schoolId())).thenReturn(true);

        // When & Then
        assertThrows(IllegalArgumentException.class, 
                () -> departmentService.create(departmentDTO));
        verify(departmentRepository).existsByNameAndSchoolId(departmentDTO.name(), departmentDTO.schoolId());
    }

    @Test
    void testUpdate_DuplicateName() {
        // Given
        Long departmentId = 1L;
        DepartmentDTO updateDTO = new DepartmentDTO(
                1L, "New Name", "New Description", 1L, "Test School",
                1L, "John Doe", Set.of(1L), Set.of("Mathematics"),
                Set.of(2L), Set.of("Jane Smith"), true,
                LocalDateTime.now(), LocalDateTime.now()
        );
        
        Department existingDept = new Department();
        existingDept.setId(1L);
        existingDept.setName("Old Name");
        
        when(departmentRepository.findById(departmentId)).thenReturn(Optional.of(existingDept));
        when(departmentRepository.existsByNameAndSchoolId(updateDTO.name(), updateDTO.schoolId())).thenReturn(true);

        // When & Then
        assertThrows(IllegalArgumentException.class, 
                () -> departmentService.update(departmentId, updateDTO));
        verify(departmentRepository).findById(departmentId);
        verify(departmentRepository).existsByNameAndSchoolId(updateDTO.name(), updateDTO.schoolId());
    }
} 