package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.AnnouncementDTO;
import com.ohma.thutothebe.dto.AnnouncementReadReceiptDTO;
import com.ohma.thutothebe.dto.AnnouncementAcknowledgmentDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.AnnouncementMapper;
import com.ohma.thutothebe.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
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
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AnnouncementServiceImplTest {

    @Mock
    private AnnouncementRepository announcementRepository;

    @Mock
    private AnnouncementReadReceiptRepository readReceiptRepository;

    @Mock
    private AnnouncementAcknowledgmentRepository acknowledgmentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AnnouncementMapper announcementMapper;

    @InjectMocks
    private AnnouncementServiceImpl announcementService;

    private User testUser;
    private User testCreator;
    private Announcement testAnnouncement;
    private AnnouncementDTO testAnnouncementDTO;
    private School testSchool;
    private Region testRegion;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        // Setup test region
        testRegion = new Region();
        testRegion.setId(1L);
        testRegion.setName("Test Region");
        testRegion.setCode("REG001");

        // Setup test school
        testSchool = new School();
        testSchool.setId(1L);
        testSchool.setName("Test School");
        testSchool.setCode("SCH001");
        testSchool.setRegion(testRegion);

        // Setup test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setFirstName("John");
        testUser.setLastName("Doe");
        testUser.setEmail("john.doe@example.com");
        testUser.setRole(UserRole.STUDENT);
        testUser.setSchool(testSchool);
        testUser.setRegion(testRegion);

        // Setup test creator
        testCreator = new User();
        testCreator.setId(2L);
        testCreator.setFirstName("Jane");
        testCreator.setLastName("Smith");
        testCreator.setEmail("jane.smith@example.com");
        testCreator.setRole(UserRole.TEACHER);
        testCreator.setSchool(testSchool);
        testCreator.setRegion(testRegion);

        // Setup test announcement
        testAnnouncement = new Announcement();
        testAnnouncement.setId(1L);
        testAnnouncement.setTitle("Test Announcement");
        testAnnouncement.setContent("This is a test announcement");
        testAnnouncement.setType(AnnouncementType.GENERAL);
        testAnnouncement.setPriority(AnnouncementPriority.NORMAL);
        testAnnouncement.setCreator(testCreator);
        testAnnouncement.setCreatorRole(UserRole.TEACHER);
        testAnnouncement.setTargetSchool(testSchool);
        testAnnouncement.setTargetRole(UserRole.STUDENT);
        testAnnouncement.setActive(true);
        testAnnouncement.setCommentsEnabled(false);
        testAnnouncement.setAcknowledgmentRequired(false);
        testAnnouncement.setCreatedAt(LocalDateTime.now());

        // Setup test announcement DTO
        testAnnouncementDTO = new AnnouncementDTO(
            1L,
            "Test Announcement",
            "This is a test announcement",
            AnnouncementType.GENERAL,
            AnnouncementPriority.NORMAL,
            2L,
            "Jane Smith",
            UserRole.TEACHER,
            1L,
            "Test Region",
            1L,
            "Test School",
            UserRole.STUDENT,
            null,
            null,
            null,
            null,
            false,
            false,
            null,
            null,
            true,
            LocalDateTime.now(),
            LocalDateTime.now(),
            0L,
            0L,
            null,
            false,
            false
        );

        pageable = PageRequest.of(0, 20);
    }

    @Test
    @DisplayName("Should get announcements for user successfully")
    void getAnnouncementsForUser_ShouldReturnAnnouncements_WhenUserExists() {
        // Given
        Page<Announcement> announcementPage = new PageImpl<>(Arrays.asList(testAnnouncement));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(announcementRepository.findAnnouncementsForUserRole(
            eq(UserRole.STUDENT), eq(1L), eq(1L), any(LocalDateTime.class), eq(pageable)))
            .thenReturn(announcementPage);
        when(announcementMapper.toDtoWithUserStatus(testAnnouncement, 1L))
            .thenReturn(testAnnouncementDTO);

        // When
        Page<AnnouncementDTO> result = announcementService.getAnnouncementsForUser(1L, pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(testAnnouncementDTO, result.getContent().get(0));
        verify(userRepository).findById(1L);
        verify(announcementRepository).findAnnouncementsForUserRole(
            eq(UserRole.STUDENT), eq(1L), eq(1L), any(LocalDateTime.class), eq(pageable));
    }

    @Test
    @DisplayName("Should throw exception when user not found")
    void getAnnouncementsForUser_ShouldThrowException_WhenUserNotFound() {
        // Given
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class, 
            () -> announcementService.getAnnouncementsForUser(999L, pageable));
        verify(userRepository).findById(999L);
        verifyNoInteractions(announcementRepository);
    }

    @Test
    @DisplayName("Should create announcement successfully with valid permissions")
    void createAnnouncement_ShouldCreateAnnouncement_WhenUserHasPermission() {
        // Given
        when(userRepository.findById(2L)).thenReturn(Optional.of(testCreator));
        when(announcementMapper.toEntity(any(AnnouncementDTO.class))).thenReturn(testAnnouncement);
        when(announcementRepository.save(any(Announcement.class))).thenReturn(testAnnouncement);
        when(announcementMapper.toDto(testAnnouncement)).thenReturn(testAnnouncementDTO);

        AnnouncementDTO createDto = new AnnouncementDTO(
            null, "New Announcement", "Content", AnnouncementType.GENERAL, 
            AnnouncementPriority.NORMAL, null, null, null, null, null, 1L, null,
            UserRole.STUDENT, null, null, null, null, false, false, null, null,
            true, null, null, null, null, null, null, null
        );

        // When
        AnnouncementDTO result = announcementService.createAnnouncement(createDto, 2L);

        // Then
        assertNotNull(result);
        assertEquals(testAnnouncementDTO.title(), result.title());
        verify(userRepository).findById(2L);
        verify(announcementRepository).save(any(Announcement.class));
    }

    @Test
    @DisplayName("Should throw exception when user lacks permission to create announcement")
    void createAnnouncement_ShouldThrowException_WhenUserLacksPermission() {
        // Given
        User studentUser = new User();
        studentUser.setId(3L);
        studentUser.setRole(UserRole.STUDENT);
        studentUser.setSchool(testSchool);

        when(userRepository.findById(3L)).thenReturn(Optional.of(studentUser));

        AnnouncementDTO createDto = new AnnouncementDTO(
            null, "New Announcement", "Content", AnnouncementType.GENERAL, 
            AnnouncementPriority.NORMAL, null, null, null, null, null, 1L, null,
            UserRole.TEACHER, null, null, null, null, false, false, null, null,
            true, null, null, null, null, null, null, null
        );

        // When & Then
        assertThrows(IllegalArgumentException.class, 
            () -> announcementService.createAnnouncement(createDto, 3L));
        verify(userRepository).findById(3L);
        verifyNoInteractions(announcementRepository);
    }

    @Test
    @DisplayName("Should mark announcement as read successfully")
    void markAsRead_ShouldCreateReadReceipt_WhenNotAlreadyRead() {
        // Given
        when(announcementRepository.findById(1L)).thenReturn(Optional.of(testAnnouncement));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(readReceiptRepository.findByAnnouncementIdAndUserId(1L, 1L)).thenReturn(Optional.empty());
        
        AnnouncementReadReceipt savedReceipt = new AnnouncementReadReceipt();
        savedReceipt.setId(1L);
        savedReceipt.setAnnouncement(testAnnouncement);
        savedReceipt.setUser(testUser);
        savedReceipt.setReadAt(LocalDateTime.now());
        savedReceipt.setCreatedAt(LocalDateTime.now());
        
        when(readReceiptRepository.save(any(AnnouncementReadReceipt.class))).thenReturn(savedReceipt);

        // When
        AnnouncementReadReceiptDTO result = announcementService.markAsRead(1L, 1L);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.announcementId());
        assertEquals(1L, result.userId());
        assertEquals("Test Announcement", result.announcementTitle());
        verify(readReceiptRepository).save(any(AnnouncementReadReceipt.class));
    }

    @Test
    @DisplayName("Should return existing read receipt when announcement already read")
    void markAsRead_ShouldReturnExistingReceipt_WhenAlreadyRead() {
        // Given
        when(announcementRepository.findById(1L)).thenReturn(Optional.of(testAnnouncement));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        
        AnnouncementReadReceipt existingReceipt = new AnnouncementReadReceipt();
        existingReceipt.setId(1L);
        existingReceipt.setAnnouncement(testAnnouncement);
        existingReceipt.setUser(testUser);
        existingReceipt.setReadAt(LocalDateTime.now());
        existingReceipt.setCreatedAt(LocalDateTime.now());
        
        when(readReceiptRepository.findByAnnouncementIdAndUserId(1L, 1L))
            .thenReturn(Optional.of(existingReceipt));

        // When
        AnnouncementReadReceiptDTO result = announcementService.markAsRead(1L, 1L);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.id());
        assertEquals(1L, result.announcementId());
        assertEquals(1L, result.userId());
        assertEquals("Test Announcement", result.announcementTitle());
        verify(readReceiptRepository, never()).save(any(AnnouncementReadReceipt.class));
    }

    @Test
    @DisplayName("Should acknowledge announcement successfully")
    void acknowledgeAnnouncement_ShouldCreateAcknowledgment_WhenRequired() {
        // Given
        testAnnouncement.setAcknowledgmentRequired(true);
        when(announcementRepository.findById(1L)).thenReturn(Optional.of(testAnnouncement));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(acknowledgmentRepository.existsByAnnouncementIdAndUserId(1L, 1L)).thenReturn(false);
        
        AnnouncementAcknowledgment savedAcknowledgment = new AnnouncementAcknowledgment();
        savedAcknowledgment.setId(1L);
        savedAcknowledgment.setAnnouncement(testAnnouncement);
        savedAcknowledgment.setUser(testUser);
        savedAcknowledgment.setAcknowledgedAt(LocalDateTime.now());
        savedAcknowledgment.setAcknowledgmentNote("Acknowledged");
        savedAcknowledgment.setCreatedAt(LocalDateTime.now());
        
        when(acknowledgmentRepository.save(any(AnnouncementAcknowledgment.class)))
            .thenReturn(savedAcknowledgment);

        // When
        AnnouncementAcknowledgmentDTO result = announcementService.acknowledgeAnnouncement(1L, 1L, "Acknowledged");

        // Then
        assertNotNull(result);
        assertEquals(1L, result.announcementId());
        assertEquals(1L, result.userId());
        assertEquals("Acknowledged", result.acknowledgmentNote());
        verify(acknowledgmentRepository).save(any(AnnouncementAcknowledgment.class));
    }

    @Test
    @DisplayName("Should throw exception when acknowledgment not required")
    void acknowledgeAnnouncement_ShouldThrowException_WhenNotRequired() {
        // Given
        testAnnouncement.setAcknowledgmentRequired(false);
        when(announcementRepository.findById(1L)).thenReturn(Optional.of(testAnnouncement));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // When & Then
        assertThrows(IllegalArgumentException.class, 
            () -> announcementService.acknowledgeAnnouncement(1L, 1L, "Note"));
        verify(acknowledgmentRepository, never()).save(any(AnnouncementAcknowledgment.class));
    }

    @Test
    @DisplayName("Should get pending acknowledgments count")
    void getPendingAcknowledgmentsCount_ShouldReturnCount_WhenUserExists() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(announcementRepository.countPendingAcknowledgments(
            eq(1L), eq(UserRole.STUDENT), eq(1L), eq(1L), any(LocalDateTime.class)))
            .thenReturn(3L);

        // When
        Long result = announcementService.getPendingAcknowledgmentsCount(1L);

        // Then
        assertEquals(3L, result);
        verify(announcementRepository).countPendingAcknowledgments(
            eq(1L), eq(UserRole.STUDENT), eq(1L), eq(1L), any(LocalDateTime.class));
    }

    @Test
    @DisplayName("Should search announcements for user")
    void searchAnnouncementsForUser_ShouldReturnResults_WhenSearchTermProvided() {
        // Given
        Page<Announcement> searchResults = new PageImpl<>(Arrays.asList(testAnnouncement));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(announcementRepository.searchAnnouncements(eq("test"), any(LocalDateTime.class), eq(pageable)))
            .thenReturn(searchResults);
        when(announcementMapper.toDtoWithUserStatus(testAnnouncement, 1L))
            .thenReturn(testAnnouncementDTO);

        // When
        Page<AnnouncementDTO> result = announcementService.searchAnnouncementsForUser(1L, "test", pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(announcementRepository).searchAnnouncements(eq("test"), any(LocalDateTime.class), eq(pageable));
    }

    @Test
    @DisplayName("Should validate user can create announcement for target")
    void canUserCreateAnnouncementForTarget_ShouldReturnTrue_WhenTeacherTargetsStudents() {
        // When
        boolean result = announcementService.canUserCreateAnnouncementForTarget(
            UserRole.TEACHER, null, 1L, null, 1L, UserRole.STUDENT);

        // Then
        assertTrue(result);
    }

    @Test
    @DisplayName("Should validate user cannot create announcement for invalid target")
    void canUserCreateAnnouncementForTarget_ShouldReturnFalse_WhenStudentTargetsTeachers() {
        // When
        boolean result = announcementService.canUserCreateAnnouncementForTarget(
            UserRole.STUDENT, null, 1L, null, 1L, UserRole.TEACHER);

        // Then
        assertFalse(result);
    }

    @Test
    @DisplayName("Should validate user can modify own announcement")
    void canUserModifyAnnouncement_ShouldReturnTrue_WhenUserIsCreator() {
        // Given
        when(userRepository.findById(2L)).thenReturn(Optional.of(testCreator));
        when(announcementRepository.findById(1L)).thenReturn(Optional.of(testAnnouncement));

        // When
        boolean result = announcementService.canUserModifyAnnouncement(2L, 1L);

        // Then
        assertTrue(result);
    }

    @Test
    @DisplayName("Should validate admin can modify any announcement")
    void canUserModifyAnnouncement_ShouldReturnTrue_WhenUserIsAdmin() {
        // Given
        User adminUser = new User();
        adminUser.setId(3L);
        adminUser.setRole(UserRole.SUPER_ADMIN);
        
        when(userRepository.findById(3L)).thenReturn(Optional.of(adminUser));
        when(announcementRepository.findById(1L)).thenReturn(Optional.of(testAnnouncement));

        // When
        boolean result = announcementService.canUserModifyAnnouncement(3L, 1L);

        // Then
        assertTrue(result);
    }

    @Test
    @DisplayName("Should update announcement with valid permissions")
    void updateAnnouncement_ShouldUpdateAnnouncement_WhenUserHasPermission() {
        // Given
        when(userRepository.findById(2L)).thenReturn(Optional.of(testCreator));
        when(announcementRepository.findById(1L)).thenReturn(Optional.of(testAnnouncement));
        when(announcementRepository.save(any(Announcement.class))).thenReturn(testAnnouncement);
        when(announcementMapper.toDto(testAnnouncement)).thenReturn(testAnnouncementDTO);

        // When
        AnnouncementDTO result = announcementService.updateAnnouncement(1L, testAnnouncementDTO, 2L);

        // Then
        assertNotNull(result);
        verify(announcementRepository).save(any(Announcement.class));
    }

    @Test
    @DisplayName("Should delete announcement with valid permissions")
    void deleteAnnouncement_ShouldDeleteAnnouncement_WhenUserHasPermission() {
        // Given
        when(userRepository.findById(2L)).thenReturn(Optional.of(testCreator));
        when(announcementRepository.findById(1L)).thenReturn(Optional.of(testAnnouncement));
        when(announcementRepository.existsById(1L)).thenReturn(true);

        // When
        announcementService.deleteAnnouncement(1L, 2L);

        // Then
        verify(announcementRepository).deleteById(1L);
    }

    @Test
    @DisplayName("Should toggle announcement status")
    void toggleAnnouncementStatus_ShouldToggleStatus_WhenUserHasPermission() {
        // Given
        when(userRepository.findById(2L)).thenReturn(Optional.of(testCreator));
        when(announcementRepository.findById(1L)).thenReturn(Optional.of(testAnnouncement));
        when(announcementRepository.save(any(Announcement.class))).thenReturn(testAnnouncement);
        when(announcementMapper.toDto(testAnnouncement)).thenReturn(testAnnouncementDTO);

        // When
        AnnouncementDTO result = announcementService.toggleAnnouncementStatus(1L, 2L);

        // Then
        assertNotNull(result);
        verify(announcementRepository).save(testAnnouncement);
        assertFalse(testAnnouncement.isActive()); // Should be toggled from true to false
    }

    @Test
    @DisplayName("Should get global announcements")
    void getGlobalAnnouncements_ShouldReturnGlobalAnnouncements() {
        // Given
        Page<Announcement> globalAnnouncements = new PageImpl<>(Arrays.asList(testAnnouncement));
        when(announcementRepository.findGlobalAnnouncements(any(LocalDateTime.class), eq(pageable)))
            .thenReturn(globalAnnouncements);
        when(announcementMapper.toDto(testAnnouncement)).thenReturn(testAnnouncementDTO);

        // When
        Page<AnnouncementDTO> result = announcementService.getGlobalAnnouncements(pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(announcementRepository).findGlobalAnnouncements(any(LocalDateTime.class), eq(pageable));
    }

    @Test
    @DisplayName("Should get announcements by type for user")
    void getAnnouncementsByTypeForUser_ShouldReturnFilteredAnnouncements() {
        // Given
        Page<Announcement> typeAnnouncements = new PageImpl<>(Arrays.asList(testAnnouncement));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(announcementRepository.findActiveAnnouncementsByType(
            any(LocalDateTime.class), eq(AnnouncementType.GENERAL), eq(pageable)))
            .thenReturn(typeAnnouncements);
        when(announcementMapper.toDtoWithUserStatus(testAnnouncement, 1L))
            .thenReturn(testAnnouncementDTO);

        // When
        Page<AnnouncementDTO> result = announcementService.getAnnouncementsByTypeForUser(
            1L, AnnouncementType.GENERAL, pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(announcementRepository).findActiveAnnouncementsByType(
            any(LocalDateTime.class), eq(AnnouncementType.GENERAL), eq(pageable));
    }

    @Test
    @DisplayName("Should get announcements by creator")
    void getAnnouncementsByCreator_ShouldReturnCreatorAnnouncements() {
        // Given
        Page<Announcement> creatorAnnouncements = new PageImpl<>(Arrays.asList(testAnnouncement));
        when(userRepository.findById(2L)).thenReturn(Optional.of(testCreator));
        when(announcementRepository.findByCreatorId(2L, pageable)).thenReturn(creatorAnnouncements);
        when(announcementMapper.toDto(testAnnouncement)).thenReturn(testAnnouncementDTO);

        // When
        Page<AnnouncementDTO> result = announcementService.getAnnouncementsByCreator(2L, pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(announcementRepository).findByCreatorId(2L, pageable);
    }
} 