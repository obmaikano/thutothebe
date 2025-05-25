package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.UserDTO;
import java.util.List;

public interface UserService extends BaseService<UserDTO, Long> {
    UserDTO getUserByEmail(String email);
    List<UserDTO> getAllTeachers();
    List<UserDTO> getAllStudents();
    boolean existsByEmail(String email);
    void updatePassword(Long userId, String newPassword);
    UserDTO updateWithoutRoleAndPassword(Long userId, UserDTO dto);
    
    // Parent-specific methods
    List<UserDTO> getAllParents();
    List<UserDTO> getChildrenByParentId(Long parentId);
    void linkChildToParent(Long parentId, Long childId);
    void unlinkChildFromParent(Long parentId, Long childId);
    List<UserDTO> getParentsBySchoolId(Long schoolId);
    List<UserDTO> getActiveParents();
    void activateUser(Long userId);
    void deactivateUser(Long userId);
} 