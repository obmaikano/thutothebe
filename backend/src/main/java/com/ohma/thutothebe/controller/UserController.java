package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.dto.UserDTO;
import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
@Tag(name = "User Management", description = "APIs for managing users")
@Slf4j
public class UserController extends BaseController<UserDTO, Long> {

    private final UserService userService;

    public UserController(UserService userService) {
        super(userService);
        this.userService = userService;
    }

    @Override
    @PostMapping
    public ResponseEntity<OhmaApiResponse<UserDTO>> create(@RequestBody UserDTO dto) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            // Check if user has permission to create users
            // For user creation, we check GLOBAL scope access (admin level)
            if (!hasAccess(AccessScope.GLOBAL, null)) {
                return createAccessDeniedResponse();
            }

            UserDTO created = userService.create(dto);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "User created successfully", created, null));
        } catch (Exception e) {
            log.error("Error creating user: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<OhmaApiResponse<UserDTO>> getById(@PathVariable Long id) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            // Check if user has access to view this user
            if (!hasAccess(AccessScope.USER, id)) {
                return createAccessDeniedResponse();
            }

            UserDTO user = userService.getById(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "User retrieved successfully", user, null));
        } catch (Exception e) {
            log.error("Error retrieving user: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @GetMapping
    public ResponseEntity<OhmaApiResponse<List<UserDTO>>> getAll() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Use secure multi-tenant filtering instead of unsafe getAll()
            List<UserDTO> accessibleUsers = userService.getUsersByAccessibleScopes(currentUserId);

            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "Users retrieved successfully", accessibleUsers, null));
        } catch (Exception e) {
            log.error("Error retrieving users: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<OhmaApiResponse<UserDTO>> update(@PathVariable Long id, @RequestBody UserDTO dto) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            // Check if user has access to update this user
            if (!hasAccess(AccessScope.USER, id)) {
                return createAccessDeniedResponse();
            }

            UserDTO updated = userService.update(id, dto);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "User updated successfully", updated, null));
        } catch (Exception e) {
            log.error("Error updating user: {}", e.getMessage(), e);
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

            // Check if user has access to delete this user
            if (!hasAccess(AccessScope.USER, id)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new OhmaApiResponse<>("ERROR", "Access denied", null, null));
            }

            userService.delete(id);
            return ResponseEntity.ok(new OhmaApiResponse<>("SUCCESS", "User deleted successfully", null, null));
        } catch (Exception e) {
            log.error("Error deleting user: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new OhmaApiResponse<>("ERROR", e.getMessage(), null, null));
        }
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<OhmaApiResponse<UserDTO>> getUserByEmail(@PathVariable String email) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            UserDTO user = userService.getUserByEmail(email);
            
            // Check if user has access to view this user
            if (!hasAccess(AccessScope.USER, user.getId())) {
                return createAccessDeniedResponse();
            }

            return ResponseEntity.ok(OhmaApiResponse.success(user));
        } catch (Exception e) {
            log.error("Error retrieving user: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(OhmaApiResponse.error(400, e.getMessage()));
        }
    }

    @GetMapping("/teachers")
    public ResponseEntity<OhmaApiResponse<List<UserDTO>>> getAllTeachers() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Use secure multi-tenant filtering for teachers
            List<UserDTO> accessibleTeachers = userService.getTeachersByAccessibleScopes(currentUserId);

            return ResponseEntity.ok(OhmaApiResponse.success(accessibleTeachers));
        } catch (Exception e) {
            log.error("Error retrieving teachers: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(OhmaApiResponse.error(400, e.getMessage()));
        }
    }

    @GetMapping("/students")
    public ResponseEntity<OhmaApiResponse<List<UserDTO>>> getAllStudents() {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new OhmaApiResponse<>("ERROR", "Authentication required", null, null));
            }

            // Use secure multi-tenant filtering for students
            List<UserDTO> accessibleStudents = userService.getStudentsByAccessibleScopes(currentUserId);

            return ResponseEntity.ok(OhmaApiResponse.success(accessibleStudents));
        } catch (Exception e) {
            log.error("Error retrieving students: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(OhmaApiResponse.error(400, e.getMessage()));
        }
    }

    @PutMapping("/{id}/update-profile")
    public ResponseEntity<OhmaApiResponse<UserDTO>> updateWithoutRoleAndPassword(
            @PathVariable Long id, 
            @RequestBody UserDTO userDTO) {
        try {
            Long currentUserId = getCurrentUserId();
            if (currentUserId == null) {
                return createUnauthorizedResponse();
            }

            // Check if user has access to update this user profile
            if (!hasAccess(AccessScope.USER, id)) {
                return createAccessDeniedResponse();
            }

            UserDTO updated = userService.updateWithoutRoleAndPassword(id, userDTO);
            return ResponseEntity.ok(OhmaApiResponse.success(updated));
        } catch (Exception e) {
            log.error("Error updating user profile: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(OhmaApiResponse.error(400, e.getMessage()));
        }
    }
} 