package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.AttendanceRecordDTO;
import com.ohma.thutothebe.dto.BulkAttendanceDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.AttendanceRecordMapper;
import com.ohma.thutothebe.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AttendanceRecordServiceImplTest {

    @Mock
    private AttendanceRecordRepository attendanceRecordRepository;

    @Mock
    private AttendanceRecordMapper attendanceRecordMapper;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ClassRepository classRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private SubjectRepository subjectRepository;

    @InjectMocks
    private AttendanceRecordServiceImpl attendanceRecordService;

    private AttendanceRecord attendanceRecord;
    private AttendanceRecordDTO attendanceRecordDTO;
    private User student;
    private User teacher;
    private com.ohma.thutothebe.entity.Class classEntity;
    private Course course;
    private Subject subject;

    @BeforeEach
    void setUp() {
        // Setup test entities
        student = new User();
        student.setId(1L);
        student.setFirstName("John");
        student.setLastName("Doe");

        teacher = new User();
        teacher.setId(2L);
        teacher.setFirstName("Jane");
        teacher.setLastName("Smith");

        classEntity = new com.ohma.thutothebe.entity.Class();
        classEntity.setId(1L);
        classEntity.setName("Grade 10A");

        course = new Course();
        course.setId(1L);
        course.setName("Mathematics");

        subject = new Subject();
        subject.setId(1L);
        subject.setName("Algebra");

        // Setup test attendance record
        attendanceRecord = new AttendanceRecord();
        attendanceRecord.setId(1L);
        attendanceRecord.setStudent(student);
        attendanceRecord.setClassEntity(classEntity);
        attendanceRecord.setCourse(course);
        attendanceRecord.setSubject(subject);
        attendanceRecord.setMarkedBy(teacher);
        attendanceRecord.setAttendanceDate(LocalDate.now());
        attendanceRecord.setAttendanceStatus(AttendanceStatus.PRESENT);
        attendanceRecord.setAttendanceType(AttendanceType.PERIOD);
        attendanceRecord.setPeriodNumber(1);
        attendanceRecord.setAcademicYear(2024);
        attendanceRecord.setTerm(Term.FIRST_TERM);
        attendanceRecord.setActive(true);

        // Setup test DTO
        attendanceRecordDTO = new AttendanceRecordDTO(
            1L,
            1L,
            "John Doe",
            1L,
            "Grade 10A",
            1L,
            "Mathematics",
            1L,
            "Algebra",
            2L,
            "Jane Smith",
            LocalDate.now(),
            AttendanceStatus.PRESENT,
            AttendanceType.PERIOD,
            1,
            LocalTime.of(8, 0),
            LocalTime.of(9, 0),
            LocalDateTime.now(),
            null,
            null,
            null,
            2024,
            Term.FIRST_TERM,
            false,
            null,
            null,
            null,
            null,
            true,
            LocalDateTime.now(),
            LocalDateTime.now()
        );
    }

    @Test
    void testGetAttendanceByStudent() {
        // Given
        Long studentId = 1L;
        List<AttendanceRecord> records = Arrays.asList(attendanceRecord);
        List<AttendanceRecordDTO> expectedDTOs = Arrays.asList(attendanceRecordDTO);

        when(attendanceRecordRepository.findByStudentIdAndActive(studentId)).thenReturn(records);
        when(attendanceRecordMapper.toDto(attendanceRecord)).thenReturn(attendanceRecordDTO);

        // When
        List<AttendanceRecordDTO> result = attendanceRecordService.getAttendanceByStudent(studentId);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(expectedDTOs.get(0), result.get(0));
        verify(attendanceRecordRepository).findByStudentIdAndActive(studentId);
        verify(attendanceRecordMapper).toDto(attendanceRecord);
    }

    @Test
    void testGetAttendanceByStudentAndDate() {
        // Given
        Long studentId = 1L;
        LocalDate date = LocalDate.now();
        List<AttendanceRecord> records = Arrays.asList(attendanceRecord);

        when(attendanceRecordRepository.findByStudentIdAndDate(studentId, date)).thenReturn(records);
        when(attendanceRecordMapper.toDto(attendanceRecord)).thenReturn(attendanceRecordDTO);

        // When
        List<AttendanceRecordDTO> result = attendanceRecordService.getAttendanceByStudentAndDate(studentId, date);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(attendanceRecordRepository).findByStudentIdAndDate(studentId, date);
    }

    @Test
    void testGetAttendanceByClass() {
        // Given
        Long classId = 1L;
        List<AttendanceRecord> records = Arrays.asList(attendanceRecord);

        when(attendanceRecordRepository.findByClassIdAndActive(classId)).thenReturn(records);
        when(attendanceRecordMapper.toDto(attendanceRecord)).thenReturn(attendanceRecordDTO);

        // When
        List<AttendanceRecordDTO> result = attendanceRecordService.getAttendanceByClass(classId);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(attendanceRecordRepository).findByClassIdAndActive(classId);
    }

    @Test
    void testMarkBulkAttendance() {
        // Given
        BulkAttendanceDTO.StudentAttendanceDTO studentAttendance = 
            new BulkAttendanceDTO.StudentAttendanceDTO(1L, AttendanceStatus.PRESENT, null, null, null);
        
        BulkAttendanceDTO bulkAttendanceDTO = new BulkAttendanceDTO(
            1L, // classId
            1L, // courseId
            1L, // subjectId
            LocalDate.now(),
            AttendanceType.PERIOD,
            1,
            LocalTime.of(8, 0),
            LocalTime.of(9, 0),
            2024,
            Term.FIRST_TERM,
            2L, // markedById
            Arrays.asList(studentAttendance)
        );

        when(attendanceRecordRepository.findExistingAttendance(any(), any(), any(), any(), any()))
            .thenReturn(Optional.empty());
        when(userRepository.findById(1L)).thenReturn(Optional.of(student));
        when(userRepository.findById(2L)).thenReturn(Optional.of(teacher));
        when(classRepository.findById(1L)).thenReturn(Optional.of(classEntity));
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        when(subjectRepository.findById(1L)).thenReturn(Optional.of(subject));
        when(attendanceRecordRepository.saveAll(any())).thenReturn(Arrays.asList(attendanceRecord));
        when(attendanceRecordMapper.toDto(attendanceRecord)).thenReturn(attendanceRecordDTO);

        // When
        List<AttendanceRecordDTO> result = attendanceRecordService.markBulkAttendance(bulkAttendanceDTO);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(attendanceRecordRepository).saveAll(any());
    }

    @Test
    void testMarkBulkAttendance_ExistingRecord() {
        // Given
        BulkAttendanceDTO.StudentAttendanceDTO studentAttendance = 
            new BulkAttendanceDTO.StudentAttendanceDTO(1L, AttendanceStatus.PRESENT, null, null, null);
        
        BulkAttendanceDTO bulkAttendanceDTO = new BulkAttendanceDTO(
            1L, 1L, 1L, LocalDate.now(), AttendanceType.PERIOD, 1,
            LocalTime.of(8, 0), LocalTime.of(9, 0), 2024, Term.FIRST_TERM, 2L,
            Arrays.asList(studentAttendance)
        );

        when(attendanceRecordRepository.findExistingAttendance(any(), any(), any(), any(), any()))
            .thenReturn(Optional.of(attendanceRecord));
        when(attendanceRecordRepository.saveAll(any())).thenReturn(Collections.emptyList());

        // When
        List<AttendanceRecordDTO> result = attendanceRecordService.markBulkAttendance(bulkAttendanceDTO);

        // Then
        assertNotNull(result);
        assertEquals(0, result.size());
        verify(attendanceRecordRepository).saveAll(any());
    }

    @Test
    void testModifyAttendance() {
        // Given
        Long attendanceId = 1L;
        String reason = "Correction needed";
        Long modifiedById = 2L;
        
        AttendanceRecordDTO updatedRecord = new AttendanceRecordDTO(
            1L, 1L, "John Doe", 1L, "Grade 10A", 1L, "Mathematics", 1L, "Algebra",
            2L, "Jane Smith", LocalDate.now(), AttendanceStatus.ABSENT_EXCUSED,
            AttendanceType.PERIOD, 1, LocalTime.of(8, 0), LocalTime.of(9, 0),
            LocalDateTime.now(), null, null, "Was sick", 2024, Term.FIRST_TERM,
            false, null, null, null, null, true, LocalDateTime.now(), LocalDateTime.now()
        );

        when(attendanceRecordRepository.findById(attendanceId)).thenReturn(Optional.of(attendanceRecord));
        when(userRepository.findById(modifiedById)).thenReturn(Optional.of(teacher));
        when(attendanceRecordRepository.save(any())).thenReturn(attendanceRecord);
        when(attendanceRecordMapper.toDto(attendanceRecord)).thenReturn(attendanceRecordDTO);

        // When
        AttendanceRecordDTO result = attendanceRecordService.modifyAttendance(attendanceId, updatedRecord, reason, modifiedById);

        // Then
        assertNotNull(result);
        verify(attendanceRecordRepository).findById(attendanceId);
        verify(attendanceRecordRepository).save(any());
        verify(userRepository).findById(modifiedById);
    }

    @Test
    void testModifyAttendance_NotFound() {
        // Given
        Long attendanceId = 999L;
        AttendanceRecordDTO updatedRecord = attendanceRecordDTO;
        String reason = "Correction";
        Long modifiedById = 2L;

        when(attendanceRecordRepository.findById(attendanceId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> {
            attendanceRecordService.modifyAttendance(attendanceId, updatedRecord, reason, modifiedById);
        });
    }

    @Test
    void testGetAttendanceStatsByStudent() {
        // Given
        Long studentId = 1L;
        Integer academicYear = 2024;

        when(attendanceRecordRepository.countByStudentIdAndStatusAndAcademicYear(studentId, AttendanceStatus.PRESENT, academicYear))
            .thenReturn(20L);
        when(attendanceRecordRepository.countByStudentIdAndStatusAndAcademicYear(studentId, AttendanceStatus.ABSENT_EXCUSED, academicYear))
            .thenReturn(2L);
        when(attendanceRecordRepository.countByStudentIdAndStatusAndAcademicYear(studentId, AttendanceStatus.ABSENT_UNEXCUSED, academicYear))
            .thenReturn(1L);
        when(attendanceRecordRepository.countByStudentIdAndStatusAndAcademicYear(studentId, AttendanceStatus.LATE, academicYear))
            .thenReturn(3L);
        when(attendanceRecordRepository.countByStudentIdAndStatusAndAcademicYear(studentId, AttendanceStatus.EARLY_DEPARTURE, academicYear))
            .thenReturn(1L);

        // When
        Map<AttendanceStatus, Long> result = attendanceRecordService.getAttendanceStatsByStudent(studentId, academicYear);

        // Then
        assertNotNull(result);
        assertEquals(5, result.size());
        assertEquals(20L, result.get(AttendanceStatus.PRESENT));
        assertEquals(2L, result.get(AttendanceStatus.ABSENT_EXCUSED));
        assertEquals(1L, result.get(AttendanceStatus.ABSENT_UNEXCUSED));
        assertEquals(3L, result.get(AttendanceStatus.LATE));
        assertEquals(1L, result.get(AttendanceStatus.EARLY_DEPARTURE));
    }

    @Test
    void testGetAttendancePercentageByStudent() {
        // Given
        Long studentId = 1L;
        Integer academicYear = 2024;

        when(attendanceRecordRepository.countByStudentIdAndStatusAndAcademicYear(studentId, AttendanceStatus.PRESENT, academicYear))
            .thenReturn(18L);
        when(attendanceRecordRepository.countByStudentIdAndStatusAndAcademicYear(studentId, AttendanceStatus.ABSENT_EXCUSED, academicYear))
            .thenReturn(1L);
        when(attendanceRecordRepository.countByStudentIdAndStatusAndAcademicYear(studentId, AttendanceStatus.ABSENT_UNEXCUSED, academicYear))
            .thenReturn(1L);
        when(attendanceRecordRepository.countByStudentIdAndStatusAndAcademicYear(studentId, AttendanceStatus.LATE, academicYear))
            .thenReturn(0L);
        when(attendanceRecordRepository.countByStudentIdAndStatusAndAcademicYear(studentId, AttendanceStatus.EARLY_DEPARTURE, academicYear))
            .thenReturn(0L);

        // When
        Double result = attendanceRecordService.getAttendancePercentageByStudent(studentId, academicYear);

        // Then
        assertNotNull(result);
        assertEquals(90.0, result, 0.01); // 18/20 = 90%
    }

    @Test
    void testGetAttendancePercentageByStudent_NoRecords() {
        // Given
        Long studentId = 1L;
        Integer academicYear = 2024;

        when(attendanceRecordRepository.countByStudentIdAndStatusAndAcademicYear(eq(studentId), any(), eq(academicYear)))
            .thenReturn(0L);

        // When
        Double result = attendanceRecordService.getAttendancePercentageByStudent(studentId, academicYear);

        // Then
        assertNotNull(result);
        assertEquals(0.0, result, 0.01);
    }

    @Test
    void testHasExistingAttendance() {
        // Given
        Long studentId = 1L;
        LocalDate date = LocalDate.now();
        AttendanceType type = AttendanceType.PERIOD;
        Long courseId = 1L;
        Integer periodNumber = 1;

        when(attendanceRecordRepository.findExistingAttendance(studentId, date, type, courseId, periodNumber))
            .thenReturn(Optional.of(attendanceRecord));

        // When
        boolean result = attendanceRecordService.hasExistingAttendance(studentId, date, type, courseId, periodNumber);

        // Then
        assertTrue(result);
        verify(attendanceRecordRepository).findExistingAttendance(studentId, date, type, courseId, periodNumber);
    }

    @Test
    void testHasExistingAttendance_NotFound() {
        // Given
        Long studentId = 1L;
        LocalDate date = LocalDate.now();
        AttendanceType type = AttendanceType.PERIOD;
        Long courseId = 1L;
        Integer periodNumber = 1;

        when(attendanceRecordRepository.findExistingAttendance(studentId, date, type, courseId, periodNumber))
            .thenReturn(Optional.empty());

        // When
        boolean result = attendanceRecordService.hasExistingAttendance(studentId, date, type, courseId, periodNumber);

        // Then
        assertFalse(result);
    }

    @Test
    void testGetExistingAttendance() {
        // Given
        Long studentId = 1L;
        LocalDate date = LocalDate.now();
        AttendanceType type = AttendanceType.PERIOD;
        Long courseId = 1L;
        Integer periodNumber = 1;

        when(attendanceRecordRepository.findExistingAttendance(studentId, date, type, courseId, periodNumber))
            .thenReturn(Optional.of(attendanceRecord));
        when(attendanceRecordMapper.toDto(attendanceRecord)).thenReturn(attendanceRecordDTO);

        // When
        AttendanceRecordDTO result = attendanceRecordService.getExistingAttendance(studentId, date, type, courseId, periodNumber);

        // Then
        assertNotNull(result);
        assertEquals(attendanceRecordDTO, result);
    }

    @Test
    void testGetExistingAttendance_NotFound() {
        // Given
        Long studentId = 1L;
        LocalDate date = LocalDate.now();
        AttendanceType type = AttendanceType.PERIOD;
        Long courseId = 1L;
        Integer periodNumber = 1;

        when(attendanceRecordRepository.findExistingAttendance(studentId, date, type, courseId, periodNumber))
            .thenReturn(Optional.empty());

        // When
        AttendanceRecordDTO result = attendanceRecordService.getExistingAttendance(studentId, date, type, courseId, periodNumber);

        // Then
        assertNull(result);
    }

    @Test
    void testGetModifiedRecords() {
        // Given
        List<AttendanceRecord> modifiedRecords = Arrays.asList(attendanceRecord);
        when(attendanceRecordRepository.findModifiedRecords()).thenReturn(modifiedRecords);
        when(attendanceRecordMapper.toDto(attendanceRecord)).thenReturn(attendanceRecordDTO);

        // When
        List<AttendanceRecordDTO> result = attendanceRecordService.getModifiedRecords();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(attendanceRecordRepository).findModifiedRecords();
    }

    @Test
    void testGetStudentsWithLowAttendance() {
        // Given
        Long classId = 1L;
        LocalDate startDate = LocalDate.of(2024, 1, 1);
        LocalDate endDate = LocalDate.of(2024, 12, 31);
        Double threshold = 75.0;

        List<Object[]> results = Arrays.asList(new Object[][]{new Object[]{1L, 10L}});
        when(attendanceRecordRepository.findStudentsWithLowAttendance(classId, startDate, endDate, threshold.longValue()))
            .thenReturn(results);

        // When
        List<Long> result = attendanceRecordService.getStudentsWithLowAttendance(classId, startDate, endDate, threshold);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(1L, result.get(0));
    }

    @Test
    void testQuickMarkAllPresent() {
        // Given
        Long classId = 1L;
        LocalDate date = LocalDate.now();
        AttendanceType type = AttendanceType.DAILY;
        Integer periodNumber = null;
        Long markedById = 2L;

        List<User> students = Arrays.asList(student);
        classEntity.setStudents(new HashSet<>(students));

        when(classRepository.findById(classId)).thenReturn(Optional.of(classEntity));
        when(userRepository.findById(markedById)).thenReturn(Optional.of(teacher));
        when(attendanceRecordRepository.findExistingAttendance(any(), any(), any(), any(), any()))
            .thenReturn(Optional.empty());
        when(attendanceRecordRepository.saveAll(any())).thenReturn(Arrays.asList(attendanceRecord));
        when(attendanceRecordMapper.toDto(attendanceRecord)).thenReturn(attendanceRecordDTO);

        // When
        List<AttendanceRecordDTO> result = attendanceRecordService.quickMarkAllPresent(classId, date, type, periodNumber, markedById);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(classRepository).findById(classId);
        verify(userRepository).findById(markedById);
        verify(attendanceRecordRepository).saveAll(any());
    }

    @Test
    void testQuickMarkAllPresent_ClassNotFound() {
        // Given
        Long classId = 999L;
        LocalDate date = LocalDate.now();
        AttendanceType type = AttendanceType.DAILY;
        Integer periodNumber = null;
        Long markedById = 2L;

        when(classRepository.findById(classId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> {
            attendanceRecordService.quickMarkAllPresent(classId, date, type, periodNumber, markedById);
        });
    }

    @Test
    void testQuickMarkAllAbsent() {
        // Given
        Long classId = 1L;
        LocalDate date = LocalDate.now();
        AttendanceType type = AttendanceType.DAILY;
        Integer periodNumber = null;
        Long markedById = 2L;
        AttendanceStatus absentType = AttendanceStatus.ABSENT_UNEXCUSED;

        List<User> students = Arrays.asList(student);
        classEntity.setStudents(new HashSet<>(students));

        when(classRepository.findById(classId)).thenReturn(Optional.of(classEntity));
        when(userRepository.findById(markedById)).thenReturn(Optional.of(teacher));
        when(attendanceRecordRepository.findExistingAttendance(any(), any(), any(), any(), any()))
            .thenReturn(Optional.empty());
        when(attendanceRecordRepository.saveAll(any())).thenReturn(Arrays.asList(attendanceRecord));
        when(attendanceRecordMapper.toDto(attendanceRecord)).thenReturn(attendanceRecordDTO);

        // When
        List<AttendanceRecordDTO> result = attendanceRecordService.quickMarkAllAbsent(classId, date, type, periodNumber, markedById, absentType);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(classRepository).findById(classId);
        verify(userRepository).findById(markedById);
        verify(attendanceRecordRepository).saveAll(any());
    }

    @Test
    void testGetAttendanceDashboardData() {
        // Given
        Long classId = 1L;
        LocalDate date = LocalDate.now();

        when(attendanceRecordRepository.countByClassIdAndDateAndStatus(classId, date, AttendanceStatus.PRESENT))
            .thenReturn(20L);
        when(attendanceRecordRepository.countByClassIdAndDateAndStatus(classId, date, AttendanceStatus.ABSENT_EXCUSED))
            .thenReturn(2L);
        when(attendanceRecordRepository.countByClassIdAndDateAndStatus(classId, date, AttendanceStatus.ABSENT_UNEXCUSED))
            .thenReturn(1L);
        when(attendanceRecordRepository.countByClassIdAndDateAndStatus(classId, date, AttendanceStatus.LATE))
            .thenReturn(2L);
        when(attendanceRecordRepository.countByClassIdAndDateAndStatus(classId, date, AttendanceStatus.EARLY_DEPARTURE))
            .thenReturn(0L);

        // When
        Map<String, Object> result = attendanceRecordService.getAttendanceDashboardData(classId, date);

        // Then
        assertNotNull(result);
        assertEquals(date, result.get("date"));
        assertEquals(classId, result.get("classId"));
        assertEquals(25L, result.get("totalStudents"));
        assertEquals(20L, result.get("presentCount"));
        assertEquals(3L, result.get("absentCount"));
        assertEquals(2L, result.get("lateCount"));
    }

    @Test
    void testUpdateBulkAttendance() {
        // Given
        BulkAttendanceDTO.StudentAttendanceDTO studentAttendance = 
            new BulkAttendanceDTO.StudentAttendanceDTO(1L, AttendanceStatus.ABSENT_EXCUSED, null, null, "Updated status");
        
        BulkAttendanceDTO bulkAttendanceDTO = new BulkAttendanceDTO(
            1L, 1L, 1L, LocalDate.now(), AttendanceType.PERIOD, 1,
            LocalTime.of(8, 0), LocalTime.of(9, 0), 2024, Term.FIRST_TERM, 2L,
            Arrays.asList(studentAttendance)
        );

        when(attendanceRecordRepository.findExistingAttendance(any(), any(), any(), any(), any()))
            .thenReturn(Optional.of(attendanceRecord));
        when(userRepository.findById(2L)).thenReturn(Optional.of(teacher));
        when(attendanceRecordRepository.saveAll(any())).thenReturn(Arrays.asList(attendanceRecord));
        when(attendanceRecordMapper.toDto(attendanceRecord)).thenReturn(attendanceRecordDTO);

        // When
        List<AttendanceRecordDTO> result = attendanceRecordService.updateBulkAttendance(bulkAttendanceDTO);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(attendanceRecordRepository).saveAll(any());
    }

    @Test
    void testGetAttendanceByDateRange() {
        // Given
        Long studentId = 1L;
        LocalDate startDate = LocalDate.of(2024, 1, 1);
        LocalDate endDate = LocalDate.of(2024, 1, 31);
        List<AttendanceRecord> records = Arrays.asList(attendanceRecord);

        when(attendanceRecordRepository.findByStudentIdAndDateRange(studentId, startDate, endDate))
            .thenReturn(records);
        when(attendanceRecordMapper.toDto(attendanceRecord)).thenReturn(attendanceRecordDTO);

        // When
        List<AttendanceRecordDTO> result = attendanceRecordService.getAttendanceByStudentAndDateRange(studentId, startDate, endDate);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(attendanceRecordRepository).findByStudentIdAndDateRange(studentId, startDate, endDate);
    }

    @Test
    void testGetAttendanceByAcademicYearAndTerm() {
        // Given
        Long studentId = 1L;
        Integer academicYear = 2024;
        Term term = Term.FIRST_TERM;
        List<AttendanceRecord> records = Arrays.asList(attendanceRecord);

        when(attendanceRecordRepository.findByStudentIdAndAcademicYearAndTerm(studentId, academicYear, term))
            .thenReturn(records);
        when(attendanceRecordMapper.toDto(attendanceRecord)).thenReturn(attendanceRecordDTO);

        // When
        List<AttendanceRecordDTO> result = attendanceRecordService.getAttendanceByStudentAndAcademicYearAndTerm(studentId, academicYear, term);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(attendanceRecordRepository).findByStudentIdAndAcademicYearAndTerm(studentId, academicYear, term);
    }
} 