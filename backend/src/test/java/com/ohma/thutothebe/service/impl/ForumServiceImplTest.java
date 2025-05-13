package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.ForumDTO;
import com.ohma.thutothebe.entity.Forum;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.ForumMapper;
import com.ohma.thutothebe.repository.ForumRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ForumServiceImplTest {

    @Mock
    private ForumRepository forumRepository;

    @Mock
    private ForumMapper forumMapper;

    @InjectMocks
    private ForumServiceImpl forumService;

    private Forum forum;
    private ForumDTO forumDTO;

    @BeforeEach
    void setUp() {
        forum = new Forum();
        forum.setId(1L);
        forum.setTitle("Test Forum");
        forum.setDescription("Test Description");
        forum.setActive(true);

        forumDTO = new ForumDTO(1L, "Test Forum", "Test Description", 1L, true);
    }

    @Test
    void create_ShouldCreateNewForum() {
        when(forumMapper.toEntity(any(ForumDTO.class))).thenReturn(forum);
        when(forumRepository.save(any(Forum.class))).thenReturn(forum);
        when(forumMapper.toDto(any(Forum.class))).thenReturn(forumDTO);

        ForumDTO result = forumService.create(forumDTO);

        assertNotNull(result);
        assertEquals(forumDTO.id(), result.id());
        assertEquals(forumDTO.title(), result.title());
        verify(forumRepository).save(any(Forum.class));
    }

    @Test
    void getById_ShouldReturnForum() {
        when(forumRepository.findById(1L)).thenReturn(Optional.of(forum));
        when(forumMapper.toDto(any(Forum.class))).thenReturn(forumDTO);

        ForumDTO result = forumService.getById(1L);

        assertNotNull(result);
        assertEquals(forumDTO.id(), result.id());
    }

    @Test
    void getById_ShouldThrowException_WhenForumNotFound() {
        when(forumRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> forumService.getById(1L));
    }

    @Test
    void getAll_ShouldReturnAllForums() {
        List<Forum> forums = Arrays.asList(forum);
        when(forumRepository.findAll()).thenReturn(forums);
        when(forumMapper.toDto(any(Forum.class))).thenReturn(forumDTO);

        List<ForumDTO> results = forumService.getAll();

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(forumDTO.id(), results.get(0).id());
    }

    @Test
    void update_ShouldUpdateForum() {
        when(forumRepository.findById(1L)).thenReturn(Optional.of(forum));
        when(forumRepository.save(any(Forum.class))).thenReturn(forum);
        when(forumMapper.toDto(any(Forum.class))).thenReturn(forumDTO);

        ForumDTO result = forumService.update(1L, forumDTO);

        assertNotNull(result);
        assertEquals(forumDTO.id(), result.id());
        verify(forumRepository).save(any(Forum.class));
    }

    @Test
    void update_ShouldThrowException_WhenForumNotFound() {
        when(forumRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> forumService.update(1L, forumDTO));
    }

    @Test
    void delete_ShouldDeleteForum() {
        when(forumRepository.existsById(1L)).thenReturn(true);
        doNothing().when(forumRepository).deleteById(1L);

        assertDoesNotThrow(() -> forumService.delete(1L));
        verify(forumRepository).deleteById(1L);
    }

    @Test
    void delete_ShouldThrowException_WhenForumNotFound() {
        when(forumRepository.existsById(1L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> forumService.delete(1L));
    }

    @Test
    void findByCourseId_ShouldReturnForum() {
        List<Forum> forums = Arrays.asList(forum);
        when(forumRepository.findByCourseId(1L)).thenReturn(forums);
        when(forumMapper.toDto(any(Forum.class))).thenReturn(forumDTO);

        ForumDTO result = forumService.findByCourseId(1L);

        assertNotNull(result);
        assertEquals(forumDTO.id(), result.id());
    }

    @Test
    void findByCourseIdAndActive_ShouldReturnForum() {
        List<Forum> forums = Arrays.asList(forum);
        when(forumRepository.findByCourseIdAndActive(1L, true)).thenReturn(forums);
        when(forumMapper.toDto(any(Forum.class))).thenReturn(forumDTO);

        ForumDTO result = forumService.findByCourseIdAndActive(1L, true);

        assertNotNull(result);
        assertEquals(forumDTO.id(), result.id());
    }

    @Test
    void findByIdWithThreads_ShouldReturnForumWithThreads() {
        when(forumRepository.findByIdWithThreads(1L)).thenReturn(forum);
        when(forumMapper.toDto(any(Forum.class))).thenReturn(forumDTO);

        ForumDTO result = forumService.findByIdWithThreads(1L);

        assertNotNull(result);
        assertEquals(forumDTO.id(), result.id());
    }

    @Test
    void findByCourseIdWithThreads_ShouldReturnForumWithThreads() {
        List<Forum> forums = Arrays.asList(forum);
        when(forumRepository.findByCourseIdWithThreads(1L)).thenReturn(forums);
        when(forumMapper.toDto(any(Forum.class))).thenReturn(forumDTO);

        ForumDTO result = forumService.findByCourseIdWithThreads(1L);

        assertNotNull(result);
        assertEquals(forumDTO.id(), result.id());
    }
} 