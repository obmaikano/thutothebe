package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.NotificationDTO;
import com.ohma.thutothebe.entity.Notification;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.NotificationMapper;
import com.ohma.thutothebe.repository.NotificationRepository;
import com.ohma.thutothebe.repository.UserRepository;
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
class NotificationServiceImplTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private NotificationMapper notificationMapper;

    @InjectMocks
    private NotificationServiceImpl notificationService;

    private User recipient;
    private Notification notification;
    private NotificationDTO notificationDTO;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        recipient = new User();
        recipient.setId(1L);
        recipient.setUsername("recipient");

        notification = new Notification();
        notification.setId(1L);
        notification.setContent("Test notification");
        notification.setType(Notification.NotificationType.MESSAGE);
        notification.setRecipient(recipient);
        notification.setReadAt(null);
        notification.setActive(true);

        notificationDTO = new NotificationDTO(1L, "Test notification", "Test notification content", 1L, Notification.NotificationType.MESSAGE, null, null, LocalDateTime.now(), null, true);
        pageable = PageRequest.of(0, 10);
    }

    @Test
    void create_ShouldCreateNewNotification() {
        when(notificationMapper.toEntity(any(NotificationDTO.class))).thenReturn(notification);
        when(userRepository.findById(1L)).thenReturn(Optional.of(recipient));
        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);
        when(notificationMapper.toDto(any(Notification.class))).thenReturn(notificationDTO);

        NotificationDTO result = notificationService.create(notificationDTO);

        assertNotNull(result);
        assertEquals(notificationDTO.id(), result.id());
        assertEquals(notificationDTO.title(), result.title());
        verify(notificationRepository).save(any(Notification.class));
    }

    @Test
    void getById_ShouldReturnNotification() {
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(notification));
        when(notificationMapper.toDto(notification)).thenReturn(notificationDTO);

        NotificationDTO result = notificationService.getById(1L);

        assertNotNull(result);
        assertEquals(notificationDTO.id(), result.id());
        assertEquals(notificationDTO.content(), result.content());
    }

    @Test
    void getById_ShouldThrowException_WhenNotificationNotFound() {
        when(notificationRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> notificationService.getById(1L));
    }

    @Test
    void getAll_ShouldReturnAllNotifications() {
        List<Notification> notifications = Arrays.asList(notification);
        when(notificationRepository.findAll()).thenReturn(notifications);
        when(notificationMapper.toDto(any(Notification.class))).thenReturn(notificationDTO);

        List<NotificationDTO> results = notificationService.getAll();

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(notificationDTO.id(), results.get(0).id());
    }

    @Test
    void update_ShouldUpdateNotification() {
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(notification));
        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);
        when(notificationMapper.toDto(any(Notification.class))).thenReturn(notificationDTO);

        NotificationDTO result = notificationService.update(1L, notificationDTO);

        assertNotNull(result);
        assertEquals(notificationDTO.id(), result.id());
        verify(notificationRepository).save(any(Notification.class));
    }

    @Test
    void update_ShouldThrowException_WhenNotificationNotFound() {
        when(notificationRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> notificationService.update(1L, notificationDTO));
    }

    @Test
    void delete_ShouldDeleteNotification() {
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(notification));

        notificationService.delete(1L);

        verify(notificationRepository).delete(notification);
    }

    @Test
    void delete_ShouldThrowException_WhenNotificationNotFound() {
        when(notificationRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> notificationService.delete(1L));
        verify(notificationRepository, never()).delete(any(Notification.class));
    }

    @Test
    void findByRecipientId_ShouldReturnNotifications() {
        List<Notification> notifications = Arrays.asList(notification);
        Page<Notification> notificationPage = new PageImpl<>(notifications);
        when(notificationRepository.findByRecipientId(1L, pageable)).thenReturn(notificationPage);
        when(notificationMapper.toDto(any(Notification.class))).thenReturn(notificationDTO);

        Page<NotificationDTO> results = notificationService.findByRecipientId(1L, pageable);

        assertNotNull(results);
        assertEquals(1, results.getTotalElements());
        assertEquals(notificationDTO.id(), results.getContent().get(0).id());
    }

    @Test
    void findByRecipientIdAndActive_ShouldReturnNotifications() {
        List<Notification> notifications = Arrays.asList(notification);
        Page<Notification> notificationPage = new PageImpl<>(notifications);
        when(notificationRepository.findByRecipientIdAndActive(1L, true, pageable)).thenReturn(notificationPage);
        when(notificationMapper.toDto(any(Notification.class))).thenReturn(notificationDTO);

        Page<NotificationDTO> results = notificationService.findByRecipientIdAndActive(1L, true, pageable);

        assertNotNull(results);
        assertEquals(1, results.getTotalElements());
        assertEquals(notificationDTO.id(), results.getContent().get(0).id());
    }

    @Test
    void findByRecipientIdAndType_ShouldReturnNotifications() {
        List<Notification> notifications = Arrays.asList(notification);
        Page<Notification> notificationPage = new PageImpl<>(notifications);
        when(notificationRepository.findByRecipientIdAndType(1L, Notification.NotificationType.MESSAGE, pageable))
                .thenReturn(notificationPage);
        when(notificationMapper.toDto(any(Notification.class))).thenReturn(notificationDTO);

        Page<NotificationDTO> results = notificationService.findByRecipientIdAndType(1L, Notification.NotificationType.MESSAGE, pageable);

        assertNotNull(results);
        assertEquals(1, results.getTotalElements());
        assertEquals(notificationDTO.id(), results.getContent().get(0).id());
    }

    @Test
    void findByRecipientIdAndTypeAndActive_ShouldReturnNotifications() {
        List<Notification> notifications = Arrays.asList(notification);
        Page<Notification> notificationPage = new PageImpl<>(notifications);
        when(notificationRepository.findByRecipientIdAndTypeAndActive(1L, Notification.NotificationType.MESSAGE, true, pageable))
                .thenReturn(notificationPage);
        when(notificationMapper.toDto(any(Notification.class))).thenReturn(notificationDTO);

        Page<NotificationDTO> results = notificationService.findByRecipientIdAndTypeAndActive(1L, Notification.NotificationType.MESSAGE, true, pageable);

        assertNotNull(results);
        assertEquals(1, results.getTotalElements());
        assertEquals(notificationDTO.id(), results.getContent().get(0).id());
    }

    @Test
    void findUnreadByRecipientId_ShouldReturnNotifications() {
        List<Notification> notifications = Arrays.asList(notification);
        when(notificationRepository.findUnreadByRecipientId(1L)).thenReturn(notifications);
        when(notificationMapper.toDto(any(Notification.class))).thenReturn(notificationDTO);

        List<NotificationDTO> results = notificationService.findUnreadByRecipientId(1L);

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(notificationDTO.id(), results.get(0).id());
    }

    @Test
    void countUnreadByRecipientId_ShouldReturnCount() {
        when(notificationRepository.countUnreadByRecipientId(1L)).thenReturn(1L);

        long count = notificationService.countUnreadByRecipientId(1L);

        assertEquals(1L, count);
    }

    @Test
    void markAsRead_ShouldMarkNotificationAsRead() {
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(notification));
        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);
        when(notificationMapper.toDto(any(Notification.class))).thenReturn(notificationDTO);

        NotificationDTO result = notificationService.markAsRead(1L);

        assertNotNull(result);
        assertEquals(notificationDTO.id(), result.id());
        verify(notificationRepository).save(any(Notification.class));
    }

    @Test
    void markAsRead_ShouldThrowException_WhenNotificationNotFound() {
        when(notificationRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> notificationService.markAsRead(1L));
    }

    @Test
    void markAllAsRead_ShouldMarkAllNotificationsAsRead() {
        List<Notification> notifications = Arrays.asList(notification);
        when(notificationRepository.findUnreadByRecipientId(1L)).thenReturn(notifications);
        when(notificationRepository.saveAll(anyList())).thenReturn(notifications);

        notificationService.markAllAsRead(1L);

        verify(notificationRepository).saveAll(anyList());
    }

    @Test
    void isNotificationRecipient_ShouldReturnTrue_WhenUserIsRecipient() {
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(notification));

        boolean result = notificationService.isNotificationRecipient(1L, 1L);

        assertTrue(result);
    }

    @Test
    void isNotificationRecipient_ShouldReturnFalse_WhenUserIsNotRecipient() {
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(notification));

        boolean result = notificationService.isNotificationRecipient(1L, 2L);

        assertFalse(result);
    }

    @Test
    void isNotificationRecipient_ShouldThrowException_WhenNotificationNotFound() {
        when(notificationRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> notificationService.isNotificationRecipient(1L, 1L));
    }

    @Test
    void markAsRead_ShouldSetReadAtTimestamp() {
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(notification));
        when(notificationRepository.save(any(Notification.class))).thenAnswer(invocation -> {
            Notification saved = invocation.getArgument(0);
            assertNotNull(saved.getReadAt());
            return saved;
        });
        when(notificationMapper.toDto(any(Notification.class))).thenReturn(notificationDTO);

        NotificationDTO result = notificationService.markAsRead(1L);

        assertNotNull(result);
        assertEquals(notificationDTO.id(), result.id());
        verify(notificationRepository).save(any(Notification.class));
    }
} 