package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.UserDTO;
import com.ohma.thutothebe.entity.User;
import com.ohma.thutothebe.entity.UserRole;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.UserMapper;
import com.ohma.thutothebe.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    private User user;
    private UserDTO userDTO;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setEmail("test@example.com");
        user.setPassword("password");
        user.setRole(UserRole.STUDENT);

        userDTO = new UserDTO();

        userDTO.setId(1L);
        userDTO.setFirstName("John");
        userDTO.setLastName("Doe");
        userDTO.setEmail("test@example.com");
        userDTO.setPassword("password");
        userDTO.setRole(UserRole.STUDENT);
    }

    @Test
    void createUser_ShouldCreateAndReturnUserDTO() {
        // Arrange
        when(userMapper.toEntity(any(UserDTO.class))).thenReturn(user);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(userMapper.toDto(any(User.class))).thenReturn(userDTO);

        // Act
        UserDTO result = userService.create(userDTO);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo(userDTO.getEmail());
        assertThat(result.getFirstName()).isEqualTo(userDTO.getFirstName());
        assertThat(result.getLastName()).isEqualTo(userDTO.getLastName());
        verify(userRepository).save(any(User.class));
        verify(passwordEncoder).encode(anyString());
    }

    @Test
    void updateUser_ShouldUpdateAndReturnUserDTO() {
        // Arrange
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(user));
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(userMapper.toDto(any(User.class))).thenReturn(userDTO);

        // Act
        UserDTO result = userService.update(1L, userDTO);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo(userDTO.getEmail());
        assertThat(result.getFirstName()).isEqualTo(userDTO.getFirstName());
        assertThat(result.getLastName()).isEqualTo(userDTO.getLastName());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void updateUser_WhenUserNotFound_ShouldThrowException() {
        // Arrange
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> userService.update(1L, userDTO))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("User not found with id: 1");
    }

    @Test
    void deleteUser_ShouldDeleteUser() {
        // Arrange
        when(userRepository.existsById(anyLong())).thenReturn(true);

        // Act
        userService.delete(1L);

        // Assert
        verify(userRepository).deleteById(1L);
    }

    @Test
    void deleteUser_WhenUserNotFound_ShouldThrowException() {
        // Arrange
        when(userRepository.existsById(anyLong())).thenReturn(false);

        // Act & Assert
        assertThatThrownBy(() -> userService.delete(1L))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("User not found with id: 1");
    }

    @Test
    void getUserById_ShouldReturnUserDTO() {
        // Arrange
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(user));
        when(userMapper.toDto(any(User.class))).thenReturn(userDTO);

        // Act
        UserDTO result = userService.getById(1L);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo(userDTO.getEmail());
        assertThat(result.getFirstName()).isEqualTo(userDTO.getFirstName());
        assertThat(result.getLastName()).isEqualTo(userDTO.getLastName());
    }

    @Test
    void getUserById_WhenUserNotFound_ShouldThrowException() {
        // Arrange
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> userService.getById(1L))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("User not found with id: 1");
    }

    @Test
    void getUserByEmail_ShouldReturnUserDTO() {
        // Arrange
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(userMapper.toDto(any(User.class))).thenReturn(userDTO);

        // Act
        UserDTO result = userService.getUserByEmail("test@example.com");

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo(userDTO.getEmail());
        assertThat(result.getFirstName()).isEqualTo(userDTO.getFirstName());
        assertThat(result.getLastName()).isEqualTo(userDTO.getLastName());
    }

    @Test
    void getUserByEmail_WhenUserNotFound_ShouldThrowException() {
        // Arrange
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> userService.getUserByEmail("test@example.com"))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("User not found with email: test@example.com");
    }

    @Test
    void getAllTeachers_ShouldReturnListOfTeacherDTOs() {
        // Arrange
        List<User> teachers = Arrays.asList(user);
        when(userRepository.findByRole(UserRole.TEACHER)).thenReturn(teachers);
        when(userMapper.toDto(any(User.class))).thenReturn(userDTO);

        // Act
        List<UserDTO> result = userService.getAllTeachers();

        // Assert
        assertThat(result).isNotNull();
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getEmail()).isEqualTo(userDTO.getEmail());
        assertThat(result.get(0).getFirstName()).isEqualTo(userDTO.getFirstName());
        assertThat(result.get(0).getLastName()).isEqualTo(userDTO.getLastName());
    }

    @Test
    void getAllStudents_ShouldReturnListOfStudentDTOs() {
        // Arrange
        List<User> students = Arrays.asList(user);
        when(userRepository.findByRole(UserRole.STUDENT)).thenReturn(students);
        when(userMapper.toDto(any(User.class))).thenReturn(userDTO);

        // Act
        List<UserDTO> result = userService.getAllStudents();

        // Assert
        assertThat(result).isNotNull();
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getEmail()).isEqualTo(userDTO.getEmail());
        assertThat(result.get(0).getFirstName()).isEqualTo(userDTO.getFirstName());
        assertThat(result.get(0).getLastName()).isEqualTo(userDTO.getLastName());
    }

    @Test
    void existsByEmail_ShouldReturnTrue_WhenEmailExists() {
        // Arrange
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        // Act
        boolean result = userService.existsByEmail("test@example.com");

        // Assert
        assertThat(result).isTrue();
    }

    @Test
    void existsByEmail_ShouldReturnFalse_WhenEmailDoesNotExist() {
        // Arrange
        when(userRepository.existsByEmail(anyString())).thenReturn(false);

        // Act
        boolean result = userService.existsByEmail("test@example.com");

        // Assert
        assertThat(result).isFalse();
    }

    @Test
    void updateWithoutRoleAndPassword_ShouldUpdateUserWithoutChangingRoleAndPassword() {
        // Arrange
        User existingUser = new User();
        existingUser.setId(1L);
        existingUser.setFirstName("John");
        existingUser.setLastName("Doe");
        existingUser.setEmail("john.doe@example.com");
        existingUser.setPassword("encodedOldPassword");
        existingUser.setRole(UserRole.TEACHER);
        existingUser.setQualification("Bachelor's Degree");

        UserDTO updateDTO = new UserDTO();
        updateDTO.setFirstName("Jane");
        updateDTO.setLastName("Smith");
        updateDTO.setEmail("jane.smith@example.com");
        updateDTO.setPassword("newPassword"); // This should be ignored
        updateDTO.setRole(UserRole.STUDENT); // This should be ignored
        updateDTO.setQualification("Master's Degree");

        when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenReturn(existingUser);
        when(userMapper.toDto(any(User.class))).thenReturn(updateDTO);

        // Act
        UserDTO result = userService.updateWithoutRoleAndPassword(1L, updateDTO);

        // Assert
        assertThat(result).isNotNull();
        verify(userMapper).updateEntityWithoutRoleAndPassword(existingUser, updateDTO);
        verify(userRepository).save(existingUser);
        // Verify that role and password were not changed in the entity
        assertThat(existingUser.getRole()).isEqualTo(UserRole.TEACHER); // Should remain unchanged
        assertThat(existingUser.getPassword()).isEqualTo("encodedOldPassword"); // Should remain unchanged
    }

    @Test
    void updateWithoutRoleAndPassword_WhenUserNotFound_ShouldThrowException() {
        // Arrange
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> userService.updateWithoutRoleAndPassword(1L, userDTO))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("User not found with id: 1");
    }
} 