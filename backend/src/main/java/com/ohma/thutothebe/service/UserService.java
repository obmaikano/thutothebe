package com.ohma.thutothebe.service;

import com.ohma.thutothebe.dto.UserDTO;
import java.util.List;

public interface UserService extends BaseService<UserDTO, Long> {
    UserDTO getUserByEmail(String email);
    List<UserDTO> getAllTeachers();
    List<UserDTO> getAllStudents();
    boolean existsByEmail(String email);
    void updatePassword(Long userId, String newPassword);
} 