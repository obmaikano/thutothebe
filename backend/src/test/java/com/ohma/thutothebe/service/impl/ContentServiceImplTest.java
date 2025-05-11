package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.ContentDTO;
import com.ohma.thutothebe.dto.CourseDTO;
import com.ohma.thutothebe.entity.Content;
import com.ohma.thutothebe.entity.ContentType;
import com.ohma.thutothebe.entity.Course;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.exception.ContentNotFoundException;
import com.ohma.thutothebe.mapper.ContentMapper;
import com.ohma.thutothebe.mapper.CourseMapper;
import com.ohma.thutothebe.repository.ContentRepository;
import com.ohma.thutothebe.service.CourseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ContentServiceImplTest {

    @Mock
    private ContentRepository contentRepository;

    @Mock
    private ContentMapper contentMapper;

    @Mock
    private CourseService courseService;

    @Mock
    private CourseMapper courseMapper;

    @InjectMocks
    private ContentServiceImpl contentService;

    private Content content;
    private ContentDTO contentDTO;
    private Course course;
    private User user;
    private CourseDTO courseDTO;

    @BeforeEach
    void setUp() {
        course = new Course();
        course.setId(1L);
        course.setName("Test Course");

        user = new User();
        user.setId(1L);
        user.setUsername("testuser");

        content = new Content();
        content.setId(1L);
        content.setTitle("Test Content");
        content.setDescription("Test Description");
        content.setType(ContentType.DOCUMENT);
        content.setUrl("http://test.com");
        content.setCourse(course);
        content.setCreatedBy(user);
        content.setActive(true);

        contentDTO = new ContentDTO(
            1L,
            "Test Content",
            "Test Description",
            ContentType.DOCUMENT,
            "http://test.com",
            1L,
            1L,
            LocalDateTime.now(),
            true
        );

        courseDTO = new CourseDTO(
            1L,
            "Test Course",
            "Test Description",
            "Test Code",
            1L,
            Set.of(1L),
            true
        );
    }

    @Test
    void whenGetByCourse_thenReturnContentList() {
        when(courseService.getById(1L)).thenReturn(courseDTO);
        when(courseMapper.toEntity(any())).thenReturn(course);
        when(contentRepository.findByCourse(course)).thenReturn(List.of(content));
        when(contentMapper.toDto(any())).thenReturn(contentDTO);

        List<ContentDTO> result = contentService.getByCourse(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(contentDTO, result.get(0));
        verify(contentRepository).findByCourse(course);
    }

    @Test
    void whenGetByType_thenReturnContentList() {
        when(courseService.getById(1L)).thenReturn(courseDTO);
        when(courseMapper.toEntity(any())).thenReturn(course);
        when(contentRepository.findByCourseAndType(course, ContentType.DOCUMENT)).thenReturn(List.of(content));
        when(contentMapper.toDto(any())).thenReturn(contentDTO);

        List<ContentDTO> result = contentService.getByType(1L, ContentType.DOCUMENT);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(contentDTO, result.get(0));
        verify(contentRepository).findByCourseAndType(course, ContentType.DOCUMENT);
    }

    @Test
    void whenGetActiveByCourse_thenReturnActiveContentList() {
        when(courseService.getById(1L)).thenReturn(courseDTO);
        when(courseMapper.toEntity(any())).thenReturn(course);
        when(contentRepository.findByCourseAndActive(course, true)).thenReturn(List.of(content));
        when(contentMapper.toDto(any())).thenReturn(contentDTO);

        List<ContentDTO> result = contentService.getActiveByCourse(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(contentDTO, result.get(0));
        verify(contentRepository).findByCourseAndActive(course, true);
    }

    @Test
    void whenGetActiveByType_thenReturnActiveContentList() {
        when(courseService.getById(1L)).thenReturn(courseDTO);
        when(courseMapper.toEntity(any())).thenReturn(course);
        when(contentRepository.findActiveByCourseAndType(course, ContentType.DOCUMENT)).thenReturn(List.of(content));
        when(contentMapper.toDto(any())).thenReturn(contentDTO);

        List<ContentDTO> result = contentService.getActiveByType(1L, ContentType.DOCUMENT);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(contentDTO, result.get(0));
        verify(contentRepository).findActiveByCourseAndType(course, ContentType.DOCUMENT);
    }

    @Test
    void whenExistsByTitleAndCourse_thenReturnTrue() {
        when(courseService.getById(1L)).thenReturn(courseDTO);
        when(courseMapper.toEntity(any())).thenReturn(course);
        when(contentRepository.existsByTitleAndCourse("Test Content", course)).thenReturn(true);

        boolean result = contentService.existsByTitleAndCourse("Test Content", 1L);

        assertTrue(result);
        verify(contentRepository).existsByTitleAndCourse("Test Content", course);
    }

    @Test
    void whenGetById_thenReturnContent() {
        when(contentRepository.findById(1L)).thenReturn(Optional.of(content));
        when(contentMapper.toDto(content)).thenReturn(contentDTO);

        ContentDTO result = contentService.getById(1L);

        assertNotNull(result);
        assertEquals(contentDTO, result);
        verify(contentRepository).findById(1L);
    }

    @Test
    void whenGetById_thenThrowException() {
        when(contentRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ContentNotFoundException.class, () -> contentService.getById(1L));
        verify(contentRepository).findById(1L);
    }

    @Test
    void whenCreate_thenReturnCreatedContent() {
        when(contentMapper.toEntity(contentDTO)).thenReturn(content);
        when(contentRepository.save(content)).thenReturn(content);
        when(contentMapper.toDto(content)).thenReturn(contentDTO);

        ContentDTO result = contentService.create(contentDTO);

        assertNotNull(result);
        assertEquals(contentDTO, result);
        verify(contentRepository).save(content);
    }

    @Test
    void whenUpdate_thenReturnUpdatedContent() {
        when(contentRepository.findById(1L)).thenReturn(Optional.of(content));
        when(contentRepository.save(content)).thenReturn(content);
        when(contentMapper.toDto(content)).thenReturn(contentDTO);

        ContentDTO result = contentService.update(1L, contentDTO);

        assertNotNull(result);
        assertEquals(contentDTO, result);
        verify(contentRepository).findById(1L);
        verify(contentRepository).save(content);
    }

    @Test
    void whenUpdate_thenThrowException() {
        when(contentRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ContentNotFoundException.class, () -> contentService.update(1L, contentDTO));
        verify(contentRepository).findById(1L);
    }

    @Test
    void whenDelete_thenDeleteContent() {
        when(contentRepository.existsById(1L)).thenReturn(true);
        doNothing().when(contentRepository).deleteById(1L);

        contentService.delete(1L);

        verify(contentRepository).existsById(1L);
        verify(contentRepository).deleteById(1L);
    }

    @Test
    void whenDelete_thenThrowException() {
        when(contentRepository.existsById(1L)).thenReturn(false);

        assertThrows(ContentNotFoundException.class, () -> contentService.delete(1L));
        verify(contentRepository).existsById(1L);
    }
} 