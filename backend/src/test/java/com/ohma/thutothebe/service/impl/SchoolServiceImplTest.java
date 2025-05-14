package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.SchoolDTO;
import com.ohma.thutothebe.entity.Region;
import com.ohma.thutothebe.entity.School;
import com.ohma.thutothebe.mapper.SchoolMapper;
import com.ohma.thutothebe.repository.RegionRepository;
import com.ohma.thutothebe.repository.SchoolRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
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
        school.setDescription("Test Description");
        school.setRegion(region);
        school.setActive(true);

        schoolDTO = new SchoolDTO(
            1L,
            "SCH001",
            "Test School",
            "Test Description",
            1L,
            true
        );
    }

    @Test
    void getSchoolById_ShouldReturnSchool_WhenExists() {
        when(schoolRepository.findById(1L)).thenReturn(Optional.of(school));
        when(schoolMapper.toDto(school)).thenReturn(schoolDTO);

        SchoolDTO result = schoolService.getById(1L);

        assertNotNull(result);
        assertEquals(schoolDTO, result);
        verify(schoolRepository).findById(1L);
        verify(schoolMapper).toDto(school);
    }

    @Test
    void getSchoolById_ShouldThrowException_WhenNotFound() {
        when(schoolRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> schoolService.getById(1L));
        verify(schoolRepository).findById(1L);
        verify(schoolMapper, never()).toDto(any());
    }

    @Test
    void getSchoolByCode_ShouldReturnSchool_WhenExists() {
        when(schoolRepository.findByCode("SCH001")).thenReturn(Optional.of(school));
        when(schoolMapper.toDto(school)).thenReturn(schoolDTO);

        SchoolDTO result = schoolService.getSchoolByCode("SCH001");

        assertNotNull(result);
        assertEquals(schoolDTO, result);
        verify(schoolRepository).findByCode("SCH001");
        verify(schoolMapper).toDto(school);
    }

    @Test
    void getSchoolByCode_ShouldThrowException_WhenNotFound() {
        when(schoolRepository.findByCode("SCH001")).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> schoolService.getSchoolByCode("SCH001"));
        verify(schoolRepository).findByCode("SCH001");
        verify(schoolMapper, never()).toDto(any());
    }

    @Test
    void getAllSchools_ShouldReturnAllSchools() {
        List<School> schools = Arrays.asList(school);
        when(schoolRepository.findAll()).thenReturn(schools);
        when(schoolMapper.toDto(school)).thenReturn(schoolDTO);

        List<SchoolDTO> result = schoolService.getAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(schoolDTO, result.get(0));
        verify(schoolRepository).findAll();
        verify(schoolMapper).toDto(school);
    }

    @Test
    void getSchoolsByRegionId_ShouldReturnSchools() {
        List<School> schools = Arrays.asList(school);
        when(schoolRepository.findByRegionId(1L)).thenReturn(schools);
        when(schoolMapper.toDto(school)).thenReturn(schoolDTO);

        List<SchoolDTO> result = schoolService.getSchoolsByRegionId(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(schoolDTO, result.get(0));
        verify(schoolRepository).findByRegionId(1L);
        verify(schoolMapper).toDto(school);
    }

    @Test
    void getActiveSchoolsByRegionId_ShouldReturnActiveSchools() {
        List<School> schools = Arrays.asList(school);
        when(schoolRepository.findByRegionIdAndActive(1L, true)).thenReturn(schools);
        when(schoolMapper.toDto(school)).thenReturn(schoolDTO);

        List<SchoolDTO> result = schoolService.getActiveSchoolsByRegionId(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(schoolDTO, result.get(0));
        verify(schoolRepository).findByRegionIdAndActive(1L, true);
        verify(schoolMapper).toDto(school);
    }

    @Test
    void createSchool_ShouldCreateNewSchool() {
        when(schoolRepository.existsByCode("SCH001")).thenReturn(false);
        when(regionRepository.findById(1L)).thenReturn(Optional.of(region));
        when(schoolMapper.toEntity(schoolDTO)).thenReturn(school);
        when(schoolRepository.save(school)).thenReturn(school);
        when(schoolMapper.toDto(school)).thenReturn(schoolDTO);

        SchoolDTO result = schoolService.createSchool(schoolDTO);

        assertNotNull(result);
        assertEquals(schoolDTO, result);
        verify(schoolRepository).existsByCode("SCH001");
        verify(regionRepository).findById(1L);
        verify(schoolMapper).toEntity(schoolDTO);
        verify(schoolRepository).save(school);
        verify(schoolMapper).toDto(school);
    }

    @Test
    void createSchool_ShouldThrowException_WhenCodeExists() {
        when(schoolRepository.existsByCode("SCH001")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> schoolService.createSchool(schoolDTO));
        verify(schoolRepository).existsByCode("SCH001");
        verify(schoolMapper, never()).toEntity(any());
        verify(schoolRepository, never()).save(any());
    }

    @Test
    void createSchool_ShouldThrowException_WhenRegionNotFound() {
        when(schoolRepository.existsByCode("SCH001")).thenReturn(false);
        when(regionRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> schoolService.createSchool(schoolDTO));
        verify(schoolRepository).existsByCode("SCH001");
        verify(regionRepository).findById(1L);
        verify(schoolMapper, never()).toEntity(any());
        verify(schoolRepository, never()).save(any());
    }

    @Test
    void updateSchool_ShouldUpdateExistingSchool() {
        when(schoolRepository.findById(1L)).thenReturn(Optional.of(school));
        when(schoolRepository.existsByCode("SCH001")).thenReturn(false);
        when(regionRepository.findById(1L)).thenReturn(Optional.of(region));
        when(schoolRepository.save(any(School.class))).thenReturn(school);
        when(schoolMapper.toDto(school)).thenReturn(schoolDTO);

        SchoolDTO result = schoolService.updateSchool(1L, schoolDTO);

        assertNotNull(result);
        assertEquals(schoolDTO, result);
        verify(schoolRepository).findById(1L);
        verify(schoolRepository).existsByCode("SCH001");
        verify(regionRepository).findById(1L);
        verify(schoolRepository).save(any(School.class));
        verify(schoolMapper).toDto(school);
    }

    @Test
    void updateSchool_ShouldThrowException_WhenNotFound() {
        when(schoolRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> schoolService.updateSchool(1L, schoolDTO));
        verify(schoolRepository).findById(1L);
        verify(schoolRepository, never()).save(any());
    }

    @Test
    void deleteSchool_ShouldDeleteSchool() {
        when(schoolRepository.existsById(1L)).thenReturn(true);

        schoolService.deleteSchool(1L);

        verify(schoolRepository).existsById(1L);
        verify(schoolRepository).deleteById(1L);
    }

    @Test
    void deleteSchool_ShouldThrowException_WhenNotFound() {
        when(schoolRepository.existsById(1L)).thenReturn(false);

        assertThrows(EntityNotFoundException.class, () -> schoolService.deleteSchool(1L));
        verify(schoolRepository).existsById(1L);
        verify(schoolRepository, never()).deleteById(any());
    }

    @Test
    void deactivateSchool_ShouldDeactivateSchool() {
        when(schoolRepository.findById(1L)).thenReturn(Optional.of(school));
        when(schoolRepository.save(school)).thenReturn(school);

        schoolService.deactivateSchool(1L);

        assertFalse(school.isActive());
        verify(schoolRepository).findById(1L);
        verify(schoolRepository).save(school);
    }

    @Test
    void activateSchool_ShouldActivateSchool() {
        school.setActive(false);
        when(schoolRepository.findById(1L)).thenReturn(Optional.of(school));
        when(schoolRepository.save(school)).thenReturn(school);

        schoolService.activateSchool(1L);

        assertTrue(school.isActive());
        verify(schoolRepository).findById(1L);
        verify(schoolRepository).save(school);
    }

    @Test
    void existsByCode_ShouldReturnTrue_WhenCodeExists() {
        when(schoolRepository.existsByCode("SCH001")).thenReturn(true);

        boolean result = schoolService.existsByCode("SCH001");

        assertTrue(result);
        verify(schoolRepository).existsByCode("SCH001");
    }

    @Test
    void existsByCode_ShouldReturnFalse_WhenCodeDoesNotExist() {
        when(schoolRepository.existsByCode("SCH001")).thenReturn(false);

        boolean result = schoolService.existsByCode("SCH001");

        assertFalse(result);
        verify(schoolRepository).existsByCode("SCH001");
    }
} 