package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.entity.AccessScope;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.entity.UserRole;
import com.ohma.thutothebe.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/rule-based-access")
public class RuleBasedAccessControlController {

    @Autowired
    private UserRepository userRepository;

    /**
     * Check if user has access to a specific scope based on their role and organizational relationships
     */
    @GetMapping("/check-access")
    public ResponseEntity<OhmaApiResponse<Boolean>> checkAccess(
            @RequestParam Long userId,
            @RequestParam AccessScope targetScope,
            @RequestParam Long targetScopeId) {
        try {
            boolean hasAccess = hasAccessToScope(userId, targetScope, targetScopeId);
            return ResponseEntity.ok(OhmaApiResponse.success(hasAccess));
        } catch (Exception e) {
            log.error("Error checking access: user={}, scope={}-{}", userId, targetScope, targetScopeId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(OhmaApiResponse.error(500, "Failed to check access: " + e.getMessage()));
        }
    }

    /**
     * Get all accessible scope IDs for a user based on their role
     */
    @GetMapping("/accessible-scopes")
    public ResponseEntity<OhmaApiResponse<List<Long>>> getAccessibleScopes(
            @RequestParam Long userId,
            @RequestParam AccessScope scopeType) {
        try {
            List<Long> accessibleScopes = getAccessibleScopeIds(userId, scopeType);
            return ResponseEntity.ok(OhmaApiResponse.success(accessibleScopes));
        } catch (Exception e) {
            log.error("Error getting accessible scopes: user={}, type={}", userId, scopeType, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(OhmaApiResponse.error(500, "Failed to get accessible scopes: " + e.getMessage()));
        }
    }

    /**
     * Check if user can perform specific action (create, read, update, delete)
     */
    @GetMapping("/can-perform-action")
    public ResponseEntity<OhmaApiResponse<Boolean>> canPerformAction(
            @RequestParam Long userId,
            @RequestParam AccessScope targetScope,
            @RequestParam Long targetScopeId,
            @RequestParam String action) {
        try {
            boolean canPerform = canPerformActionAtScope(userId, targetScope, targetScopeId, action);
            return ResponseEntity.ok(OhmaApiResponse.success(canPerform));
        } catch (Exception e) {
            log.error("Error checking action permission: user={}, scope={}-{}, action={}", 
                userId, targetScope, targetScopeId, action, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(OhmaApiResponse.error(500, "Failed to check action permission: " + e.getMessage()));
        }
    }

    /**
     * Get user's primary scope (their main organizational context)
     */
    @GetMapping("/primary-scope/{userId}")
    public ResponseEntity<OhmaApiResponse<PrimaryScopeInfo>> getPrimaryScope(@PathVariable Long userId) {
        try {
            PrimaryScopeInfo primaryScope = getUserPrimaryScope(userId);
            return ResponseEntity.ok(OhmaApiResponse.success(primaryScope));
        } catch (Exception e) {
            log.error("Error getting primary scope: user={}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(OhmaApiResponse.error(500, "Failed to get primary scope: " + e.getMessage()));
        }
    }

    // Core access control logic

    private boolean hasAccessToScope(Long userId, AccessScope targetScope, Long targetScopeId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        return switch (user.getRole()) {
            case SUPER_ADMIN, MINISTRY_EXECUTIVE -> true; // Global access
            case MINISTRY_STAFF -> hasMinistryAccess(targetScope);
            case DIRECTOR, REGIONAL_ADMIN, REGIONAL_OFFICER -> hasRegionalAccess(user, targetScope, targetScopeId);
            case SCHOOL_ADMIN, SCHOOL_HEAD -> hasSchoolAccess(user, targetScope, targetScopeId);
            case DEPARTMENT_HEAD -> hasDepartmentAccess(user, targetScope, targetScopeId);
            case SENIOR_TEACHER, TEACHER -> hasTeacherAccess(user, targetScope, targetScopeId);
            case STUDENT -> hasStudentAccess(user, targetScope, targetScopeId);
            case PARENT -> hasParentAccess(user, targetScope, targetScopeId);
            default -> false;
        };
    }

    private boolean canPerformActionAtScope(Long userId, AccessScope targetScope, Long targetScopeId, String action) {
        // First check if user has access to the scope
        if (!hasAccessToScope(userId, targetScope, targetScopeId)) {
            return false;
        }

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        // Then check role-based action permissions
        return switch (action.toUpperCase()) {
            case "READ" -> hasReadPermission(user, targetScope);
            case "CREATE" -> hasCreatePermission(user, targetScope);
            case "UPDATE" -> hasUpdatePermission(user, targetScope, targetScopeId);
            case "DELETE" -> hasDeletePermission(user, targetScope, targetScopeId);
            default -> false;
        };
    }

    private List<Long> getAccessibleScopeIds(Long userId, AccessScope scopeType) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        return switch (user.getRole()) {
            case SUPER_ADMIN, MINISTRY_EXECUTIVE -> getAllScopeIdsForType(scopeType);
            case MINISTRY_STAFF -> getMinistryAccessibleScopes(scopeType);
            case DIRECTOR, REGIONAL_ADMIN, REGIONAL_OFFICER -> getRegionalAccessibleScopes(user, scopeType);
            case SCHOOL_ADMIN, SCHOOL_HEAD -> getSchoolAccessibleScopes(user, scopeType);
            case DEPARTMENT_HEAD -> getDepartmentAccessibleScopes(user, scopeType);
            case SENIOR_TEACHER, TEACHER -> getTeacherAccessibleScopes(user, scopeType);
            case STUDENT -> getStudentAccessibleScopes(user, scopeType);
            case PARENT -> getParentAccessibleScopes(user, scopeType);
            default -> List.of();
        };
    }

    // Role-specific access logic

    private boolean hasMinistryAccess(AccessScope targetScope) {
        // Ministry staff can access most scopes but not individual users
        return targetScope != AccessScope.USER;
    }

    private boolean hasRegionalAccess(User user, AccessScope targetScope, Long targetScopeId) {
        // Regional admins can access anything in their region
        if (user.getRegion() == null && user.getSchool() == null) return false;
        
        Long userRegionId = user.getRegion() != null ? 
            user.getRegion().getId() : 
            user.getSchool().getRegion().getId();

        return switch (targetScope) {
            case REGION -> targetScopeId.equals(userRegionId);
            case SCHOOL -> isSchoolInUserRegion(targetScopeId, userRegionId);
            case DEPARTMENT -> isDepartmentInUserRegion(targetScopeId, userRegionId);
            case CLASS -> isClassInUserRegion(targetScopeId, userRegionId);
            case USER -> isUserInUserRegion(targetScopeId, userRegionId);
            default -> false;
        };
    }

    private boolean hasSchoolAccess(User user, AccessScope targetScope, Long targetScopeId) {
        // School admins can access anything in their school
        if (user.getSchool() == null) return false;
        
        Long userSchoolId = user.getSchool().getId();

        return switch (targetScope) {
            case SCHOOL -> targetScopeId.equals(userSchoolId);
            case DEPARTMENT -> isDepartmentInUserSchool(targetScopeId, userSchoolId);
            case CLASS -> isClassInUserSchool(targetScopeId, userSchoolId);
            case USER -> isUserInUserSchool(targetScopeId, userSchoolId);
            default -> false;
        };
    }

    private boolean hasDepartmentAccess(User user, AccessScope targetScope, Long targetScopeId) {
        // Department heads have school-level access for now (could be refined)
        return hasSchoolAccess(user, targetScope, targetScopeId);
    }

    private boolean hasTeacherAccess(User user, AccessScope targetScope, Long targetScopeId) {
        return switch (targetScope) {
            case CLASS -> isTeacherAssignedToClass(user.getId(), targetScopeId);
            case USER -> {
                if (targetScopeId.equals(user.getId())) yield true; // Self access
                yield isStudentInTeacherClass(user.getId(), targetScopeId);
            }
            default -> false;
        };
    }

    private boolean hasStudentAccess(User user, AccessScope targetScope, Long targetScopeId) {
        return switch (targetScope) {
            case CLASS -> isStudentInClass(user.getId(), targetScopeId);
            case USER -> {
                if (targetScopeId.equals(user.getId())) yield true; // Self access
                yield areInSameClass(user.getId(), targetScopeId);
            }
            default -> false;
        };
    }

    private boolean hasParentAccess(User user, AccessScope targetScope, Long targetScopeId) {
        // Parents can access their children and their children's classes/schools
        List<Long> childrenIds = user.getChildren().stream()
            .map(User::getId)
            .collect(Collectors.toList());

        return switch (targetScope) {
            case USER -> childrenIds.contains(targetScopeId);
            case CLASS -> childrenIds.stream().anyMatch(childId -> isStudentInClass(childId, targetScopeId));
            case SCHOOL -> childrenIds.stream().anyMatch(childId -> isUserInUserSchool(childId, targetScopeId));
            default -> false;
        };
    }

    // Action permission checks

    private boolean hasReadPermission(User user, AccessScope targetScope) {
        // Most roles can read within their scope
        return switch (user.getRole()) {
            case STUDENT -> targetScope == AccessScope.CLASS || targetScope == AccessScope.USER;
            default -> true;
        };
    }

    private boolean hasCreatePermission(User user, AccessScope targetScope) {
        return switch (user.getRole()) {
            case SUPER_ADMIN, MINISTRY_EXECUTIVE -> true;
            case MINISTRY_STAFF, DIRECTOR, REGIONAL_ADMIN, REGIONAL_OFFICER -> 
                targetScope != AccessScope.USER;
            case SCHOOL_ADMIN, SCHOOL_HEAD, DEPARTMENT_HEAD -> 
                targetScope == AccessScope.CLASS || targetScope == AccessScope.USER;
            case SENIOR_TEACHER, TEACHER -> targetScope == AccessScope.USER; // Can create content for students
            case STUDENT -> false; // Students typically can't create organizational entities
            case PARENT -> false;
            default -> false;
        };
    }

    private boolean hasUpdatePermission(User user, AccessScope targetScope, Long targetScopeId) {
        // Update permissions similar to create, but with ownership checks for USER scope
        if (targetScope == AccessScope.USER && targetScopeId.equals(user.getId())) {
            return true; // Can always update self
        }
        
        return hasCreatePermission(user, targetScope);
    }

    private boolean hasDeletePermission(User user, AccessScope targetScope, Long targetScopeId) {
        // Delete is more restricted
        return switch (user.getRole()) {
            case SUPER_ADMIN, MINISTRY_EXECUTIVE -> true;
            case MINISTRY_STAFF, DIRECTOR, REGIONAL_ADMIN, REGIONAL_OFFICER -> 
                targetScope != AccessScope.USER;
            case SCHOOL_ADMIN, SCHOOL_HEAD -> 
                targetScope == AccessScope.CLASS || 
                (targetScope == AccessScope.USER && !targetScopeId.equals(user.getId()));
            case DEPARTMENT_HEAD -> targetScope == AccessScope.CLASS;
            case SENIOR_TEACHER, TEACHER -> false; // Teachers typically can't delete
            case STUDENT, PARENT -> false;
            default -> false;
        };
    }

    // Helper methods (simplified versions - in real implementation would use proper repository queries)
    
    private boolean isSchoolInUserRegion(Long schoolId, Long regionId) {
        // In real implementation: schoolRepository.findById(schoolId).map(s -> s.getRegion().getId().equals(regionId))
        return true; // Placeholder
    }

    private boolean isDepartmentInUserRegion(Long departmentId, Long regionId) {
        return true; // Placeholder
    }

    private boolean isClassInUserRegion(Long classId, Long regionId) {
        return true; // Placeholder
    }

    private boolean isUserInUserRegion(Long userId, Long regionId) {
        return userRepository.findById(userId)
            .map(u -> u.getSchool() != null && u.getSchool().getRegion().getId().equals(regionId))
            .orElse(false);
    }

    private boolean isDepartmentInUserSchool(Long departmentId, Long schoolId) {
        return true; // Placeholder
    }

    private boolean isClassInUserSchool(Long classId, Long schoolId) {
        return true; // Placeholder
    }

    private boolean isUserInUserSchool(Long userId, Long schoolId) {
        return userRepository.findById(userId)
            .map(u -> u.getSchool() != null && u.getSchool().getId().equals(schoolId))
            .orElse(false);
    }

    private boolean isTeacherAssignedToClass(Long teacherId, Long classId) {
        return false; // Placeholder - would check TeacherClassAssignment table
    }

    private boolean isStudentInTeacherClass(Long teacherId, Long studentId) {
        return false; // Placeholder - would check if student is in any of teacher's classes
    }

    private boolean isStudentInClass(Long studentId, Long classId) {
        return false; // Placeholder - would check StudentEnrollment table
    }

    private boolean areInSameClass(Long studentId1, Long studentId2) {
        return false; // Placeholder - would check if students share any classes
    }

    // Scope ID retrieval methods

    private List<Long> getAllScopeIdsForType(AccessScope scopeType) {
        // In real implementation would use appropriate repository
        return List.of(); // Placeholder
    }

    private List<Long> getMinistryAccessibleScopes(AccessScope scopeType) {
        return scopeType != AccessScope.USER ? getAllScopeIdsForType(scopeType) : List.of();
    }

    private List<Long> getRegionalAccessibleScopes(User user, AccessScope scopeType) {
        // Return scope IDs in user's region
        return List.of(); // Placeholder
    }

    private List<Long> getSchoolAccessibleScopes(User user, AccessScope scopeType) {
        // Return scope IDs in user's school
        return List.of(); // Placeholder
    }

    private List<Long> getDepartmentAccessibleScopes(User user, AccessScope scopeType) {
        // Return scope IDs in user's department/school
        return List.of(); // Placeholder
    }

    private List<Long> getTeacherAccessibleScopes(User user, AccessScope scopeType) {
        // Return classes teacher is assigned to, and students in those classes
        return List.of(); // Placeholder
    }

    private List<Long> getStudentAccessibleScopes(User user, AccessScope scopeType) {
        // Return classes student is enrolled in, and classmates
        return List.of(); // Placeholder
    }

    private List<Long> getParentAccessibleScopes(User user, AccessScope scopeType) {
        // Return children and their classes/schools
        return switch (scopeType) {
            case USER -> user.getChildren().stream().map(User::getId).collect(Collectors.toList());
            default -> List.of(); // Placeholder for classes/schools
        };
    }

    private PrimaryScopeInfo getUserPrimaryScope(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        return switch (user.getRole()) {
            case SUPER_ADMIN, MINISTRY_EXECUTIVE -> 
                new PrimaryScopeInfo(AccessScope.GLOBAL, null, "Global System Access");
            case MINISTRY_STAFF, DIRECTOR -> 
                new PrimaryScopeInfo(AccessScope.GLOBAL, null, "Ministry Level Access");
            case REGIONAL_ADMIN, REGIONAL_OFFICER -> {
                if (user.getRegion() != null) {
                    yield new PrimaryScopeInfo(AccessScope.REGION, user.getRegion().getId(), 
                        user.getRegion().getName());
                } else if (user.getSchool() != null) {
                    yield new PrimaryScopeInfo(AccessScope.REGION, user.getSchool().getRegion().getId(),
                        user.getSchool().getRegion().getName());
                } else {
                    yield new PrimaryScopeInfo(AccessScope.GLOBAL, null, "Unassigned Regional Role");
                }
            }
            case SCHOOL_ADMIN, SCHOOL_HEAD, DEPARTMENT_HEAD, SENIOR_TEACHER, TEACHER -> {
                if (user.getSchool() != null) {
                    yield new PrimaryScopeInfo(AccessScope.SCHOOL, user.getSchool().getId(),
                        user.getSchool().getName());
                } else {
                    yield new PrimaryScopeInfo(AccessScope.GLOBAL, null, "Unassigned School Role");
                }
            }
            case STUDENT -> {
                if (user.getSchool() != null) {
                    yield new PrimaryScopeInfo(AccessScope.SCHOOL, user.getSchool().getId(),
                        user.getSchool().getName() + " (Student)");
                } else {
                    yield new PrimaryScopeInfo(AccessScope.USER, user.getId(), "Individual Student");
                }
            }
            case PARENT -> new PrimaryScopeInfo(AccessScope.PARENT, user.getId(), "Parent Access");
            default -> new PrimaryScopeInfo(AccessScope.USER, user.getId(), "Individual User");
        };
    }

    // Response DTOs
    public static class PrimaryScopeInfo {
        public AccessScope scopeType;
        public Long scopeId;
        public String scopeName;

        public PrimaryScopeInfo(AccessScope scopeType, Long scopeId, String scopeName) {
            this.scopeType = scopeType;
            this.scopeId = scopeId;
            this.scopeName = scopeName;
        }
    }
} 