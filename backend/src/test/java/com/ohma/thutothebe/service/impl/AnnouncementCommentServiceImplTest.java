package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.AnnouncementCommentDto;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.AnnouncementCommentMapper;
import com.ohma.thutothebe.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AnnouncementCommentServiceImplTest {

    @Mock
    private AnnouncementCommentRepository commentRepository;

    @Mock
    private AnnouncementCommentLikeRepository likeRepository;

    @Mock
    private AnnouncementRepository announcementRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AnnouncementCommentMapper mapper;

    @InjectMocks
    private AnnouncementCommentServiceImpl commentService;

    private Announcement testAnnouncement;
    private User testUser;
    private AnnouncementComment testComment;
    private AnnouncementCommentDto testCommentDto;
    private AnnouncementCommentLike testLike;

    @BeforeEach
    void setUp() {
        // Setup test data
        testAnnouncement = new Announcement();
        testAnnouncement.setId(1L);
        testAnnouncement.setTitle("Test Announcement");
        testAnnouncement.setContent("Test Content");

        testUser = new User();
        testUser.setId(1L);
        testUser.setFirstName("John");
        testUser.setLastName("Doe");
        testUser.setRole(UserRole.TEACHER);

        testComment = new AnnouncementComment();
        testComment.setId(1L);
        testComment.setContent("Test Comment");
        testComment.setAnnouncement(testAnnouncement);
        testComment.setAuthor(testUser);
        testComment.setActive(true);
        testComment.setCreatedAt(LocalDateTime.now());

        testCommentDto = new AnnouncementCommentDto();
        testCommentDto.setId(1L);
        testCommentDto.setContent("Test Comment");
        testCommentDto.setAnnouncementId(1L);
        testCommentDto.setAuthorId(1L);
        testCommentDto.setAuthorName("John Doe");
        testCommentDto.setAuthorRole("TEACHER");
        testCommentDto.setActive(true);
        testCommentDto.setLikes(0);
        testCommentDto.setReplies(new ArrayList<>());

        testLike = new AnnouncementCommentLike();
        testLike.setId(1L);
        testLike.setComment(testComment);
        testLike.setUser(testUser);
        testLike.setActive(true);
    }

    @Test
    void testGetCommentsByAnnouncementId_Success() {
        // Given
        Long announcementId = 1L;
        List<AnnouncementComment> comments = Arrays.asList(testComment);
        List<AnnouncementCommentDto> expectedDtos = Arrays.asList(testCommentDto);

        when(commentRepository.findByAnnouncementIdAndParentCommentIsNull(announcementId))
                .thenReturn(comments);
        when(mapper.toDto(testComment)).thenReturn(testCommentDto);

        // When
        List<AnnouncementCommentDto> result = commentService.getCommentsByAnnouncementId(announcementId);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testCommentDto.getId(), result.get(0).getId());
        assertEquals(testCommentDto.getContent(), result.get(0).getContent());

        verify(commentRepository).findByAnnouncementIdAndParentCommentIsNull(announcementId);
        verify(mapper).toDto(testComment);
    }

    @Test
    void testGetCommentsByAnnouncementId_EmptyResult() {
        // Given
        Long announcementId = 1L;
        when(commentRepository.findByAnnouncementIdAndParentCommentIsNull(announcementId))
                .thenReturn(Collections.emptyList());

        // When
        List<AnnouncementCommentDto> result = commentService.getCommentsByAnnouncementId(announcementId);

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(commentRepository).findByAnnouncementIdAndParentCommentIsNull(announcementId);
        verify(mapper, never()).toDto(any());
    }

    @Test
    void testCreateComment_Success() {
        // Given
        Long announcementId = 1L;
        Long authorId = 1L;
        String content = "New Comment";
        Long parentCommentId = null;

        when(announcementRepository.findById(announcementId)).thenReturn(Optional.of(testAnnouncement));
        when(userRepository.findById(authorId)).thenReturn(Optional.of(testUser));
        when(commentRepository.save(any(AnnouncementComment.class))).thenReturn(testComment);
        when(mapper.toDto(testComment)).thenReturn(testCommentDto);

        // When
        AnnouncementCommentDto result = commentService.createComment(announcementId, authorId, content, parentCommentId);

        // Then
        assertNotNull(result);
        assertEquals(testCommentDto.getId(), result.getId());
        assertEquals(testCommentDto.getContent(), result.getContent());

        verify(announcementRepository).findById(announcementId);
        verify(userRepository).findById(authorId);
        verify(commentRepository).save(any(AnnouncementComment.class));
        verify(mapper).toDto(testComment);
    }

    @Test
    void testCreateComment_WithParentComment_Success() {
        // Given
        Long announcementId = 1L;
        Long authorId = 1L;
        String content = "Reply Comment";
        Long parentCommentId = 1L;

        AnnouncementComment parentComment = new AnnouncementComment();
        parentComment.setId(parentCommentId);

        when(announcementRepository.findById(announcementId)).thenReturn(Optional.of(testAnnouncement));
        when(userRepository.findById(authorId)).thenReturn(Optional.of(testUser));
        when(commentRepository.findById(parentCommentId)).thenReturn(Optional.of(parentComment));
        when(commentRepository.save(any(AnnouncementComment.class))).thenReturn(testComment);
        when(mapper.toDto(testComment)).thenReturn(testCommentDto);

        // When
        AnnouncementCommentDto result = commentService.createComment(announcementId, authorId, content, parentCommentId);

        // Then
        assertNotNull(result);
        assertEquals(testCommentDto.getId(), result.getId());

        verify(announcementRepository).findById(announcementId);
        verify(userRepository).findById(authorId);
        verify(commentRepository).findById(parentCommentId);
        verify(commentRepository).save(any(AnnouncementComment.class));
        verify(mapper).toDto(testComment);
    }

    @Test
    void testCreateComment_AnnouncementNotFound_ThrowsException() {
        // Given
        Long announcementId = 999L;
        Long authorId = 1L;
        String content = "New Comment";

        when(announcementRepository.findById(announcementId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> 
                commentService.createComment(announcementId, authorId, content, null));

        verify(announcementRepository).findById(announcementId);
        verify(userRepository, never()).findById(any());
        verify(commentRepository, never()).save(any());
    }

    @Test
    void testCreateComment_UserNotFound_ThrowsException() {
        // Given
        Long announcementId = 1L;
        Long authorId = 999L;
        String content = "New Comment";

        when(announcementRepository.findById(announcementId)).thenReturn(Optional.of(testAnnouncement));
        when(userRepository.findById(authorId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> 
                commentService.createComment(announcementId, authorId, content, null));

        verify(announcementRepository).findById(announcementId);
        verify(userRepository).findById(authorId);
        verify(commentRepository, never()).save(any());
    }

    @Test
    void testUpdateComment_Success() {
        // Given
        Long commentId = 1L;
        Long userId = 1L;
        String newContent = "Updated Comment";

        when(commentRepository.findById(commentId)).thenReturn(Optional.of(testComment));
        when(commentRepository.save(testComment)).thenReturn(testComment);
        when(mapper.toDto(testComment)).thenReturn(testCommentDto);

        // When
        AnnouncementCommentDto result = commentService.updateComment(commentId, newContent, userId);

        // Then
        assertNotNull(result);
        assertEquals(newContent, testComment.getContent());

        verify(commentRepository).findById(commentId);
        verify(commentRepository).save(testComment);
        verify(mapper).toDto(testComment);
    }

    @Test
    void testUpdateComment_UnauthorizedUser_ThrowsException() {
        // Given
        Long commentId = 1L;
        Long unauthorizedUserId = 999L;
        String newContent = "Updated Comment";

        when(commentRepository.findById(commentId)).thenReturn(Optional.of(testComment));

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> 
                commentService.updateComment(commentId, newContent, unauthorizedUserId));

        verify(commentRepository).findById(commentId);
        verify(commentRepository, never()).save(any());
    }

    @Test
    void testDeleteComment_Success() {
        // Given
        Long commentId = 1L;
        Long userId = 1L;

        when(commentRepository.findById(commentId)).thenReturn(Optional.of(testComment));
        when(commentRepository.save(testComment)).thenReturn(testComment);

        // When
        commentService.deleteComment(commentId, userId);

        // Then
        assertFalse(testComment.isActive());

        verify(commentRepository).findById(commentId);
        verify(commentRepository).save(testComment);
    }

    @Test
    void testDeleteComment_UnauthorizedUser_ThrowsException() {
        // Given
        Long commentId = 1L;
        Long unauthorizedUserId = 999L;

        when(commentRepository.findById(commentId)).thenReturn(Optional.of(testComment));

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> 
                commentService.deleteComment(commentId, unauthorizedUserId));

        verify(commentRepository).findById(commentId);
        verify(commentRepository, never()).save(any());
    }

    @Test
    void testToggleLike_NewLike_Success() {
        // Given
        Long commentId = 1L;
        Long userId = 1L;

        when(commentRepository.findById(commentId)).thenReturn(Optional.of(testComment));
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(likeRepository.findByCommentIdAndUserId(commentId, userId)).thenReturn(Optional.empty());
        when(likeRepository.save(any(AnnouncementCommentLike.class))).thenReturn(testLike);

        // When
        commentService.toggleLike(commentId, userId);

        // Then
        verify(commentRepository).findById(commentId);
        verify(userRepository).findById(userId);
        verify(likeRepository).findByCommentIdAndUserId(commentId, userId);
        verify(likeRepository).save(any(AnnouncementCommentLike.class));
    }

    @Test
    void testToggleLike_ExistingLike_ToggleSuccess() {
        // Given
        Long commentId = 1L;
        Long userId = 1L;
        testLike.setActive(true);

        when(commentRepository.findById(commentId)).thenReturn(Optional.of(testComment));
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(likeRepository.findByCommentIdAndUserId(commentId, userId)).thenReturn(Optional.of(testLike));
        when(likeRepository.save(testLike)).thenReturn(testLike);

        // When
        commentService.toggleLike(commentId, userId);

        // Then
        assertFalse(testLike.isActive());

        verify(commentRepository).findById(commentId);
        verify(userRepository).findById(userId);
        verify(likeRepository).findByCommentIdAndUserId(commentId, userId);
        verify(likeRepository).save(testLike);
    }

    @Test
    void testIsCommentLikedByUser_True() {
        // Given
        Long commentId = 1L;
        Long userId = 1L;

        when(likeRepository.existsByCommentIdAndUserIdAndActiveTrue(commentId, userId)).thenReturn(true);

        // When
        boolean result = commentService.isCommentLikedByUser(commentId, userId);

        // Then
        assertTrue(result);
        verify(likeRepository).existsByCommentIdAndUserIdAndActiveTrue(commentId, userId);
    }

    @Test
    void testIsCommentLikedByUser_False() {
        // Given
        Long commentId = 1L;
        Long userId = 1L;

        when(likeRepository.existsByCommentIdAndUserIdAndActiveTrue(commentId, userId)).thenReturn(false);

        // When
        boolean result = commentService.isCommentLikedByUser(commentId, userId);

        // Then
        assertFalse(result);
        verify(likeRepository).existsByCommentIdAndUserIdAndActiveTrue(commentId, userId);
    }

    @Test
    void testGetCommentCount_Success() {
        // Given
        Long announcementId = 1L;
        long expectedCount = 5L;

        when(commentRepository.countByAnnouncementIdAndActiveTrue(announcementId)).thenReturn(expectedCount);

        // When
        long result = commentService.getCommentCount(announcementId);

        // Then
        assertEquals(expectedCount, result);
        verify(commentRepository).countByAnnouncementIdAndActiveTrue(announcementId);
    }

    @Test
    void testGetCommentsByAuthor_Success() {
        // Given
        Long authorId = 1L;
        List<AnnouncementComment> comments = Arrays.asList(testComment);

        when(commentRepository.findByAuthorIdAndActiveTrue(authorId)).thenReturn(comments);
        when(mapper.toDto(testComment)).thenReturn(testCommentDto);

        // When
        List<AnnouncementCommentDto> result = commentService.getCommentsByAuthor(authorId);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testCommentDto.getId(), result.get(0).getId());

        verify(commentRepository).findByAuthorIdAndActiveTrue(authorId);
        verify(mapper).toDto(testComment);
    }

    @Test
    void testGetRepliesByParentCommentId_Success() {
        // Given
        Long parentCommentId = 1L;
        List<AnnouncementComment> replies = Arrays.asList(testComment);

        when(commentRepository.findByParentCommentIdAndActiveTrue(parentCommentId)).thenReturn(replies);
        when(mapper.toDto(testComment)).thenReturn(testCommentDto);

        // When
        List<AnnouncementCommentDto> result = commentService.getRepliesByParentCommentId(parentCommentId);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testCommentDto.getId(), result.get(0).getId());

        verify(commentRepository).findByParentCommentIdAndActiveTrue(parentCommentId);
        verify(mapper).toDto(testComment);
    }
} 