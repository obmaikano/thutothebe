package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.MessageGroupDTO;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.service.MessageGroupService;
import com.ohma.thutothebe.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/message-groups")
@Tag(name = "Message Group Controller", description = "APIs for managing message groups")
public class MessageGroupController extends BaseController<MessageGroupDTO, Long> {

    private final MessageGroupService messageGroupService;
    private final UserService userService;

    public MessageGroupController(MessageGroupService messageGroupService, UserService userService) {
        super(messageGroupService);
        this.messageGroupService = messageGroupService;
        this.userService = userService;
    }

    @GetMapping("/creator/{creatorId}")
    @Operation(summary = "Get groups created by a user")
    @PreAuthorize("hasRole('ADMIN') or #creatorId == authentication.principal.id")
    public ResponseEntity<OhmaApiResponse<List<MessageGroupDTO>>> getByCreatorId(
            @Parameter(description = "Creator ID") @PathVariable Long creatorId) {
        try {
            List<MessageGroupDTO> groups = messageGroupService.findByCreatorId(creatorId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Groups retrieved successfully", groups, null));
        } catch (Exception e) {
            log.error("Error retrieving groups: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/creator/{creatorId}/active")
    @Operation(summary = "Get active groups created by a user")
    @PreAuthorize("hasRole('ADMIN') or #creatorId == authentication.principal.id")
    public ResponseEntity<OhmaApiResponse<List<MessageGroupDTO>>> getByCreatorIdAndActive(
            @Parameter(description = "Creator ID") @PathVariable Long creatorId,
            @Parameter(description = "Active status") @RequestParam(defaultValue = "true") boolean active) {
        try {
            List<MessageGroupDTO> groups = messageGroupService.findByCreatorIdAndActive(creatorId, active);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Groups retrieved successfully", groups, null));
        } catch (Exception e) {
            log.error("Error retrieving groups: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/member/{memberId}")
    @Operation(summary = "Get groups where user is a member")
    @PreAuthorize("hasRole('ADMIN') or #memberId == authentication.principal.id")
    public ResponseEntity<OhmaApiResponse<List<MessageGroupDTO>>> getByMemberId(
            @Parameter(description = "Member ID") @PathVariable Long memberId) {
        try {
            List<MessageGroupDTO> groups = messageGroupService.findByMemberId(memberId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Groups retrieved successfully", groups, null));
        } catch (Exception e) {
            log.error("Error retrieving groups: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/member/{memberId}/active")
    @Operation(summary = "Get active groups where user is a member")
    @PreAuthorize("hasRole('ADMIN') or #memberId == authentication.principal.id")
    public ResponseEntity<OhmaApiResponse<List<MessageGroupDTO>>> getByMemberIdAndActive(
            @Parameter(description = "Member ID") @PathVariable Long memberId,
            @Parameter(description = "Active status") @RequestParam(defaultValue = "true") boolean active) {
        try {
            List<MessageGroupDTO> groups = messageGroupService.findByMemberIdAndActive(memberId, active);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Groups retrieved successfully", groups, null));
        } catch (Exception e) {
            log.error("Error retrieving groups: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/{id}/with-members-messages")
    @Operation(summary = "Get group with members and messages")
    @PreAuthorize("hasRole('ADMIN') or @messageGroupService.isGroupMember(#id, authentication.principal.id)")
    public ResponseEntity<OhmaApiResponse<MessageGroupDTO>> getByIdWithMembersAndMessages(
            @Parameter(description = "Group ID") @PathVariable Long id) {
        try {
            MessageGroupDTO group = messageGroupService.findByIdWithMembersAndMessages(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Group retrieved successfully", group, null));
        } catch (Exception e) {
            log.error("Error retrieving group: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{id}/members/{userId}")
    @Operation(summary = "Add a member to the group")
    @PreAuthorize("hasRole('ADMIN') or @messageGroupService.isGroupCreator(#id, authentication.principal.id)")
    public ResponseEntity<OhmaApiResponse<MessageGroupDTO>> addMember(
            @Parameter(description = "Group ID") @PathVariable Long id,
            @Parameter(description = "User ID") @PathVariable Long userId) {
        try {
            // Validate user exists
            userService.getById(userId);
            
            MessageGroupDTO updated = messageGroupService.addMember(id, userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Member added successfully", updated, null));
        } catch (Exception e) {
            log.error("Error adding member: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @DeleteMapping("/{id}/members/{userId}")
    @Operation(summary = "Remove a member from the group")
    @PreAuthorize("hasRole('ADMIN') or @messageGroupService.isGroupCreator(#id, authentication.principal.id)")
    public ResponseEntity<OhmaApiResponse<MessageGroupDTO>> removeMember(
            @Parameter(description = "Group ID") @PathVariable Long id,
            @Parameter(description = "User ID") @PathVariable Long userId) {
        try {
            MessageGroupDTO updated = messageGroupService.removeMember(id, userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Member removed successfully", updated, null));
        } catch (Exception e) {
            log.error("Error removing member: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 