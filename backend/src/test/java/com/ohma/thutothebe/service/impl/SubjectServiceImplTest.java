package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.SubjectDTO;
import com.ohma.thutothebe.entity.Subject;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.SubjectMapper;
import com.ohma.thutothebe.repository.SubjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SubjectServiceImplTest {

    @Mock
    private SubjectRepository subjectRepository;

    @Mock
    private SubjectMapper subjectMapper;

    @InjectMocks
    private SubjectServiceImpl subjectService;

    private Subject subject;
    private SubjectDTO subjectDTO;

    @BeforeEach
    void setUp() {
        // Setup test data
        subject = new Subject();
        subject.setId(1L);
        subject.setCode("MATH101");
        subject.setName("Mathematics 101");
        subject.setDescription("Introduction to Mathematics");
        subject.setActive(true);

        subjectDTO = new SubjectDTO(
                1L,
                "MATH101",
                "Mathematics 101",
                "Introduction to Mathematics",
                true
        );
    }

    @Test
    @DisplayName("Test getSubjectByCode when subject exists")
    void getSubjectByCode_ShouldReturnSubject_WhenExists() {
        // Arrange
        when(subjectRepository.findByCode(anyString())).thenReturn(Optional.of(subject));
        when(subjectMapper.toDto(any(Subject.class))).thenReturn(subjectDTO);

        // Act
        SubjectDTO result = subjectService.getSubjectByCode("MATH101");

        // Assert
        assertNotNull(result);
        assertEquals("MATH101", result.code());
        assertEquals("Mathematics 101", result.name());
        verify(subjectRepository, times(1)).findByCode("MATH101");
    }

    @Test
    @DisplayName("Test getSubjectByCode when subject does not exist")
    void getSubjectByCode_ShouldThrowException_WhenNotFound() {
        // Arrange
        when(subjectRepository.findByCode(anyString())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> subjectService.getSubjectByCode("NONEXISTENT"));
        verify(subjectRepository, times(1)).findByCode("NONEXISTENT");
    }

    @Test
    @DisplayName("Test getActiveSubjects")
    void getActiveSubjects_ShouldReturnActiveSubjects() {
        // Arrange
        List<Subject> activeSubjects = Arrays.asList(subject);
        when(subjectRepository.findByActive(true)).thenReturn(activeSubjects);
        when(subjectMapper.toDto(any(Subject.class))).thenReturn(subjectDTO);

        // Act
        List<SubjectDTO> result = subjectService.getActiveSubjects();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("MATH101", result.get(0).code());
        verify(subjectRepository, times(1)).findByActive(true);
    }

    @Test
    @DisplayName("Test createSubject when code is unique")
    void createSubject_ShouldCreateNewSubject_WhenCodeIsUnique() {
        // Arrange
        when(subjectRepository.existsByCode(anyString())).thenReturn(false);
        when(subjectMapper.toEntity(any(SubjectDTO.class))).thenReturn(subject);
        when(subjectRepository.save(any(Subject.class))).thenReturn(subject);
        when(subjectMapper.toDto(any(Subject.class))).thenReturn(subjectDTO);

        // Act
        SubjectDTO result = subjectService.createSubject(subjectDTO);

        // Assert
        assertNotNull(result);
        assertEquals("MATH101", result.code());
        verify(subjectRepository, times(1)).existsByCode("MATH101");
        verify(subjectRepository, times(1)).save(any(Subject.class));
    }

    @Test
    @DisplayName("Test createSubject when code already exists")
    void createSubject_ShouldThrowException_WhenCodeExists() {
        // Arrange
        when(subjectRepository.existsByCode(anyString())).thenReturn(true);

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> subjectService.createSubject(subjectDTO));
        verify(subjectRepository, times(1)).existsByCode("MATH101");
        verify(subjectRepository, never()).save(any(Subject.class));
    }

    @Test
    @DisplayName("Test updateSubject when subject exists and code is unique")
    void updateSubject_ShouldUpdateSubject_WhenExistsAndCodeIsUnique() {
        // Arrange
        when(subjectRepository.findById(anyLong())).thenReturn(Optional.of(subject));
        when(subjectRepository.existsByCode(anyString())).thenReturn(false);
        when(subjectMapper.toEntity(any(SubjectDTO.class))).thenReturn(subject);
        when(subjectRepository.save(any(Subject.class))).thenReturn(subject);
        when(subjectMapper.toDto(any(Subject.class))).thenReturn(subjectDTO);

        // Act
        SubjectDTO updatedDTO = new SubjectDTO(1L, "MATH102", "Mathematics 102", "Updated description", true);
        SubjectDTO result = subjectService.updateSubject(1L, updatedDTO);

        // Assert
        assertNotNull(result);
        verify(subjectRepository, times(1)).findById(1L);
        verify(subjectRepository, times(1)).save(any(Subject.class));
    }

    @Test
    @DisplayName("Test updateSubject when subject does not exist")
    void updateSubject_ShouldThrowException_WhenNotFound() {
        // Arrange
        when(subjectRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        SubjectDTO updatedDTO = new SubjectDTO(1L, "MATH102", "Mathematics 102", "Updated description", true);
        assertThrows(ResourceNotFoundException.class, () -> subjectService.updateSubject(1L, updatedDTO));
        verify(subjectRepository, times(1)).findById(1L);
        verify(subjectRepository, never()).save(any(Subject.class));
    }

    @Test
    @DisplayName("Test updateSubject when code already exists for another subject")
    void updateSubject_ShouldThrowException_WhenCodeExistsForAnotherSubject() {
        // Arrange
        Subject existingSubject = new Subject();
        existingSubject.setId(1L);
        existingSubject.setCode("MATH101");

        when(subjectRepository.findById(anyLong())).thenReturn(Optional.of(existingSubject));
        when(subjectRepository.existsByCode("MATH102")).thenReturn(true);

        // Act & Assert
        SubjectDTO updatedDTO = new SubjectDTO(1L, "MATH102", "Mathematics 102", "Updated description", true);
        assertThrows(IllegalArgumentException.class, () -> subjectService.updateSubject(1L, updatedDTO));
        verify(subjectRepository, times(1)).findById(1L);
        verify(subjectRepository, times(1)).existsByCode("MATH102");
        verify(subjectRepository, never()).save(any(Subject.class));
    }

    @Test
    @DisplayName("Test deleteSubject when subject exists")
    void deleteSubject_ShouldDeleteSubject_WhenExists() {
        // Arrange
        when(subjectRepository.existsById(anyLong())).thenReturn(true);
        doNothing().when(subjectRepository).deleteById(anyLong());

        // Act
        subjectService.deleteSubject(1L);

        // Assert
        verify(subjectRepository, times(1)).existsById(1L);
        verify(subjectRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Test deleteSubject when subject does not exist")
    void deleteSubject_ShouldThrowException_WhenNotFound() {
        // Arrange
        when(subjectRepository.existsById(anyLong())).thenReturn(false);

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> subjectService.deleteSubject(1L));
        verify(subjectRepository, times(1)).existsById(1L);
        verify(subjectRepository, never()).deleteById(anyLong());
    }

    @Test
    @DisplayName("Test activateSubject when subject exists")
    void activateSubject_ShouldActivateSubject_WhenExists() {
        // Arrange
        Subject inactiveSubject = new Subject();
        inactiveSubject.setId(1L);
        inactiveSubject.setActive(false);

        when(subjectRepository.findById(anyLong())).thenReturn(Optional.of(inactiveSubject));
        when(subjectRepository.save(any(Subject.class))).thenReturn(inactiveSubject);

        // Act
        subjectService.activateSubject(1L);

        // Assert
        assertTrue(inactiveSubject.isActive());
        verify(subjectRepository, times(1)).findById(1L);
        verify(subjectRepository, times(1)).save(inactiveSubject);
    }

    @Test
    @DisplayName("Test activateSubject when subject does not exist")
    void activateSubject_ShouldThrowException_WhenNotFound() {
        // Arrange
        when(subjectRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> subjectService.activateSubject(1L));
        verify(subjectRepository, times(1)).findById(1L);
        verify(subjectRepository, never()).save(any(Subject.class));
    }

    @Test
    @DisplayName("Test deactivateSubject when subject exists")
    void deactivateSubject_ShouldDeactivateSubject_WhenExists() {
        // Arrange
        when(subjectRepository.findById(anyLong())).thenReturn(Optional.of(subject));
        when(subjectRepository.save(any(Subject.class))).thenReturn(subject);

        // Act
        subjectService.deactivateSubject(1L);

        // Assert
        assertFalse(subject.isActive());
        verify(subjectRepository, times(1)).findById(1L);
        verify(subjectRepository, times(1)).save(subject);
    }

    @Test
    @DisplayName("Test deactivateSubject when subject does not exist")
    void deactivateSubject_ShouldThrowException_WhenNotFound() {
        // Arrange
        when(subjectRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> subjectService.deactivateSubject(1L));
        verify(subjectRepository, times(1)).findById(1L);
        verify(subjectRepository, never()).save(any(Subject.class));
    }

    @Test
    @DisplayName("Test existsByCode when code exists")
    void existsByCode_ShouldReturnTrue_WhenCodeExists() {
        // Arrange
        when(subjectRepository.existsByCode(anyString())).thenReturn(true);

        // Act
        boolean result = subjectService.existsByCode("MATH101");

        // Assert
        assertTrue(result);
        verify(subjectRepository, times(1)).existsByCode("MATH101");
    }

    @Test
    @DisplayName("Test existsByCode when code does not exist")
    void existsByCode_ShouldReturnFalse_WhenCodeDoesNotExist() {
        // Arrange
        when(subjectRepository.existsByCode(anyString())).thenReturn(false);

        // Act
        boolean result = subjectService.existsByCode("NONEXISTENT");

        // Assert
        assertFalse(result);
        verify(subjectRepository, times(1)).existsByCode("NONEXISTENT");
    }
} 