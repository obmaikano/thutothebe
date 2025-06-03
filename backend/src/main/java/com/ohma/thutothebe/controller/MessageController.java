package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.MessageDTO;
import com.ohma.thutothebe.dto.UserDTO;
import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.entity.UserRole;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.service.MessageService;
import com.ohma.thutothebe.service.MessageGroupService;
import com.ohma.thutothebe.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/messages")
@Tag(name = "Message Controller", description = "APIs for managing messages")
public class MessageController extends BaseController<MessageDTO, Long> {

    private final MessageService messageService;
    private final MessageGroupService messageGroupService;
    private final UserService userService;

    public MessageController(MessageService messageService, MessageGroupService messageGroupService, UserService userService) {
        super(messageService);
        this.messageService = messageService;
        this.messageGroupService = messageGroupService;
        this.userService = userService;
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get messages for a user")
    public ResponseEntity<OhmaApiResponse<List<MessageDTO>>> getByUserId(
            @Parameter(description = "User ID") @PathVariable Long userId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view messages for this user (admin or own messages)
            if (!hasAccess(AccessScope.USER, userId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to user messages", null, null));
            }

            List<MessageDTO> messages = messageService.findByUserId(userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Messages retrieved successfully", messages, null));
        } catch (Exception e) {
            log.error("Error retrieving messages: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/user/{userId}/active")
    @Operation(summary = "Get active messages for a user")
    public ResponseEntity<OhmaApiResponse<List<MessageDTO>>> getByUserIdAndActive(
            @Parameter(description = "User ID") @PathVariable Long userId,
            @Parameter(description = "Active status") @RequestParam(defaultValue = "true") boolean active) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view active messages for this user
            if (!hasAccess(AccessScope.USER, userId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to user messages", null, null));
            }

            List<MessageDTO> messages = messageService.findByUserIdAndActive(userId, active);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Messages retrieved successfully", messages, null));
        } catch (Exception e) {
            log.error("Error retrieving messages: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/conversation")
    @Operation(summary = "Get messages between two users")
    public ResponseEntity<OhmaApiResponse<List<MessageDTO>>> getBySenderAndRecipient(
            @Parameter(description = "Sender ID") @RequestParam Long senderId,
            @Parameter(description = "Recipient ID") @RequestParam Long recipientId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view conversation (participant or admin)
            if (!hasAccess(AccessScope.USER, senderId) && !hasAccess(AccessScope.USER, recipientId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to conversation", null, null));
            }

            List<MessageDTO> messages = messageService.findBySenderAndRecipient(senderId, recipientId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Messages retrieved successfully", messages, null));
        } catch (Exception e) {
            log.error("Error retrieving messages: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/conversation/active")
    @Operation(summary = "Get active messages between two users")
    public ResponseEntity<OhmaApiResponse<List<MessageDTO>>> getBySenderAndRecipientAndActive(
            @Parameter(description = "Sender ID") @RequestParam Long senderId,
            @Parameter(description = "Recipient ID") @RequestParam Long recipientId,
            @Parameter(description = "Active status") @RequestParam(defaultValue = "true") boolean active) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view active conversation
            if (!hasAccess(AccessScope.USER, senderId) && !hasAccess(AccessScope.USER, recipientId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to conversation", null, null));
            }

            List<MessageDTO> messages = messageService.findBySenderAndRecipientAndActive(senderId, recipientId, active);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Messages retrieved successfully", messages, null));
        } catch (Exception e) {
            log.error("Error retrieving messages: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/group/{groupId}")
    @Operation(summary = "Get messages in a group")
    public ResponseEntity<OhmaApiResponse<List<MessageDTO>>> getByGroupId(
            @Parameter(description = "Group ID") @PathVariable Long groupId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user is a group member or has admin access
            if (!messageGroupService.isGroupMember(groupId, currentUserId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to group messages", null, null));
            }

            List<MessageDTO> messages = messageService.findByGroupId(groupId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Messages retrieved successfully", messages, null));
        } catch (Exception e) {
            log.error("Error retrieving messages: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/group/{groupId}/active")
    @Operation(summary = "Get active messages in a group")
    public ResponseEntity<OhmaApiResponse<List<MessageDTO>>> getByGroupIdAndActive(
            @Parameter(description = "Group ID") @PathVariable Long groupId,
            @Parameter(description = "Active status") @RequestParam(defaultValue = "true") boolean active) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user is a group member or has admin access
            if (!messageGroupService.isGroupMember(groupId, currentUserId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to group messages", null, null));
            }

            List<MessageDTO> messages = messageService.findByGroupIdAndActive(groupId, active);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Messages retrieved successfully", messages, null));
        } catch (Exception e) {
            log.error("Error retrieving messages: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/contacts/student/{studentId}")
    @Operation(summary = "Get contacts for a student")
    public ResponseEntity<OhmaApiResponse<List<UserDTO>>> getContactsForStudent(
            @Parameter(description = "Student ID") @PathVariable Long studentId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view contacts for this student
            if (!hasAccess(AccessScope.USER, studentId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to student contacts", null, null));
            }

            List<UserDTO> contacts = messageService.getContactsForStudent(studentId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Contacts retrieved successfully", contacts, null));
        } catch (Exception e) {
            log.error("Error retrieving contacts: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/debug/admin-users")
    @Operation(summary = "Debug endpoint to check admin users")
    public ResponseEntity<OhmaApiResponse<Object>> getAdminUsers() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Only global admin can access debug endpoints
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to debug endpoints", null, null));
            }

            List<UserDTO> schoolAdmins = userService.getUsersByRole(UserRole.SCHOOL_ADMIN);
            List<UserDTO> superAdmins = userService.getUsersByRole(UserRole.SUPER_ADMIN);
            
            java.util.Map<String, Object> result = new java.util.HashMap<>();
            result.put("schoolAdmins", schoolAdmins);
            result.put("superAdmins", superAdmins);
            result.put("schoolAdminCount", schoolAdmins.size());
            result.put("superAdminCount", superAdmins.size());
            
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Admin users retrieved", result, null));
        } catch (Exception e) {
            log.error("Error retrieving admin users: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/conversations/user/{userId}")
    @Operation(summary = "Get conversations for a user")
    public ResponseEntity<OhmaApiResponse<List<Object>>> getConversationsForUser(
            @Parameter(description = "User ID") @PathVariable Long userId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view conversations for this user
            if (!hasAccess(AccessScope.USER, userId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to user conversations", null, null));
            }

            List<Object> conversations = messageService.getConversationsForUser(userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Conversations retrieved successfully", conversations, null));
        } catch (Exception e) {
            log.error("Error retrieving conversations: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // Real-time messaging endpoints
    @Override
    @PostMapping
    @Operation(summary = "Send a new message")
    public ResponseEntity<OhmaApiResponse<MessageDTO>> create(@RequestBody MessageDTO messageDTO) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has permission to send messages as the sender
            if (!hasAccess(AccessScope.USER, messageDTO.senderId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to send messages", null, null));
            }

            MessageDTO sentMessage = messageService.sendMessage(messageDTO);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Message sent successfully", sentMessage, null));
        } catch (Exception e) {
            log.error("Error sending message: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @PutMapping("/{id}")
    @Operation(summary = "Update a message")
    public ResponseEntity<OhmaApiResponse<MessageDTO>> update(
            @Parameter(description = "Message ID") @PathVariable Long id,
            @RequestBody MessageDTO messageDTO) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            // Get existing message to check ownership
            MessageDTO existingMessage = messageService.getById(id);
            
            // Check if user has permission to update this message (owner or admin)
            if (!hasAccess(AccessScope.USER, existingMessage.senderId()) && !hasAccess(AccessScope.GLOBAL, null)) {
                return createAccessDeniedResponse();
            }

            MessageDTO updated = messageService.update(id, messageDTO);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Message updated successfully", updated, null));
        } catch (Exception e) {
            log.error("Error updating message: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a message")
    public ResponseEntity<OhmaApiResponse<Void>> delete(@Parameter(description = "Message ID") @PathVariable Long id) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Get existing message to check ownership
            MessageDTO existingMessage = messageService.getById(id);
            
            // Check if user has permission to delete this message (owner or admin)
            if (!hasAccess(AccessScope.USER, existingMessage.senderId()) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to delete message", null, null));
            }

            messageService.delete(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Message deleted successfully", null, null));
        } catch (Exception e) {
            log.error("Error deleting message: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{messageId}/delivered")
    @Operation(summary = "Mark message as delivered")
    public ResponseEntity<OhmaApiResponse<Void>> markMessageAsDelivered(
            @Parameter(description = "Message ID") @PathVariable Long messageId,
            @Parameter(description = "User ID") @RequestParam Long userId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has permission to mark message as delivered for this user
            if (!hasAccess(AccessScope.USER, userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to mark message as delivered", null, null));
            }

            messageService.markMessageAsDelivered(messageId, userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Message marked as delivered", null, null));
        } catch (Exception e) {
            log.error("Error marking message as delivered: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{messageId}/read")
    @Operation(summary = "Mark message as read")
    public ResponseEntity<OhmaApiResponse<Void>> markMessageAsRead(
            @Parameter(description = "Message ID") @PathVariable Long messageId,
            @Parameter(description = "User ID") @RequestParam Long userId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has permission to mark message as read for this user
            if (!hasAccess(AccessScope.USER, userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to mark message as read", null, null));
            }

            messageService.markMessageAsRead(messageId, userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Message marked as read", null, null));
        } catch (Exception e) {
            log.error("Error marking message as read: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/conversation/read")
    @Operation(summary = "Mark conversation as read")
    public ResponseEntity<OhmaApiResponse<Void>> markConversationAsRead(
            @Parameter(description = "User ID") @RequestParam Long userId,
            @Parameter(description = "Partner ID") @RequestParam Long partnerId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has permission to mark conversation as read for this user
            if (!hasAccess(AccessScope.USER, userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to mark conversation as read", null, null));
            }

            messageService.markConversationAsRead(userId, partnerId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Conversation marked as read", null, null));
        } catch (Exception e) {
            log.error("Error marking conversation as read: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/group/{groupId}/read")
    @Operation(summary = "Mark group messages as read")
    public ResponseEntity<OhmaApiResponse<Void>> markGroupMessagesAsRead(
            @Parameter(description = "Group ID") @PathVariable Long groupId,
            @Parameter(description = "User ID") @RequestParam Long userId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has permission to mark group messages as read for this user
            if (!hasAccess(AccessScope.USER, userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to mark group messages as read", null, null));
            }

            messageService.markGroupMessagesAsRead(groupId, userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Group messages marked as read", null, null));
        } catch (Exception e) {
            log.error("Error marking group messages as read: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/conversation/{userId1}/{userId2}")
    @Operation(summary = "Get conversation messages between two users")
    public ResponseEntity<OhmaApiResponse<List<MessageDTO>>> getConversationMessages(
            @Parameter(description = "User ID 1") @PathVariable Long userId1,
            @Parameter(description = "User ID 2") @PathVariable Long userId2) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view conversation (participant or admin)
            if (!hasAccess(AccessScope.USER, userId1) && !hasAccess(AccessScope.USER, userId2) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to conversation messages", null, null));
            }

            List<MessageDTO> messages = messageService.getConversationMessages(userId1, userId2);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Conversation messages retrieved successfully", messages, null));
        } catch (Exception e) {
            log.error("Error retrieving conversation messages: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/conversation/{userId1}/{userId2}/active")
    @Operation(summary = "Get active conversation messages between two users")
    public ResponseEntity<OhmaApiResponse<List<MessageDTO>>> getActiveConversationMessages(
            @Parameter(description = "User ID 1") @PathVariable Long userId1,
            @Parameter(description = "User ID 2") @PathVariable Long userId2) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view active conversation
            if (!hasAccess(AccessScope.USER, userId1) && !hasAccess(AccessScope.USER, userId2) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to conversation messages", null, null));
            }

            List<MessageDTO> messages = messageService.getActiveConversationMessages(userId1, userId2);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active conversation messages retrieved successfully", messages, null));
        } catch (Exception e) {
            log.error("Error retrieving active conversation messages: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/unread-count/{userId}")
    @Operation(summary = "Get unread message count for user")
    public ResponseEntity<OhmaApiResponse<Long>> getUnreadMessageCount(
            @Parameter(description = "User ID") @PathVariable Long userId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view unread count for this user
            if (!hasAccess(AccessScope.USER, userId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to unread message count", null, null));
            }

            Long count = messageService.getUnreadMessageCount(userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Unread message count retrieved successfully", count, null));
        } catch (Exception e) {
            log.error("Error retrieving unread message count: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/unread-count/conversation/{userId}/{partnerId}")
    @Operation(summary = "Get unread message count for conversation")
    public ResponseEntity<OhmaApiResponse<Long>> getUnreadMessageCountForConversation(
            @Parameter(description = "User ID") @PathVariable Long userId,
            @Parameter(description = "Partner ID") @PathVariable Long partnerId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view unread count for this conversation
            if (!hasAccess(AccessScope.USER, userId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to conversation unread count", null, null));
            }

            Long count = messageService.getUnreadMessageCountForConversation(userId, partnerId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Conversation unread count retrieved successfully", count, null));
        } catch (Exception e) {
            log.error("Error retrieving conversation unread count: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/unread-count/group/{userId}/{groupId}")
    @Operation(summary = "Get unread message count for group")
    public ResponseEntity<OhmaApiResponse<Long>> getUnreadMessageCountForGroup(
            @Parameter(description = "User ID") @PathVariable Long userId,
            @Parameter(description = "Group ID") @PathVariable Long groupId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view unread count for this group
            if (!hasAccess(AccessScope.USER, userId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to group unread count", null, null));
            }

            Long count = messageService.getUnreadMessageCountForGroup(userId, groupId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Group unread count retrieved successfully", count, null));
        } catch (Exception e) {
            log.error("Error retrieving group unread count: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PutMapping("/{messageId}/update")
    @Operation(summary = "Update a message with user authorization")
    public ResponseEntity<OhmaApiResponse<MessageDTO>> updateMessageWithAuth(
            @Parameter(description = "Message ID") @PathVariable Long messageId,
            @RequestBody MessageDTO messageDTO,
            @Parameter(description = "User ID") @RequestParam Long userId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has permission to update message as this user
            if (!hasAccess(AccessScope.USER, userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to update message", null, null));
            }

            MessageDTO updated = messageService.updateMessage(messageId, messageDTO, userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Message updated successfully", updated, null));
        } catch (Exception e) {
            log.error("Error updating message with auth: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @DeleteMapping("/{messageId}/delete")
    @Operation(summary = "Delete a message with user authorization")
    public ResponseEntity<OhmaApiResponse<Void>> deleteMessageWithAuth(
            @Parameter(description = "Message ID") @PathVariable Long messageId,
            @Parameter(description = "User ID") @RequestParam Long userId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has permission to delete message as this user
            if (!hasAccess(AccessScope.USER, userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to delete message", null, null));
            }

            messageService.deleteMessage(messageId, userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Message deleted successfully", null, null));
        } catch (Exception e) {
            log.error("Error deleting message with auth: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 