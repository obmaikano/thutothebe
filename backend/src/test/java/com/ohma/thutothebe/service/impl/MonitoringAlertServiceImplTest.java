package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.MonitoringAlertDTO;
import com.ohma.thutothebe.entity.MonitoringAlert;
import com.ohma.thutothebe.entity.MonitoringAlertSeverity;
import com.ohma.thutothebe.entity.MonitoringAlertType;
import com.ohma.thutothebe.entity.MonitoringScope;
import com.ohma.thutothebe.mapper.MonitoringAlertMapper;
import com.ohma.thutothebe.repository.MonitoringAlertRepository;
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

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MonitoringAlertServiceImplTest {

    @Mock
    private MonitoringAlertRepository monitoringAlertRepository;

    @Mock
    private MonitoringAlertMapper monitoringAlertMapper;

    private MonitoringAlertServiceImpl monitoringAlertService;

    private MonitoringAlert monitoringAlert;
    private MonitoringAlertDTO monitoringAlertDTO;
    private LocalDateTime testDateTime;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        // Create service instance and inject mocked dependencies
        monitoringAlertService = new MonitoringAlertServiceImpl(monitoringAlertRepository);
        ReflectionTestUtils.setField(monitoringAlertService, "monitoringAlertRepository", monitoringAlertRepository);
        ReflectionTestUtils.setField(monitoringAlertService, "monitoringAlertMapper", monitoringAlertMapper);

        testDateTime = LocalDateTime.now();
        pageable = PageRequest.of(0, 10);

        monitoringAlert = new MonitoringAlert();
        monitoringAlert.setId(1L);
        monitoringAlert.setAlertType(MonitoringAlertType.IRREGULAR_ATTENDANCE);
        monitoringAlert.setSeverity(MonitoringAlertSeverity.HIGH);
        monitoringAlert.setScope(MonitoringScope.SCHOOL);
        monitoringAlert.setScopeId(1L);
        monitoringAlert.setTitle("Low Attendance Alert");
        monitoringAlert.setDescription("School attendance below threshold");
        monitoringAlert.setThresholdValue(80.0);
        monitoringAlert.setActualValue(75.0);
        monitoringAlert.setMetricName("attendance_rate");
        monitoringAlert.setAlertTimestamp(testDateTime);
        monitoringAlert.setAcknowledged(false);
        monitoringAlert.setAcknowledgedAt(null);
        monitoringAlert.setAcknowledgedBy(null);
        monitoringAlert.setResolved(false);
        monitoringAlert.setResolvedAt(null);
        monitoringAlert.setResolvedBy(null);
        monitoringAlert.setNotificationSent(false);
        monitoringAlert.setActive(true);

        monitoringAlertDTO = new MonitoringAlertDTO(
            1L, MonitoringAlertType.IRREGULAR_ATTENDANCE, MonitoringAlertSeverity.HIGH,
            MonitoringScope.SCHOOL, 1L, 1L, "Test School", 1L, "Test Region",
            "Low Attendance Alert", "School attendance below threshold", 80.0, 75.0, "attendance_rate",
            testDateTime, false, null, null, false, null, null, null,
            false, null, true
        );
    }

    @Test
    @DisplayName("Test findBySchoolId")
    void findBySchoolId_ShouldReturnAlerts() {
        List<MonitoringAlert> alerts = Arrays.asList(monitoringAlert);
        when(monitoringAlertRepository.findBySchoolId(1L)).thenReturn(alerts);
        when(monitoringAlertMapper.toDto(monitoringAlert)).thenReturn(monitoringAlertDTO);

        List<MonitoringAlertDTO> result = monitoringAlertService.findBySchoolId(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(MonitoringScope.SCHOOL, result.get(0).scope());
        verify(monitoringAlertRepository).findBySchoolId(1L);
    }

    @Test
    @DisplayName("Test findByRegionId")
    void findByRegionId_ShouldReturnAlerts() {
        List<MonitoringAlert> alerts = Arrays.asList(monitoringAlert);
        when(monitoringAlertRepository.findByRegionId(1L)).thenReturn(alerts);
        when(monitoringAlertMapper.toDto(monitoringAlert)).thenReturn(monitoringAlertDTO);

        List<MonitoringAlertDTO> result = monitoringAlertService.findByRegionId(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(monitoringAlertRepository).findByRegionId(1L);
    }

    @Test
    @DisplayName("Test findByScope")
    void findByScope_ShouldReturnAlerts() {
        List<MonitoringAlert> alerts = Arrays.asList(monitoringAlert);
        when(monitoringAlertRepository.findByScope(MonitoringScope.SCHOOL)).thenReturn(alerts);
        when(monitoringAlertMapper.toDto(monitoringAlert)).thenReturn(monitoringAlertDTO);

        List<MonitoringAlertDTO> result = monitoringAlertService.findByScope(MonitoringScope.SCHOOL);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(MonitoringScope.SCHOOL, result.get(0).scope());
        verify(monitoringAlertRepository).findByScope(MonitoringScope.SCHOOL);
    }

    @Test
    @DisplayName("Test findByAlertType")
    void findByAlertType_ShouldReturnAlerts() {
        List<MonitoringAlert> alerts = Arrays.asList(monitoringAlert);
        when(monitoringAlertRepository.findByAlertType(MonitoringAlertType.IRREGULAR_ATTENDANCE)).thenReturn(alerts);
        when(monitoringAlertMapper.toDto(monitoringAlert)).thenReturn(monitoringAlertDTO);

        List<MonitoringAlertDTO> result = monitoringAlertService.findByAlertType(MonitoringAlertType.IRREGULAR_ATTENDANCE);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(MonitoringAlertType.IRREGULAR_ATTENDANCE, result.get(0).alertType());
        verify(monitoringAlertRepository).findByAlertType(MonitoringAlertType.IRREGULAR_ATTENDANCE);
    }

    @Test
    @DisplayName("Test findBySeverity")
    void findBySeverity_ShouldReturnAlerts() {
        List<MonitoringAlert> alerts = Arrays.asList(monitoringAlert);
        when(monitoringAlertRepository.findBySeverity(MonitoringAlertSeverity.HIGH)).thenReturn(alerts);
        when(monitoringAlertMapper.toDto(monitoringAlert)).thenReturn(monitoringAlertDTO);

        List<MonitoringAlertDTO> result = monitoringAlertService.findBySeverity(MonitoringAlertSeverity.HIGH);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(MonitoringAlertSeverity.HIGH, result.get(0).severity());
        verify(monitoringAlertRepository).findBySeverity(MonitoringAlertSeverity.HIGH);
    }

    @Test
    @DisplayName("Test findByAcknowledged")
    void findByAcknowledged_ShouldReturnPagedAlerts() {
        List<MonitoringAlert> alerts = Arrays.asList(monitoringAlert);
        when(monitoringAlertRepository.findByAcknowledged(false)).thenReturn(alerts);
        when(monitoringAlertMapper.toDto(monitoringAlert)).thenReturn(monitoringAlertDTO);

        Page<MonitoringAlertDTO> result = monitoringAlertService.findByAcknowledged(false, pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertFalse(result.getContent().get(0).acknowledged());
        verify(monitoringAlertRepository).findByAcknowledged(false);
    }

    @Test
    @DisplayName("Test findByResolved")
    void findByResolved_ShouldReturnPagedAlerts() {
        List<MonitoringAlert> alerts = Arrays.asList(monitoringAlert);
        when(monitoringAlertRepository.findByResolved(false)).thenReturn(alerts);
        when(monitoringAlertMapper.toDto(monitoringAlert)).thenReturn(monitoringAlertDTO);

        Page<MonitoringAlertDTO> result = monitoringAlertService.findByResolved(false, pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertFalse(result.getContent().get(0).resolved());
        verify(monitoringAlertRepository).findByResolved(false);
    }

    @Test
    @DisplayName("Test findByDateRange")
    void findByDateRange_ShouldReturnAlerts() {
        LocalDateTime startDate = testDateTime.minusDays(1);
        LocalDateTime endDate = testDateTime.plusDays(1);
        Page<MonitoringAlert> alertPage = new PageImpl<>(Arrays.asList(monitoringAlert));
        
        when(monitoringAlertRepository.findByDateRange(startDate, endDate, Pageable.unpaged()))
            .thenReturn(alertPage);
        when(monitoringAlertMapper.toDto(monitoringAlert)).thenReturn(monitoringAlertDTO);

        List<MonitoringAlertDTO> result = monitoringAlertService.findByDateRange(startDate, endDate);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(monitoringAlertRepository).findByDateRange(startDate, endDate, Pageable.unpaged());
    }

    @Test
    @DisplayName("Test findBySchoolIdAndDateRange")
    void findBySchoolIdAndDateRange_ShouldReturnFilteredAlerts() {
        LocalDateTime startDate = testDateTime.minusDays(1);
        LocalDateTime endDate = testDateTime.plusDays(1);
        List<MonitoringAlert> alerts = Arrays.asList(monitoringAlert);
        
        when(monitoringAlertRepository.findBySchoolId(1L)).thenReturn(alerts);
        when(monitoringAlertMapper.toDto(monitoringAlert)).thenReturn(monitoringAlertDTO);

        List<MonitoringAlertDTO> result = monitoringAlertService.findBySchoolIdAndDateRange(1L, startDate, endDate);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(monitoringAlertRepository).findBySchoolId(1L);
    }

    @Test
    @DisplayName("Test findByRegionIdAndDateRange")
    void findByRegionIdAndDateRange_ShouldReturnFilteredAlerts() {
        LocalDateTime startDate = testDateTime.minusDays(1);
        LocalDateTime endDate = testDateTime.plusDays(1);
        List<MonitoringAlert> alerts = Arrays.asList(monitoringAlert);
        
        when(monitoringAlertRepository.findByRegionId(1L)).thenReturn(alerts);
        when(monitoringAlertMapper.toDto(monitoringAlert)).thenReturn(monitoringAlertDTO);

        List<MonitoringAlertDTO> result = monitoringAlertService.findByRegionIdAndDateRange(1L, startDate, endDate);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(monitoringAlertRepository).findByRegionId(1L);
    }

    @Test
    @DisplayName("Test findUnacknowledgedBySeverities")
    void findUnacknowledgedBySeverities_ShouldReturnAlerts() {
        List<MonitoringAlertSeverity> severities = Arrays.asList(MonitoringAlertSeverity.HIGH, MonitoringAlertSeverity.CRITICAL);
        List<MonitoringAlert> alerts = Arrays.asList(monitoringAlert);
        
        when(monitoringAlertRepository.findCriticalUnacknowledgedAlerts(severities)).thenReturn(alerts);
        when(monitoringAlertMapper.toDto(monitoringAlert)).thenReturn(monitoringAlertDTO);

        List<MonitoringAlertDTO> result = monitoringAlertService.findUnacknowledgedBySeverities(severities);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(monitoringAlertRepository).findCriticalUnacknowledgedAlerts(severities);
    }

    @Test
    @DisplayName("Test findUnresolvedBySeverity")
    void findUnresolvedBySeverity_ShouldReturnAlerts() {
        List<MonitoringAlert> alerts = Arrays.asList(monitoringAlert);
        
        when(monitoringAlertRepository.findUnresolvedBySeverity(MonitoringAlertSeverity.HIGH)).thenReturn(alerts);
        when(monitoringAlertMapper.toDto(monitoringAlert)).thenReturn(monitoringAlertDTO);

        List<MonitoringAlertDTO> result = monitoringAlertService.findUnresolvedBySeverity(MonitoringAlertSeverity.HIGH);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(monitoringAlertRepository).findUnresolvedBySeverity(MonitoringAlertSeverity.HIGH);
    }

    @Test
    @DisplayName("Test countUnacknowledgedBySchool")
    void countUnacknowledgedBySchool_ShouldReturnCount() {
        when(monitoringAlertRepository.countUnacknowledgedBySchoolId(1L)).thenReturn(5L);

        Long result = monitoringAlertService.countUnacknowledgedBySchool(1L);

        assertEquals(5L, result);
        verify(monitoringAlertRepository).countUnacknowledgedBySchoolId(1L);
    }

    @Test
    @DisplayName("Test countUnacknowledgedByRegion")
    void countUnacknowledgedByRegion_ShouldReturnCount() {
        when(monitoringAlertRepository.countUnacknowledgedByRegionId(1L)).thenReturn(10L);

        Long result = monitoringAlertService.countUnacknowledgedByRegion(1L);

        assertEquals(10L, result);
        verify(monitoringAlertRepository).countUnacknowledgedByRegionId(1L);
    }

    @Test
    @DisplayName("Test countUnresolvedBySchool")
    void countUnresolvedBySchool_ShouldReturnCount() {
        List<MonitoringAlert> alerts = Arrays.asList(monitoringAlert);
        when(monitoringAlertRepository.findBySchoolId(1L)).thenReturn(alerts);

        Long result = monitoringAlertService.countUnresolvedBySchool(1L);

        assertEquals(1L, result);
        verify(monitoringAlertRepository).findBySchoolId(1L);
    }

    @Test
    @DisplayName("Test countUnresolvedByRegion")
    void countUnresolvedByRegion_ShouldReturnCount() {
        List<MonitoringAlert> alerts = Arrays.asList(monitoringAlert);
        when(monitoringAlertRepository.findByRegionId(1L)).thenReturn(alerts);

        Long result = monitoringAlertService.countUnresolvedByRegion(1L);

        assertEquals(1L, result);
        verify(monitoringAlertRepository).findByRegionId(1L);
    }

    @Test
    @DisplayName("Test getAlertTypeStatistics")
    void getAlertTypeStatistics_ShouldReturnStatistics() {
        LocalDateTime startDate = testDateTime.minusDays(7);
        LocalDateTime endDate = testDateTime;
        
        when(monitoringAlertRepository.countByAlertTypeSince(any(MonitoringAlertType.class), eq(startDate)))
            .thenReturn(3L);

        Map<MonitoringAlertType, Long> result = monitoringAlertService.getAlertTypeStatistics(startDate, endDate);

        assertNotNull(result);
        assertEquals(MonitoringAlertType.values().length, result.size());
        verify(monitoringAlertRepository, times(MonitoringAlertType.values().length))
            .countByAlertTypeSince(any(MonitoringAlertType.class), eq(startDate));
    }

    @Test
    @DisplayName("Test getAlertSeverityStatistics")
    void getAlertSeverityStatistics_ShouldReturnStatistics() {
        LocalDateTime startDate = testDateTime.minusDays(7);
        LocalDateTime endDate = testDateTime;
        
        when(monitoringAlertRepository.countUnacknowledgedBySeverity(any(MonitoringAlertSeverity.class)))
            .thenReturn(2L);

        Map<MonitoringAlertSeverity, Long> result = monitoringAlertService.getAlertSeverityStatistics(startDate, endDate);

        assertNotNull(result);
        assertEquals(MonitoringAlertSeverity.values().length, result.size());
        verify(monitoringAlertRepository, times(MonitoringAlertSeverity.values().length))
            .countUnacknowledgedBySeverity(any(MonitoringAlertSeverity.class));
    }

    @Test
    @DisplayName("Test findPendingNotifications")
    void findPendingNotifications_ShouldReturnPendingAlerts() {
        List<MonitoringAlert> alerts = Arrays.asList(monitoringAlert);
        when(monitoringAlertRepository.findByAcknowledged(false)).thenReturn(alerts);
        when(monitoringAlertMapper.toDto(monitoringAlert)).thenReturn(monitoringAlertDTO);

        List<MonitoringAlertDTO> result = monitoringAlertService.findPendingNotifications();

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(monitoringAlertRepository).findByAcknowledged(false);
    }

    @Test
    @DisplayName("Test findActiveAlertsBySchoolAndType")
    void findActiveAlertsBySchoolAndType_ShouldReturnActiveAlerts() {
        List<MonitoringAlert> alerts = Arrays.asList(monitoringAlert);
        when(monitoringAlertRepository.findBySchoolId(1L)).thenReturn(alerts);
        when(monitoringAlertMapper.toDto(monitoringAlert)).thenReturn(monitoringAlertDTO);

        List<MonitoringAlertDTO> result = monitoringAlertService.findActiveAlertsBySchoolAndType(1L, MonitoringAlertType.IRREGULAR_ATTENDANCE);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(monitoringAlertRepository).findBySchoolId(1L);
    }

    @Test
    @DisplayName("Test findActiveAlertsByRegionAndType")
    void findActiveAlertsByRegionAndType_ShouldReturnActiveAlerts() {
        List<MonitoringAlert> alerts = Arrays.asList(monitoringAlert);
        when(monitoringAlertRepository.findByRegionId(1L)).thenReturn(alerts);
        when(monitoringAlertMapper.toDto(monitoringAlert)).thenReturn(monitoringAlertDTO);

        List<MonitoringAlertDTO> result = monitoringAlertService.findActiveAlertsByRegionAndType(1L, MonitoringAlertType.IRREGULAR_ATTENDANCE);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(monitoringAlertRepository).findByRegionId(1L);
    }

    @Test
    @DisplayName("Test acknowledgeAlert when alert exists and not acknowledged")
    void acknowledgeAlert_ShouldAcknowledgeAlert_WhenExistsAndNotAcknowledged() {
        when(monitoringAlertRepository.findById(1L)).thenReturn(Optional.of(monitoringAlert));
        when(monitoringAlertRepository.save(monitoringAlert)).thenReturn(monitoringAlert);
        when(monitoringAlertMapper.toDto(monitoringAlert)).thenReturn(monitoringAlertDTO);

        MonitoringAlertDTO result = monitoringAlertService.acknowledgeAlert(1L, "admin");

        assertNotNull(result);
        assertTrue(monitoringAlert.isAcknowledged());
        assertEquals("admin", monitoringAlert.getAcknowledgedBy());
        assertNotNull(monitoringAlert.getAcknowledgedAt());
        verify(monitoringAlertRepository).findById(1L);
        verify(monitoringAlertRepository).save(monitoringAlert);
    }

    @Test
    @DisplayName("Test acknowledgeAlert when alert already acknowledged")
    void acknowledgeAlert_ShouldReturnExisting_WhenAlreadyAcknowledged() {
        monitoringAlert.setAcknowledged(true);
        when(monitoringAlertRepository.findById(1L)).thenReturn(Optional.of(monitoringAlert));
        when(monitoringAlertMapper.toDto(monitoringAlert)).thenReturn(monitoringAlertDTO);

        MonitoringAlertDTO result = monitoringAlertService.acknowledgeAlert(1L, "admin");

        assertNotNull(result);
        verify(monitoringAlertRepository).findById(1L);
        verify(monitoringAlertRepository, never()).save(any());
    }

    @Test
    @DisplayName("Test acknowledgeAlert when alert not found")
    void acknowledgeAlert_ShouldThrowException_WhenNotFound() {
        when(monitoringAlertRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> 
            monitoringAlertService.acknowledgeAlert(1L, "admin"));

        verify(monitoringAlertRepository).findById(1L);
        verify(monitoringAlertRepository, never()).save(any());
    }

    @Test
    @DisplayName("Test resolveAlert when alert exists and not resolved")
    void resolveAlert_ShouldResolveAlert_WhenExistsAndNotResolved() {
        when(monitoringAlertRepository.findById(1L)).thenReturn(Optional.of(monitoringAlert));
        when(monitoringAlertRepository.save(monitoringAlert)).thenReturn(monitoringAlert);
        when(monitoringAlertMapper.toDto(monitoringAlert)).thenReturn(monitoringAlertDTO);

        MonitoringAlertDTO result = monitoringAlertService.resolveAlert(1L, "admin", "Issue resolved");

        assertNotNull(result);
        assertTrue(monitoringAlert.isResolved());
        assertTrue(monitoringAlert.isAcknowledged()); // Auto-acknowledged
        assertEquals("admin", monitoringAlert.getResolvedBy());
        assertEquals("Issue resolved", monitoringAlert.getResolutionNotes());
        assertNotNull(monitoringAlert.getResolvedAt());
        verify(monitoringAlertRepository).findById(1L);
        verify(monitoringAlertRepository).save(monitoringAlert);
    }

    @Test
    @DisplayName("Test resolveAlert when alert already resolved")
    void resolveAlert_ShouldReturnExisting_WhenAlreadyResolved() {
        monitoringAlert.setResolved(true);
        when(monitoringAlertRepository.findById(1L)).thenReturn(Optional.of(monitoringAlert));
        when(monitoringAlertMapper.toDto(monitoringAlert)).thenReturn(monitoringAlertDTO);

        MonitoringAlertDTO result = monitoringAlertService.resolveAlert(1L, "admin", "Issue resolved");

        assertNotNull(result);
        verify(monitoringAlertRepository).findById(1L);
        verify(monitoringAlertRepository, never()).save(any());
    }

    @Test
    @DisplayName("Test resolveAlert when alert not found")
    void resolveAlert_ShouldThrowException_WhenNotFound() {
        when(monitoringAlertRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> 
            monitoringAlertService.resolveAlert(1L, "admin", "Issue resolved"));

        verify(monitoringAlertRepository).findById(1L);
        verify(monitoringAlertRepository, never()).save(any());
    }

    @Test
    @DisplayName("Test createAlert")
    void createAlert_ShouldCreateNewAlert() {
        when(monitoringAlertRepository.save(any(MonitoringAlert.class))).thenReturn(monitoringAlert);
        when(monitoringAlertMapper.toDto(monitoringAlert)).thenReturn(monitoringAlertDTO);

        MonitoringAlertDTO result = monitoringAlertService.createAlert(
            MonitoringAlertType.IRREGULAR_ATTENDANCE,
            MonitoringAlertSeverity.HIGH,
            MonitoringScope.SCHOOL,
            1L,
            "Low Attendance Alert",
            "School attendance below threshold",
            80.0,
            75.0,
            "attendance_rate"
        );

        assertNotNull(result);
        verify(monitoringAlertRepository).save(any(MonitoringAlert.class));
    }

    @Test
    @DisplayName("Test processAlerts")
    void processAlerts_ShouldExecuteWithoutError() {
        // Mock the dependencies for checkThresholds and sendNotifications
        when(monitoringAlertRepository.countUnacknowledgedBySeverity(any(MonitoringAlertSeverity.class)))
            .thenReturn(3L);
        when(monitoringAlertRepository.findByAcknowledged(false)).thenReturn(Arrays.asList());

        assertDoesNotThrow(() -> monitoringAlertService.processAlerts());
    }

    @Test
    @DisplayName("Test sendNotifications")
    void sendNotifications_ShouldProcessPendingNotifications() {
        List<MonitoringAlert> pendingAlerts = Arrays.asList(monitoringAlert);
        when(monitoringAlertRepository.findByAcknowledged(false)).thenReturn(pendingAlerts);
        when(monitoringAlertRepository.save(monitoringAlert)).thenReturn(monitoringAlert);

        monitoringAlertService.sendNotifications();

        assertTrue(monitoringAlert.isNotificationSent());
        assertNotNull(monitoringAlert.getNotificationSentAt());
        verify(monitoringAlertRepository).findByAcknowledged(false);
        verify(monitoringAlertRepository).save(monitoringAlert);
    }

    @Test
    @DisplayName("Test checkThresholds")
    void checkThresholds_ShouldCheckAndCreateAlerts() {
        when(monitoringAlertRepository.countUnacknowledgedBySeverity(any(MonitoringAlertSeverity.class)))
            .thenReturn(15L); // Above threshold for some severities
        when(monitoringAlertRepository.save(any(MonitoringAlert.class))).thenReturn(monitoringAlert);

        monitoringAlertService.checkThresholds();

        verify(monitoringAlertRepository, atLeastOnce()).countUnacknowledgedBySeverity(any(MonitoringAlertSeverity.class));
    }

    @Test
    @DisplayName("Test BaseServiceImpl inherited methods - create")
    void create_ShouldCreateNewAlert() {
        when(monitoringAlertMapper.toEntity(monitoringAlertDTO)).thenReturn(monitoringAlert);
        when(monitoringAlertRepository.save(monitoringAlert)).thenReturn(monitoringAlert);
        when(monitoringAlertMapper.toDto(monitoringAlert)).thenReturn(monitoringAlertDTO);

        MonitoringAlertDTO result = monitoringAlertService.create(monitoringAlertDTO);

        assertNotNull(result);
        assertEquals(monitoringAlertDTO.alertType(), result.alertType());
        verify(monitoringAlertRepository).save(monitoringAlert);
    }

    @Test
    @DisplayName("Test BaseServiceImpl inherited methods - getById")
    void getById_ShouldReturnAlert_WhenExists() {
        when(monitoringAlertRepository.findById(1L)).thenReturn(Optional.of(monitoringAlert));
        when(monitoringAlertMapper.toDto(monitoringAlert)).thenReturn(monitoringAlertDTO);

        MonitoringAlertDTO result = monitoringAlertService.getById(1L);

        assertNotNull(result);
        assertEquals(1L, result.id());
        verify(monitoringAlertRepository).findById(1L);
    }

    @Test
    @DisplayName("Test BaseServiceImpl inherited methods - update")
    void update_ShouldUpdateAlert_WhenExists() {
        when(monitoringAlertRepository.findById(1L)).thenReturn(Optional.of(monitoringAlert));
        when(monitoringAlertRepository.save(monitoringAlert)).thenReturn(monitoringAlert);
        when(monitoringAlertMapper.toDto(monitoringAlert)).thenReturn(monitoringAlertDTO);

        MonitoringAlertDTO result = monitoringAlertService.update(1L, monitoringAlertDTO);

        assertNotNull(result);
        verify(monitoringAlertRepository).findById(1L);
        verify(monitoringAlertMapper).updateEntity(monitoringAlert, monitoringAlertDTO);
        verify(monitoringAlertRepository).save(monitoringAlert);
    }

    @Test
    @DisplayName("Test BaseServiceImpl inherited methods - delete")
    void delete_ShouldDeleteAlert_WhenExists() {
        when(monitoringAlertRepository.existsById(1L)).thenReturn(true);

        monitoringAlertService.delete(1L);

        verify(monitoringAlertRepository).existsById(1L);
        verify(monitoringAlertRepository).deleteById(1L);
    }

    @Test
    @DisplayName("Test BaseServiceImpl inherited methods - getAll")
    void getAll_ShouldReturnAllAlerts() {
        List<MonitoringAlert> alerts = Arrays.asList(monitoringAlert);
        when(monitoringAlertRepository.findAll()).thenReturn(alerts);
        when(monitoringAlertMapper.toDto(monitoringAlert)).thenReturn(monitoringAlertDTO);

        List<MonitoringAlertDTO> result = monitoringAlertService.getAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(monitoringAlertRepository).findAll();
    }

    @Test
    @DisplayName("Test BaseServiceImpl inherited methods - getAll with pagination")
    void getAll_ShouldReturnPagedAlerts() {
        Page<MonitoringAlert> alertPage = new PageImpl<>(Arrays.asList(monitoringAlert));
        when(monitoringAlertRepository.findAll(pageable)).thenReturn(alertPage);
        when(monitoringAlertMapper.toDto(monitoringAlert)).thenReturn(monitoringAlertDTO);

        Page<MonitoringAlertDTO> result = monitoringAlertService.getAll(pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(monitoringAlertRepository).findAll(pageable);
    }
} 