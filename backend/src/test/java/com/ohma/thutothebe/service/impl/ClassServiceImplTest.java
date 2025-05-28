package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.ClassDTO;
import com.ohma.thutothebe.entity.Class;
import com.ohma.thutothebe.entity.School;
import com.ohma.thutothebe.entity.Student;
import com.ohma.thutothebe.entity.Teacher;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.entity.UserRole;
import com.ohma.thutothebe.entity.enums.GradeLevel;
import com.ohma.thutothebe.mapper.ClassMapper;
import com.ohma.thutothebe.repository.ClassRepository;
import com.ohma.thutothebe.repository.SchoolRepository;
import com.ohma.thutothebe.repository.TeacherRepository;
import com.ohma.thutothebe.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClassServiceImplTest {

    @Mock
    private ClassRepository classRepository;

    @Mock
    private SchoolRepository schoolRepository;

    @Mock
    private TeacherRepository teacherRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ClassMapper classMapper;

    @InjectMocks
    private ClassServiceImpl classService;

    private Class classEntity;
    private ClassDTO classDTO;
    private School school;
    private Teacher teacher;
    private User student;

    @BeforeEach
    void setUp() {
        school = new School();
        school.setId(1L);
        school.setName("Test School");

        teacher = new Teacher();
        teacher.setId(1L);
        teacher.setFirstName("John");
        teacher.setLastName("Doe");
        teacher.setEmail("john.doe@example.com");
        teacher.setStaffId("T001");

        student = new User();
        student.setId(2L);
        student.setUsername("student1");
        student.setRole(UserRole.STUDENT);

        classEntity = new Class();
        classEntity.setId(1L);
        classEntity.setName("Test Class");
        classEntity.setDescription("Test Description");
        classEntity.setSchool(school);
        classEntity.setTeachers(new HashSet<>(Arrays.asList(teacher)));
        classEntity.setStudents(new HashSet<>(Arrays.asList(student)));
        classEntity.setActive(true);

        classDTO = new ClassDTO(
            1L,
            "Test Class",
            "Test Description",
            GradeLevel.STANDARD_1,
            30,
            25,
            5,
            false,
            1L,
            new HashSet<>(Arrays.asList(1L)),
            new HashSet<>(Arrays.asList(2L)),
            true
        );
    }

    @Test
    void getClassById_ShouldReturnClass_WhenExists() {
        when(classRepository.findById(1L)).thenReturn(Optional.of(classEntity));
        when(classMapper.toDto(classEntity)).thenReturn(classDTO);

        ClassDTO result = classService.getById(1L);

        assertNotNull(result);
        assertEquals(classDTO, result);
        verify(classRepository).findById(1L);
        verify(classMapper).toDto(classEntity);
    }

    @Test
    void getClassById_ShouldThrowException_WhenNotFound() {
        when(classRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> classService.getById(1L));
        verify(classRepository).findById(1L);
        verify(classMapper, never()).toDto(any());
    }

    @Test
    void getClassesBySchoolId_ShouldReturnClasses() {
        List<Class> classes = Arrays.asList(classEntity);
        when(classRepository.findBySchoolId(1L)).thenReturn(classes);
        when(classMapper.toDto(classEntity)).thenReturn(classDTO);

        List<ClassDTO> result = classService.getClassesBySchoolId(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(classDTO, result.get(0));
        verify(classRepository).findBySchoolId(1L);
        verify(classMapper).toDto(classEntity);
    }

    @Test
    void getActiveClassesBySchoolId_ShouldReturnActiveClasses() {
        List<Class> classes = Arrays.asList(classEntity);
        when(classRepository.findBySchoolIdAndActive(1L, true)).thenReturn(classes);
        when(classMapper.toDto(classEntity)).thenReturn(classDTO);

        List<ClassDTO> result = classService.getActiveClassesBySchoolId(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(classDTO, result.get(0));
        verify(classRepository).findBySchoolIdAndActive(1L, true);
        verify(classMapper).toDto(classEntity);
    }

    @Test
    void getClassesBySchoolIdAndTeacherId_ShouldReturnClasses() {
        List<Class> classes = Arrays.asList(classEntity);
        when(classRepository.findBySchoolIdAndTeacherId(1L, 1L)).thenReturn(classes);
        when(classMapper.toDto(classEntity)).thenReturn(classDTO);

        List<ClassDTO> result = classService.getClassesBySchoolIdAndTeacherId(1L, 1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(classDTO, result.get(0));
        verify(classRepository).findBySchoolIdAndTeacherId(1L, 1L);
        verify(classMapper).toDto(classEntity);
    }

    @Test
    void getClassesBySchoolIdAndStudentId_ShouldReturnClasses() {
        List<Class> classes = Arrays.asList(classEntity);
        when(classRepository.findBySchoolIdAndStudentId(1L, 2L)).thenReturn(classes);
        when(classMapper.toDto(classEntity)).thenReturn(classDTO);

        List<ClassDTO> result = classService.getClassesBySchoolIdAndStudentId(1L, 2L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(classDTO, result.get(0));
        verify(classRepository).findBySchoolIdAndStudentId(1L, 2L);
        verify(classMapper).toDto(classEntity);
    }

    @Test
    void createClass_ShouldCreateNewClass() {
        when(schoolRepository.findById(1L)).thenReturn(Optional.of(school));
        when(teacherRepository.findById(1L)).thenReturn(Optional.of(teacher));
        when(userRepository.findById(2L)).thenReturn(Optional.of(student));
        when(classMapper.toEntity(classDTO)).thenReturn(classEntity);
        when(classRepository.save(classEntity)).thenReturn(classEntity);
        when(classMapper.toDto(classEntity)).thenReturn(classDTO);

        ClassDTO result = classService.createClass(classDTO);

        assertNotNull(result);
        assertEquals(classDTO, result);
        verify(schoolRepository).findById(1L);
        verify(teacherRepository).findById(1L);
        verify(userRepository).findById(2L);
        verify(classMapper).toEntity(classDTO);
        verify(classRepository).save(classEntity);
        verify(classMapper).toDto(classEntity);
    }

    @Test
    void createClass_ShouldThrowException_WhenSchoolNotFound() {
        when(schoolRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> classService.createClass(classDTO));
        verify(schoolRepository).findById(1L);
        verify(classMapper, never()).toEntity(any());
        verify(classRepository, never()).save(any());
    }

    @Test
    void updateClass_ShouldUpdateExistingClass() {
        when(classRepository.findById(1L)).thenReturn(Optional.of(classEntity));
        when(schoolRepository.findById(1L)).thenReturn(Optional.of(school));
        when(teacherRepository.findById(1L)).thenReturn(Optional.of(teacher));
        when(userRepository.findById(2L)).thenReturn(Optional.of(student));
        when(classRepository.save(any(Class.class))).thenReturn(classEntity);
        when(classMapper.toDto(classEntity)).thenReturn(classDTO);

        ClassDTO result = classService.updateClass(1L, classDTO);

        assertNotNull(result);
        assertEquals(classDTO, result);
        verify(classRepository).findById(1L);
        verify(schoolRepository).findById(1L);
        verify(teacherRepository).findById(1L);
        verify(userRepository).findById(2L);
        verify(classRepository).save(any(Class.class));
        verify(classMapper).toDto(classEntity);
    }

    @Test
    void updateClass_ShouldThrowException_WhenNotFound() {
        when(classRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> classService.updateClass(1L, classDTO));
        verify(classRepository).findById(1L);
        verify(classRepository, never()).save(any());
    }

    @Test
    void deleteClass_ShouldDeleteClass() {
        when(classRepository.existsById(1L)).thenReturn(true);

        classService.deleteClass(1L);

        verify(classRepository).existsById(1L);
        verify(classRepository).deleteById(1L);
    }

    @Test
    void deleteClass_ShouldThrowException_WhenNotFound() {
        when(classRepository.existsById(1L)).thenReturn(false);

        assertThrows(EntityNotFoundException.class, () -> classService.deleteClass(1L));
        verify(classRepository).existsById(1L);
        verify(classRepository, never()).deleteById(any());
    }

    @Test
    void deactivateClass_ShouldDeactivateClass() {
        when(classRepository.findById(1L)).thenReturn(Optional.of(classEntity));
        when(classRepository.save(classEntity)).thenReturn(classEntity);

        classService.deactivateClass(1L);

        assertFalse(classEntity.isActive());
        verify(classRepository).findById(1L);
        verify(classRepository).save(classEntity);
    }

    @Test
    void activateClass_ShouldActivateClass() {
        classEntity.setActive(false);
        when(classRepository.findById(1L)).thenReturn(Optional.of(classEntity));
        when(classRepository.save(classEntity)).thenReturn(classEntity);

        classService.activateClass(1L);

        assertTrue(classEntity.isActive());
        verify(classRepository).findById(1L);
        verify(classRepository).save(classEntity);
    }

    @Test
    void addTeacherToClass_ShouldAddTeacher() {
        when(classRepository.findById(1L)).thenReturn(Optional.of(classEntity));
        when(teacherRepository.findById(1L)).thenReturn(Optional.of(teacher));
        when(classRepository.save(classEntity)).thenReturn(classEntity);

        classService.addTeacherToClass(1L, 1L);

        assertTrue(classEntity.getTeachers().contains(teacher));
        verify(classRepository).findById(1L);
        verify(teacherRepository).findById(1L);
        verify(classRepository).save(classEntity);
    }

    @Test
    void removeTeacherFromClass_ShouldRemoveTeacher() {
        when(classRepository.findById(1L)).thenReturn(Optional.of(classEntity));
        when(teacherRepository.findById(1L)).thenReturn(Optional.of(teacher));
        when(classRepository.save(classEntity)).thenReturn(classEntity);

        classService.removeTeacherFromClass(1L, 1L);

        assertFalse(classEntity.getTeachers().contains(teacher));
        verify(classRepository).findById(1L);
        verify(teacherRepository).findById(1L);
        verify(classRepository).save(classEntity);
    }

    @Test
    void addStudentToClass_ShouldAddStudent() {
        when(classRepository.findById(1L)).thenReturn(Optional.of(classEntity));
        when(userRepository.findById(2L)).thenReturn(Optional.of(student));
        when(classRepository.save(classEntity)).thenReturn(classEntity);

        classService.addStudentToClass(1L, 2L);

        assertTrue(classEntity.getStudents().contains(student));
        verify(classRepository).findById(1L);
        verify(userRepository).findById(2L);
        verify(classRepository).save(classEntity);
    }

    @Test
    void removeStudentFromClass_ShouldRemoveStudent() {
        when(classRepository.findById(1L)).thenReturn(Optional.of(classEntity));
        when(userRepository.findById(2L)).thenReturn(Optional.of(student));
        when(classRepository.save(classEntity)).thenReturn(classEntity);

        classService.removeStudentFromClass(1L, 2L);

        assertFalse(classEntity.getStudents().contains(student));
        verify(classRepository).findById(1L);
        verify(userRepository).findById(2L);
        verify(classRepository).save(classEntity);
    }
} 