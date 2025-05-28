package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.RegionMonitoringDTO;
import com.ohma.thutothebe.dto.SchoolMonitoringDTO;
import com.ohma.thutothebe.entity.Region;
import com.ohma.thutothebe.entity.RegionMonitoring;
import com.ohma.thutothebe.mapper.RegionMonitoringMapper;
import com.ohma.thutothebe.repository.RegionMonitoringRepository;
import com.ohma.thutothebe.repository.RegionRepository;
import com.ohma.thutothebe.service.SchoolMonitoringService;
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
class RegionMonitoringServiceImplTest {

    @Mock
    private RegionMonitoringRepository regionMonitoringRepository;

    @Mock
    private RegionMonitoringMapper regionMonitoringMapper;

    @Mock
    private RegionRepository regionRepository;

    @Mock
    private SchoolMonitoringService schoolMonitoringService;

    private RegionMonitoringServiceImpl regionMonitoringService;

    private RegionMonitoring regionMonitoring;
    private RegionMonitoringDTO regionMonitoringDTO;
    private SchoolMonitoringDTO schoolMonitoringDTO;
    private Region region;
    private LocalDate testDate;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        // Create service instance and inject mocked dependencies
        regionMonitoringService = new RegionMonitoringServiceImpl(regionMonitoringRepository);
        ReflectionTestUtils.setField(regionMonitoringService, "regionMonitoringRepository", regionMonitoringRepository);
        ReflectionTestUtils.setField(regionMonitoringService, "regionMonitoringMapper", regionMonitoringMapper);
        ReflectionTestUtils.setField(regionMonitoringService, "regionRepository", regionRepository);
        ReflectionTestUtils.setField(regionMonitoringService, "schoolMonitoringService", schoolMonitoringService);

        testDate = LocalDate.now();
        pageable = PageRequest.of(0, 10);

        region = new Region();
        region.setId(1L);
        region.setCode("REG001");
        region.setName("Test Region");

        regionMonitoring = new RegionMonitoring();
        regionMonitoring.setId(1L);
        regionMonitoring.setRegion(region);
        regionMonitoring.setMonitoringDate(testDate);
        regionMonitoring.setTotalSchools(10);
        regionMonitoring.setActiveSchools(9);
        regionMonitoring.setTotalTeachers(200);
        regionMonitoring.setTotalStudents(5000);
        regionMonitoring.setAverageAttendanceRate(85.0);
        regionMonitoring.setTotalLogins(1000);
        regionMonitoring.setTotalAssignmentSubmissions(500);
        regionMonitoring.setTotalAssignmentsGraded(450);
        regionMonitoring.setAverageGradingTurnaroundHours(24.0);
        regionMonitoring.setAverageCurriculumCompletionRate(75.0);
        regionMonitoring.setAverageSystemUptimePercentage(99.0);
        regionMonitoring.setSchoolsWithLowUsage(2);
        regionMonitoring.setSchoolsWithDelayedGrading(1);
        regionMonitoring.setSchoolsWithIrregularAttendance(1);
        regionMonitoring.setTotalAlerts(20);
        regionMonitoring.setHighPerformingSchools(7);
        regionMonitoring.setLowPerformingSchools(1);
        regionMonitoring.setAverageComplianceScore(80.0);
        regionMonitoring.setResourceUtilizationRate(75.0);
        regionMonitoring.setLastUpdated(LocalDateTime.now());
        regionMonitoring.setActive(true);

        regionMonitoringDTO = new RegionMonitoringDTO(
            1L, 1L, "Test Region", "REG001", testDate, 10, 9, 200, 5000, 1000,
            85.0, 500, 450, 24.0, 75.0, 99.0, 2, 1, 1, 20, 7, 1, 80.0, 75.0,
            LocalDateTime.now(), true
        );

