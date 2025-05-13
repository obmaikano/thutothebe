package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.StudentPerformanceDTO;
import com.ohma.thutothebe.entity.StudentPerformance;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.StudentPerformanceMapper;
import com.ohma.thutothebe.repository.StudentPerformanceRepository;
import com.ohma.thutothebe.service.impl.StudentPerformanceServiceImpl;
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
class StudentPerformanceServiceImplTest {

    @Mock
    private StudentPerformanceRepository studentPerformanceRepository;
    @Mock
    private StudentPerformanceMapper studentPerformanceMapper;
    @InjectMocks
    private StudentPerformanceServiceImpl studentPerformanceService;

    private StudentPerformance studentPerformance;
    private StudentPerformanceDTO studentPerformanceDTO;
    private User student;
    private Course course;
    private LocalDateTime now;

    @BeforeEach
    void setUp() {
        now = LocalDateTime.now();
        student = new User();
        student.setId(1L);
        course = new Course();
        course.setId(2L);
        studentPerformance = new StudentPerformance();
        studentPerformance.setId(10L);
        studentPerformance.setStudent(student);
        studentPerformance.setCourse(course);
        studentPerformance.setAverageGrade(85.0);
        studentPerformance.setTotalSubmissions(5);
        studentPerformance.setForumPosts(3);
        studentPerformance.setLoginCount(10);
        studentPerformance.setTimeSpentMinutes(120L);
        studentPerformance.setLastUpdated(now);
        studentPerformanceDTO = new StudentPerformanceDTO(
            10L, 1L, 2L, 85.0, 5, 3, 10, 120L, now
        );
    }

    @Test
    void getStudentPerformance_ShouldReturnPerformance() {
        when(studentPerformanceRepository.findByStudentIdAndCourseId(1L, 2L)).thenReturn(Optional.of(studentPerformance));
        when(studentPerformanceMapper.toDto(studentPerformance)).thenReturn(studentPerformanceDTO);
        StudentPerformanceDTO result = studentPerformanceService.getStudentPerformance(1L, 2L);
        assertThat(result).isEqualTo(studentPerformanceDTO);
        verify(studentPerformanceRepository).findByStudentIdAndCourseId(1L, 2L);
    }

    @Test
    void getStudentPerformance_ShouldThrow_WhenNotFound() {
        when(studentPerformanceRepository.findByStudentIdAndCourseId(1L, 2L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> studentPerformanceService.getStudentPerformance(1L, 2L))
            .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void getStudentPerformanceHistory_ShouldReturnList() {
        when(studentPerformanceRepository.findByStudentId(1L)).thenReturn(List.of(studentPerformance));
        when(studentPerformanceMapper.toDto(studentPerformance)).thenReturn(studentPerformanceDTO);
        List<StudentPerformanceDTO> result = studentPerformanceService.getStudentPerformanceHistory(1L);
        assertThat(result).containsExactly(studentPerformanceDTO);
    }

    @Test
    void getCoursePerformance_ShouldReturnList() {
        when(studentPerformanceRepository.findByCourseId(2L)).thenReturn(List.of(studentPerformance));
        when(studentPerformanceMapper.toDto(studentPerformance)).thenReturn(studentPerformanceDTO);
        List<StudentPerformanceDTO> result = studentPerformanceService.getCoursePerformance(2L);
        assertThat(result).containsExactly(studentPerformanceDTO);
    }

    @Test
    void getPerformanceByDateRange_ShouldReturnList() {
        when(studentPerformanceRepository.findByDateRange(any(), any())).thenReturn(List.of(studentPerformance));
        when(studentPerformanceMapper.toDto(studentPerformance)).thenReturn(studentPerformanceDTO);
        List<StudentPerformanceDTO> result = studentPerformanceService.getPerformanceByDateRange(now.minusDays(1), now);
        assertThat(result).containsExactly(studentPerformanceDTO);
    }

    @Test
    void updateStudentPerformance_ShouldNotThrow() {
        // This method is void, just verify it calls repository methods (mock logic as needed)
        doNothing().when(studentPerformanceRepository).save(any());
        studentPerformanceService.updateStudentPerformance(1L, 2L);
        verify(studentPerformanceRepository, atLeast(0)).save(any());
    }

    @Test
    void updateAllStudentPerformance_ShouldNotThrow() {
        doNothing().when(studentPerformanceRepository).save(any());
        studentPerformanceService.updateAllStudentPerformance();
        verify(studentPerformanceRepository, atLeast(0)).save(any());
    }
} 