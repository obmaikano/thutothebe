package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.UserDTO;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.entity.UserRole;
import com.ohma.thutothebe.exception.UserNotFoundException;
import com.ohma.thutothebe.mapper.UserMapper;
import com.ohma.thutothebe.repository.UserRepository;
import com.ohma.thutothebe.service.UserService;
import com.ohma.thutothebe.service.impl.BaseServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class UserServiceImpl extends BaseServiceImpl<User, UserDTO, Long> implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder) {
        super(userRepository);
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    protected User mapToEntity(UserDTO dto) {
        User user = userMapper.toEntity(dto);
        user.setPassword(passwordEncoder.encode(dto.password()));
        return user;
    }

    @Override
    protected UserDTO mapToDto(User entity) {
        return userMapper.toDto(entity);
    }

    @Override
    protected void updateEntity(User entity, UserDTO dto) {
        userMapper.updateEntityFromDto(entity, dto);
        if (dto.password() != null && !dto.password().isEmpty()) {
            entity.setPassword(passwordEncoder.encode(dto.password()));
        }
    }

    @Override
    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> UserNotFoundException.withEmail(email));
        return mapToDto(user);
    }

    @Override
    public List<UserDTO> getAllTeachers() {
        return userRepository.findByRole(UserRole.TEACHER).stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Override
    public List<UserDTO> getAllStudents() {
        return userRepository.findByRole(UserRole.STUDENT).stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public void updatePassword(Long userId, String newPassword) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> UserNotFoundException.withId(userId));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    protected RuntimeException notFoundException(Long id) {
        return UserNotFoundException.withId(id);
    }
} 