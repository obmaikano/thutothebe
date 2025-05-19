package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.StudentDTO;
import com.ohma.thutothebe.dto.StudentOnboardingDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.entity.enums.StudentStatus;
import com.ohma.thutothebe.entity.enums.Gender;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.StudentMapper;
import com.ohma.thutothebe.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentServiceImplTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private SchoolRepository schoolRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ClassRepository classRepository;

    @Mock
    private SubjectRepository subjectRepository;

    @Mock
    private StudentMapper studentMapper;

    @InjectMocks
    private StudentServiceImpl studentService;

    private Student student;
    private StudentDTO studentDTO;
    private School school;
    private User user;
    private com.ohma.thutothebe.entity.Class classEntity;
    private Subject subject;

    @BeforeEach
    void setUp() {
        // Setup School
        school = new School();
        school.setId(1L);
        school.setName("Test School");

        // Setup User
        user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");

        // Setup Class
        classEntity = new com.ohma.thutothebe.entity.Class();
        classEntity.setId(1L);
        classEntity.setName("Test Class");

        // Setup Subject
        subject = new Subject();
        subject.setId(1L);
        subject.setName("Test Subject");

        // Setup Student
        student = new Student();
        student.setId(1L);
        student.setAdmissionNumber("STU-2024-0001");
        student.setFirstName("John");
        student.setLastName("Doe");
        student.setDateOfBirth(LocalDate.of(2000, 1, 1));
        student.setGender(Gender.MALE);
        student.setEmail("john.doe@example.com");
        student.setSchool(school);
        student.setUser(user);
        student.setStudentClass(classEntity);
        student.setStatus(StudentStatus.PENDING);
        student.setSubjects(new HashSet<>(Arrays.asList(subject)));

        // Setup StudentDTO
        studentDTO = new StudentDTO(
            1L,
            "STU-2024-0001",
            "John",
            "Doe",
            LocalDate.of(2000, 1, 1),
            Gender.MALE,
            "1234567890",
            "john.doe@example.com",
            "123 Test St",
            2024,
            1L,
            null,
            null,
            "Emergency Contact",
            "9876543210",
            "Parent",
            1L,
            1L,
            null,
            true,
            StudentStatus.PENDING,
            null,
            new HashSet<>(Arrays.asList(1L))
        );
    }

    @Test
    void createStudent_Success() {
        when(studentMapper.toEntity(any(StudentDTO.class))).thenReturn(student);
        when(studentRepository.save(any(Student.class))).thenReturn(student);
        when(studentMapper.toDto(any(Student.class))).thenReturn(studentDTO);

        StudentDTO result = studentService.createStudent(studentDTO);

        assertNotNull(result);
        assertEquals(studentDTO.admissionNumber(), result.admissionNumber());
        assertEquals(studentDTO.firstName(), result.firstName());
        assertEquals(studentDTO.lastName(), result.lastName());
        verify(studentRepository).save(any(Student.class));
    }

    @Test
    void getStudentByAdmissionNumber_Success() {
        when(studentRepository.findByAdmissionNumber("STU-2024-0001")).thenReturn(Optional.of(student));
        when(studentMapper.toDto(student)).thenReturn(studentDTO);

        StudentDTO result = studentService.getStudentByAdmissionNumber("STU-2024-0001");

        assertNotNull(result);
        assertEquals("STU-2024-0001", result.admissionNumber());
    }

    @Test
    void getStudentByAdmissionNumber_NotFound() {
        when(studentRepository.findByAdmissionNumber("INVALID")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> 
            studentService.getStudentByAdmissionNumber("INVALID")
        );
    }

    @Test
    void getStudentByEmail_Success() {
        when(studentRepository.findByEmail("john.doe@example.com")).thenReturn(Optional.of(student));
        when(studentMapper.toDto(student)).thenReturn(studentDTO);

        StudentDTO result = studentService.getStudentByEmail("john.doe@example.com");

        assertNotNull(result);
        assertEquals("john.doe@example.com", result.email());
    }

    @Test
    void getStudentByEmail_NotFound() {
        when(studentRepository.findByEmail("invalid@example.com")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> 
            studentService.getStudentByEmail("invalid@example.com")
        );
    }

    @Test
    void getStudentByUserId_Success() {
        when(studentRepository.findByUser_Id(1L)).thenReturn(Optional.of(student));
        when(studentMapper.toDto(student)).thenReturn(studentDTO);

        StudentDTO result = studentService.getStudentByUserId(1L);

        assertNotNull(result);
        assertEquals(1L, result.userId());
    }

    @Test
    void getStudentByUserId_NotFound() {
        when(studentRepository.findByUser_Id(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> 
            studentService.getStudentByUserId(999L)
        );
    }

    @Test
    void getActiveStudents_Success() {
        List<Student> students = Arrays.asList(student);
        when(studentRepository.findByActive(true)).thenReturn(students);
        when(studentMapper.toDto(any(Student.class))).thenReturn(studentDTO);

        List<StudentDTO> results = studentService.getActiveStudents();

        assertNotNull(results);
        assertFalse(results.isEmpty());
        assertEquals(1, results.size());
    }

    @Test
    void getStudentsBySchoolId_Success() {
        List<Student> students = Arrays.asList(student);
        when(studentRepository.findBySchool_Id(1L)).thenReturn(students);
        when(studentMapper.toDto(any(Student.class))).thenReturn(studentDTO);

        List<StudentDTO> results = studentService.getStudentsBySchoolId(1L);

        assertNotNull(results);
        assertFalse(results.isEmpty());
        assertEquals(1, results.size());
    }

    @Test
    void getStudentsByClassId_Success() {
        List<Student> students = Arrays.asList(student);
        when(studentRepository.findByStudentClass_Id(1L)).thenReturn(students);
        when(studentMapper.toDto(any(Student.class))).thenReturn(studentDTO);

        List<StudentDTO> results = studentService.getStudentsByClassId(1L);

        assertNotNull(results);
        assertFalse(results.isEmpty());
        assertEquals(1, results.size());
    }

    @Test
    void getStudentsBySubjectId_Success() {
        List<Student> students = Arrays.asList(student);
        when(studentRepository.findBySubjects_Id(1L)).thenReturn(students);
        when(studentMapper.toDto(any(Student.class))).thenReturn(studentDTO);

        List<StudentDTO> results = studentService.getStudentsBySubjectId(1L);

        assertNotNull(results);
        assertFalse(results.isEmpty());
        assertEquals(1, results.size());
    }

    @Test
    void linkToUser_Success() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(studentRepository.save(any(Student.class))).thenReturn(student);
        when(studentMapper.toDto(any(Student.class))).thenReturn(studentDTO);

        StudentDTO result = studentService.linkToUser(1L, 1L);

        assertNotNull(result);
        assertEquals(1L, result.userId());
        verify(studentRepository).save(any(Student.class));
    }

    @Test
    void activateStudent_Success() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(studentRepository.save(any(Student.class))).thenReturn(student);
        when(studentMapper.toDto(any(Student.class))).thenReturn(studentDTO);

        studentService.activateStudent(1L);

        verify(studentRepository).save(any(Student.class));
    }

    @Test
    void deactivateStudent_Success() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(studentRepository.save(any(Student.class))).thenReturn(student);
        when(studentMapper.toDto(any(Student.class))).thenReturn(studentDTO);

        studentService.deactivateStudent(1L);

        verify(studentRepository).save(any(Student.class));
    }

    @Test
    void onboardStudent_Success() {
        StudentOnboardingDTO onboardingDTO = new StudentOnboardingDTO(
            1L,
            1L,
            new HashSet<>(Arrays.asList(1L)),
            StudentStatus.ACTIVE,
            "Test notes"
        );

        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(classRepository.findById(1L)).thenReturn(Optional.of(classEntity));
        when(subjectRepository.findById(1L)).thenReturn(Optional.of(subject));
        when(studentRepository.save(any(Student.class))).thenReturn(student);
        when(studentMapper.toDto(any(Student.class))).thenReturn(studentDTO);

        StudentDTO result = studentService.onboardStudent(onboardingDTO);

        assertNotNull(result);
        assertEquals(1L, result.classId());
        verify(studentRepository).save(any(Student.class));
    }
} 