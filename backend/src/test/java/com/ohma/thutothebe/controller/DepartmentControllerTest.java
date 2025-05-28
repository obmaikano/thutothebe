package com.ohma.thutothebe.controller;

import com.ohma.thutothebe.dto.DepartmentDTO;
import com.ohma.thutothebe.dto.OhmaApiResponse;
import com.ohma.thutothebe.service.DepartmentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DepartmentControllerTest {

    @Mock
    private DepartmentService departmentService;

    @InjectMocks
    private DepartmentController departmentController;

    private DepartmentDTO departmentDTO;

    @BeforeEach
    void setUp() {
        departmentDTO = new DepartmentDTO(
            1L,
            "Mathematics Department",
            "Department of Mathematics",
            1L,
            "Test School",
            1L,
            "John Doe",
            Set.of(1L),
            Set.of("Mathematics"),
            Set.of(2L),
            Set.of("Jane Smith"),
            true,
            LocalDateTime.now(),
            LocalDateTime.now()
        );
    }

    @Test
    void createDepartment_ShouldReturnSuccessResponse() {
        // Given
        when(departmentService.create(any(DepartmentDTO.class))).thenReturn(departmentDTO);

        // When
        ResponseEntity<OhmaApiResponse<DepartmentDTO>> response = departmentController.create(departmentDTO);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("SUCCESS", response.getBody().getStatus());
        assertEquals("Department created successfully", response.getBody().getMessage());
        assertEquals(departmentDTO, response.getBody().getData());
        verify(departmentService).create(departmentDTO);
    }

    @Test
    void getDepartmentsBySchoolId_ShouldReturnDepartmentsList() {
        // Given
        List<DepartmentDTO> departments = Arrays.asList(departmentDTO);
        when(departmentService.getDepartmentsBySchoolId(1L)).thenReturn(departments);

        // When
        ResponseEntity<OhmaApiResponse<List<DepartmentDTO>>> response = departmentController.getDepartmentsBySchoolId(1L);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("SUCCESS", response.getBody().getStatus());
        assertEquals("Departments retrieved successfully", response.getBody().getMessage());
        assertEquals(departments, response.getBody().getData());
        verify(departmentService).getDepartmentsBySchoolId(1L);
    }

    @Test
    void getActiveDepartmentsBySchoolId_ShouldReturnActiveDepartments() {
        // Given
        List<DepartmentDTO> departments = Arrays.asList(departmentDTO);
        when(departmentService.getActiveDepartmentsBySchoolId(1L)).thenReturn(departments);

        // When
        ResponseEntity<OhmaApiResponse<List<DepartmentDTO>>> response = departmentController.getActiveDepartmentsBySchoolId(1L);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("SUCCESS", response.getBody().getStatus());
        assertEquals("Active departments retrieved successfully", response.getBody().getMessage());
        assertEquals(departments, response.getBody().getData());
        verify(departmentService).getActiveDepartmentsBySchoolId(1L);
    }

    @Test
    void assignDepartmentHead_ShouldReturnUpdatedDepartment() {
        // Given
        when(departmentService.assignDepartmentHead(1L, 1L)).thenReturn(departmentDTO);

        // When
        ResponseEntity<OhmaApiResponse<DepartmentDTO>> response = departmentController.assignDepartmentHead(1L, 1L);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("SUCCESS", response.getBody().getStatus());
        assertEquals("Department head assigned successfully", response.getBody().getMessage());
        assertEquals(departmentDTO, response.getBody().getData());
        verify(departmentService).assignDepartmentHead(1L, 1L);
    }

    @Test
    void assignTeacherToDepartment_ShouldReturnUpdatedDepartment() {
        // Given
        when(departmentService.assignTeacherToDepartment(1L, 2L)).thenReturn(departmentDTO);

        // When
        ResponseEntity<OhmaApiResponse<DepartmentDTO>> response = departmentController.assignTeacherToDepartment(1L, 2L);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("SUCCESS", response.getBody().getStatus());
        assertEquals("Teacher assigned to department successfully", response.getBody().getMessage());
        assertEquals(departmentDTO, response.getBody().getData());
        verify(departmentService).assignTeacherToDepartment(1L, 2L);
    }

    @Test
    void assignSubjectToDepartment_ShouldReturnUpdatedDepartment() {
        // Given
        when(departmentService.assignSubjectToDepartment(1L, 1L)).thenReturn(departmentDTO);

        // When
        ResponseEntity<OhmaApiResponse<DepartmentDTO>> response = departmentController.assignSubjectToDepartment(1L, 1L);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("SUCCESS", response.getBody().getStatus());
        assertEquals("Subject assigned to department successfully", response.getBody().getMessage());
        assertEquals(departmentDTO, response.getBody().getData());
        verify(departmentService).assignSubjectToDepartment(1L, 1L);
    }

    @Test
    void activateDepartment_ShouldReturnSuccessMessage() {
        // Given
        doNothing().when(departmentService).activateDepartment(1L);

        // When
        ResponseEntity<OhmaApiResponse<Void>> response = departmentController.activateDepartment(1L);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("SUCCESS", response.getBody().getStatus());
        assertEquals("Department activated successfully", response.getBody().getMessage());
        verify(departmentService).activateDepartment(1L);
    }

    @Test
    void deactivateDepartment_ShouldReturnSuccessMessage() {
        // Given
        doNothing().when(departmentService).deactivateDepartment(1L);

        // When
        ResponseEntity<OhmaApiResponse<Void>> response = departmentController.deactivateDepartment(1L);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("SUCCESS", response.getBody().getStatus());
        assertEquals("Department deactivated successfully", response.getBody().getMessage());
        verify(departmentService).deactivateDepartment(1L);
    }

    @Test
    void getDepartmentByNameAndSchoolId_ShouldReturnDepartment() {
        // Given
        when(departmentService.getDepartmentByNameAndSchoolId("Mathematics Department", 1L))
            .thenReturn(departmentDTO);

        // When
        ResponseEntity<OhmaApiResponse<DepartmentDTO>> response = 
            departmentController.getDepartmentByNameAndSchoolId("Mathematics Department", 1L);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("SUCCESS", response.getBody().getStatus());
        assertEquals("Department retrieved successfully", response.getBody().getMessage());
        assertEquals(departmentDTO, response.getBody().getData());
        verify(departmentService).getDepartmentByNameAndSchoolId("Mathematics Department", 1L);
    }

    @Test
    void countActiveDepartmentsBySchoolId_ShouldReturnCount() {
        // Given
        when(departmentService.countActiveDepartmentsBySchoolId(1L)).thenReturn(5L);

        // When
        ResponseEntity<OhmaApiResponse<Long>> response = departmentController.countActiveDepartmentsBySchoolId(1L);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("SUCCESS", response.getBody().getStatus());
        assertEquals("Department count retrieved successfully", response.getBody().getMessage());
        assertEquals(5L, response.getBody().getData());
        verify(departmentService).countActiveDepartmentsBySchoolId(1L);
    }

    @Test
    void existsByNameAndSchoolId_ShouldReturnBoolean() {
        // Given
        when(departmentService.existsByNameAndSchoolId("Mathematics Department", 1L))
            .thenReturn(true);

        // When
        ResponseEntity<OhmaApiResponse<Boolean>> response = 
            departmentController.existsByNameAndSchoolId("Mathematics Department", 1L);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("SUCCESS", response.getBody().getStatus());
        assertEquals("Department existence checked successfully", response.getBody().getMessage());
        assertEquals(true, response.getBody().getData());
        verify(departmentService).existsByNameAndSchoolId("Mathematics Department", 1L);
    }

    @Test
    void updateDepartment_ShouldReturnUpdatedDepartment() {
        // Given
        when(departmentService.update(eq(1L), any(DepartmentDTO.class))).thenReturn(departmentDTO);

        // When
        ResponseEntity<OhmaApiResponse<DepartmentDTO>> response = departmentController.update(1L, departmentDTO);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("SUCCESS", response.getBody().getStatus());
        assertEquals("Department updated successfully", response.getBody().getMessage());
        assertEquals(departmentDTO, response.getBody().getData());
        verify(departmentService).update(1L, departmentDTO);
    }

    @Test
    void removeDepartmentHead_ShouldReturnUpdatedDepartment() {
        // Given
        DepartmentDTO deptWithoutHead = new DepartmentDTO(
            1L, "Mathematics Department", "Department of Mathematics", 1L, "Test School",
            null, null, Set.of(1L), Set.of("Mathematics"), Set.of(2L), 
            Set.of("Jane Smith"), true, LocalDateTime.now(), LocalDateTime.now()
        );
        when(departmentService.removeDepartmentHead(1L)).thenReturn(deptWithoutHead);

        // When
        ResponseEntity<OhmaApiResponse<DepartmentDTO>> response = departmentController.removeDepartmentHead(1L);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("SUCCESS", response.getBody().getStatus());
        assertEquals("Department head removed successfully", response.getBody().getMessage());
        assertEquals(deptWithoutHead, response.getBody().getData());
        verify(departmentService).removeDepartmentHead(1L);
    }

    @Test
    void removeTeacherFromDepartment_ShouldReturnUpdatedDepartment() {
        // Given
        when(departmentService.removeTeacherFromDepartment(1L, 2L)).thenReturn(departmentDTO);

        // When
        ResponseEntity<OhmaApiResponse<DepartmentDTO>> response = departmentController.removeTeacherFromDepartment(1L, 2L);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("SUCCESS", response.getBody().getStatus());
        assertEquals("Teacher removed from department successfully", response.getBody().getMessage());
        assertEquals(departmentDTO, response.getBody().getData());
        verify(departmentService).removeTeacherFromDepartment(1L, 2L);
    }

    @Test
    void removeSubjectFromDepartment_ShouldReturnUpdatedDepartment() {
        // Given
        when(departmentService.removeSubjectFromDepartment(1L, 1L)).thenReturn(departmentDTO);

        // When
        ResponseEntity<OhmaApiResponse<DepartmentDTO>> response = departmentController.removeSubjectFromDepartment(1L, 1L);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("SUCCESS", response.getBody().getStatus());
        assertEquals("Subject removed from department successfully", response.getBody().getMessage());
        assertEquals(departmentDTO, response.getBody().getData());
        verify(departmentService).removeSubjectFromDepartment(1L, 1L);
    }
} 