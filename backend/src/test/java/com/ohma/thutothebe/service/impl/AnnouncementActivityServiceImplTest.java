package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.AnnouncementActivityDto;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.AnnouncementActivityMapper;
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
class AnnouncementActivityServiceImplTest {

    @Mock
    private AnnouncementActivityRepository activityRepository;

    @Mock
    private AnnouncementRepository announcementRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AnnouncementActivityMapper mapper;

    @InjectMocks
    private AnnouncementActivityServiceImpl activityService;

    private Announcement testAnnouncement;
    private User testUser;
    private AnnouncementActivity testActivity;
    private AnnouncementActivityDto testActivityDto;

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

        testActivity = new AnnouncementActivity();
        testActivity.setId(1L);
        testActivity.setType(AnnouncementActivityType.READ);
        testActivity.setAnnouncement(testAnnouncement);
        testActivity.setUser(testUser);
        testActivity.setDetails("User read the announcement");
        testActivity.setActive(true);
        testActivity.setCreatedAt(LocalDateTime.now());

        testActivityDto = new AnnouncementActivityDto();
        testActivityDto.setId(1L);
        testActivityDto.setType(AnnouncementActivityType.READ);
        testActivityDto.setAnnouncementId(1L);
        testActivityDto.setUserId(1L);
        testActivityDto.setUserName("John Doe");
        testActivityDto.setUserRole("TEACHER");
        testActivityDto.setDetails("User read the announcement");
        testActivityDto.setActive(true);
        testActivityDto.setTimestamp(LocalDateTime.now());
    }

    @Test
    void testGetActivitiesByAnnouncementId_Success() {
        // Given
        Long announcementId = 1L;
        List<AnnouncementActivity> activities = Arrays.asList(testActivity);

        when(activityRepository.findByAnnouncementIdAndActiveTrue(announcementId)).thenReturn(activities);
        when(mapper.toDto(testActivity)).thenReturn(testActivityDto);

        // When
        List<AnnouncementActivityDto> result = activityService.getActivitiesByAnnouncementId(announcementId);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testActivityDto.getId(), result.get(0).getId());
        assertEquals(testActivityDto.getType(), result.get(0).getType());

        verify(activityRepository).findByAnnouncementIdAndActiveTrue(announcementId);
        verify(mapper).toDto(testActivity);
    }

    @Test
    void testGetActivitiesByAnnouncementId_EmptyResult() {
        // Given
        Long announcementId = 1L;
        when(activityRepository.findByAnnouncementIdAndActiveTrue(announcementId))
                .thenReturn(Collections.emptyList());

        // When
        List<AnnouncementActivityDto> result = activityService.getActivitiesByAnnouncementId(announcementId);

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(activityRepository).findByAnnouncementIdAndActiveTrue(announcementId);
        verify(mapper, never()).toDto(any());
    }

    @Test
    void testGetActivitiesByAnnouncementIdAndType_Success() {
        // Given
        Long announcementId = 1L;
        AnnouncementActivityType type = AnnouncementActivityType.READ;
        List<AnnouncementActivity> activities = Arrays.asList(testActivity);

        when(activityRepository.findByAnnouncementIdAndTypeAndActiveTrue(announcementId, type))
                .thenReturn(activities);
        when(mapper.toDto(testActivity)).thenReturn(testActivityDto);

        // When
        List<AnnouncementActivityDto> result = activityService.getActivitiesByAnnouncementIdAndType(announcementId, type);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testActivityDto.getType(), result.get(0).getType());

        verify(activityRepository).findByAnnouncementIdAndTypeAndActiveTrue(announcementId, type);
        verify(mapper).toDto(testActivity);
    }

    @Test
    void testGetActivitiesByUserId_Success() {
        // Given
        Long userId = 1L;
        List<AnnouncementActivity> activities = Arrays.asList(testActivity);

        when(activityRepository.findByUserIdAndActiveTrue(userId)).thenReturn(activities);
        when(mapper.toDto(testActivity)).thenReturn(testActivityDto);

        // When
        List<AnnouncementActivityDto> result = activityService.getActivitiesByUserId(userId);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testActivityDto.getUserId(), result.get(0).getUserId());

        verify(activityRepository).findByUserIdAndActiveTrue(userId);
        verify(mapper).toDto(testActivity);
    }

    @Test
    void testCreateActivity_Success() {
        // Given
        Long announcementId = 1L;
        Long userId = 1L;
        AnnouncementActivityType type = AnnouncementActivityType.READ;
        String details = "User read the announcement";

        when(announcementRepository.findById(announcementId)).thenReturn(Optional.of(testAnnouncement));
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(activityRepository.save(any(AnnouncementActivity.class))).thenReturn(testActivity);
        when(mapper.toDto(testActivity)).thenReturn(testActivityDto);

        // When
        AnnouncementActivityDto result = activityService.createActivity(announcementId, userId, type, details);

        // Then
        assertNotNull(result);
        assertEquals(testActivityDto.getId(), result.getId());
        assertEquals(testActivityDto.getType(), result.getType());

        verify(announcementRepository).findById(announcementId);
        verify(userRepository).findById(userId);
        verify(activityRepository).save(any(AnnouncementActivity.class));
        verify(mapper).toDto(testActivity);
    }

    @Test
    void testCreateActivity_AnnouncementNotFound_ThrowsException() {
        // Given
        Long announcementId = 999L;
        Long userId = 1L;
        AnnouncementActivityType type = AnnouncementActivityType.READ;
        String details = "User read the announcement";

        when(announcementRepository.findById(announcementId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> 
                activityService.createActivity(announcementId, userId, type, details));

        verify(announcementRepository).findById(announcementId);
        verify(userRepository, never()).findById(any());
        verify(activityRepository, never()).save(any());
    }

    @Test
    void testCreateActivity_UserNotFound_ThrowsException() {
        // Given
        Long announcementId = 1L;
        Long userId = 999L;
        AnnouncementActivityType type = AnnouncementActivityType.READ;
        String details = "User read the announcement";

        when(announcementRepository.findById(announcementId)).thenReturn(Optional.of(testAnnouncement));
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> 
                activityService.createActivity(announcementId, userId, type, details));

        verify(announcementRepository).findById(announcementId);
        verify(userRepository).findById(userId);
        verify(activityRepository, never()).save(any());
    }

    @Test
    void testGetActivityCount_Success() {
        // Given
        Long announcementId = 1L;
        AnnouncementActivityType type = AnnouncementActivityType.READ;
        long expectedCount = 5L;

        when(activityRepository.countByAnnouncementIdAndTypeAndActiveTrue(announcementId, type))
                .thenReturn(expectedCount);

        // When
        long result = activityService.getActivityCount(announcementId, type);

        // Then
        assertEquals(expectedCount, result);
        verify(activityRepository).countByAnnouncementIdAndTypeAndActiveTrue(announcementId, type);
    }

    @Test
    void testHasUserPerformedActivity_True() {
        // Given
        Long announcementId = 1L;
        Long userId = 1L;
        AnnouncementActivityType type = AnnouncementActivityType.READ;

        when(activityRepository.existsByAnnouncementIdAndUserIdAndTypeAndActiveTrue(announcementId, userId, type))
                .thenReturn(true);

        // When
        boolean result = activityService.hasUserPerformedActivity(announcementId, userId, type);

        // Then
        assertTrue(result);
        verify(activityRepository).existsByAnnouncementIdAndUserIdAndTypeAndActiveTrue(announcementId, userId, type);
    }

    @Test
    void testHasUserPerformedActivity_False() {
        // Given
        Long announcementId = 1L;
        Long userId = 1L;
        AnnouncementActivityType type = AnnouncementActivityType.READ;

        when(activityRepository.existsByAnnouncementIdAndUserIdAndTypeAndActiveTrue(announcementId, userId, type))
                .thenReturn(false);

        // When
        boolean result = activityService.hasUserPerformedActivity(announcementId, userId, type);

        // Then
        assertFalse(result);
        verify(activityRepository).existsByAnnouncementIdAndUserIdAndTypeAndActiveTrue(announcementId, userId, type);
    }

    @Test
    void testRecordReadActivity_NewActivity_Success() {
        // Given
        Long announcementId = 1L;
        Long userId = 1L;

        when(activityRepository.existsByAnnouncementIdAndUserIdAndTypeAndActiveTrue(
                announcementId, userId, AnnouncementActivityType.READ)).thenReturn(false);
        when(announcementRepository.findById(announcementId)).thenReturn(Optional.of(testAnnouncement));
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(activityRepository.save(any(AnnouncementActivity.class))).thenReturn(testActivity);
        when(mapper.toDto(testActivity)).thenReturn(testActivityDto);

        // When
        activityService.recordReadActivity(announcementId, userId);

        // Then
        verify(activityRepository).existsByAnnouncementIdAndUserIdAndTypeAndActiveTrue(
                announcementId, userId, AnnouncementActivityType.READ);
        verify(announcementRepository).findById(announcementId);
        verify(userRepository).findById(userId);
        verify(activityRepository).save(any(AnnouncementActivity.class));
    }

    @Test
    void testRecordReadActivity_ExistingActivity_NoAction() {
        // Given
        Long announcementId = 1L;
        Long userId = 1L;

        when(activityRepository.existsByAnnouncementIdAndUserIdAndTypeAndActiveTrue(
                announcementId, userId, AnnouncementActivityType.READ)).thenReturn(true);

        // When
        activityService.recordReadActivity(announcementId, userId);

        // Then
        verify(activityRepository).existsByAnnouncementIdAndUserIdAndTypeAndActiveTrue(
                announcementId, userId, AnnouncementActivityType.READ);
        verify(announcementRepository, never()).findById(any());
        verify(userRepository, never()).findById(any());
        verify(activityRepository, never()).save(any());
    }

    @Test
    void testRecordAcknowledgeActivity_NewActivity_Success() {
        // Given
        Long announcementId = 1L;
        Long userId = 1L;

        when(activityRepository.existsByAnnouncementIdAndUserIdAndTypeAndActiveTrue(
                announcementId, userId, AnnouncementActivityType.ACKNOWLEDGED)).thenReturn(false);
        when(announcementRepository.findById(announcementId)).thenReturn(Optional.of(testAnnouncement));
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(activityRepository.save(any(AnnouncementActivity.class))).thenReturn(testActivity);
        when(mapper.toDto(testActivity)).thenReturn(testActivityDto);

        // When
        activityService.recordAcknowledgeActivity(announcementId, userId);

        // Then
        verify(activityRepository).existsByAnnouncementIdAndUserIdAndTypeAndActiveTrue(
                announcementId, userId, AnnouncementActivityType.ACKNOWLEDGED);
        verify(announcementRepository).findById(announcementId);
        verify(userRepository).findById(userId);
        verify(activityRepository).save(any(AnnouncementActivity.class));
    }

    @Test
    void testRecordCommentActivity_Success() {
        // Given
        Long announcementId = 1L;
        Long userId = 1L;
        String commentContent = "This is a test comment";

        when(announcementRepository.findById(announcementId)).thenReturn(Optional.of(testAnnouncement));
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(activityRepository.save(any(AnnouncementActivity.class))).thenReturn(testActivity);
        when(mapper.toDto(testActivity)).thenReturn(testActivityDto);

        // When
        activityService.recordCommentActivity(announcementId, userId, commentContent);

        // Then
        verify(announcementRepository).findById(announcementId);
        verify(userRepository).findById(userId);
        verify(activityRepository).save(any(AnnouncementActivity.class));
    }

    @Test
    void testRecordCommentActivity_LongComment_TruncatesDetails() {
        // Given
        Long announcementId = 1L;
        Long userId = 1L;
        String longComment = "This is a very long comment that exceeds fifty characters and should be truncated";

        when(announcementRepository.findById(announcementId)).thenReturn(Optional.of(testAnnouncement));
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(activityRepository.save(any(AnnouncementActivity.class))).thenAnswer(invocation -> {
            AnnouncementActivity activity = invocation.getArgument(0);
            assertTrue(activity.getDetails().contains("..."));
            assertTrue(activity.getDetails().length() <= 65); // "User commented: " + 50 chars + "..."
            return testActivity;
        });
        when(mapper.toDto(testActivity)).thenReturn(testActivityDto);

        // When
        activityService.recordCommentActivity(announcementId, userId, longComment);

        // Then
        verify(announcementRepository).findById(announcementId);
        verify(userRepository).findById(userId);
        verify(activityRepository).save(any(AnnouncementActivity.class));
    }

    @Test
    void testRecordLikeActivity_Success() {
        // Given
        Long announcementId = 1L;
        Long userId = 1L;
        String details = "Liked comment: Test comment";

        when(announcementRepository.findById(announcementId)).thenReturn(Optional.of(testAnnouncement));
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(activityRepository.save(any(AnnouncementActivity.class))).thenReturn(testActivity);
        when(mapper.toDto(testActivity)).thenReturn(testActivityDto);

        // When
        activityService.recordLikeActivity(announcementId, userId, details);

        // Then
        verify(announcementRepository).findById(announcementId);
        verify(userRepository).findById(userId);
        verify(activityRepository).save(any(AnnouncementActivity.class));
    }

    @Test
    void testCreateActivity_WithNullDetails_Success() {
        // Given
        Long announcementId = 1L;
        Long userId = 1L;
        AnnouncementActivityType type = AnnouncementActivityType.VIEWED;
        String details = null;

        when(announcementRepository.findById(announcementId)).thenReturn(Optional.of(testAnnouncement));
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(activityRepository.save(any(AnnouncementActivity.class))).thenReturn(testActivity);
        when(mapper.toDto(testActivity)).thenReturn(testActivityDto);

        // When
        AnnouncementActivityDto result = activityService.createActivity(announcementId, userId, type, details);

        // Then
        assertNotNull(result);
        verify(announcementRepository).findById(announcementId);
        verify(userRepository).findById(userId);
        verify(activityRepository).save(any(AnnouncementActivity.class));
        verify(mapper).toDto(testActivity);
    }

    @Test
    void testGetActivitiesByAnnouncementIdAndType_MultipleTypes() {
        // Given
        Long announcementId = 1L;
        
        // Test READ activities
        AnnouncementActivityType readType = AnnouncementActivityType.READ;
        List<AnnouncementActivity> readActivities = Arrays.asList(testActivity);
        
        when(activityRepository.findByAnnouncementIdAndTypeAndActiveTrue(announcementId, readType))
                .thenReturn(readActivities);
        when(mapper.toDto(testActivity)).thenReturn(testActivityDto);

        // When
        List<AnnouncementActivityDto> readResult = activityService.getActivitiesByAnnouncementIdAndType(announcementId, readType);

        // Then
        assertNotNull(readResult);
        assertEquals(1, readResult.size());
        assertEquals(AnnouncementActivityType.READ, readResult.get(0).getType());

        // Test ACKNOWLEDGED activities
        AnnouncementActivityType acknowledgedType = AnnouncementActivityType.ACKNOWLEDGED;
        when(activityRepository.findByAnnouncementIdAndTypeAndActiveTrue(announcementId, acknowledgedType))
                .thenReturn(Collections.emptyList());

        List<AnnouncementActivityDto> acknowledgedResult = activityService.getActivitiesByAnnouncementIdAndType(announcementId, acknowledgedType);

        assertNotNull(acknowledgedResult);
        assertTrue(acknowledgedResult.isEmpty());

        verify(activityRepository).findByAnnouncementIdAndTypeAndActiveTrue(announcementId, readType);
        verify(activityRepository).findByAnnouncementIdAndTypeAndActiveTrue(announcementId, acknowledgedType);
    }
} 