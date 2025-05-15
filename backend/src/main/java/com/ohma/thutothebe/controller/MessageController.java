package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.MessageDTO;
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
} 