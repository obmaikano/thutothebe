package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.SchoolMonitoringDTO;
import com.ohma.thutothebe.entity.School;
import com.ohma.thutothebe.entity.SchoolMonitoring;
import com.ohma.thutothebe.entity.UserActivityType;
import com.ohma.thutothebe.mapper.SchoolMonitoringMapper;
import com.ohma.thutothebe.repository.SchoolMonitoringRepository;
import com.ohma.thutothebe.repository.SchoolRepository;
import com.ohma.thutothebe.repository.UserActivityLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SchoolMonitoringServiceImplTest {

    @Mock
    private SchoolMonitoringRepository schoolMonitoringRepository;

    @Mock
    private SchoolMonitoringMapper schoolMonitoringMapper;

    @Mock
    private SchoolRepository schoolRepository;

    @Mock
    private UserActivityLogRepository userActivityLogRepository;

    private SchoolMonitoringServiceImpl schoolMonitoringService;

    private SchoolMonitoring schoolMonitoring;
    private SchoolMonitoringDTO schoolMonitoringDTO;
    private School school;
    private LocalDate testDate;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        // Create service instance and inject mocked dependencies
        schoolMonitoringService = new SchoolMonitoringServiceImpl(schoolMonitoringRepository);
        ReflectionTestUtils.setField(schoolMonitoringService, "schoolMonitoringRepository", schoolMonitoringRepository);
        ReflectionTestUtils.setField(schoolMonitoringService, "schoolMonitoringMapper", schoolMonitoringMapper);
        ReflectionTestUtils.setField(schoolMonitoringService, "schoolRepository", schoolRepository);
        ReflectionTestUtils.setField(schoolMonitoringService, "userActivityLogRepository", userActivityLogRepository);

        testDate = LocalDate.now();
        pageable = PageRequest.of(0, 10);

        school = new School();
        school.setId(1L);
        school.setCode("SCH001");
        school.setName("Test School");

        schoolMonitoring = new SchoolMonitoring();
        schoolMonitoring.setId(1L);
        schoolMonitoring.setSchool(school);
        schoolMonitoring.setMonitoringDate(testDate);
        schoolMonitoring.setTotalLogins(100);
        schoolMonitoring.setTotalActiveTeachers(20);
        schoolMonitoring.setTotalActiveStudents(500);
        schoolMonitoring.setAttendanceRate(85.0);
        schoolMonitoring.setAssignmentSubmissions(50);
        schoolMonitoring.setAssignmentsGraded(45);
        schoolMonitoring.setAverageGradingTurnaroundHours(24.0);
        schoolMonitoring.setCurriculumCompletionRate(75.0);
        schoolMonitoring.setSystemUptimePercentage(99.0);
        schoolMonitoring.setPeakUsageHour(10);
        schoolMonitoring.setComplianceScore(80.0);
        schoolMonitoring.setAlertCount(2);
        schoolMonitoring.setLastActivityTimestamp(LocalDateTime.now());
        schoolMonitoring.setActive(true);

        schoolMonitoringDTO = new SchoolMonitoringDTO(
            1L, 1L, "Test School", "SCH001", 1L, "Test Region", testDate, 20, 500, 100,
            20, 75, 5, 85.0, 50, 45, 24.0, 75.0, 99.0, 10, 15, 12, 35, 42, 18, 156,
            LocalDateTime.now(), 80.0, 2, true
        );
    }

    @Test
    @DisplayName("Test findBySchoolIdAndDate when data exists")
    void findBySchoolIdAndDate_ShouldReturnData_WhenExists() {
        when(schoolMonitoringRepository.findBySchoolIdAndMonitoringDate(1L, testDate))
            .thenReturn(Optional.of(schoolMonitoring));
        when(schoolMonitoringMapper.toDto(schoolMonitoring)).thenReturn(schoolMonitoringDTO);

        SchoolMonitoringDTO result = schoolMonitoringService.findBySchoolIdAndDate(1L, testDate);

        assertNotNull(result);
        assertEquals(1L, result.schoolId());
        assertEquals(testDate, result.monitoringDate());
        verify(schoolMonitoringRepository).findBySchoolIdAndMonitoringDate(1L, testDate);
    }

    @Test
    @DisplayName("Test findBySchoolIdAndDate when data does not exist")
    void findBySchoolIdAndDate_ShouldReturnNull_WhenNotExists() {
        when(schoolMonitoringRepository.findBySchoolIdAndMonitoringDate(1L, testDate))
            .thenReturn(Optional.empty());

        SchoolMonitoringDTO result = schoolMonitoringService.findBySchoolIdAndDate(1L, testDate);

        assertNull(result);
        verify(schoolMonitoringRepository).findBySchoolIdAndMonitoringDate(1L, testDate);
    }

    @Test
    @DisplayName("Test findBySchoolIdAndDateRange")
    void findBySchoolIdAndDateRange_ShouldReturnList() {
        LocalDate startDate = testDate.minusDays(7);
        LocalDate endDate = testDate;
        List<SchoolMonitoring> monitoringList = Arrays.asList(schoolMonitoring);

        when(schoolMonitoringRepository.findBySchoolIdAndDateRange(1L, startDate, endDate))
            .thenReturn(monitoringList);
        when(schoolMonitoringMapper.toDto(schoolMonitoring)).thenReturn(schoolMonitoringDTO);

        List<SchoolMonitoringDTO> result = schoolMonitoringService.findBySchoolIdAndDateRange(1L, startDate, endDate);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).schoolId());
        verify(schoolMonitoringRepository).findBySchoolIdAndDateRange(1L, startDate, endDate);
    }

    @Test
    @DisplayName("Test findByRegionIdAndDate")
    void findByRegionIdAndDate_ShouldReturnList() {
        List<SchoolMonitoring> monitoringList = Arrays.asList(schoolMonitoring);

        when(schoolMonitoringRepository.findByRegionIdAndDate(1L, testDate))
            .thenReturn(monitoringList);
        when(schoolMonitoringMapper.toDto(schoolMonitoring)).thenReturn(schoolMonitoringDTO);

        List<SchoolMonitoringDTO> result = schoolMonitoringService.findByRegionIdAndDate(1L, testDate);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(schoolMonitoringRepository).findByRegionIdAndDate(1L, testDate);
    }

    @Test
    @DisplayName("Test findByRegionIdAndDateRange")
    void findByRegionIdAndDateRange_ShouldReturnList() {
        LocalDate startDate = testDate.minusDays(7);
        LocalDate endDate = testDate;
        List<SchoolMonitoring> monitoringList = Arrays.asList(schoolMonitoring);

        when(schoolMonitoringRepository.findByRegionIdAndDateRange(1L, startDate, endDate))
            .thenReturn(monitoringList);
        when(schoolMonitoringMapper.toDto(schoolMonitoring)).thenReturn(schoolMonitoringDTO);

        List<SchoolMonitoringDTO> result = schoolMonitoringService.findByRegionIdAndDateRange(1L, startDate, endDate);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(schoolMonitoringRepository).findByRegionIdAndDateRange(1L, startDate, endDate);
    }

    @Test
    @DisplayName("Test findByDate")
    void findByDate_ShouldReturnList() {
        List<SchoolMonitoring> monitoringList = Arrays.asList(schoolMonitoring);

        when(schoolMonitoringRepository.findByMonitoringDate(testDate))
            .thenReturn(monitoringList);
        when(schoolMonitoringMapper.toDto(schoolMonitoring)).thenReturn(schoolMonitoringDTO);

        List<SchoolMonitoringDTO> result = schoolMonitoringService.findByDate(testDate);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(schoolMonitoringRepository).findByMonitoringDate(testDate);
    }

    @Test
    @DisplayName("Test findByDateRange with pagination")
    void findByDateRange_ShouldReturnPage() {
        LocalDate startDate = testDate.minusDays(7);
        LocalDate endDate = testDate;
        Page<SchoolMonitoring> monitoringPage = new PageImpl<>(Arrays.asList(schoolMonitoring));

        when(schoolMonitoringRepository.findByDateRange(startDate, endDate, pageable))
            .thenReturn(monitoringPage);
        when(schoolMonitoringMapper.toDto(schoolMonitoring)).thenReturn(schoolMonitoringDTO);

        Page<SchoolMonitoringDTO> result = schoolMonitoringService.findByDateRange(startDate, endDate, pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(schoolMonitoringRepository).findByDateRange(startDate, endDate, pageable);
    }

    @Test
    @DisplayName("Test findSchoolsWithLowAttendance")
    void findSchoolsWithLowAttendance_ShouldReturnList() {
        Double threshold = 80.0;
        List<SchoolMonitoring> monitoringList = Arrays.asList(schoolMonitoring);

        when(schoolMonitoringRepository.findSchoolsWithLowAttendance(threshold, testDate))
            .thenReturn(monitoringList);
        when(schoolMonitoringMapper.toDto(schoolMonitoring)).thenReturn(schoolMonitoringDTO);

        List<SchoolMonitoringDTO> result = schoolMonitoringService.findSchoolsWithLowAttendance(threshold, testDate);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(schoolMonitoringRepository).findSchoolsWithLowAttendance(threshold, testDate);
    }

    @Test
    @DisplayName("Test findSchoolsWithLowUsage")
    void findSchoolsWithLowUsage_ShouldReturnList() {
        Integer threshold = 50;
        List<SchoolMonitoring> monitoringList = Arrays.asList(schoolMonitoring);

        when(schoolMonitoringRepository.findSchoolsWithLowUsage(threshold, testDate))
            .thenReturn(monitoringList);
        when(schoolMonitoringMapper.toDto(schoolMonitoring)).thenReturn(schoolMonitoringDTO);

        List<SchoolMonitoringDTO> result = schoolMonitoringService.findSchoolsWithLowUsage(threshold, testDate);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(schoolMonitoringRepository).findSchoolsWithLowUsage(threshold, testDate);
    }

    @Test
    @DisplayName("Test findSchoolsWithDelayedGrading")
    void findSchoolsWithDelayedGrading_ShouldReturnList() {
        Double threshold = 48.0;
        List<SchoolMonitoring> monitoringList = Arrays.asList(schoolMonitoring);

        when(schoolMonitoringRepository.findSchoolsWithDelayedGrading(threshold, testDate))
            .thenReturn(monitoringList);
        when(schoolMonitoringMapper.toDto(schoolMonitoring)).thenReturn(schoolMonitoringDTO);

        List<SchoolMonitoringDTO> result = schoolMonitoringService.findSchoolsWithDelayedGrading(threshold, testDate);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(schoolMonitoringRepository).findSchoolsWithDelayedGrading(threshold, testDate);
    }

    @Test
    @DisplayName("Test findSchoolsWithLowCompliance")
    void findSchoolsWithLowCompliance_ShouldReturnList() {
        Double threshold = 70.0;
        List<SchoolMonitoring> monitoringList = Arrays.asList(schoolMonitoring);

        when(schoolMonitoringRepository.findSchoolsWithLowCompliance(threshold, testDate))
            .thenReturn(monitoringList);
        when(schoolMonitoringMapper.toDto(schoolMonitoring)).thenReturn(schoolMonitoringDTO);

        List<SchoolMonitoringDTO> result = schoolMonitoringService.findSchoolsWithLowCompliance(threshold, testDate);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(schoolMonitoringRepository).findSchoolsWithLowCompliance(threshold, testDate);
    }

    @Test
    @DisplayName("Test findSchoolsWithHighAlerts")
    void findSchoolsWithHighAlerts_ShouldReturnList() {
        Integer threshold = 5;
        List<SchoolMonitoring> monitoringList = Arrays.asList(schoolMonitoring);

        when(schoolMonitoringRepository.findSchoolsWithHighAlerts(threshold, testDate))
            .thenReturn(monitoringList);
        when(schoolMonitoringMapper.toDto(schoolMonitoring)).thenReturn(schoolMonitoringDTO);

        List<SchoolMonitoringDTO> result = schoolMonitoringService.findSchoolsWithHighAlerts(threshold, testDate);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(schoolMonitoringRepository).findSchoolsWithHighAlerts(threshold, testDate);
    }

    @Test
    @DisplayName("Test findLatestMonitoringDataForSchool when data exists")
    void findLatestMonitoringDataForSchool_ShouldReturnData_WhenExists() {
        when(schoolMonitoringRepository.findLatestMonitoringDataForSchool(1L))
            .thenReturn(Optional.of(schoolMonitoring));
        when(schoolMonitoringMapper.toDto(schoolMonitoring)).thenReturn(schoolMonitoringDTO);

        SchoolMonitoringDTO result = schoolMonitoringService.findLatestMonitoringDataForSchool(1L);

        assertNotNull(result);
        assertEquals(1L, result.schoolId());
        verify(schoolMonitoringRepository).findLatestMonitoringDataForSchool(1L);
    }

    @Test
    @DisplayName("Test findLatestMonitoringDataForSchool when data does not exist")
    void findLatestMonitoringDataForSchool_ShouldReturnNull_WhenNotExists() {
        when(schoolMonitoringRepository.findLatestMonitoringDataForSchool(1L))
            .thenReturn(Optional.empty());

        SchoolMonitoringDTO result = schoolMonitoringService.findLatestMonitoringDataForSchool(1L);

        assertNull(result);
        verify(schoolMonitoringRepository).findLatestMonitoringDataForSchool(1L);
    }

    @Test
    @DisplayName("Test findLatestMonitoringDataForAllSchools")
    void findLatestMonitoringDataForAllSchools_ShouldReturnList() {
        List<SchoolMonitoring> monitoringList = Arrays.asList(schoolMonitoring);

        when(schoolMonitoringRepository.findLatestMonitoringDataForAllSchools())
            .thenReturn(monitoringList);
        when(schoolMonitoringMapper.toDto(schoolMonitoring)).thenReturn(schoolMonitoringDTO);

        List<SchoolMonitoringDTO> result = schoolMonitoringService.findLatestMonitoringDataForAllSchools();

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(schoolMonitoringRepository).findLatestMonitoringDataForAllSchools();
    }

    @Test
    @DisplayName("Test generateMonitoringDataForSchool when data already exists")
    void generateMonitoringDataForSchool_ShouldReturnExisting_WhenDataExists() {
        when(schoolMonitoringRepository.findBySchoolIdAndMonitoringDate(1L, testDate))
            .thenReturn(Optional.of(schoolMonitoring));
        when(schoolMonitoringMapper.toDto(schoolMonitoring)).thenReturn(schoolMonitoringDTO);

        SchoolMonitoringDTO result = schoolMonitoringService.generateMonitoringDataForSchool(1L, testDate);

        assertNotNull(result);
        assertEquals(1L, result.schoolId());
        verify(schoolMonitoringRepository).findBySchoolIdAndMonitoringDate(1L, testDate);
        verify(schoolRepository, never()).findById(anyLong());
    }

    @Test
    @DisplayName("Test generateMonitoringDataForSchool when creating new data")
    void generateMonitoringDataForSchool_ShouldCreateNew_WhenDataNotExists() {
        when(schoolMonitoringRepository.findBySchoolIdAndMonitoringDate(1L, testDate))
            .thenReturn(Optional.empty());
        when(schoolRepository.findById(1L)).thenReturn(Optional.of(school));
        when(userActivityLogRepository.countActivityBySchoolAndType(eq(1L), eq(UserActivityType.LOGIN), any(), any()))
            .thenReturn(100L);
        when(userActivityLogRepository.countActiveUsersBySchool(eq(1L), any(), any()))
            .thenReturn(20L);
        when(schoolMonitoringRepository.save(any(SchoolMonitoring.class))).thenReturn(schoolMonitoring);
        when(schoolMonitoringMapper.toDto(schoolMonitoring)).thenReturn(schoolMonitoringDTO);

        SchoolMonitoringDTO result = schoolMonitoringService.generateMonitoringDataForSchool(1L, testDate);

        assertNotNull(result);
        verify(schoolRepository).findById(1L);
        verify(schoolMonitoringRepository).save(any(SchoolMonitoring.class));
    }

    @Test
    @DisplayName("Test generateMonitoringDataForSchool when school not found")
    void generateMonitoringDataForSchool_ShouldThrowException_WhenSchoolNotFound() {
        when(schoolMonitoringRepository.findBySchoolIdAndMonitoringDate(1L, testDate))
            .thenReturn(Optional.empty());
        when(schoolRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> 
            schoolMonitoringService.generateMonitoringDataForSchool(1L, testDate));

        verify(schoolRepository).findById(1L);
        verify(schoolMonitoringRepository, never()).save(any(SchoolMonitoring.class));
    }

    @Test
    @DisplayName("Test generateMonitoringDataForAllSchools")
    void generateMonitoringDataForAllSchools_ShouldProcessAllSchools() {
        School school2 = new School();
        school2.setId(2L);
        List<School> schools = Arrays.asList(school, school2);

        when(schoolRepository.findAll()).thenReturn(schools);
        when(schoolMonitoringRepository.findBySchoolIdAndMonitoringDate(anyLong(), eq(testDate)))
            .thenReturn(Optional.empty());
        when(schoolRepository.findById(anyLong())).thenReturn(Optional.of(school));
        when(userActivityLogRepository.countActivityBySchoolAndType(anyLong(), eq(UserActivityType.LOGIN), any(), any()))
            .thenReturn(100L);
        when(userActivityLogRepository.countActiveUsersBySchool(anyLong(), any(), any()))
            .thenReturn(20L);
        when(schoolMonitoringRepository.save(any(SchoolMonitoring.class))).thenReturn(schoolMonitoring);
        when(schoolMonitoringMapper.toDto(schoolMonitoring)).thenReturn(schoolMonitoringDTO);

        schoolMonitoringService.generateMonitoringDataForAllSchools(testDate);

        verify(schoolRepository).findAll();
        verify(schoolMonitoringRepository, times(2)).save(any(SchoolMonitoring.class));
    }

    @Test
    @DisplayName("Test calculateComplianceScore")
    void calculateComplianceScore_ShouldReturnCalculatedScore() {
        when(schoolMonitoringRepository.findBySchoolIdAndMonitoringDate(1L, testDate))
            .thenReturn(Optional.of(schoolMonitoring));
        when(schoolMonitoringMapper.toDto(schoolMonitoring)).thenReturn(schoolMonitoringDTO);

        Double result = schoolMonitoringService.calculateComplianceScore(1L, testDate);

        assertNotNull(result);
        assertTrue(result >= 0.0 && result <= 100.0);
        verify(schoolMonitoringRepository).findBySchoolIdAndMonitoringDate(1L, testDate);
    }

    @Test
    @DisplayName("Test calculateComplianceScore when no data exists")
    void calculateComplianceScore_ShouldReturnZero_WhenNoData() {
        when(schoolMonitoringRepository.findBySchoolIdAndMonitoringDate(1L, testDate))
            .thenReturn(Optional.empty());

        Double result = schoolMonitoringService.calculateComplianceScore(1L, testDate);

        assertEquals(0.0, result);
        verify(schoolMonitoringRepository).findBySchoolIdAndMonitoringDate(1L, testDate);
    }

    @Test
    @DisplayName("Test updateSchoolMonitoringData when data exists")
    void updateSchoolMonitoringData_ShouldUpdateExisting_WhenDataExists() {
        when(schoolMonitoringRepository.findBySchoolIdAndMonitoringDate(1L, testDate))
            .thenReturn(Optional.of(schoolMonitoring));
        when(schoolMonitoringRepository.save(any(SchoolMonitoring.class))).thenReturn(schoolMonitoring);

        schoolMonitoringService.updateSchoolMonitoringData(1L, testDate);

        verify(schoolMonitoringRepository, atLeastOnce()).findBySchoolIdAndMonitoringDate(1L, testDate);
        verify(schoolMonitoringRepository).save(any(SchoolMonitoring.class));
    }

    @Test
    @DisplayName("Test updateSchoolMonitoringData when data does not exist")
    void updateSchoolMonitoringData_ShouldGenerateNew_WhenDataNotExists() {
        when(schoolMonitoringRepository.findBySchoolIdAndMonitoringDate(1L, testDate))
            .thenReturn(Optional.empty());
        when(schoolRepository.findById(1L)).thenReturn(Optional.of(school));
        when(userActivityLogRepository.countActivityBySchoolAndType(
            eq(1L), eq(UserActivityType.LOGIN), any(), any())).thenReturn(100L);
        when(schoolMonitoringRepository.save(any(SchoolMonitoring.class))).thenReturn(schoolMonitoring);

        schoolMonitoringService.updateSchoolMonitoringData(1L, testDate);

        verify(schoolMonitoringRepository, atLeastOnce()).findBySchoolIdAndMonitoringDate(1L, testDate);
        verify(schoolRepository).findById(1L);
        verify(schoolMonitoringRepository).save(any(SchoolMonitoring.class));
    }

    @Test
    @DisplayName("Test BaseServiceImpl inherited methods - create")
    void create_ShouldCreateNewMonitoringData() {
        when(schoolMonitoringMapper.toEntity(schoolMonitoringDTO)).thenReturn(schoolMonitoring);
        when(schoolMonitoringRepository.save(schoolMonitoring)).thenReturn(schoolMonitoring);
        when(schoolMonitoringMapper.toDto(schoolMonitoring)).thenReturn(schoolMonitoringDTO);

        SchoolMonitoringDTO result = schoolMonitoringService.create(schoolMonitoringDTO);

        assertNotNull(result);
        assertEquals(schoolMonitoringDTO.schoolId(), result.schoolId());
        verify(schoolMonitoringRepository).save(schoolMonitoring);
    }

    @Test
    @DisplayName("Test BaseServiceImpl inherited methods - getById")
    void getById_ShouldReturnMonitoringData_WhenExists() {
        when(schoolMonitoringRepository.findById(1L)).thenReturn(Optional.of(schoolMonitoring));
        when(schoolMonitoringMapper.toDto(schoolMonitoring)).thenReturn(schoolMonitoringDTO);

        SchoolMonitoringDTO result = schoolMonitoringService.getById(1L);

        assertNotNull(result);
        assertEquals(1L, result.id());
        verify(schoolMonitoringRepository).findById(1L);
    }

    @Test
    @DisplayName("Test BaseServiceImpl inherited methods - update")
    void update_ShouldUpdateMonitoringData_WhenExists() {
        when(schoolMonitoringRepository.findById(1L)).thenReturn(Optional.of(schoolMonitoring));
        when(schoolMonitoringRepository.save(schoolMonitoring)).thenReturn(schoolMonitoring);
        when(schoolMonitoringMapper.toDto(schoolMonitoring)).thenReturn(schoolMonitoringDTO);

        SchoolMonitoringDTO result = schoolMonitoringService.update(1L, schoolMonitoringDTO);

        assertNotNull(result);
        verify(schoolMonitoringRepository).findById(1L);
        verify(schoolMonitoringMapper).updateEntity(schoolMonitoring, schoolMonitoringDTO);
        verify(schoolMonitoringRepository).save(schoolMonitoring);
    }

    @Test
    @DisplayName("Test BaseServiceImpl inherited methods - delete")
    void delete_ShouldDeleteMonitoringData_WhenExists() {
        when(schoolMonitoringRepository.existsById(1L)).thenReturn(true);

        schoolMonitoringService.delete(1L);

        verify(schoolMonitoringRepository).existsById(1L);
        verify(schoolMonitoringRepository).deleteById(1L);
    }

    @Test
    @DisplayName("Test BaseServiceImpl inherited methods - getAll")
    void getAll_ShouldReturnAllMonitoringData() {
        List<SchoolMonitoring> monitoringList = Arrays.asList(schoolMonitoring);
        when(schoolMonitoringRepository.findAll()).thenReturn(monitoringList);
        when(schoolMonitoringMapper.toDto(schoolMonitoring)).thenReturn(schoolMonitoringDTO);

        List<SchoolMonitoringDTO> result = schoolMonitoringService.getAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(schoolMonitoringRepository).findAll();
    }

    @Test
    @DisplayName("Test BaseServiceImpl inherited methods - getAll with pagination")
    void getAll_ShouldReturnPagedMonitoringData() {
        Page<SchoolMonitoring> monitoringPage = new PageImpl<>(Arrays.asList(schoolMonitoring));
        when(schoolMonitoringRepository.findAll(pageable)).thenReturn(monitoringPage);
        when(schoolMonitoringMapper.toDto(schoolMonitoring)).thenReturn(schoolMonitoringDTO);

        Page<SchoolMonitoringDTO> result = schoolMonitoringService.getAll(pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(schoolMonitoringRepository).findAll(pageable);
    }
} 