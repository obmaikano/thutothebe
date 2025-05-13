package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.GradeCategoryDTO;
import com.ohma.thutothebe.dto.CourseDTO;
import com.ohma.thutothebe.entity.GradeCategory;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.exception.GradeCategoryNotFoundException;
import com.ohma.thutothebe.mapper.GradeCategoryMapper;
import com.ohma.thutothebe.mapper.CourseMapper;
import com.ohma.thutothebe.repository.GradeCategoryRepository;
import com.ohma.thutothebe.service.CourseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GradeCategoryServiceImplTest {

    @Mock
    private GradeCategoryRepository gradeCategoryRepository;

    @Mock
    private GradeCategoryMapper gradeCategoryMapper;

    @Mock
    private CourseService courseService;

    @Mock
    private CourseMapper courseMapper;

    @InjectMocks
    private GradeCategoryServiceImpl gradeCategoryService;

    private Course testCourse;
    private GradeCategory testCategory;
    private GradeCategoryDTO testCategoryDTO;
    private CourseDTO testCourseDTO;

    @BeforeEach
    void setUp() {
        // Setup test course
        testCourse = new Course();
        testCourse.setId(1L);
        testCourse.setName("Test Course");

        // Setup test course DTO
        testCourseDTO = new CourseDTO(
            1L,
            "TEST101",
            "Test Course",
            "Test Description",
            1L,
            Set.of(),
            true,
            1L
        );

        // Setup test category
        testCategory = new GradeCategory();
        testCategory.setId(1L);
        testCategory.setName("Test Category");
        testCategory.setDescription("Test Description");
        testCategory.setWeight(50.0);
        testCategory.setCourse(testCourse);
        testCategory.setActive(true);
        testCategory.setMinGrade(0.0);
        testCategory.setMaxGrade(100.0);
        testCategory.setPassingGrade(60.0);

        // Setup test DTO
        testCategoryDTO = new GradeCategoryDTO(
            1L,
            "Test Category",
            "Test Description",
            50.0,
            1L,
            true,
            0.0,
            100.0,
            60.0
        );
    }

    @Test
    void getByCourse_ShouldReturnCategories() {
        // Arrange
        when(courseService.getById(1L)).thenReturn(testCourseDTO);
        when(courseMapper.toEntity(testCourseDTO)).thenReturn(testCourse);
        when(gradeCategoryRepository.findByCourse(testCourse)).thenReturn(Arrays.asList(testCategory));
        when(gradeCategoryMapper.toDto(testCategory)).thenReturn(testCategoryDTO);

        // Act
        List<GradeCategoryDTO> result = gradeCategoryService.getByCourse(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testCategoryDTO, result.get(0));
        verify(courseService).getById(1L);
        verify(courseMapper).toEntity(testCourseDTO);
        verify(gradeCategoryRepository).findByCourse(testCourse);
        verify(gradeCategoryMapper).toDto(testCategory);
    }

    @Test
    void getActiveByCourse_ShouldReturnActiveCategories() {
        // Arrange
        when(courseService.getById(1L)).thenReturn(testCourseDTO);
        when(courseMapper.toEntity(testCourseDTO)).thenReturn(testCourse);
        when(gradeCategoryRepository.findByCourseAndActive(testCourse, true)).thenReturn(Arrays.asList(testCategory));
        when(gradeCategoryMapper.toDto(testCategory)).thenReturn(testCategoryDTO);

        // Act
        List<GradeCategoryDTO> result = gradeCategoryService.getActiveByCourse(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testCategoryDTO, result.get(0));
        verify(courseService).getById(1L);
        verify(courseMapper).toEntity(testCourseDTO);
        verify(gradeCategoryRepository).findByCourseAndActive(testCourse, true);
        verify(gradeCategoryMapper).toDto(testCategory);
    }

    @Test
    void getTotalWeightByCourse_ShouldReturnTotalWeight() {
        // Arrange
        when(courseService.getById(1L)).thenReturn(testCourseDTO);
        when(courseMapper.toEntity(testCourseDTO)).thenReturn(testCourse);
        when(gradeCategoryRepository.findTotalWeightByCourse(testCourse)).thenReturn(100.0);

        // Act
        Double result = gradeCategoryService.getTotalWeightByCourse(1L);

        // Assert
        assertNotNull(result);
        assertEquals(100.0, result);
        verify(courseService).getById(1L);
        verify(courseMapper).toEntity(testCourseDTO);
        verify(gradeCategoryRepository).findTotalWeightByCourse(testCourse);
    }

    @Test
    void getAveragePassingGradeByCourse_ShouldReturnAverage() {
        // Arrange
        when(courseService.getById(1L)).thenReturn(testCourseDTO);
        when(courseMapper.toEntity(testCourseDTO)).thenReturn(testCourse);
        when(gradeCategoryRepository.findAveragePassingGradeByCourse(testCourse)).thenReturn(60.0);

        // Act
        Double result = gradeCategoryService.getAveragePassingGradeByCourse(1L);

        // Assert
        assertNotNull(result);
        assertEquals(60.0, result);
        verify(courseService).getById(1L);
        verify(courseMapper).toEntity(testCourseDTO);
        verify(gradeCategoryRepository).findAveragePassingGradeByCourse(testCourse);
    }

    @Test
    void createCategory_ShouldCreateAndReturnCategory() {
        // Arrange
        when(gradeCategoryMapper.toEntity(testCategoryDTO)).thenReturn(testCategory);
        when(gradeCategoryRepository.save(testCategory)).thenReturn(testCategory);
        when(gradeCategoryMapper.toDto(testCategory)).thenReturn(testCategoryDTO);

        // Act
        GradeCategoryDTO result = gradeCategoryService.create(testCategoryDTO);

        // Assert
        assertNotNull(result);
        assertEquals(testCategoryDTO, result);
        verify(gradeCategoryMapper).toEntity(testCategoryDTO);
        verify(gradeCategoryRepository).save(testCategory);
        verify(gradeCategoryMapper).toDto(testCategory);
    }

    @Test
    void updateCategory_ShouldUpdateAndReturnCategory() {
        // Arrange
        when(gradeCategoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        when(gradeCategoryRepository.save(testCategory)).thenReturn(testCategory);
        when(gradeCategoryMapper.toDto(testCategory)).thenReturn(testCategoryDTO);

        // Act
        GradeCategoryDTO result = gradeCategoryService.update(1L, testCategoryDTO);

        // Assert
        assertNotNull(result);
        assertEquals(testCategoryDTO, result);
        verify(gradeCategoryRepository).findById(1L);
        verify(gradeCategoryMapper).updateEntityFromDto(testCategoryDTO, testCategory);
        verify(gradeCategoryRepository).save(testCategory);
        verify(gradeCategoryMapper).toDto(testCategory);
    }

    @Test
    void updateCategory_WhenCategoryNotFound_ShouldThrowException() {
        // Arrange
        when(gradeCategoryRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(GradeCategoryNotFoundException.class, () -> 
            gradeCategoryService.update(1L, testCategoryDTO)
        );
        verify(gradeCategoryRepository).findById(1L);
        verify(gradeCategoryMapper, never()).updateEntityFromDto(any(), any());
        verify(gradeCategoryRepository, never()).save(any());
    }

    @Test
    void deleteCategory_ShouldDeleteCategory() {
        // Arrange
        when(gradeCategoryRepository.existsById(1L)).thenReturn(true);

        // Act
        gradeCategoryService.delete(1L);

        // Assert
        verify(gradeCategoryRepository).existsById(1L);
        verify(gradeCategoryRepository).deleteById(1L);
    }

    @Test
    void deleteCategory_WhenCategoryNotFound_ShouldThrowException() {
        // Arrange
        when(gradeCategoryRepository.existsById(1L)).thenReturn(false);

        // Act & Assert
        assertThrows(GradeCategoryNotFoundException.class, () -> 
            gradeCategoryService.delete(1L)
        );
        verify(gradeCategoryRepository).existsById(1L);
        verify(gradeCategoryRepository, never()).deleteById(any());
    }

    @Test
    void constructGradeCategoryDTO_WithInvalidWeight_ShouldThrowException() {
        // Act & Assert
        assertThrows(IllegalArgumentException.class, () ->
                new GradeCategoryDTO(
                        null,
                        "Test Category",
                        "Test Description",
                        150.0, // Invalid weight > 100
                        1L,
                        true,
                        0.0,
                        100.0,
                        60.0
                )
        );
    }

    @Test
    void constructGradeCategoryDTO_WithInvalidGradeRange_ShouldThrowException() {
        // Act & Assert
        assertThrows(IllegalArgumentException.class, () ->
                new GradeCategoryDTO(
                        null,
                        "Test Category",
                        "Test Description",
                        50.0,
                        1L,
                        true,
                        80.0, // Min grade > max grade
                        60.0,
                        60.0
                )
        );
    }

    @Test
    void createCategory_WithInvalidPassingGrade_ShouldThrowException() {
        // Act & Assert
        assertThrows(IllegalArgumentException.class, () ->
                new GradeCategoryDTO(
                        null,
                        "Test Category",
                        "Test Description",
                        50.0,
                        1L,
                        true,
                        0.0,
                        100.0,
                        150.0 // Invalid passing grade
                )
        );

    }
} 