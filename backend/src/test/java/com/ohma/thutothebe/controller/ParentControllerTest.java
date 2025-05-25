package com.ohma.thutothebe.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ohma.thutothebe.dto.UserDTO;
import com.ohma.thutothebe.entity.UserRole;
import com.ohma.thutothebe.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class ParentControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private ParentController parentController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;
    private UserDTO parentDTO;
    private UserDTO updatedParentDTO;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(parentController).build();
        objectMapper = new ObjectMapper();

        // Setup test data
        parentDTO = new UserDTO();
        parentDTO.setId(1L);
        parentDTO.setFirstName("John");
        parentDTO.setLastName("Doe");
        parentDTO.setEmail("john.doe@example.com");
        parentDTO.setRole(UserRole.PARENT);
        parentDTO.setQualification("Bachelor's Degree");

        updatedParentDTO = new UserDTO();
        updatedParentDTO.setId(1L);
        updatedParentDTO.setFirstName("Jane");
        updatedParentDTO.setLastName("Smith");
        updatedParentDTO.setEmail("jane.smith@example.com");
        updatedParentDTO.setRole(UserRole.PARENT); // Should remain unchanged
        updatedParentDTO.setQualification("Master's Degree");
    }

    @Test
    void updateParentProfile_ShouldUpdateParentWithoutChangingRoleAndPassword() throws Exception {
        // Arrange
        when(userService.getById(1L)).thenReturn(parentDTO);
        when(userService.updateWithoutRoleAndPassword(eq(1L), any(UserDTO.class))).thenReturn(updatedParentDTO);

        UserDTO updateRequest = new UserDTO();
        updateRequest.setFirstName("Jane");
        updateRequest.setLastName("Smith");
        updateRequest.setEmail("jane.smith@example.com");
        updateRequest.setPassword("newPassword"); // This should be ignored
        updateRequest.setRole(UserRole.STUDENT); // This should be ignored
        updateRequest.setQualification("Master's Degree");

        // Act & Assert
        mockMvc.perform(put("/parents/{id}/update-profile", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andExpect(jsonPath("$.message").value("Parent profile updated successfully"))
                .andExpect(jsonPath("$.data.firstName").value("Jane"))
                .andExpect(jsonPath("$.data.lastName").value("Smith"))
                .andExpect(jsonPath("$.data.email").value("jane.smith@example.com"))
                .andExpect(jsonPath("$.data.qualification").value("Master's Degree"))
                .andExpect(jsonPath("$.data.role").value("PARENT")); // Should remain unchanged
    }

    @Test
    void updateParentProfile_WhenUserIsNotParent_ShouldReturnBadRequest() throws Exception {
        // Arrange
        UserDTO nonParentUser = new UserDTO();
        nonParentUser.setId(1L);
        nonParentUser.setRole(UserRole.STUDENT);
        
        when(userService.getById(1L)).thenReturn(nonParentUser);

        UserDTO updateRequest = new UserDTO();
        updateRequest.setFirstName("Jane");
        updateRequest.setLastName("Smith");

        // Act & Assert
        mockMvc.perform(put("/parents/{id}/update-profile", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value("ERROR"))
                .andExpect(jsonPath("$.message").value("User with id 1 is not a parent"));
    }

    @Test
    void updateParentProfile_WhenServiceThrowsException_ShouldReturnBadRequest() throws Exception {
        // Arrange
        when(userService.getById(1L)).thenReturn(parentDTO);
        when(userService.updateWithoutRoleAndPassword(eq(1L), any(UserDTO.class)))
                .thenThrow(new RuntimeException("Update failed"));

        UserDTO updateRequest = new UserDTO();
        updateRequest.setFirstName("Jane");
        updateRequest.setLastName("Smith");

        // Act & Assert
        mockMvc.perform(put("/parents/{id}/update-profile", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value("ERROR"))
                .andExpect(jsonPath("$.message").value("Update failed"));
    }
} 