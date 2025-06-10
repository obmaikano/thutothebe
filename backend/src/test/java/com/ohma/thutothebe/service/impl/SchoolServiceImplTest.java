package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.SchoolDTO;
import com.ohma.thutothebe.entity.Region;
import com.ohma.thutothebe.entity.School;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.SchoolMapper;
import com.ohma.thutothebe.repository.RegionRepository;
import com.ohma.thutothebe.repository.SchoolRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SchoolServiceImplTest {

    @Mock
    private SchoolRepository schoolRepository;

    @Mock
    private RegionRepository regionRepository;

    @Mock
    private SchoolMapper schoolMapper;

    @InjectMocks
    private SchoolServiceImpl schoolService;

    private School school;
    private SchoolDTO schoolDTO;
    private Region region;

    @BeforeEach
    void setUp() {
        region = new Region();
        region.setId(1L);
        region.setCode("REG001");
        region.setName("Test Region");
        
        school = new School();
        school.setId(1L);
        school.setCode("SCH001");
        school.setName("Test School");
        school.setDescription("Test School Description");
        school.setActive(true);
        school.setRegion(region);

        schoolDTO = new SchoolDTO(
                1L,
                "SCH001",
                "Test School",
                "Test School Description",
                1L,
                null,
                null,
                true
        );
    }

    @Test
    @DisplayName("Test getSchoolById when school exists")
    void getSchoolById_ShouldReturnSchool_WhenExists() {
        when(schoolRepository.findById(anyLong())).thenReturn(Optional.of(school));
        when(schoolMapper.toDto(any(School.class))).thenReturn(schoolDTO);

        SchoolDTO result = schoolService.findById(1L);

        assertNotNull(result);
        assertEquals("SCH001", result.code());
        assertEquals("Test School", result.name());
        verify(schoolRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Test getSchoolById when school does not exist")
    void getSchoolById_ShouldThrowException_WhenNotFound() {
        when(schoolRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> schoolService.findById(999L));
        verify(schoolRepository, times(1)).findById(999L);
    }

    @Test
    @DisplayName("Test getSchoolByCode when school exists")
    void getSchoolByCode_ShouldReturnSchool_WhenExists() {
        when(schoolRepository.findByCode(anyString())).thenReturn(Optional.of(school));
        when(schoolMapper.toDto(any(School.class))).thenReturn(schoolDTO);

        SchoolDTO result = schoolService.getSchoolByCode("SCH001");

        assertNotNull(result);
        assertEquals("SCH001", result.code());
        assertEquals("Test School", result.name());
        verify(schoolRepository, times(1)).findByCode("SCH001");
    }

    @Test
    @DisplayName("Test getSchoolByCode when school does not exist")
    void getSchoolByCode_ShouldThrowException_WhenNotFound() {
        when(schoolRepository.findByCode(anyString())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> schoolService.getSchoolByCode("NONEXISTENT"));
        verify(schoolRepository, times(1)).findByCode("NONEXISTENT");
    }

    @Test
    @DisplayName("Test getAllSchools")
    void getAllSchools_ShouldReturnAllSchools() {
        List<School> schools = Arrays.asList(school);
        when(schoolRepository.findAll()).thenReturn(schools);
        when(schoolMapper.toDto(any(School.class))).thenReturn(schoolDTO);

        List<SchoolDTO> result = schoolService.getAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("SCH001", result.get(0).code());
        verify(schoolRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Test getSchoolsByRegionId")
    void getSchoolsByRegionId_ShouldReturnSchools() {
        List<School> schools = Arrays.asList(school);
        when(schoolRepository.findByRegionId(anyLong())).thenReturn(schools);
        when(schoolMapper.toDto(any(School.class))).thenReturn(schoolDTO);

        List<SchoolDTO> result = schoolService.getSchoolsByRegionId(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("SCH001", result.get(0).code());
        verify(schoolRepository, times(1)).findByRegionId(1L);
    }

    @Test
    @DisplayName("Test getActiveSchoolsByRegionId")
    void getActiveSchoolsByRegionId_ShouldReturnActiveSchools() {
        List<School> activeSchools = Arrays.asList(school);
        when(schoolRepository.findByRegionIdAndActive(anyLong(), anyBoolean())).thenReturn(activeSchools);
        when(schoolMapper.toDto(any(School.class))).thenReturn(schoolDTO);

        List<SchoolDTO> result = schoolService.getActiveSchoolsByRegionId(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("SCH001", result.get(0).code());
        verify(schoolRepository, times(1)).findByRegionIdAndActive(1L, true);
    }

    @Test
    @DisplayName("Test createSchool when code is unique and region exists")
    void createSchool_ShouldCreateNewSchool_WhenCodeIsUniqueAndRegionExists() {
        when(schoolRepository.existsByCode(anyString())).thenReturn(false);
        when(regionRepository.findById(anyLong())).thenReturn(Optional.of(region));
        when(schoolMapper.toEntity(any(SchoolDTO.class))).thenReturn(school);
        when(schoolRepository.save(any(School.class))).thenReturn(school);
        when(schoolMapper.toDto(any(School.class))).thenReturn(schoolDTO);

        SchoolDTO result = schoolService.createSchool(schoolDTO);

        assertNotNull(result);
        assertEquals("SCH001", result.code());
        assertEquals("Test School", result.name());
        verify(schoolRepository, times(1)).existsByCode("SCH001");
        verify(regionRepository, times(1)).findById(1L);
        verify(schoolRepository, times(1)).save(any(School.class));
    }

    @Test
    @DisplayName("Test createSchool when code already exists")
    void createSchool_ShouldThrowException_WhenCodeExists() {
        when(schoolRepository.existsByCode(anyString())).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> schoolService.createSchool(schoolDTO));
        verify(schoolRepository, times(1)).existsByCode("SCH001");
        verify(regionRepository, never()).findById(anyLong());
        verify(schoolRepository, never()).save(any(School.class));
    }

    @Test
    @DisplayName("Test createSchool when region does not exist")
    void createSchool_ShouldThrowException_WhenRegionNotFound() {
        when(schoolRepository.existsByCode(anyString())).thenReturn(false);
        when(regionRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> schoolService.createSchool(schoolDTO));
        verify(schoolRepository, times(1)).existsByCode("SCH001");
        verify(regionRepository, times(1)).findById(1L);
        verify(schoolRepository, never()).save(any(School.class));
    }

    @Test
    @DisplayName("Test updateSchool when school exists and code is unique")
    void updateSchool_ShouldUpdateExistingSchool_WhenExistsAndCodeIsUnique() {
        when(schoolRepository.findById(anyLong())).thenReturn(Optional.of(school));
        when(schoolRepository.existsByCode(anyString())).thenReturn(false);
        when(regionRepository.findById(anyLong())).thenReturn(Optional.of(region));
        when(schoolMapper.toEntity(any(SchoolDTO.class))).thenReturn(school);
        when(schoolRepository.save(any(School.class))).thenReturn(school);
        when(schoolMapper.toDto(any(School.class))).thenReturn(schoolDTO);

        SchoolDTO updatedDTO = new SchoolDTO(1L, "SCH002", "Updated School", "Updated School Description", 1L, null, null, true);
        SchoolDTO result = schoolService.updateSchool(1L, updatedDTO);

        assertNotNull(result);
        verify(schoolRepository, times(1)).findById(1L);
        verify(schoolRepository, times(1)).existsByCode("SCH002");
        verify(regionRepository, times(1)).findById(1L);
        verify(schoolRepository, times(1)).save(any(School.class));
    }

    @Test
    @DisplayName("Test updateSchool when school does not exist")
    void updateSchool_ShouldThrowException_WhenNotFound() {
        when(schoolRepository.findById(anyLong())).thenReturn(Optional.empty());

        SchoolDTO updatedDTO = new SchoolDTO(1L, "SCH002", "Updated School", "Updated School Description", 1L, null, null, true);
        assertThrows(ResourceNotFoundException.class, () -> schoolService.updateSchool(1L, updatedDTO));
        verify(schoolRepository, times(1)).findById(1L);
        verify(schoolRepository, never()).save(any(School.class));
    }

    @Test
    @DisplayName("Test deleteSchool when school exists")
    void deleteSchool_ShouldDeleteSchool_WhenExists() {
        when(schoolRepository.findById(anyLong())).thenReturn(Optional.of(school));
        doNothing().when(schoolRepository).deleteById(anyLong());

        schoolService.deleteSchool(1L);

        verify(schoolRepository, times(1)).findById(1L);
        verify(schoolRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Test deleteSchool when school does not exist")
    void deleteSchool_ShouldThrowException_WhenNotFound() {
        when(schoolRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> schoolService.deleteSchool(1L));
        verify(schoolRepository, times(1)).findById(1L);
        verify(schoolRepository, never()).deleteById(anyLong());
    }

    @Test
    @DisplayName("Test deactivateSchool when school exists")
    void deactivateSchool_ShouldDeactivateSchool_WhenExists() {
        when(schoolRepository.findById(anyLong())).thenReturn(Optional.of(school));
        when(schoolRepository.save(any(School.class))).thenReturn(school);

        schoolService.deactivateSchool(1L);

        assertFalse(school.isActive());
        verify(schoolRepository, times(1)).findById(1L);
        verify(schoolRepository, times(1)).save(school);
    }

    @Test
    @DisplayName("Test deactivateSchool when school does not exist")
    void deactivateSchool_ShouldThrowException_WhenNotFound() {
        when(schoolRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> schoolService.deactivateSchool(1L));
        verify(schoolRepository, times(1)).findById(1L);
        verify(schoolRepository, never()).save(any(School.class));
    }

    @Test
    @DisplayName("Test activateSchool when school exists")
    void activateSchool_ShouldActivateSchool_WhenExists() {
        School inactiveSchool = new School();
        inactiveSchool.setId(1L);
        inactiveSchool.setActive(false);

        when(schoolRepository.findById(anyLong())).thenReturn(Optional.of(inactiveSchool));
        when(schoolRepository.save(any(School.class))).thenReturn(inactiveSchool);

        schoolService.activateSchool(1L);

        assertTrue(inactiveSchool.isActive());
        verify(schoolRepository, times(1)).findById(1L);
        verify(schoolRepository, times(1)).save(inactiveSchool);
    }

    @Test
    @DisplayName("Test activateSchool when school does not exist")
    void activateSchool_ShouldThrowException_WhenNotFound() {
        when(schoolRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> schoolService.activateSchool(1L));
        verify(schoolRepository, times(1)).findById(1L);
        verify(schoolRepository, never()).save(any(School.class));
    }

    @Test
    @DisplayName("Test existsByCode when code exists")
    void existsByCode_ShouldReturnTrue_WhenCodeExists() {
        when(schoolRepository.existsByCode(anyString())).thenReturn(true);

        boolean result = schoolService.existsByCode("SCH001");

        assertTrue(result);
        verify(schoolRepository, times(1)).existsByCode("SCH001");
    }

    @Test
    @DisplayName("Test existsByCode when code does not exist")
    void existsByCode_ShouldReturnFalse_WhenCodeDoesNotExist() {
        when(schoolRepository.existsByCode(anyString())).thenReturn(false);

        boolean result = schoolService.existsByCode("NONEXISTENT");

        assertFalse(result);
        verify(schoolRepository, times(1)).existsByCode("NONEXISTENT");
    }
} 