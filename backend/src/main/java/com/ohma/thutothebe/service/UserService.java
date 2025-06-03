package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.UserDTO;
import com.ohma.thutothebe.entity.UserRole;
import java.util.List;

public interface UserService extends BaseService<UserDTO, Long> {
    UserDTO getUserByEmail(String email);
    List<UserDTO> getAllTeachers();
    List<UserDTO> getAllStudents();
    boolean existsByEmail(String email);
    void updatePassword(Long userId, String newPassword);
    UserDTO updateWithoutRoleAndPassword(Long userId, UserDTO dto);
    List<UserDTO> getUsersByRole(UserRole role);
    
    // Parent-specific methods
    List<UserDTO> getAllParents();
    List<UserDTO> getChildrenByParentId(Long parentId);
    void linkChildToParent(Long parentId, Long childId);
    void unlinkChildFromParent(Long parentId, Long childId);
    List<UserDTO> getParentsBySchoolId(Long schoolId);
    List<UserDTO> getActiveParents();
    void activateUser(Long userId);
    void deactivateUser(Long userId);

    // ==================== MULTI-TENANT FILTERING METHODS ====================
    
    /**
     * Get users filtered by accessible scope IDs based on user's permissions
     * This replaces the unsafe getAll() method
     */
    List<UserDTO> getUsersByAccessibleScopes(Long currentUserId);
    
    /**
     * Get teachers filtered by accessible scope IDs
     */
    List<UserDTO> getTeachersByAccessibleScopes(Long currentUserId);
    
    /**
     * Get students filtered by accessible scope IDs
     */
    List<UserDTO> getStudentsByAccessibleScopes(Long currentUserId);
    
    /**
     * Get parents filtered by accessible scope IDs
     */
    List<UserDTO> getParentsByAccessibleScopes(Long currentUserId);
    
    /**
     * Get users by specific school ID (for school-level access)
     */
    List<UserDTO> getUsersBySchoolId(Long schoolId);
    
    /**
     * Get users by specific region ID (for regional access)
     */
    List<UserDTO> getUsersByRegionId(Long regionId);
    
    /**
     * Get users by role and school ID
     */
    List<UserDTO> getUsersByRoleAndSchoolId(UserRole role, Long schoolId);
    
    /**
     * Get users by role and region ID
     */
    List<UserDTO> getUsersByRoleAndRegionId(UserRole role, Long regionId);
    
    /**
     * Get users by multiple school IDs (for class-level access across schools)
     */
    List<UserDTO> getUsersBySchoolIds(List<Long> schoolIds);
    
    /**
     * Get users by multiple region IDs (for regional access across regions)
     */
    List<UserDTO> getUsersByRegionIds(List<Long> regionIds);
    
    /**
     * Get users by specific user IDs (for user-level access)
     */
    List<UserDTO> getUsersByUserIds(List<Long> userIds);
    
    /**
     * Get users by role and multiple school IDs
     */
    List<UserDTO> getUsersByRoleAndSchoolIds(UserRole role, List<Long> schoolIds);
    
    /**
     * Get users by role and multiple region IDs
     */
    List<UserDTO> getUsersByRoleAndRegionIds(UserRole role, List<Long> regionIds);
    
    /**
     * Get users by role and specific user IDs
     */
    List<UserDTO> getUsersByRoleAndUserIds(UserRole role, List<Long> userIds);
    
    /**
     * Get users by multi-scope access (combines school, region, and user level access)
     */
    List<UserDTO> getUsersByMultiScopeAccess(List<Long> schoolIds, List<Long> regionIds, List<Long> userIds);
    
    /**
     * Get users by role and multi-scope access
     */
    List<UserDTO> getUsersByRoleAndMultiScopeAccess(UserRole role, List<Long> schoolIds, List<Long> regionIds, List<Long> userIds);
} 