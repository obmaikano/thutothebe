package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.AttendanceSummaryDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.entity.AttendanceSummary.AttendanceSummaryType;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.AttendanceSummaryMapper;
import com.ohma.thutothebe.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AttendanceSummaryServiceImplTest {

    @Mock
    private AttendanceSummaryRepository attendanceSummaryRepository;

    @Mock
    private AttendanceSummaryMapper attendanceSummaryMapper;

    @Mock
    private AttendanceRecordRepository attendanceRecordRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ClassRepository classRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private SubjectRepository subjectRepository;

    @InjectMocks
    private AttendanceSummaryServiceImpl attendanceSummaryService;

    private AttendanceSummary testSummary;
    private AttendanceSummaryDTO testSummaryDTO;
    private User testStudent;
    private com.ohma.thutothebe.entity.Class testClass;
    private Course testCourse;
    private AttendanceRecord testRecord;

    @BeforeEach
    void setUp() {
        // Setup test entities
        testStudent = new User();
        testStudent.setId(1L);
        testStudent.setFirstName("John");
        testStudent.setLastName("Doe");

        testClass = new com.ohma.thutothebe.entity.Class();
        testClass.setId(1L);
        testClass.setName("Grade 10A");

        testCourse = new Course();
        testCourse.setId(1L);
        testCourse.setName("Mathematics");

        testSummary = new AttendanceSummary();
        testSummary.setId(1L);
        testSummary.setStudent(testStudent);
        testSummary.setClassEntity(testClass);
        testSummary.setCourse(testCourse);
        testSummary.setAcademicYear(2024);
        testSummary.setTerm(Term.FIRST_TERM);
        testSummary.setSummaryType(AttendanceSummaryType.TERM);
        testSummary.setTotalDays(20);
        testSummary.setPresentDays(18);
        testSummary.setAbsentExcusedDays(1);
        testSummary.setAbsentUnexcusedDays(1);
        testSummary.setLateDays(0);
        testSummary.setEarlyDepartureDays(0);
        testSummary.setAttendancePercentage(90.0);
        testSummary.setActive(true);

        testSummaryDTO = new AttendanceSummaryDTO(
                1L,                                    // id
                1L,                                    // studentId
                "John Doe",                           // studentName
                1L,                                    // classId
                "Grade 10A",                          // className
                1L,                                    // courseId
                "Mathematics",                        // courseName
                null,                                 // subjectId
                null,                                 // subjectName
                2024,                                 // academicYear
                Term.FIRST_TERM,                      // term
                AttendanceSummaryType.TERM,           // summaryType
                20,                                   // totalDays
                18,                                   // presentDays
                1,                                    // absentExcusedDays
                1,                                    // absentUnexcusedDays
                0,                                    // lateDays
                0,                                    // earlyDepartureDays
                90.0,                                 // attendancePercentage
                LocalDate.now().minusDays(30),        // periodFrom
                LocalDate.now(),                      // periodTo
                LocalDate.now(),                      // lastCalculatedDate
                true,                                 // active
                LocalDate.now().atStartOfDay(),       // createdAt (LocalDateTime)
                LocalDate.now().atStartOfDay()        // modifiedAt (LocalDateTime)
        );

        testRecord = new AttendanceRecord();
        testRecord.setId(1L);
        testRecord.setStudent(testStudent);
        testRecord.setClassEntity(testClass);
        testRecord.setCourse(testCourse);
        testRecord.setAttendanceStatus(AttendanceStatus.PRESENT);
        testRecord.setAttendanceDate(LocalDate.now());
        testRecord.setAcademicYear(2024);
        testRecord.setTerm(Term.FIRST_TERM);
    }

    @Test
    void testGetSummariesByStudent() {
        // Given
        Long studentId = 1L;
        List<AttendanceSummary> summaries = Arrays.asList(testSummary);
        when(attendanceSummaryRepository.findByStudentIdAndActive(studentId)).thenReturn(summaries);
        when(attendanceSummaryMapper.toDto(testSummary)).thenReturn(testSummaryDTO);

        // When
        List<AttendanceSummaryDTO> result = attendanceSummaryService.getSummariesByStudent(studentId);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testSummaryDTO, result.get(0));
        verify(attendanceSummaryRepository).findByStudentIdAndActive(studentId);
        verify(attendanceSummaryMapper).toDto(testSummary);
    }

    @Test
    void testGetSummariesByStudentAndAcademicYear() {
        // Given
        Long studentId = 1L;
        Integer academicYear = 2024;
        List<AttendanceSummary> summaries = Arrays.asList(testSummary);
        when(attendanceSummaryRepository.findByStudentIdAndAcademicYear(studentId, academicYear)).thenReturn(summaries);
        when(attendanceSummaryMapper.toDto(testSummary)).thenReturn(testSummaryDTO);

        // When
        List<AttendanceSummaryDTO> result = attendanceSummaryService.getSummariesByStudentAndAcademicYear(studentId, academicYear);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testSummaryDTO, result.get(0));
        verify(attendanceSummaryRepository).findByStudentIdAndAcademicYear(studentId, academicYear);
    }

    @Test
    void testGetSummariesByClass() {
        // Given
        Long classId = 1L;
        List<AttendanceSummary> summaries = Arrays.asList(testSummary);
        when(attendanceSummaryRepository.findByClassIdAndActive(classId)).thenReturn(summaries);
        when(attendanceSummaryMapper.toDto(testSummary)).thenReturn(testSummaryDTO);

        // When
        List<AttendanceSummaryDTO> result = attendanceSummaryService.getSummariesByClass(classId);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testSummaryDTO, result.get(0));
        verify(attendanceSummaryRepository).findByClassIdAndActive(classId);
    }

    @Test
    void testGetStudentsWithLowAttendance() {
        // Given
        Double threshold = 75.0;
        List<AttendanceSummary> summaries = Arrays.asList(testSummary);
        when(attendanceSummaryRepository.findByAttendancePercentageLessThan(threshold)).thenReturn(summaries);
        when(attendanceSummaryMapper.toDto(testSummary)).thenReturn(testSummaryDTO);

        // When
        List<AttendanceSummaryDTO> result = attendanceSummaryService.getStudentsWithLowAttendance(threshold);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(attendanceSummaryRepository).findByAttendancePercentageLessThan(threshold);
    }

    @Test
    void testGetAverageAttendancePercentageByClass() {
        // Given
        Long classId = 1L;
        Integer academicYear = 2024;
        Term term = Term.FIRST_TERM;
        Double expectedAverage = 85.5;
        when(attendanceSummaryRepository.getAverageAttendancePercentageByClassAndAcademicYearAndTerm(classId, academicYear, term))
                .thenReturn(expectedAverage);

        // When
        Double result = attendanceSummaryService.getAverageAttendancePercentageByClass(classId, academicYear, term);

        // Then
        assertEquals(expectedAverage, result);
        verify(attendanceSummaryRepository).getAverageAttendancePercentageByClassAndAcademicYearAndTerm(classId, academicYear, term);
    }

    @Test
    void testGetAverageAttendancePercentageByClassReturnsZeroWhenNull() {
        // Given
        Long classId = 1L;
        Integer academicYear = 2024;
        Term term = Term.FIRST_TERM;
        when(attendanceSummaryRepository.getAverageAttendancePercentageByClassAndAcademicYearAndTerm(classId, academicYear, term))
                .thenReturn(null);

        // When
        Double result = attendanceSummaryService.getAverageAttendancePercentageByClass(classId, academicYear, term);

        // Then
        assertEquals(0.0, result);
    }

    @Test
    void testGenerateSummaryForStudent() {
        // Given
        Long studentId = 1L;
        Long classId = 1L;
        Integer academicYear = 2024;
        Term term = Term.FIRST_TERM;
        AttendanceSummaryType summaryType = AttendanceSummaryType.TERM;

        List<AttendanceRecord> records = Arrays.asList(testRecord);
        
        when(userRepository.findById(studentId)).thenReturn(Optional.of(testStudent));
        when(classRepository.findById(classId)).thenReturn(Optional.of(testClass));
        when(attendanceRecordRepository.findByStudentIdAndAcademicYearAndTerm(studentId, academicYear, term))
                .thenReturn(records);
        when(attendanceSummaryRepository.save(any(AttendanceSummary.class))).thenReturn(testSummary);
        when(attendanceSummaryMapper.toDto(testSummary)).thenReturn(testSummaryDTO);

        // When
        AttendanceSummaryDTO result = attendanceSummaryService.generateSummaryForStudent(studentId, classId, academicYear, term, summaryType);

        // Then
        assertNotNull(result);
        assertEquals(testSummaryDTO, result);
        verify(userRepository).findById(studentId);
        verify(classRepository).findById(classId);
        verify(attendanceRecordRepository).findByStudentIdAndAcademicYearAndTerm(studentId, academicYear, term);
        verify(attendanceSummaryRepository).save(any(AttendanceSummary.class));
    }

    @Test
    void testGenerateSummaryForStudentThrowsExceptionWhenStudentNotFound() {
        // Given
        Long studentId = 999L;
        Long classId = 1L;
        Integer academicYear = 2024;
        Term term = Term.FIRST_TERM;
        AttendanceSummaryType summaryType = AttendanceSummaryType.TERM;

        when(userRepository.findById(studentId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> {
            attendanceSummaryService.generateSummaryForStudent(studentId, classId, academicYear, term, summaryType);
        });
        verify(userRepository).findById(studentId);
        verify(classRepository, never()).findById(any());
    }

    @Test
    void testGenerateSummaryForStudentAndCourse() {
        // Given
        Long studentId = 1L;
        Long courseId = 1L;
        Integer academicYear = 2024;
        Term term = Term.FIRST_TERM;
        AttendanceSummaryType summaryType = AttendanceSummaryType.COURSE_SPECIFIC;

        List<AttendanceRecord> records = Arrays.asList(testRecord);
        
        when(userRepository.findById(studentId)).thenReturn(Optional.of(testStudent));
        when(courseRepository.findById(courseId)).thenReturn(Optional.of(testCourse));
        when(attendanceRecordRepository.findByCourseIdAndActive(courseId)).thenReturn(records);
        when(attendanceSummaryRepository.save(any(AttendanceSummary.class))).thenReturn(testSummary);
        when(attendanceSummaryMapper.toDto(testSummary)).thenReturn(testSummaryDTO);

        // When
        AttendanceSummaryDTO result = attendanceSummaryService.generateSummaryForStudentAndCourse(studentId, courseId, academicYear, term, summaryType);

        // Then
        assertNotNull(result);
        assertEquals(testSummaryDTO, result);
        verify(userRepository).findById(studentId);
        verify(courseRepository).findById(courseId);
        verify(attendanceRecordRepository).findByCourseIdAndActive(courseId);
        verify(attendanceSummaryRepository).save(any(AttendanceSummary.class));
    }

    @Test
    void testGenerateSummaryForStudentAndCourseThrowsExceptionWhenNoRecords() {
        // Given
        Long studentId = 1L;
        Long courseId = 1L;
        Integer academicYear = 2024;
        Term term = Term.FIRST_TERM;
        AttendanceSummaryType summaryType = AttendanceSummaryType.COURSE_SPECIFIC;

        when(userRepository.findById(studentId)).thenReturn(Optional.of(testStudent));
        when(courseRepository.findById(courseId)).thenReturn(Optional.of(testCourse));
        when(attendanceRecordRepository.findByCourseIdAndActive(courseId)).thenReturn(Collections.emptyList());

        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> {
            attendanceSummaryService.generateSummaryForStudentAndCourse(studentId, courseId, academicYear, term, summaryType);
        });
    }

    @Test
    void testGenerateSummariesForClass() {
        // Given
        Long classId = 1L;
        Integer academicYear = 2024;
        Term term = Term.FIRST_TERM;
        AttendanceSummaryType summaryType = AttendanceSummaryType.TERM;

        Set<User> students = new HashSet<>(Arrays.asList(testStudent));
        testClass.setStudents(students);
        
        List<AttendanceRecord> records = Arrays.asList(testRecord);
        List<AttendanceSummary> savedSummaries = Arrays.asList(testSummary);
        
        when(classRepository.findById(classId)).thenReturn(Optional.of(testClass));
        when(attendanceRecordRepository.findByStudentIdAndAcademicYearAndTerm(testStudent.getId(), academicYear, term))
                .thenReturn(records);
        when(attendanceSummaryRepository.saveAll(any())).thenReturn(savedSummaries);
        when(attendanceSummaryMapper.toDto(testSummary)).thenReturn(testSummaryDTO);

        // When
        List<AttendanceSummaryDTO> result = attendanceSummaryService.generateSummariesForClass(classId, academicYear, term, summaryType);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testSummaryDTO, result.get(0));
        verify(classRepository).findById(classId);
        verify(attendanceRecordRepository).findByStudentIdAndAcademicYearAndTerm(testStudent.getId(), academicYear, term);
        verify(attendanceSummaryRepository).saveAll(any());
    }

    @Test
    void testRecalculateSummary() {
        // Given
        Long summaryId = 1L;
        List<AttendanceRecord> records = Arrays.asList(testRecord);
        
        when(attendanceSummaryRepository.findById(summaryId)).thenReturn(Optional.of(testSummary));
        when(attendanceRecordRepository.findByStudentIdAndAcademicYearAndTerm(
                testSummary.getStudent().getId(), testSummary.getAcademicYear(), testSummary.getTerm()))
                .thenReturn(records);
        when(attendanceSummaryRepository.save(testSummary)).thenReturn(testSummary);
        when(attendanceSummaryMapper.toDto(testSummary)).thenReturn(testSummaryDTO);

        // When
        AttendanceSummaryDTO result = attendanceSummaryService.recalculateSummary(summaryId);

        // Then
        assertNotNull(result);
        assertEquals(testSummaryDTO, result);
        verify(attendanceSummaryRepository).findById(summaryId);
        verify(attendanceSummaryRepository).save(testSummary);
    }

    @Test
    void testRecalculateSummaryThrowsExceptionWhenNotFound() {
        // Given
        Long summaryId = 999L;
        when(attendanceSummaryRepository.findById(summaryId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> {
            attendanceSummaryService.recalculateSummary(summaryId);
        });
        verify(attendanceSummaryRepository).findById(summaryId);
        verify(attendanceSummaryRepository, never()).save(any());
    }

    @Test
    void testGetAttendanceSummaryDashboard() {
        // Given
        Long classId = 1L;
        Integer academicYear = 2024;
        Term term = Term.FIRST_TERM;
        
        List<AttendanceSummary> summaries = Arrays.asList(testSummary);
        when(attendanceSummaryRepository.findByClassIdAndAcademicYearAndTerm(classId, academicYear, term))
                .thenReturn(summaries);

        // When
        Map<String, Object> result = attendanceSummaryService.getAttendanceSummaryDashboard(classId, academicYear, term);

        // Then
        assertNotNull(result);
        assertEquals(classId, result.get("classId"));
        assertEquals(academicYear, result.get("academicYear"));
        assertEquals(term, result.get("term"));
        assertEquals(1, result.get("totalStudents"));
        assertEquals(90.0, result.get("averageAttendancePercentage"));
        assertEquals(1L, result.get("studentsWithGoodAttendance"));
        assertEquals(0L, result.get("studentsWithPoorAttendance"));
    }

    @Test
    void testGetStudentsRequiringAttention() {
        // Given
        Long classId = 1L;
        Double attendanceThreshold = 80.0;
        Integer absentDaysThreshold = 5;
        
        // Create a summary with low attendance
        AttendanceSummary lowAttendanceSummary = new AttendanceSummary();
        lowAttendanceSummary.setId(2L);
        lowAttendanceSummary.setStudent(testStudent);
        lowAttendanceSummary.setClassEntity(testClass);
        lowAttendanceSummary.setAttendancePercentage(70.0);
        lowAttendanceSummary.setAbsentExcusedDays(3);
        lowAttendanceSummary.setAbsentUnexcusedDays(4);
        
        List<AttendanceSummary> summaries = Arrays.asList(lowAttendanceSummary);
        when(attendanceSummaryRepository.findByClassIdAndActive(classId)).thenReturn(summaries);
        when(attendanceSummaryMapper.toDto(lowAttendanceSummary)).thenReturn(testSummaryDTO);

        // When
        List<AttendanceSummaryDTO> result = attendanceSummaryService.getStudentsRequiringAttention(classId, attendanceThreshold, absentDaysThreshold);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(attendanceSummaryRepository).findByClassIdAndActive(classId);
    }

    @Test
    void testValidateSummaryData() {
        // Given
        Long summaryId = 1L;
        when(attendanceSummaryRepository.findById(summaryId)).thenReturn(Optional.of(testSummary));

        // When
        boolean result = attendanceSummaryService.validateSummaryData(summaryId);

        // Then
        assertTrue(result);
        verify(attendanceSummaryRepository).findById(summaryId);
    }

    @Test
    void testValidateSummaryDataThrowsExceptionWhenNotFound() {
        // Given
        Long summaryId = 999L;
        when(attendanceSummaryRepository.findById(summaryId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> {
            attendanceSummaryService.validateSummaryData(summaryId);
        });
    }

    @Test
    void testCountStudentsWithGoodAttendance() {
        // Given
        Long classId = 1L;
        Double threshold = 80.0;
        Integer academicYear = 2024;
        Term term = Term.FIRST_TERM;
        Long expectedCount = 15L;
        
        when(attendanceSummaryRepository.countStudentsWithGoodAttendance(classId, threshold, academicYear, term))
                .thenReturn(expectedCount);

        // When
        Long result = attendanceSummaryService.countStudentsWithGoodAttendance(classId, threshold, academicYear, term);

        // Then
        assertEquals(expectedCount, result);
        verify(attendanceSummaryRepository).countStudentsWithGoodAttendance(classId, threshold, academicYear, term);
    }

    @Test
    void testCountStudentsWithPoorAttendance() {
        // Given
        Long classId = 1L;
        Double threshold = 60.0;
        Integer academicYear = 2024;
        Term term = Term.FIRST_TERM;
        Long expectedCount = 3L;
        
        when(attendanceSummaryRepository.countStudentsWithPoorAttendance(classId, threshold, academicYear, term))
                .thenReturn(expectedCount);

        // When
        Long result = attendanceSummaryService.countStudentsWithPoorAttendance(classId, threshold, academicYear, term);

        // Then
        assertEquals(expectedCount, result);
        verify(attendanceSummaryRepository).countStudentsWithPoorAttendance(classId, threshold, academicYear, term);
    }

    @Test
    void testGetSummariesByType() {
        // Given
        AttendanceSummaryType summaryType = AttendanceSummaryType.TERM;
        List<AttendanceSummary> summaries = Arrays.asList(testSummary);
        when(attendanceSummaryRepository.findBySummaryTypeAndActive(summaryType)).thenReturn(summaries);
        when(attendanceSummaryMapper.toDto(testSummary)).thenReturn(testSummaryDTO);

        // When
        List<AttendanceSummaryDTO> result = attendanceSummaryService.getSummariesByType(summaryType);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testSummaryDTO, result.get(0));
        verify(attendanceSummaryRepository).findBySummaryTypeAndActive(summaryType);
    }

    @Test
    void testGetSummaryByStudentAndClassAndAcademicYearAndTermAndType() {
        // Given
        Long studentId = 1L;
        Long classId = 1L;
        Integer academicYear = 2024;
        Term term = Term.FIRST_TERM;
        AttendanceSummaryType summaryType = AttendanceSummaryType.TERM;
        
        when(attendanceSummaryRepository.findByStudentAndClassAndAcademicYearAndTermAndType(
                studentId, classId, academicYear, term, summaryType))
                .thenReturn(Optional.of(testSummary));
        when(attendanceSummaryMapper.toDto(testSummary)).thenReturn(testSummaryDTO);

        // When
        Optional<AttendanceSummaryDTO> result = attendanceSummaryService.getSummaryByStudentAndClassAndAcademicYearAndTermAndType(
                studentId, classId, academicYear, term, summaryType);

        // Then
        assertTrue(result.isPresent());
        assertEquals(testSummaryDTO, result.get());
        verify(attendanceSummaryRepository).findByStudentAndClassAndAcademicYearAndTermAndType(
                studentId, classId, academicYear, term, summaryType);
    }

    @Test
    void testRecalculateOutdatedSummaries() {
        // Given
        LocalDate cutoffDate = LocalDate.now().minusDays(7);
        List<AttendanceSummary> outdatedSummaries = Arrays.asList(testSummary);
        List<AttendanceRecord> records = Arrays.asList(testRecord);
        
        when(attendanceSummaryRepository.findOutdatedSummaries(cutoffDate)).thenReturn(outdatedSummaries);
        when(attendanceSummaryRepository.findById(testSummary.getId())).thenReturn(Optional.of(testSummary));
        when(attendanceRecordRepository.findByStudentIdAndAcademicYearAndTerm(
                testSummary.getStudent().getId(), testSummary.getAcademicYear(), testSummary.getTerm()))
                .thenReturn(records);
        when(attendanceSummaryRepository.save(testSummary)).thenReturn(testSummary);
        when(attendanceSummaryMapper.toDto(testSummary)).thenReturn(testSummaryDTO);

        // When
        attendanceSummaryService.recalculateOutdatedSummaries(cutoffDate);

        // Then
        verify(attendanceSummaryRepository).findOutdatedSummaries(cutoffDate);
        verify(attendanceSummaryRepository).findById(testSummary.getId());
        verify(attendanceSummaryRepository).save(testSummary);
    }

    @Test
    void testGenerateAttendanceAlerts() {
        // Given
        Long schoolId = 1L;
        Double attendanceThreshold = 75.0;
        List<AttendanceSummary> lowAttendanceSummaries = Arrays.asList(testSummary);
        
        when(attendanceSummaryRepository.findBySchoolIdAndAttendancePercentageLessThan(schoolId, attendanceThreshold))
                .thenReturn(lowAttendanceSummaries);

        // When
        List<Map<String, Object>> result = attendanceSummaryService.generateAttendanceAlerts(schoolId, attendanceThreshold);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        
        Map<String, Object> alert = result.get(0);
        assertEquals(testStudent.getId(), alert.get("studentId"));
        assertEquals("John Doe", alert.get("studentName"));
        assertEquals(testClass.getId(), alert.get("classId"));
        assertEquals(testClass.getName(), alert.get("className"));
        assertEquals(testSummary.getAttendancePercentage(), alert.get("attendancePercentage"));
        
        verify(attendanceSummaryRepository).findBySchoolIdAndAttendancePercentageLessThan(schoolId, attendanceThreshold);
    }
} 