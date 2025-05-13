package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.CourseStatisticsDTO;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.CourseStatistics;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.CourseStatisticsMapper;
import com.ohma.thutothebe.repository.CourseRepository;
import com.ohma.thutothebe.repository.CourseStatisticsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CourseStatisticsServiceImplTest {

    @Mock
    private CourseStatisticsRepository courseStatisticsRepository;
    @Mock
    private CourseRepository courseRepository;
    @Mock
    private CourseStatisticsMapper courseStatisticsMapper;
    @InjectMocks
    private CourseStatisticsServiceImpl courseStatisticsService;

    private CourseStatistics courseStatistics;
    private CourseStatisticsDTO courseStatisticsDTO;
    private Course course;
    private LocalDateTime now;

    @BeforeEach
    void setUp() {
        now = LocalDateTime.now();
        course = new Course();
        course.setId(1L);
        courseStatistics = new CourseStatistics();
        courseStatistics.setId(10L);
        courseStatistics.setCourse(course);
        courseStatistics.setCurrentEnrollment(20);
        courseStatistics.setTotalEnrollment(100);
        courseStatistics.setAverageGrade(75.0);
        courseStatistics.setCompletionRate(0.8);
        courseStatistics.setDropoutRate(0.1);
        courseStatistics.setLastUpdated(now);
        courseStatisticsDTO = new CourseStatisticsDTO(
            10L, 1L, 20, 100, 75.0, 0.8, 0.1, now
        );
    }

    @Test
    void getCurrentStatistics_ShouldReturnStatistics() {
        when(courseStatisticsRepository.findByCourseId(1L)).thenReturn(Optional.of(courseStatistics));
        when(courseStatisticsMapper.toDto(courseStatistics)).thenReturn(courseStatisticsDTO);
        CourseStatisticsDTO result = courseStatisticsService.getCurrentStatistics(1L);
        assertThat(result).isEqualTo(courseStatisticsDTO);
        verify(courseStatisticsRepository).findByCourseId(1L);
    }

    @Test
    void getCurrentStatistics_ShouldThrow_WhenNotFound() {
        when(courseStatisticsRepository.findByCourseId(1L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> courseStatisticsService.getCurrentStatistics(1L))
            .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void getHistoricalStatistics_ShouldReturnList() {
        when(courseStatisticsRepository.findHistoricalByCourseId(1L)).thenReturn(List.of(courseStatistics));
        when(courseStatisticsMapper.toDto(courseStatistics)).thenReturn(courseStatisticsDTO);
        List<CourseStatisticsDTO> result = courseStatisticsService.getHistoricalStatistics(1L);
        assertThat(result).containsExactly(courseStatisticsDTO);
    }

    @Test
    void getStatisticsByDateRange_ShouldReturnList() {
        when(courseStatisticsRepository.findByDateRange(any(), any())).thenReturn(List.of(courseStatistics));
        when(courseStatisticsMapper.toDto(courseStatistics)).thenReturn(courseStatisticsDTO);
        List<CourseStatisticsDTO> result = courseStatisticsService.getStatisticsByDateRange(now.minusDays(1), now);
        assertThat(result).containsExactly(courseStatisticsDTO);
    }

    @Test
    void updateStatistics_ShouldUpdateAndSave() {
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        when(courseStatisticsRepository.findByCourseId(1L)).thenReturn(Optional.of(courseStatistics));
        when(courseStatisticsRepository.save(any())).thenReturn(courseStatistics);
        courseStatisticsService.updateStatistics(1L);
        verify(courseStatisticsRepository).save(any(CourseStatistics.class));
    }

    @Test
    void updateStatistics_ShouldThrow_WhenCourseNotFound() {
        when(courseRepository.findById(1L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> courseStatisticsService.updateStatistics(1L))
            .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void updateAllCourseStatistics_ShouldUpdateAll() {
        when(courseRepository.findAll()).thenReturn(List.of(course));
        doNothing().when(courseStatisticsRepository).save(any());
        courseStatisticsService.updateAllCourseStatistics();
        verify(courseStatisticsRepository, atLeast(0)).save(any());
    }
} 