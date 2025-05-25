package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.dto.UserDTO;
import com.ohma.thutothebe.entity.UserRole;
import com.ohma.thutothebe.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    @PreAuthorize("hasAnyRole('ADMIN', 'SCHOOL_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<OhmaApiResponse<List<UserDTO>>> getAllParents() {
        try {
            List<UserDTO> parents = userService.getAllParents();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Parents retrieved successfully", parents, null));
        } catch (Exception e) {
            log.error("Error retrieving parents: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/children/{parentId}")
    @Operation(summary = "Get children linked to a parent")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCHOOL_ADMIN', 'SUPER_ADMIN', 'PARENT')")
    public ResponseEntity<OhmaApiResponse<List<UserDTO>>> getChildrenByParentId(@PathVariable Long parentId) {
        try {
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
    @PreAuthorize("hasAnyRole('ADMIN', 'SCHOOL_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<OhmaApiResponse<Void>> linkChildToParent(
            @PathVariable Long parentId, 
            @PathVariable Long childId) {
        try {
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
    @PreAuthorize("hasAnyRole('ADMIN', 'SCHOOL_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<OhmaApiResponse<Void>> unlinkChildFromParent(
            @PathVariable Long parentId, 
            @PathVariable Long childId) {
        try {
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
    @PreAuthorize("hasAnyRole('ADMIN', 'SCHOOL_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<OhmaApiResponse<List<UserDTO>>> getParentsBySchoolId(@PathVariable Long schoolId) {
        try {
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
    @PreAuthorize("hasAnyRole('ADMIN', 'SCHOOL_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<OhmaApiResponse<List<UserDTO>>> getActiveParents() {
        try {
            List<UserDTO> parents = userService.getActiveParents();
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Active parents retrieved successfully", parents, null));
        } catch (Exception e) {
            log.error("Error retrieving active parents: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/{id}/activate")
    @Operation(summary = "Activate a parent account")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCHOOL_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<OhmaApiResponse<Void>> activateParent(@PathVariable Long id) {
        try {
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
    @PreAuthorize("hasAnyRole('ADMIN', 'SCHOOL_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<OhmaApiResponse<Void>> deactivateParent(@PathVariable Long id) {
        try {
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
    @PreAuthorize("hasAnyRole('ADMIN', 'SCHOOL_ADMIN', 'SUPER_ADMIN', 'PARENT')")
    public ResponseEntity<OhmaApiResponse<UserDTO>> updateParentProfile(
            @PathVariable Long id, 
            @RequestBody UserDTO parentDTO) {
        try {
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