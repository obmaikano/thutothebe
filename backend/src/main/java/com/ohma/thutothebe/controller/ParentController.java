package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.dto.UserDTO;
import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.entity.UserRole;
import com.ohma.thutothebe.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/parents")
@Tag(name = "Parent Management", description = "APIs for managing parent users")
public class ParentController extends BaseController<UserDTO, Long> {

    private final UserService userService;

    @Autowired
    public ParentController(UserService userService) {
        super(userService);
        this.userService = userService;
    }

    @GetMapping("/all")
    @Operation(summary = "Get all parents")
    public ResponseEntity<OhmaApiResponse<List<UserDTO>>> getAllParents() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Get accessible user IDs and filter for parents
            List<Long> accessibleUserIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.USER);
            
            if (accessibleUserIds.isEmpty()) {
                return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "No accessible parents", List.of(), null));
            }

            List<UserDTO> allParents = userService.getAllParents();
            List<UserDTO> accessibleParents = allParents.stream()
                    .filter(parent -> accessibleUserIds.contains(parent.getId()))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Parents retrieved successfully", accessibleParents, null));
        } catch (Exception e) {
            log.error("Error retrieving parents: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/children/{parentId}")
    @Operation(summary = "Get children linked to a parent")
    public ResponseEntity<OhmaApiResponse<List<UserDTO>>> getChildrenByParentId(@PathVariable Long parentId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view this parent's data
            if (!hasAccess(AccessScope.USER, parentId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to parent data", null, null));
            }

            List<UserDTO> children = userService.getChildrenByParentId(parentId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Children retrieved successfully", children, null));
        } catch (Exception e) {
            log.error("Error retrieving children for parent: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{parentId}/link-child/{childId}")
    @Operation(summary = "Link a child to a parent")
    public ResponseEntity<OhmaApiResponse<Void>> linkChildToParent(
            @PathVariable Long parentId, 
            @PathVariable Long childId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to manage both parent and child accounts
            if (!hasAccess(AccessScope.USER, parentId) || !hasAccess(AccessScope.USER, childId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to user data", null, null));
            }

            userService.linkChildToParent(parentId, childId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Child linked to parent successfully", null, null));
        } catch (Exception e) {
            log.error("Error linking child to parent: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{parentId}/unlink-child/{childId}")
    @Operation(summary = "Unlink a child from a parent")
    public ResponseEntity<OhmaApiResponse<Void>> unlinkChildFromParent(
            @PathVariable Long parentId, 
            @PathVariable Long childId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to manage both parent and child accounts
            if (!hasAccess(AccessScope.USER, parentId) || !hasAccess(AccessScope.USER, childId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to user data", null, null));
            }

            userService.unlinkChildFromParent(parentId, childId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Child unlinked from parent successfully", null, null));
        } catch (Exception e) {
            log.error("Error unlinking child from parent: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/school/{schoolId}")
    @Operation(summary = "Get parents by school ID")
    public ResponseEntity<OhmaApiResponse<List<UserDTO>>> getParentsBySchoolId(@PathVariable Long schoolId) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to view this school's parent data
            if (!hasAccess(AccessScope.SCHOOL, schoolId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to school data", null, null));
            }

            List<UserDTO> parents = userService.getParentsBySchoolId(schoolId);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Parents for school retrieved successfully", parents, null));
        } catch (Exception e) {
            log.error("Error retrieving parents for school: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active parents")
    public ResponseEntity<OhmaApiResponse<List<UserDTO>>> getActiveParents() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Get accessible user IDs and filter for active parents
            List<Long> accessibleUserIds = accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.USER);
            
            if (accessibleUserIds.isEmpty()) {
                return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "No accessible parents", List.of(), null));
            }

            List<UserDTO> allActiveParents = userService.getActiveParents();
            List<UserDTO> accessibleActiveParents = allActiveParents.stream()
                    .filter(parent -> accessibleUserIds.contains(parent.getId()))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active parents retrieved successfully", accessibleActiveParents, null));
        } catch (Exception e) {
            log.error("Error retrieving active parents: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{id}/activate")
    @Operation(summary = "Activate a parent account")
    public ResponseEntity<OhmaApiResponse<Void>> activateParent(@PathVariable Long id) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to manage this parent account
            if (!hasAccess(AccessScope.USER, id)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to parent data", null, null));
            }

            userService.activateUser(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Parent account activated successfully", null, null));
        } catch (Exception e) {
            log.error("Error activating parent account: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate a parent account")
    public ResponseEntity<OhmaApiResponse<Void>> deactivateParent(@PathVariable Long id) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to manage this parent account
            if (!hasAccess(AccessScope.USER, id)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to parent data", null, null));
            }

            userService.deactivateUser(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Parent account deactivated successfully", null, null));
        } catch (Exception e) {
            log.error("Error deactivating parent account: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PutMapping("/{id}/update-profile")
    @Operation(summary = "Update parent profile without changing role and password")
    public ResponseEntity<OhmaApiResponse<UserDTO>> updateParentProfile(
            @PathVariable Long id, 
            @RequestBody UserDTO parentDTO) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Check if user has access to update this parent profile
            if (!hasAccess(AccessScope.USER, id)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied to parent data", null, null));
            }

            // Verify that the user is actually a parent
            UserDTO existingParent = userService.getById(id);
            if (existingParent.getRole() != UserRole.PARENT) {
                return ResponseEntity.badRequest()
                        .body(new OhmaApiResponse<>("ERROR", "User with id " + id + " is not a parent", null, null));
            }
            
            UserDTO updated = userService.updateWithoutRoleAndPassword(id, parentDTO);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Parent profile updated successfully", updated, null));
        } catch (Exception e) {
            log.error("Error updating parent profile: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }
} 