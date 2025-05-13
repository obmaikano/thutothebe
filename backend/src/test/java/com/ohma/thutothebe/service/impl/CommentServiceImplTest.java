package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.CommentDTO;
import com.ohma.thutothebe.entity.Comment;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.CommentMapper;
import com.ohma.thutothebe.repository.CommentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CommentServiceImplTest {

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private CommentMapper commentMapper;

    @InjectMocks
    private CommentServiceImpl commentService;

    private Comment comment;
    private CommentDTO commentDTO;
    private LocalDateTime now;

    @BeforeEach
    void setUp() {
        now = LocalDateTime.now();
        
        comment = new Comment();
        comment.setId(1L);
        comment.setContent("Test Comment");
        comment.setActive(true);
        comment.setCreatedAt(now);
        comment.setUpdatedAt(now);

        commentDTO = new CommentDTO(
            1L,
            "Test Comment",
            1L,
            1L,
            1L,
            now,
            now,
            true
        );
    }

    @Test
    void create_ShouldCreateNewComment() {
        when(commentMapper.toEntity(any(CommentDTO.class))).thenReturn(comment);
        when(commentRepository.save(any(Comment.class))).thenReturn(comment);
        when(commentMapper.toDto(any(Comment.class))).thenReturn(commentDTO);

        CommentDTO result = commentService.create(commentDTO);

        assertNotNull(result);
        assertEquals(commentDTO.id(), result.id());
        assertEquals(commentDTO.content(), result.content());
        verify(commentRepository).save(any(Comment.class));
    }

    @Test
    void getById_ShouldReturnComment() {
        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));
        when(commentMapper.toDto(any(Comment.class))).thenReturn(commentDTO);

        CommentDTO result = commentService.getById(1L);

        assertNotNull(result);
        assertEquals(commentDTO.id(), result.id());
    }

    @Test
    void getById_ShouldThrowException_WhenCommentNotFound() {
        when(commentRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> commentService.getById(1L));
    }

    @Test
    void getAll_ShouldReturnAllComments() {
        List<Comment> comments = Arrays.asList(comment);
        when(commentRepository.findAll()).thenReturn(comments);
        when(commentMapper.toDto(any(Comment.class))).thenReturn(commentDTO);

        List<CommentDTO> results = commentService.getAll();

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(commentDTO.id(), results.get(0).id());
    }

    @Test
    void update_ShouldUpdateComment() {
        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));
        when(commentRepository.save(any(Comment.class))).thenReturn(comment);
        when(commentMapper.toDto(any(Comment.class))).thenReturn(commentDTO);

        CommentDTO result = commentService.update(1L, commentDTO);

        assertNotNull(result);
        assertEquals(commentDTO.id(), result.id());
        verify(commentRepository).save(any(Comment.class));
    }

    @Test
    void update_ShouldThrowException_WhenCommentNotFound() {
        when(commentRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> commentService.update(1L, commentDTO));
    }

    @Test
    void delete_ShouldDeleteComment() {
        when(commentRepository.existsById(1L)).thenReturn(true);
        doNothing().when(commentRepository).deleteById(1L);

        assertDoesNotThrow(() -> commentService.delete(1L));
        verify(commentRepository).deleteById(1L);
    }

    @Test
    void delete_ShouldThrowException_WhenCommentNotFound() {
        when(commentRepository.existsById(1L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> commentService.delete(1L));
    }

    @Test
    void findByThreadId_ShouldReturnComments() {
        List<Comment> comments = Arrays.asList(comment);
        when(commentRepository.findByThreadId(1L)).thenReturn(comments);
        when(commentMapper.toDto(any(Comment.class))).thenReturn(commentDTO);

        List<CommentDTO> results = commentService.findByThreadId(1L);

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(commentDTO.id(), results.get(0).id());
    }

    @Test
    void findByThreadIdAndActive_ShouldReturnComments() {
        List<Comment> comments = Arrays.asList(comment);
        when(commentRepository.findByThreadIdAndActive(1L, true)).thenReturn(comments);
        when(commentMapper.toDto(any(Comment.class))).thenReturn(commentDTO);

        List<CommentDTO> results = commentService.findByThreadIdAndActive(1L, true);

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(commentDTO.id(), results.get(0).id());
    }

    @Test
    void findByAuthorId_ShouldReturnComments() {
        List<Comment> comments = Arrays.asList(comment);
        when(commentRepository.findByAuthorId(1L)).thenReturn(comments);
        when(commentMapper.toDto(any(Comment.class))).thenReturn(commentDTO);

        List<CommentDTO> results = commentService.findByAuthorId(1L);

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(commentDTO.id(), results.get(0).id());
    }

    @Test
    void findByAuthorIdAndActive_ShouldReturnComments() {
        List<Comment> comments = Arrays.asList(comment);
        when(commentRepository.findByAuthorIdAndActive(1L, true)).thenReturn(comments);
        when(commentMapper.toDto(any(Comment.class))).thenReturn(commentDTO);

        List<CommentDTO> results = commentService.findByAuthorIdAndActive(1L, true);

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(commentDTO.id(), results.get(0).id());
    }

    @Test
    void findByParentId_ShouldReturnComments() {
        List<Comment> comments = Arrays.asList(comment);
        when(commentRepository.findByParentId(1L)).thenReturn(comments);
        when(commentMapper.toDto(any(Comment.class))).thenReturn(commentDTO);

        List<CommentDTO> results = commentService.findByParentId(1L);

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(commentDTO.id(), results.get(0).id());
    }

    @Test
    void findByParentIdAndActive_ShouldReturnComments() {
        List<Comment> comments = Arrays.asList(comment);
        when(commentRepository.findByParentIdAndActive(1L, true)).thenReturn(comments);
        when(commentMapper.toDto(any(Comment.class))).thenReturn(commentDTO);

        List<CommentDTO> results = commentService.findByParentIdAndActive(1L, true);

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(commentDTO.id(), results.get(0).id());
    }

    @Test
    void findByIdWithReplies_ShouldReturnCommentWithReplies() {
        when(commentRepository.findByIdWithReplies(1L)).thenReturn(comment);
        when(commentMapper.toDto(any(Comment.class))).thenReturn(commentDTO);

        CommentDTO result = commentService.findByIdWithReplies(1L);

        assertNotNull(result);
        assertEquals(commentDTO.id(), result.id());
    }

    @Test
    void findTopLevelCommentsByThreadId_ShouldReturnComments() {
        List<Comment> comments = Arrays.asList(comment);
        when(commentRepository.findTopLevelCommentsByThreadId(1L)).thenReturn(comments);
        when(commentMapper.toDto(any(Comment.class))).thenReturn(commentDTO);

        List<CommentDTO> results = commentService.findTopLevelCommentsByThreadId(1L);

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(commentDTO.id(), results.get(0).id());
    }

    @Test
    void findRepliesByParentId_ShouldReturnReplies() {
        List<Comment> comments = Arrays.asList(comment);
        when(commentRepository.findRepliesByParentId(1L)).thenReturn(comments);
        when(commentMapper.toDto(any(Comment.class))).thenReturn(commentDTO);

        List<CommentDTO> results = commentService.findRepliesByParentId(1L);

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(commentDTO.id(), results.get(0).id());
    }
} 