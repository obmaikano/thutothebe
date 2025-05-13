package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.SystemUsageDTO;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.Module;
import com.ohma.thutothebe.entity.SystemUsage;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.entity.UserRole;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.SystemUsageMapper;
import com.ohma.thutothebe.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SystemUsageServiceImplTest {

    @Mock
    private SystemUsageRepository systemUsageRepository;

    @Mock
    private SystemUsageMapper systemUsageMapper;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private ModuleRepository moduleRepository;

    @InjectMocks
    private SystemUsageServiceImpl systemUsageService;

    private SystemUsage systemUsage;
    private SystemUsageDTO systemUsageDTO;
    private User student;
    private User teacher;
    private User admin;
    private Course course;
    private Module module;
    private LocalDateTime now;

    @BeforeEach
    void setUp() {
        now = LocalDateTime.now();
        
        // Setup SystemUsage
        systemUsage = new SystemUsage();
        systemUsage.setId(1L);
        systemUsage.setTimestamp(now);
        systemUsage.setActiveUsers(10);
        systemUsage.setTotalLogins(50);
        systemUsage.setInstructorCount(5);
        systemUsage.setStudentCount(40);
        systemUsage.setAdminCount(2);
        systemUsage.setPeakModule("Test Module");
        systemUsage.setPeakCourse("Test Course");

        // Setup SystemUsageDTO
        systemUsageDTO = new SystemUsageDTO(
            1L,
            now,
            10,
            50,
            5,
            40,
            2,
            "Test Module",
            "Test Course"
        );

        // Setup Users
        student = new User();
        student.setId(1L);
        student.setRole(UserRole.STUDENT);
        student.setCreatedAt(now);

        teacher = new User();
        teacher.setId(2L);
        teacher.setRole(UserRole.TEACHER);
        teacher.setCreatedAt(now);

        admin = new User();
        admin.setId(3L);
        admin.setRole(UserRole.ADMIN);
        admin.setCreatedAt(now);

        // Setup Course
        course = new Course();
        course.setId(1L);
        course.setName("Test Course");
        course.setActive(true);
        course.setStudents(new HashSet<>(Arrays.asList(student)));

        // Setup Module
        module = new Module();
        module.setId(1L);
        module.setTitle("Test Module");
        module.setAccessCount(100L);
        module.setCourse(course);
    }

    @Test
    void getCurrentUsage_ShouldReturnLatestUsage() {
        when(systemUsageRepository.findFirstByOrderByTimestampDesc())
            .thenReturn(Optional.of(systemUsage));
        when(systemUsageMapper.toDto(systemUsage))
            .thenReturn(systemUsageDTO);

        SystemUsageDTO result = systemUsageService.getCurrentUsage();

        assertThat(result).isNotNull();
        assertThat(result.timestamp()).isEqualTo(now);
        assertThat(result.activeUsers()).isEqualTo(10);
        assertThat(result.totalLogins()).isEqualTo(50);
        verify(systemUsageRepository).findFirstByOrderByTimestampDesc();
    }

    @Test
    void getCurrentUsage_ShouldThrowException_WhenNoDataFound() {
        when(systemUsageRepository.findFirstByOrderByTimestampDesc())
            .thenReturn(Optional.empty());

        assertThatThrownBy(() -> systemUsageService.getCurrentUsage())
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("No system usage data found");
    }

    @Test
    void getUsageByDateRange_ShouldReturnUsageList() {
        LocalDateTime startDate = now.minusDays(1);
        LocalDateTime endDate = now;
        List<SystemUsage> usages = Arrays.asList(systemUsage);

        when(systemUsageRepository.findByDateRange(startDate, endDate))
            .thenReturn(usages);
        when(systemUsageMapper.toDto(any(SystemUsage.class)))
            .thenReturn(systemUsageDTO);

        List<SystemUsageDTO> result = systemUsageService.getUsageByDateRange(startDate, endDate);

        assertThat(result).isNotNull();
        assertThat(result).hasSize(1);
        assertThat(result.get(0)).isEqualTo(systemUsageDTO);
        verify(systemUsageRepository).findByDateRange(startDate, endDate);
    }

    @Test
    void updateSystemUsage_ShouldCalculateAndSaveStatistics() {
        // Mock user counts
        when(userRepository.countByLastLoginTimeAfter(any(LocalDateTime.class)))
            .thenReturn(10);
        when(userRepository.countByRole(UserRole.TEACHER))
            .thenReturn(5);
        when(userRepository.countByRole(UserRole.STUDENT))
            .thenReturn(40);
        when(userRepository.countByRole(UserRole.ADMIN))
            .thenReturn(2);

        // Mock module and course data
        when(moduleRepository.findMostAccessed())
            .thenReturn(Arrays.asList(module));
        when(courseRepository.findByActiveTrue())
            .thenReturn(new HashSet<>(Arrays.asList(course)));

        // Mock save operation
        when(systemUsageRepository.save(any(SystemUsage.class)))
            .thenReturn(systemUsage);

        systemUsageService.updateSystemUsage();

        verify(systemUsageRepository).save(any(SystemUsage.class));
        verify(userRepository, times(2)).countByLastLoginTimeAfter(any(LocalDateTime.class));
        verify(userRepository).countByRole(UserRole.TEACHER);
        verify(userRepository).countByRole(UserRole.STUDENT);
        verify(userRepository).countByRole(UserRole.ADMIN);
        verify(moduleRepository).findMostAccessed();
        verify(courseRepository).findByActiveTrue();
    }

    @Test
    void updateSystemUsageScheduled_ShouldHandleExceptions() {
        doThrow(new RuntimeException("Test exception"))
            .when(systemUsageRepository).save(any(SystemUsage.class));

        systemUsageService.updateSystemUsageScheduled();

        // Should not throw exception
        verify(systemUsageRepository).save(any(SystemUsage.class));
    }

    @Test
    void calculateActiveUsers_ShouldReturnCorrectCount() {
        LocalDateTime fifteenMinutesAgo = now.minusMinutes(15);
        when(userRepository.countByLastLoginTimeAfter(fifteenMinutesAgo))
            .thenReturn(10);

        Integer result = systemUsageService.calculateActiveUsers();

        assertThat(result).isEqualTo(10);
        verify(userRepository).countByLastLoginTimeAfter(fifteenMinutesAgo);
    }

    @Test
    void calculateTotalLogins_ShouldReturnCorrectCount() {
        LocalDateTime today = now.withHour(0).withMinute(0).withSecond(0);
        when(userRepository.countByLastLoginTimeAfter(today))
            .thenReturn(50);

        Integer result = systemUsageService.calculateTotalLogins();

        assertThat(result).isEqualTo(50);
        verify(userRepository).countByLastLoginTimeAfter(today);
    }

    @Test
    void calculatePeakModule_ShouldReturnMostAccessedModule() {
        when(moduleRepository.findMostAccessed())
            .thenReturn(Arrays.asList(module));

        String result = systemUsageService.calculatePeakModule();

        assertThat(result).isEqualTo("Test Module");
        verify(moduleRepository).findMostAccessed();
    }

    @Test
    void calculatePeakModule_ShouldReturnNA_WhenNoModules() {
        when(moduleRepository.findMostAccessed())
            .thenReturn(Collections.emptyList());

        String result = systemUsageService.calculatePeakModule();

        assertThat(result).isEqualTo("N/A");
        verify(moduleRepository).findMostAccessed();
    }

    @Test
    void calculatePeakCourse_ShouldReturnCourseWithMostStudents() {
        when(courseRepository.findByActiveTrue())
            .thenReturn(new HashSet<>(Arrays.asList(course)));

        String result = systemUsageService.calculatePeakCourse();

        assertThat(result).isEqualTo("Test Course");
        verify(courseRepository).findByActiveTrue();
    }

    @Test
    void calculatePeakCourse_ShouldReturnNA_WhenNoCourses() {
        when(courseRepository.findByActiveTrue())
            .thenReturn(Collections.emptySet());

        String result = systemUsageService.calculatePeakCourse();

        assertThat(result).isEqualTo("N/A");
        verify(courseRepository).findByActiveTrue();
    }
} 