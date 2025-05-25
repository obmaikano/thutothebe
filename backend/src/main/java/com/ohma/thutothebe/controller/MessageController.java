package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.MessageDTO;
import com.ohma.thutothebe.dto.UserDTO;
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
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
    public ResponseEntity<OhmaApiResponse<List<MessageDTO>>> getByUserId(
            @Parameter(description = "User ID") @PathVariable Long userId) {
        try {
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
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
    public ResponseEntity<OhmaApiResponse<List<MessageDTO>>> getByUserIdAndActive(
            @Parameter(description = "User ID") @PathVariable Long userId,
            @Parameter(description = "Active status") @RequestParam(defaultValue = "true") boolean active) {
        try {
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
    @PreAuthorize("hasRole('ADMIN') or #senderId == authentication.principal.id or #recipientId == authentication.principal.id")
    public ResponseEntity<OhmaApiResponse<List<MessageDTO>>> getBySenderAndRecipient(
            @Parameter(description = "Sender ID") @RequestParam Long senderId,
            @Parameter(description = "Recipient ID") @RequestParam Long recipientId) {
        try {
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
    @PreAuthorize("hasRole('ADMIN') or #senderId == authentication.principal.id or #recipientId == authentication.principal.id")
    public ResponseEntity<OhmaApiResponse<List<MessageDTO>>> getBySenderAndRecipientAndActive(
            @Parameter(description = "Sender ID") @RequestParam Long senderId,
            @Parameter(description = "Recipient ID") @RequestParam Long recipientId,
            @Parameter(description = "Active status") @RequestParam(defaultValue = "true") boolean active) {
        try {
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
    @PreAuthorize("hasRole('ADMIN') or @messageGroupService.isGroupMember(#groupId, authentication.principal.id)")
    public ResponseEntity<OhmaApiResponse<List<MessageDTO>>> getByGroupId(
            @Parameter(description = "Group ID") @PathVariable Long groupId) {
        try {
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
    @PreAuthorize("hasRole('ADMIN') or @messageGroupService.isGroupMember(#groupId, authentication.principal.id)")
    public ResponseEntity<OhmaApiResponse<List<MessageDTO>>> getByGroupIdAndActive(
            @Parameter(description = "Group ID") @PathVariable Long groupId,
            @Parameter(description = "Active status") @RequestParam(defaultValue = "true") boolean active) {
        try {
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
    @PreAuthorize("hasRole('ADMIN') or #studentId == authentication.principal.id")
    public ResponseEntity<OhmaApiResponse<List<UserDTO>>> getContactsForStudent(
            @Parameter(description = "Student ID") @PathVariable Long studentId) {
        try {
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
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
    public ResponseEntity<OhmaApiResponse<List<Object>>> getConversationsForUser(
            @Parameter(description = "User ID") @PathVariable Long userId) {
        try {
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
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<OhmaApiResponse<MessageDTO>> create(@RequestBody MessageDTO messageDTO) {
        try {
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
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<OhmaApiResponse<MessageDTO>> update(
            @Parameter(description = "Message ID") @PathVariable Long id,
            @RequestBody MessageDTO messageDTO) {
        try {
            // For message updates, we need the user ID for authorization
            // We'll extract it from the messageDTO or use a default approach
            Long userId = messageDTO.senderId(); // Assuming the sender is the one updating
            MessageDTO updatedMessage = messageService.updateMessage(id, messageDTO, userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Message updated successfully", updatedMessage, null));
        } catch (Exception e) {
            log.error("Error updating message: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a message")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<OhmaApiResponse<Void>> delete(@Parameter(description = "Message ID") @PathVariable Long id) {
        try {
            // For message deletion, we need to get the user ID from security context or request
            // For now, we'll need to modify this to get the authenticated user ID
            // This is a simplified approach - in production, get from SecurityContext
            throw new UnsupportedOperationException("Use DELETE /messages/{messageId}?userId={userId} endpoint instead");
        } catch (Exception e) {
            log.error("Error deleting message: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{messageId}/delivered")
    @Operation(summary = "Mark message as delivered")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<OhmaApiResponse<Void>> markMessageAsDelivered(
            @Parameter(description = "Message ID") @PathVariable Long messageId,
            @Parameter(description = "User ID") @RequestParam Long userId) {
        try {
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
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<OhmaApiResponse<Void>> markMessageAsRead(
            @Parameter(description = "Message ID") @PathVariable Long messageId,
            @Parameter(description = "User ID") @RequestParam Long userId) {
        try {
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
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<OhmaApiResponse<Void>> markConversationAsRead(
            @Parameter(description = "User ID") @RequestParam Long userId,
            @Parameter(description = "Partner ID") @RequestParam Long partnerId) {
        try {
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
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<OhmaApiResponse<Void>> markGroupMessagesAsRead(
            @Parameter(description = "Group ID") @PathVariable Long groupId,
            @Parameter(description = "User ID") @RequestParam Long userId) {
        try {
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
    @PreAuthorize("hasRole('ADMIN') or #userId1 == authentication.principal.id or #userId2 == authentication.principal.id")
    public ResponseEntity<OhmaApiResponse<List<MessageDTO>>> getConversationMessages(
            @Parameter(description = "User ID 1") @PathVariable Long userId1,
            @Parameter(description = "User ID 2") @PathVariable Long userId2) {
        try {
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
    @PreAuthorize("hasRole('ADMIN') or #userId1 == authentication.principal.id or #userId2 == authentication.principal.id")
    public ResponseEntity<OhmaApiResponse<List<MessageDTO>>> getActiveConversationMessages(
            @Parameter(description = "User ID 1") @PathVariable Long userId1,
            @Parameter(description = "User ID 2") @PathVariable Long userId2) {
        try {
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
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
    public ResponseEntity<OhmaApiResponse<Long>> getUnreadMessageCount(
            @Parameter(description = "User ID") @PathVariable Long userId) {
        try {
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
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
    public ResponseEntity<OhmaApiResponse<Long>> getUnreadMessageCountForConversation(
            @Parameter(description = "User ID") @PathVariable Long userId,
            @Parameter(description = "Partner ID") @PathVariable Long partnerId) {
        try {
            Long count = messageService.getUnreadMessageCountForConversation(userId, partnerId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Unread conversation count retrieved successfully", count, null));
        } catch (Exception e) {
            log.error("Error retrieving unread conversation count: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/unread-count/group/{userId}/{groupId}")
    @Operation(summary = "Get unread message count for group")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
    public ResponseEntity<OhmaApiResponse<Long>> getUnreadMessageCountForGroup(
            @Parameter(description = "User ID") @PathVariable Long userId,
            @Parameter(description = "Group ID") @PathVariable Long groupId) {
        try {
            Long count = messageService.getUnreadMessageCountForGroup(userId, groupId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Unread group count retrieved successfully", count, null));
        } catch (Exception e) {
            log.error("Error retrieving unread group count: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    // Custom endpoints with specific parameters
    @PutMapping("/{messageId}/update")
    @Operation(summary = "Update a message with user authorization")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<OhmaApiResponse<MessageDTO>> updateMessageWithAuth(
            @Parameter(description = "Message ID") @PathVariable Long messageId,
            @RequestBody MessageDTO messageDTO,
            @Parameter(description = "User ID") @RequestParam Long userId) {
        try {
            MessageDTO updatedMessage = messageService.updateMessage(messageId, messageDTO, userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Message updated successfully", updatedMessage, null));
        } catch (Exception e) {
            log.error("Error updating message: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @DeleteMapping("/{messageId}/delete")
    @Operation(summary = "Delete a message with user authorization")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<OhmaApiResponse<Void>> deleteMessageWithAuth(
            @Parameter(description = "Message ID") @PathVariable Long messageId,
            @Parameter(description = "User ID") @RequestParam Long userId) {
        try {
            messageService.deleteMessage(messageId, userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Message deleted successfully", null, null));
        } catch (Exception e) {
            log.error("Error deleting message: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 