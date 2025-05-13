package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.ThreadDTO;
import com.ohma.thutothebe.entity.Thread;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.ThreadMapper;
import com.ohma.thutothebe.repository.ThreadRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ThreadServiceImplTest {

    @Mock
    private ThreadRepository threadRepository;

    @Mock
    private ThreadMapper threadMapper;

    @InjectMocks
    private ThreadServiceImpl threadService;

    private Thread thread;
    private ThreadDTO threadDTO;
    private LocalDateTime now;

    @BeforeEach
    void setUp() {
        now = LocalDateTime.now();
        
        thread = new Thread();
        thread.setId(1L);
        thread.setTitle("Test Thread");
        thread.setContent("Test Content");
        thread.setActive(true);
        thread.setPinned(false);
        thread.setLastActivityAt(now);

        threadDTO = new ThreadDTO(
            1L,
            "Test Thread",
            "Test Content",
            1L,
            1L,
            false,
            now,
            true
        );
    }

    @Test
    void create_ShouldCreateNewThread() {
        when(threadMapper.toEntity(any(ThreadDTO.class))).thenReturn(thread);
        when(threadRepository.save(any(Thread.class))).thenReturn(thread);
        when(threadMapper.toDto(any(Thread.class))).thenReturn(threadDTO);

        ThreadDTO result = threadService.create(threadDTO);

        assertNotNull(result);
        assertEquals(threadDTO.id(), result.id());
        assertEquals(threadDTO.title(), result.title());
        verify(threadRepository).save(any(Thread.class));
    }

    @Test
    void getById_ShouldReturnThread() {
        when(threadRepository.findById(1L)).thenReturn(Optional.of(thread));
        when(threadMapper.toDto(any(Thread.class))).thenReturn(threadDTO);

        ThreadDTO result = threadService.getById(1L);

        assertNotNull(result);
        assertEquals(threadDTO.id(), result.id());
    }

    @Test
    void getById_ShouldThrowException_WhenThreadNotFound() {
        when(threadRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> threadService.getById(1L));
    }

    @Test
    void getAll_ShouldReturnAllThreads() {
        List<Thread> threads = Arrays.asList(thread);
        when(threadRepository.findAll()).thenReturn(threads);
        when(threadMapper.toDto(any(Thread.class))).thenReturn(threadDTO);

        List<ThreadDTO> results = threadService.getAll();

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(threadDTO.id(), results.get(0).id());
    }

    @Test
    void update_ShouldUpdateThread() {
        when(threadRepository.findById(1L)).thenReturn(Optional.of(thread));
        when(threadRepository.save(any(Thread.class))).thenReturn(thread);
        when(threadMapper.toDto(any(Thread.class))).thenReturn(threadDTO);

        ThreadDTO result = threadService.update(1L, threadDTO);

        assertNotNull(result);
        assertEquals(threadDTO.id(), result.id());
        verify(threadRepository).save(any(Thread.class));
    }

    @Test
    void update_ShouldThrowException_WhenThreadNotFound() {
        when(threadRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> threadService.update(1L, threadDTO));
    }

    @Test
    void delete_ShouldDeleteThread() {
        when(threadRepository.existsById(1L)).thenReturn(true);
        doNothing().when(threadRepository).deleteById(1L);

        assertDoesNotThrow(() -> threadService.delete(1L));
        verify(threadRepository).deleteById(1L);
    }

    @Test
    void delete_ShouldThrowException_WhenThreadNotFound() {
        when(threadRepository.existsById(1L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> threadService.delete(1L));
    }

    @Test
    void findByForumId_ShouldReturnThreads() {
        List<Thread> threads = Arrays.asList(thread);
        when(threadRepository.findByForumId(1L)).thenReturn(threads);
        when(threadMapper.toDto(any(Thread.class))).thenReturn(threadDTO);

        List<ThreadDTO> results = threadService.findByForumId(1L);

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(threadDTO.id(), results.get(0).id());
    }

    @Test
    void findByForumIdAndActive_ShouldReturnThreads() {
        List<Thread> threads = Arrays.asList(thread);
        when(threadRepository.findByForumIdAndActive(1L, true)).thenReturn(threads);
        when(threadMapper.toDto(any(Thread.class))).thenReturn(threadDTO);

        List<ThreadDTO> results = threadService.findByForumIdAndActive(1L, true);

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(threadDTO.id(), results.get(0).id());
    }

    @Test
    void findByAuthorId_ShouldReturnThreads() {
        List<Thread> threads = Arrays.asList(thread);
        when(threadRepository.findByAuthorId(1L)).thenReturn(threads);
        when(threadMapper.toDto(any(Thread.class))).thenReturn(threadDTO);

        List<ThreadDTO> results = threadService.findByAuthorId(1L);

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(threadDTO.id(), results.get(0).id());
    }

    @Test
    void findByAuthorIdAndActive_ShouldReturnThreads() {
        List<Thread> threads = Arrays.asList(thread);
        when(threadRepository.findByAuthorIdAndActive(1L, true)).thenReturn(threads);
        when(threadMapper.toDto(any(Thread.class))).thenReturn(threadDTO);

        List<ThreadDTO> results = threadService.findByAuthorIdAndActive(1L, true);

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(threadDTO.id(), results.get(0).id());
    }

    @Test
    void findByIdWithComments_ShouldReturnThreadWithComments() {
        when(threadRepository.findByIdWithComments(1L)).thenReturn(thread);
        when(threadMapper.toDto(any(Thread.class))).thenReturn(threadDTO);

        ThreadDTO result = threadService.findByIdWithComments(1L);

        assertNotNull(result);
        assertEquals(threadDTO.id(), result.id());
    }

    @Test
    void findByForumIdWithComments_ShouldReturnThreadsWithComments() {
        List<Thread> threads = Arrays.asList(thread);
        when(threadRepository.findByForumIdWithComments(1L)).thenReturn(threads);
        when(threadMapper.toDto(any(Thread.class))).thenReturn(threadDTO);

        List<ThreadDTO> results = threadService.findByForumIdWithComments(1L);

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(threadDTO.id(), results.get(0).id());
    }

    @Test
    void findByForumIdOrderByPinnedAndLastActivity_ShouldReturnPagedThreads() {
        List<Thread> threads = Arrays.asList(thread);
        Page<Thread> threadPage = new PageImpl<>(threads);
        Pageable pageable = PageRequest.of(0, 10);
        when(threadRepository.findByForumIdOrderByPinnedAndLastActivity(1L, pageable)).thenReturn(threadPage);
        when(threadMapper.toDto(any(Thread.class))).thenReturn(threadDTO);

        Page<ThreadDTO> results = threadService.findByForumIdOrderByPinnedAndLastActivity(1L, pageable);

        assertNotNull(results);
        assertEquals(1, results.getTotalElements());
        assertEquals(threadDTO.id(), results.getContent().get(0).id());
    }
} 