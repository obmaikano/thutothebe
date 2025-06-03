package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.MessageGroupDTO;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.service.MessageGroupService;
import com.ohma.thutothebe.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<OhmaApiResponse<List<MessageGroupDTO>>> getByCreatorId(
            @Parameter(description = "Creator ID") @PathVariable Long creatorId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view groups created by this user (self-access or admin access)
            if (!hasAccess(AccessScope.USER, creatorId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to view user's message groups", null, null));
            }

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
    public ResponseEntity<OhmaApiResponse<List<MessageGroupDTO>>> getByCreatorIdAndActive(
            @Parameter(description = "Creator ID") @PathVariable Long creatorId,
            @Parameter(description = "Active status") @RequestParam(defaultValue = "true") boolean active) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view groups created by this user (self-access or admin access)
            if (!hasAccess(AccessScope.USER, creatorId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to view user's message groups", null, null));
            }

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
    public ResponseEntity<OhmaApiResponse<List<MessageGroupDTO>>> getByMemberId(
            @Parameter(description = "Member ID") @PathVariable Long memberId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view groups for this member (self-access or admin access)
            if (!hasAccess(AccessScope.USER, memberId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to view user's message groups", null, null));
            }

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
    public ResponseEntity<OhmaApiResponse<List<MessageGroupDTO>>> getByMemberIdAndActive(
            @Parameter(description = "Member ID") @PathVariable Long memberId,
            @Parameter(description = "Active status") @RequestParam(defaultValue = "true") boolean active) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view groups for this member (self-access or admin access)
            if (!hasAccess(AccessScope.USER, memberId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to view user's message groups", null, null));
            }

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
    public ResponseEntity<OhmaApiResponse<MessageGroupDTO>> getByIdWithMembersAndMessages(
            @Parameter(description = "Group ID") @PathVariable Long id) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user is a member of this group or has admin access
            if (!messageGroupService.isGroupMember(id, currentUserId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to view group details", null, null));
            }

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
    public ResponseEntity<OhmaApiResponse<MessageGroupDTO>> addMember(
            @Parameter(description = "Group ID") @PathVariable Long id,
            @Parameter(description = "User ID") @PathVariable Long userId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user is the group creator or has admin access
            if (!messageGroupService.isGroupCreator(id, currentUserId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to add members to this group", null, null));
            }

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
    public ResponseEntity<OhmaApiResponse<MessageGroupDTO>> removeMember(
            @Parameter(description = "Group ID") @PathVariable Long id,
            @Parameter(description = "User ID") @PathVariable Long userId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user is the group creator or has admin access
            if (!messageGroupService.isGroupCreator(id, currentUserId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to remove members from this group", null, null));
            }

            MessageGroupDTO updated = messageGroupService.removeMember(id, userId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Member removed successfully", updated, null));
        } catch (Exception e) {
            log.error("Error removing member: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @PostMapping
    public ResponseEntity<OhmaApiResponse<MessageGroupDTO>> create(@RequestBody MessageGroupDTO dto) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to create message groups (authenticated users can create groups)
            // Additional validation: ensure the creator ID in DTO matches current user
            if (dto.creatorId() != null && !dto.creatorId().equals(currentUserId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to create group for another user", null, null));
            }

            return super.create(dto);
        } catch (Exception e) {
            log.error("Error creating message group: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<OhmaApiResponse<MessageGroupDTO>> update(@PathVariable Long id, @RequestBody MessageGroupDTO dto) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user is the group creator or has admin access
            if (!messageGroupService.isGroupCreator(id, currentUserId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to update this group", null, null));
            }

            return super.update(id, dto);
        } catch (Exception e) {
            log.error("Error updating message group: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @DeleteMapping("/{id}")
    public ResponseEntity<OhmaApiResponse<Void>> delete(@PathVariable Long id) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user is the group creator or has admin access
            if (!messageGroupService.isGroupCreator(id, currentUserId) && !hasAccess(AccessScope.GLOBAL, null)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to delete this group", null, null));
            }

            return super.delete(id);
        } catch (Exception e) {
            log.error("Error deleting message group: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 