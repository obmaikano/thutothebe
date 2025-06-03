package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.GradeDTO;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.service.GradeService;
import com.ohma.thutothebe.service.impl.RuleBasedAccessControlServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

/**
 * Demonstration controller showing how to integrate rule-based access control
 * into existing grade management functionality
 */
@Slf4j
@RestController
@RequestMapping("/api/access-control-demo")
public class AccessControlDemoController {

    @Autowired
    private GradeService gradeService;
    
    @Autowired
    private RuleBasedAccessControlServiceImpl accessControlService;

    /**
     * Demo: Get grades for a specific student with access control
     * Shows how teachers can only access students in their classes
     */
    @GetMapping("/grades/student/{studentId}")
    public ResponseEntity<OhmaApiResponse<List<GradeDTO>>> getStudentGradesDemo(@PathVariable Long studentId) {
        try {
            Long currentUserId = getCurrentUserId();
            
            // Check if current user can access this student's grades
            if (!accessControlService.hasAccess(currentUserId, AccessScope.USER, studentId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(OhmaApiResponse.error(403, "Access denied: You cannot view this student's grades"));
            }
            
            // If access is granted, fetch the grades using existing service
            List<GradeDTO> grades = gradeService.findByStudentId(studentId);
            return ResponseEntity.ok(OhmaApiResponse.success(grades));
            
        } catch (Exception e) {
            log.error("Error retrieving student grades: studentId={}", studentId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(OhmaApiResponse.error(500, "Failed to retrieve grades: " + e.getMessage()));
        }
    }

    /**
     * Demo: Create grade with access control
     * Shows how only teachers assigned to the class can create grades
     */
    @PostMapping("/grades/class/{classId}/student/{studentId}")
    public ResponseEntity<OhmaApiResponse<GradeDTO>> createGradeDemo(
            @PathVariable Long classId,
            @PathVariable Long studentId,
            @RequestBody GradeDTO gradeDTO) {
        try {
            Long currentUserId = getCurrentUserId();
            
            // Check if current user can modify grades for this class
            if (!accessControlService.hasAccess(currentUserId, AccessScope.CLASS, classId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(OhmaApiResponse.error(403, "Access denied: You are not assigned to this class"));
            }
            
            // Check if current user can assign grades to this student
            if (!accessControlService.hasAccess(currentUserId, AccessScope.USER, studentId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(OhmaApiResponse.error(403, "Access denied: This student is not in your classes"));
            }
            
            // Create new DTO with required fields (since GradeDTO is immutable record)
            GradeDTO gradeToCreate = new GradeDTO(
                null, // id
                studentId, // studentId
                gradeDTO.courseId(), // courseId
                gradeDTO.gradeCategoryId(), // gradeCategoryId
                gradeDTO.assessmentId(), // assessmentId
                gradeDTO.assignmentId(), // assignmentId
                gradeDTO.gradeType(), // gradeType
                gradeDTO.score(), // score
                gradeDTO.maxScore(), // maxScore
                gradeDTO.weight(), // weight
                gradeDTO.feedback(), // feedback
                currentUserId, // gradedById - use current user
                null, // gradedAt - will be set by service
                gradeDTO.isFinal(), // isFinal
                false, // isModerated
                null, // moderatedById
                null, // moderatedAt
                null, // moderationNotes
                null, // originalScore
                true, // active
                null, // createdAt - will be set by service
                null  // modifiedAt
            );
            
            GradeDTO savedGrade = gradeService.create(gradeToCreate);
            return ResponseEntity.ok(OhmaApiResponse.success(savedGrade));
            
        } catch (Exception e) {
            log.error("Error creating grade: classId={}, studentId={}", classId, studentId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(OhmaApiResponse.error(500, "Failed to create grade: " + e.getMessage()));
        }
    }

    /**
     * Demo: Get accessible classes for the current user
     * Shows how to filter data based on user permissions
     */
    @GetMapping("/accessible-classes")
    public ResponseEntity<OhmaApiResponse<List<Long>>> getAccessibleClassesDemo() {
        try {
            Long currentUserId = getCurrentUserId();
            
            // Get all class IDs user has access to
            List<Long> accessibleClassIds = accessControlService
                .getAccessibleScopeIds(currentUserId, AccessScope.CLASS);
            
            return ResponseEntity.ok(OhmaApiResponse.success(accessibleClassIds));
            
        } catch (Exception e) {
            log.error("Error retrieving accessible classes: userId={}", getCurrentUserId(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(OhmaApiResponse.error(500, "Failed to retrieve accessible classes: " + e.getMessage()));
        }
    }

    /**
     * Demo: Check multiple access permissions at once
     * Useful for frontend to determine what UI elements to show
     */
    @PostMapping("/check-multiple-access")
    public ResponseEntity<OhmaApiResponse<Map<String, Boolean>>> checkMultipleAccessDemo(
            @RequestBody Map<String, Object> request) {
        try {
            Long currentUserId = getCurrentUserId();
            Map<String, Boolean> results = new HashMap<>();
            
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> checks = (List<Map<String, Object>>) request.get("checks");
            
            for (Map<String, Object> check : checks) {
                String key = (String) check.get("key");
                String scopeStr = (String) check.get("scope");
                Long scopeId = Long.valueOf(check.get("scopeId").toString());
                
                try {
                    AccessScope scope = AccessScope.valueOf(scopeStr.toUpperCase());
                    boolean hasAccess = accessControlService.hasAccess(currentUserId, scope, scopeId);
                    results.put(key, hasAccess);
                } catch (IllegalArgumentException e) {
                    results.put(key, false); // Invalid scope, deny access
                }
            }
            
            return ResponseEntity.ok(OhmaApiResponse.success(results));
            
        } catch (Exception e) {
            log.error("Error checking multiple access permissions", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(OhmaApiResponse.error(500, "Failed to check access permissions: " + e.getMessage()));
        }
    }

    /**
     * Demo: User profile with access control
     * Shows role-based data filtering
     */
    @GetMapping("/user-profile")
    public ResponseEntity<OhmaApiResponse<Map<String, Object>>> getUserProfileDemo() {
        try {
            Long currentUserId = getCurrentUserId();
            Map<String, Object> profile = new HashMap<>();
            
            // Basic user info - everyone can see their own
            profile.put("userId", currentUserId);
            
            // Add accessible scopes based on role
            profile.put("accessibleClasses", accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.CLASS));
            profile.put("accessibleUsers", accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.USER));
            profile.put("accessibleSchools", accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.SCHOOL));
            
            // Check admin capabilities
            profile.put("isGlobalAdmin", !accessControlService.getAccessibleScopeIds(currentUserId, AccessScope.GLOBAL).isEmpty());
            
            return ResponseEntity.ok(OhmaApiResponse.success(profile));
            
        } catch (Exception e) {
            log.error("Error retrieving user profile", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(OhmaApiResponse.error(500, "Failed to retrieve profile: " + e.getMessage()));
        }
    }

    /**
     * Demo: Simple access check endpoint for frontend
     */
    @GetMapping("/check-access")
    public ResponseEntity<OhmaApiResponse<Boolean>> checkAccessDemo(
            @RequestParam String targetScope,
            @RequestParam Long targetScopeId) {
        try {
            Long currentUserId = getCurrentUserId();
            
            AccessScope scope;
            try {
                scope = AccessScope.valueOf(targetScope.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(OhmaApiResponse.error(400, "Invalid scope: " + targetScope));
            }
            
            boolean hasAccess = accessControlService.hasAccess(currentUserId, scope, targetScopeId);
            return ResponseEntity.ok(OhmaApiResponse.success(hasAccess));
            
        } catch (Exception e) {
            log.error("Error checking access: targetScope={}, targetScopeId={}", targetScope, targetScopeId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(OhmaApiResponse.error(500, "Failed to check access: " + e.getMessage()));
        }
    }

    /**
     * Helper method to get current user ID from security context
     * In a real implementation, this would extract from JWT token or session
     */
    private Long getCurrentUserId() {
        // For demo purposes, returning a hardcoded ID
        // In real implementation:
        // Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // return extractUserIdFromAuth(auth);
        return 1L; // Demo user ID
    }
} 