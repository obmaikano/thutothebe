package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.NotificationDTO;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.entity.Notification;
import com.ohma.thutothebe.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/notifications")
@Tag(name = "Notification Controller", description = "APIs for managing notifications")
public class NotificationController extends BaseController<NotificationDTO, Long> {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        super(notificationService);
        this.notificationService = notificationService;
    }

    @GetMapping("/recipient/{recipientId}")
    @Operation(summary = "Get notifications for a recipient")
    @PreAuthorize("hasRole('ADMIN') or #recipientId == authentication.principal.id")
    public ResponseEntity<OhmaApiResponse<Page<NotificationDTO>>> getByRecipientId(
            @Parameter(description = "Recipient ID") @PathVariable Long recipientId,
            @Parameter(description = "Pagination parameters") Pageable pageable) {
        try {
            Page<NotificationDTO> notifications = notificationService.findByRecipientId(recipientId, pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Notifications retrieved successfully", notifications, null));
        } catch (Exception e) {
            log.error("Error retrieving notifications: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/recipient/{recipientId}/active")
    @Operation(summary = "Get active notifications for a recipient")
    @PreAuthorize("hasRole('ADMIN') or #recipientId == authentication.principal.id")
    public ResponseEntity<OhmaApiResponse<Page<NotificationDTO>>> getByRecipientIdAndActive(
            @Parameter(description = "Recipient ID") @PathVariable Long recipientId,
            @Parameter(description = "Active status") @RequestParam(defaultValue = "true") boolean active,
            @Parameter(description = "Pagination parameters") Pageable pageable) {
        try {
            Page<NotificationDTO> notifications = notificationService.findByRecipientIdAndActive(recipientId, active, pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Notifications retrieved successfully", notifications, null));
        } catch (Exception e) {
            log.error("Error retrieving notifications: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/recipient/{recipientId}/type/{type}")
    @Operation(summary = "Get notifications by type for a recipient")
    @PreAuthorize("hasRole('ADMIN') or #recipientId == authentication.principal.id")
    public ResponseEntity<OhmaApiResponse<Page<NotificationDTO>>> getByRecipientIdAndType(
            @Parameter(description = "Recipient ID") @PathVariable Long recipientId,
            @Parameter(description = "Notification type") @PathVariable Notification.NotificationType type,
            @Parameter(description = "Pagination parameters") Pageable pageable) {
        try {
            Page<NotificationDTO> notifications = notificationService.findByRecipientIdAndType(recipientId, type, pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Notifications retrieved successfully", notifications, null));
        } catch (Exception e) {
            log.error("Error retrieving notifications: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/recipient/{recipientId}/type/{type}/active")
    @Operation(summary = "Get active notifications by type for a recipient")
    @PreAuthorize("hasRole('ADMIN') or #recipientId == authentication.principal.id")
    public ResponseEntity<OhmaApiResponse<Page<NotificationDTO>>> getByRecipientIdAndTypeAndActive(
            @Parameter(description = "Recipient ID") @PathVariable Long recipientId,
            @Parameter(description = "Notification type") @PathVariable Notification.NotificationType type,
            @Parameter(description = "Active status") @RequestParam(defaultValue = "true") boolean active,
            @Parameter(description = "Pagination parameters") Pageable pageable) {
        try {
            Page<NotificationDTO> notifications = notificationService.findByRecipientIdAndTypeAndActive(recipientId, type, active, pageable);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Notifications retrieved successfully", notifications, null));
        } catch (Exception e) {
            log.error("Error retrieving notifications: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/recipient/{recipientId}/unread")
    @Operation(summary = "Get unread notifications for a recipient")
    @PreAuthorize("hasRole('ADMIN') or #recipientId == authentication.principal.id")
    public ResponseEntity<OhmaApiResponse<List<NotificationDTO>>> getUnreadByRecipientId(
            @Parameter(description = "Recipient ID") @PathVariable Long recipientId) {
        try {
            List<NotificationDTO> notifications = notificationService.findUnreadByRecipientId(recipientId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Unread notifications retrieved successfully", notifications, null));
        } catch (Exception e) {
            log.error("Error retrieving unread notifications: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/recipient/{recipientId}/unread/count")
    @Operation(summary = "Get count of unread notifications for a recipient")
    @PreAuthorize("hasRole('ADMIN') or #recipientId == authentication.principal.id")
    public ResponseEntity<OhmaApiResponse<Long>> getUnreadCountByRecipientId(
            @Parameter(description = "Recipient ID") @PathVariable Long recipientId) {
        try {
            long count = notificationService.countUnreadByRecipientId(recipientId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Unread count retrieved successfully", count, null));
        } catch (Exception e) {
            log.error("Error retrieving unread count: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{id}/mark-read")
    @Operation(summary = "Mark a notification as read")
    @PreAuthorize("hasRole('ADMIN') or @notificationService.isNotificationRecipient(#id, authentication.principal.id)")
    public ResponseEntity<OhmaApiResponse<NotificationDTO>> markAsRead(
            @Parameter(description = "Notification ID") @PathVariable Long id) {
        try {
            NotificationDTO notification = notificationService.markAsRead(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Notification marked as read", notification, null));
        } catch (Exception e) {
            log.error("Error marking notification as read: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/recipient/{recipientId}/mark-all-read")
    @Operation(summary = "Mark all notifications as read for a recipient")
    @PreAuthorize("hasRole('ADMIN') or #recipientId == authentication.principal.id")
    public ResponseEntity<OhmaApiResponse<Void>> markAllAsRead(
            @Parameter(description = "Recipient ID") @PathVariable Long recipientId) {
        try {
            notificationService.markAllAsRead(recipientId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "All notifications marked as read", null, null));
        } catch (Exception e) {
            log.error("Error marking all notifications as read: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 