        schoolMonitoringDTO = new SchoolMonitoringDTO(
            1L, 1L, "Test School", "SCH001", 1L, "Test Region", testDate, 20, 500, 100,
            20, 75, 5, 85.0, 50, 45, 24.0, 75.0, 99.0, 10, 15, 12, 35, 42, 18, 156,
            LocalDateTime.now(), 80.0, 2, true
        );
    }

    @Test
    @DisplayName("Test findByRegionIdAndDate when data exists")
    void findByRegionIdAndDate_ShouldReturnData_WhenExists() {
        when(regionMonitoringRepository.findByRegionIdAndMonitoringDate(1L, testDate))
            .thenReturn(Optional.of(regionMonitoring));
        when(regionMonitoringMapper.toDto(regionMonitoring)).thenReturn(regionMonitoringDTO);

        RegionMonitoringDTO result = regionMonitoringService.findByRegionIdAndDate(1L, testDate);

        assertNotNull(result);
        assertEquals(1L, result.regionId());
        assertEquals(testDate, result.monitoringDate());
        verify(regionMonitoringRepository).findByRegionIdAndMonitoringDate(1L, testDate);
    }

    @Test
    @DisplayName("Test findByRegionIdAndDate when data does not exist")
    void findByRegionIdAndDate_ShouldReturnNull_WhenNotExists() {
        when(regionMonitoringRepository.findByRegionIdAndMonitoringDate(1L, testDate))
            .thenReturn(Optional.empty());

        RegionMonitoringDTO result = regionMonitoringService.findByRegionIdAndDate(1L, testDate);

        assertNull(result);
        verify(regionMonitoringRepository).findByRegionIdAndMonitoringDate(1L, testDate);
    }

    @Test
    @DisplayName("Test findByRegionIdAndDateRange")
    void findByRegionIdAndDateRange_ShouldReturnList() {
        LocalDate startDate = testDate.minusDays(7);
        LocalDate endDate = testDate;
        List<RegionMonitoring> monitoringList = Arrays.asList(regionMonitoring);

        when(regionMonitoringRepository.findByRegionIdAndDateRange(1L, startDate, endDate))
            .thenReturn(monitoringList);
        when(regionMonitoringMapper.toDto(regionMonitoring)).thenReturn(regionMonitoringDTO);

        List<RegionMonitoringDTO> result = regionMonitoringService.findByRegionIdAndDateRange(1L, startDate, endDate);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).regionId());
        verify(regionMonitoringRepository).findByRegionIdAndDateRange(1L, startDate, endDate);
    }

    @Test
    @DisplayName("Test findByDate")
    void findByDate_ShouldReturnList() {
        List<RegionMonitoring> monitoringList = Arrays.asList(regionMonitoring);

        when(regionMonitoringRepository.findByMonitoringDate(testDate))
            .thenReturn(monitoringList);
        when(regionMonitoringMapper.toDto(regionMonitoring)).thenReturn(regionMonitoringDTO);

        List<RegionMonitoringDTO> result = regionMonitoringService.findByDate(testDate);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(regionMonitoringRepository).findByMonitoringDate(testDate);
    }

    @Test
    @DisplayName("Test findByDateRange with pagination")
    void findByDateRange_ShouldReturnPage() {
        LocalDate startDate = testDate.minusDays(7);
        LocalDate endDate = testDate;
        Page<RegionMonitoring> monitoringPage = new PageImpl<>(Arrays.asList(regionMonitoring));

        when(regionMonitoringRepository.findByDateRange(startDate, endDate, pageable))
            .thenReturn(monitoringPage);
        when(regionMonitoringMapper.toDto(regionMonitoring)).thenReturn(regionMonitoringDTO);

        Page<RegionMonitoringDTO> result = regionMonitoringService.findByDateRange(startDate, endDate, pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(regionMonitoringRepository).findByDateRange(startDate, endDate, pageable);
    }

    @Test
    @DisplayName("Test findRegionsWithLowAttendance")
    void findRegionsWithLowAttendance_ShouldReturnList() {
        Double threshold = 80.0;
        List<RegionMonitoring> monitoringList = Arrays.asList(regionMonitoring);

        when(regionMonitoringRepository.findRegionsWithLowAttendance(threshold, testDate))
            .thenReturn(monitoringList);
        when(regionMonitoringMapper.toDto(regionMonitoring)).thenReturn(regionMonitoringDTO);

        List<RegionMonitoringDTO> result = regionMonitoringService.findRegionsWithLowAttendance(threshold, testDate);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(regionMonitoringRepository).findRegionsWithLowAttendance(threshold, testDate);
    }

    @Test
    @DisplayName("Test findRegionsWithLowUsageSchools")
    void findRegionsWithLowUsageSchools_ShouldReturnList() {
        Integer threshold = 3;
        List<RegionMonitoring> monitoringList = Arrays.asList(regionMonitoring);

        when(regionMonitoringRepository.findRegionsWithLowUsageSchools(threshold, testDate))
            .thenReturn(monitoringList);
        when(regionMonitoringMapper.toDto(regionMonitoring)).thenReturn(regionMonitoringDTO);

        List<RegionMonitoringDTO> result = regionMonitoringService.findRegionsWithLowUsageSchools(threshold, testDate);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(regionMonitoringRepository).findRegionsWithLowUsageSchools(threshold, testDate);
    }

    @Test
    @DisplayName("Test findRegionsWithLowCompliance")
    void findRegionsWithLowCompliance_ShouldReturnList() {
        Double threshold = 70.0;
        List<RegionMonitoring> monitoringList = Arrays.asList(regionMonitoring);

        when(regionMonitoringRepository.findRegionsWithLowCompliance(threshold, testDate))
            .thenReturn(monitoringList);
        when(regionMonitoringMapper.toDto(regionMonitoring)).thenReturn(regionMonitoringDTO);

        List<RegionMonitoringDTO> result = regionMonitoringService.findRegionsWithLowCompliance(threshold, testDate);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(regionMonitoringRepository).findRegionsWithLowCompliance(threshold, testDate);
    }

    @Test
    @DisplayName("Test findRegionsWithHighAlerts")
    void findRegionsWithHighAlerts_ShouldReturnList() {
        Integer threshold = 15;
        List<RegionMonitoring> monitoringList = Arrays.asList(regionMonitoring);

        when(regionMonitoringRepository.findRegionsWithHighAlerts(threshold, testDate))
            .thenReturn(monitoringList);
        when(regionMonitoringMapper.toDto(regionMonitoring)).thenReturn(regionMonitoringDTO);

        List<RegionMonitoringDTO> result = regionMonitoringService.findRegionsWithHighAlerts(threshold, testDate);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(regionMonitoringRepository).findRegionsWithHighAlerts(threshold, testDate);
    }

    @Test
    @DisplayName("Test findTopPerformingRegions")
    void findTopPerformingRegions_ShouldReturnList() {
        Double threshold = 85.0;
        List<RegionMonitoring> monitoringList = Arrays.asList(regionMonitoring);

        when(regionMonitoringRepository.findTopPerformingRegions(threshold, testDate))
            .thenReturn(monitoringList);
        when(regionMonitoringMapper.toDto(regionMonitoring)).thenReturn(regionMonitoringDTO);

        List<RegionMonitoringDTO> result = regionMonitoringService.findTopPerformingRegions(threshold, testDate);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(regionMonitoringRepository).findTopPerformingRegions(threshold, testDate);
    }

    @Test
    @DisplayName("Test findUnderperformingRegions")
    void findUnderperformingRegions_ShouldReturnList() {
        Double threshold = 60.0;
        List<RegionMonitoring> monitoringList = Arrays.asList(regionMonitoring);

        when(regionMonitoringRepository.findUnderperformingRegions(threshold, testDate))
            .thenReturn(monitoringList);
        when(regionMonitoringMapper.toDto(regionMonitoring)).thenReturn(regionMonitoringDTO);

        List<RegionMonitoringDTO> result = regionMonitoringService.findUnderperformingRegions(threshold, testDate);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(regionMonitoringRepository).findUnderperformingRegions(threshold, testDate);
    }

    @Test
    @DisplayName("Test findLatestMonitoringDataForRegion when data exists")
    void findLatestMonitoringDataForRegion_ShouldReturnData_WhenExists() {
        when(regionMonitoringRepository.findLatestMonitoringDataForRegion(1L))
            .thenReturn(Optional.of(regionMonitoring));
        when(regionMonitoringMapper.toDto(regionMonitoring)).thenReturn(regionMonitoringDTO);

        RegionMonitoringDTO result = regionMonitoringService.findLatestMonitoringDataForRegion(1L);

        assertNotNull(result);
        assertEquals(1L, result.regionId());
        verify(regionMonitoringRepository).findLatestMonitoringDataForRegion(1L);
    }

    @Test
    @DisplayName("Test findLatestMonitoringDataForRegion when data does not exist")
    void findLatestMonitoringDataForRegion_ShouldReturnNull_WhenNotExists() {
        when(regionMonitoringRepository.findLatestMonitoringDataForRegion(1L))
            .thenReturn(Optional.empty());

        RegionMonitoringDTO result = regionMonitoringService.findLatestMonitoringDataForRegion(1L);

        assertNull(result);
        verify(regionMonitoringRepository).findLatestMonitoringDataForRegion(1L);
    }

    @Test
    @DisplayName("Test findLatestMonitoringDataForAllRegions")
    void findLatestMonitoringDataForAllRegions_ShouldReturnList() {
        List<RegionMonitoring> monitoringList = Arrays.asList(regionMonitoring);

        when(regionMonitoringRepository.findLatestMonitoringDataForAllRegions())
            .thenReturn(monitoringList);
        when(regionMonitoringMapper.toDto(regionMonitoring)).thenReturn(regionMonitoringDTO);

        List<RegionMonitoringDTO> result = regionMonitoringService.findLatestMonitoringDataForAllRegions();

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(regionMonitoringRepository).findLatestMonitoringDataForAllRegions();
    }

    @Test
    @DisplayName("Test generateMonitoringDataForRegion when data already exists")
    void generateMonitoringDataForRegion_ShouldReturnExisting_WhenDataExists() {
        when(regionMonitoringRepository.findByRegionIdAndMonitoringDate(1L, testDate))
            .thenReturn(Optional.of(regionMonitoring));
        when(regionMonitoringMapper.toDto(regionMonitoring)).thenReturn(regionMonitoringDTO);

        RegionMonitoringDTO result = regionMonitoringService.generateMonitoringDataForRegion(1L, testDate);

        assertNotNull(result);
        assertEquals(1L, result.regionId());
        verify(regionMonitoringRepository).findByRegionIdAndMonitoringDate(1L, testDate);
        verify(regionRepository, never()).findById(anyLong());
    }

    @Test
    @DisplayName("Test generateMonitoringDataForRegion when creating new data")
    void generateMonitoringDataForRegion_ShouldCreateNew_WhenDataNotExists() {
        when(regionMonitoringRepository.findByRegionIdAndMonitoringDate(1L, testDate))
            .thenReturn(Optional.empty());
        when(regionRepository.findById(1L)).thenReturn(Optional.of(region));
        when(schoolMonitoringService.findByRegionIdAndDate(1L, testDate))
            .thenReturn(Arrays.asList(schoolMonitoringDTO));
        when(regionMonitoringRepository.save(any(RegionMonitoring.class))).thenReturn(regionMonitoring);
        when(regionMonitoringMapper.toDto(regionMonitoring)).thenReturn(regionMonitoringDTO);

        RegionMonitoringDTO result = regionMonitoringService.generateMonitoringDataForRegion(1L, testDate);

        assertNotNull(result);
        verify(regionRepository).findById(1L);
        verify(schoolMonitoringService).findByRegionIdAndDate(1L, testDate);
        verify(regionMonitoringRepository).save(any(RegionMonitoring.class));
    }

    @Test
    @DisplayName("Test generateMonitoringDataForRegion when region not found")
    void generateMonitoringDataForRegion_ShouldThrowException_WhenRegionNotFound() {
        when(regionMonitoringRepository.findByRegionIdAndMonitoringDate(1L, testDate))
            .thenReturn(Optional.empty());
        when(regionRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> 
            regionMonitoringService.generateMonitoringDataForRegion(1L, testDate));

        verify(regionRepository).findById(1L);
        verify(regionMonitoringRepository, never()).save(any(RegionMonitoring.class));
    }

    @Test
    @DisplayName("Test generateMonitoringDataForAllRegions")
    void generateMonitoringDataForAllRegions_ShouldProcessAllRegions() {
        Region region2 = new Region();
        region2.setId(2L);
        List<Region> regions = Arrays.asList(region, region2);

        when(regionRepository.findAll()).thenReturn(regions);
        when(regionMonitoringRepository.findByRegionIdAndMonitoringDate(anyLong(), eq(testDate)))
            .thenReturn(Optional.empty());
        when(regionRepository.findById(anyLong())).thenReturn(Optional.of(region));
        when(schoolMonitoringService.findByRegionIdAndDate(anyLong(), eq(testDate)))
            .thenReturn(Arrays.asList(schoolMonitoringDTO));
        when(regionMonitoringRepository.save(any(RegionMonitoring.class))).thenReturn(regionMonitoring);
        when(regionMonitoringMapper.toDto(regionMonitoring)).thenReturn(regionMonitoringDTO);

        regionMonitoringService.generateMonitoringDataForAllRegions(testDate);

        verify(regionRepository).findAll();
        verify(regionMonitoringRepository, times(2)).save(any(RegionMonitoring.class));
    }

    @Test
    @DisplayName("Test getNationalAverageAttendanceRate")
    void getNationalAverageAttendanceRate_ShouldReturnAverage() {
        Double expectedAverage = 85.5;
        when(regionMonitoringRepository.getNationalAverageAttendanceRate(testDate))
            .thenReturn(expectedAverage);

        Double result = regionMonitoringService.getNationalAverageAttendanceRate(testDate);

        assertEquals(expectedAverage, result);
        verify(regionMonitoringRepository).getNationalAverageAttendanceRate(testDate);
    }

    @Test
    @DisplayName("Test getNationalAverageComplianceScore")
    void getNationalAverageComplianceScore_ShouldReturnAverage() {
        Double expectedAverage = 82.3;
        when(regionMonitoringRepository.getNationalAverageComplianceScore(testDate))
            .thenReturn(expectedAverage);

        Double result = regionMonitoringService.getNationalAverageComplianceScore(testDate);

        assertEquals(expectedAverage, result);
        verify(regionMonitoringRepository).getNationalAverageComplianceScore(testDate);
    }

    @Test
    @DisplayName("Test getTotalSchoolsNationally")
    void getTotalSchoolsNationally_ShouldReturnTotal() {
        Long expectedTotal = 150L;
        when(regionMonitoringRepository.getTotalSchoolsNationally(testDate))
            .thenReturn(expectedTotal);

        Long result = regionMonitoringService.getTotalSchoolsNationally(testDate);

        assertEquals(expectedTotal, result);
        verify(regionMonitoringRepository).getTotalSchoolsNationally(testDate);
    }

    @Test
    @DisplayName("Test getTotalTeachersNationally")
    void getTotalTeachersNationally_ShouldReturnTotal() {
        Long expectedTotal = 3000L;
        when(regionMonitoringRepository.getTotalTeachersNationally(testDate))
            .thenReturn(expectedTotal);

        Long result = regionMonitoringService.getTotalTeachersNationally(testDate);

        assertEquals(expectedTotal, result);
        verify(regionMonitoringRepository).getTotalTeachersNationally(testDate);
    }

    @Test
    @DisplayName("Test getTotalStudentsNationally")
    void getTotalStudentsNationally_ShouldReturnTotal() {
        Long expectedTotal = 75000L;
        when(regionMonitoringRepository.getTotalStudentsNationally(testDate))
            .thenReturn(expectedTotal);

        Long result = regionMonitoringService.getTotalStudentsNationally(testDate);

        assertEquals(expectedTotal, result);
        verify(regionMonitoringRepository).getTotalStudentsNationally(testDate);
    }

    @Test
    @DisplayName("Test updateRegionMonitoringData when data exists")
    void updateRegionMonitoringData_ShouldUpdateExisting_WhenDataExists() {
        when(regionMonitoringRepository.findByRegionIdAndMonitoringDate(1L, testDate))
            .thenReturn(Optional.of(regionMonitoring));
        when(regionRepository.findById(1L)).thenReturn(Optional.of(region));
        when(schoolMonitoringService.findByRegionIdAndDate(1L, testDate))
            .thenReturn(Arrays.asList(schoolMonitoringDTO));
        when(regionMonitoringRepository.save(any(RegionMonitoring.class))).thenReturn(regionMonitoring);

        regionMonitoringService.updateRegionMonitoringData(1L, testDate);

        verify(regionMonitoringRepository, atLeastOnce()).findByRegionIdAndMonitoringDate(1L, testDate);
        verify(regionMonitoringRepository).save(any(RegionMonitoring.class));
    }

    @Test
    @DisplayName("Test updateRegionMonitoringData when data does not exist")
    void updateRegionMonitoringData_ShouldGenerateNew_WhenDataNotExists() {
        when(regionMonitoringRepository.findByRegionIdAndMonitoringDate(1L, testDate))
            .thenReturn(Optional.empty());
        when(regionRepository.findById(1L)).thenReturn(Optional.of(region));
        when(schoolMonitoringService.findByRegionIdAndDate(1L, testDate))
            .thenReturn(Arrays.asList(schoolMonitoringDTO));
        when(regionMonitoringRepository.save(any(RegionMonitoring.class))).thenReturn(regionMonitoring);
        when(regionMonitoringMapper.toDto(regionMonitoring)).thenReturn(regionMonitoringDTO);

        regionMonitoringService.updateRegionMonitoringData(1L, testDate);

        verify(regionMonitoringRepository, atLeastOnce()).findByRegionIdAndMonitoringDate(1L, testDate);
        verify(regionRepository).findById(1L);
        verify(regionMonitoringRepository).save(any(RegionMonitoring.class));
    }

    @Test
    @DisplayName("Test BaseServiceImpl inherited methods - create")
    void create_ShouldCreateNewMonitoringData() {
        when(regionMonitoringMapper.toEntity(regionMonitoringDTO)).thenReturn(regionMonitoring);
        when(regionMonitoringRepository.save(regionMonitoring)).thenReturn(regionMonitoring);
        when(regionMonitoringMapper.toDto(regionMonitoring)).thenReturn(regionMonitoringDTO);

        RegionMonitoringDTO result = regionMonitoringService.create(regionMonitoringDTO);

        assertNotNull(result);
        assertEquals(regionMonitoringDTO.regionId(), result.regionId());
        verify(regionMonitoringRepository).save(regionMonitoring);
    }

    @Test
    @DisplayName("Test BaseServiceImpl inherited methods - getById")
    void getById_ShouldReturnMonitoringData_WhenExists() {
        when(regionMonitoringRepository.findById(1L)).thenReturn(Optional.of(regionMonitoring));
        when(regionMonitoringMapper.toDto(regionMonitoring)).thenReturn(regionMonitoringDTO);

        RegionMonitoringDTO result = regionMonitoringService.getById(1L);

        assertNotNull(result);
        assertEquals(1L, result.id());
        verify(regionMonitoringRepository).findById(1L);
    }

    @Test
    @DisplayName("Test BaseServiceImpl inherited methods - update")
    void update_ShouldUpdateMonitoringData_WhenExists() {
        when(regionMonitoringRepository.findById(1L)).thenReturn(Optional.of(regionMonitoring));
        when(regionMonitoringRepository.save(regionMonitoring)).thenReturn(regionMonitoring);
        when(regionMonitoringMapper.toDto(regionMonitoring)).thenReturn(regionMonitoringDTO);

        RegionMonitoringDTO result = regionMonitoringService.update(1L, regionMonitoringDTO);

        assertNotNull(result);
        verify(regionMonitoringRepository).findById(1L);
        verify(regionMonitoringMapper).updateEntity(regionMonitoring, regionMonitoringDTO);
        verify(regionMonitoringRepository).save(regionMonitoring);
    }

    @Test
    @DisplayName("Test BaseServiceImpl inherited methods - delete")
    void delete_ShouldDeleteMonitoringData_WhenExists() {
        when(regionMonitoringRepository.existsById(1L)).thenReturn(true);

        regionMonitoringService.delete(1L);

        verify(regionMonitoringRepository).existsById(1L);
        verify(regionMonitoringRepository).deleteById(1L);
    }

    @Test
    @DisplayName("Test BaseServiceImpl inherited methods - getAll")
    void getAll_ShouldReturnAllMonitoringData() {
        List<RegionMonitoring> monitoringList = Arrays.asList(regionMonitoring);
        when(regionMonitoringRepository.findAll()).thenReturn(monitoringList);
        when(regionMonitoringMapper.toDto(regionMonitoring)).thenReturn(regionMonitoringDTO);

        List<RegionMonitoringDTO> result = regionMonitoringService.getAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(regionMonitoringRepository).findAll();
    }

    @Test
    @DisplayName("Test BaseServiceImpl inherited methods - getAll with pagination")
    void getAll_ShouldReturnPagedMonitoringData() {
        Page<RegionMonitoring> monitoringPage = new PageImpl<>(Arrays.asList(regionMonitoring));
        when(regionMonitoringRepository.findAll(pageable)).thenReturn(monitoringPage);
        when(regionMonitoringMapper.toDto(regionMonitoring)).thenReturn(regionMonitoringDTO);

        Page<RegionMonitoringDTO> result = regionMonitoringService.getAll(pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(regionMonitoringRepository).findAll(pageable);
    }
} 