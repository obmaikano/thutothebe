package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.SchoolDTO;
import com.ohma.thutothebe.entity.Region;
import com.ohma.thutothebe.entity.School;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.SchoolMapper;
import com.ohma.thutothebe.repository.SchoolRepository;
import org.junit.jupiter.api.BeforeEach;
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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SchoolServiceImplTest {

    @Mock
    private SchoolRepository schoolRepository;

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
    void create_ShouldCreateNewSchool() {
        when(schoolMapper.toEntity(any(SchoolDTO.class))).thenReturn(school);
        when(schoolRepository.save(any(School.class))).thenReturn(school);
        when(schoolMapper.toDto(any(School.class))).thenReturn(schoolDTO);

        SchoolDTO result = schoolService.create(schoolDTO);

        assertNotNull(result);
        assertEquals(schoolDTO.code(), result.code());
        assertEquals(schoolDTO.name(), result.name());
        verify(schoolRepository).save(any(School.class));
    }

    @Test
    void getById_ShouldReturnSchool_WhenExists() {
        when(schoolRepository.findById(1L)).thenReturn(Optional.of(school));
        when(schoolMapper.toDto(any(School.class))).thenReturn(schoolDTO);

        SchoolDTO result = schoolService.getById(1L);

        assertNotNull(result);
        assertEquals(schoolDTO.id(), result.id());
        verify(schoolRepository).findById(1L);
    }

    @Test
    void getById_ShouldThrowException_WhenNotFound() {
        when(schoolRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> schoolService.getById(1L));
    }

    @Test
    void getAll_ShouldReturnAllSchools() {
        List<School> schools = Arrays.asList(school);
        when(schoolRepository.findAll()).thenReturn(schools);
        when(schoolMapper.toDto(any(School.class))).thenReturn(schoolDTO);

        List<SchoolDTO> results = schoolService.getAll();

        assertNotNull(results);
        assertEquals(1, results.size());
        verify(schoolRepository).findAll();
    }

    @Test
    void getAll_WithPagination_ShouldReturnPagedSchools() {
        List<School> schools = Arrays.asList(school);
        Page<School> schoolPage = new PageImpl<>(schools);
        Pageable pageable = PageRequest.of(0, 10);

        when(schoolRepository.findAll(pageable)).thenReturn(schoolPage);
        when(schoolMapper.toDto(any(School.class))).thenReturn(schoolDTO);

        Page<SchoolDTO> results = schoolService.getAll(pageable);

        assertNotNull(results);
        assertEquals(1, results.getTotalElements());
        verify(schoolRepository).findAll(pageable);
    }

    @Test
    void update_ShouldUpdateSchool_WhenExists() {
        when(schoolRepository.findById(1L)).thenReturn(Optional.of(school));
        when(schoolRepository.save(any(School.class))).thenReturn(school);
        when(schoolMapper.toDto(any(School.class))).thenReturn(schoolDTO);

        SchoolDTO result = schoolService.update(1L, schoolDTO);

        assertNotNull(result);
        assertEquals(schoolDTO.id(), result.id());
        verify(schoolRepository).save(any(School.class));
    }

    @Test
    void update_ShouldThrowException_WhenNotFound() {
        when(schoolRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> schoolService.update(1L, schoolDTO));
    }

    @Test
    void delete_ShouldDeleteSchool_WhenExists() {
        when(schoolRepository.existsById(1L)).thenReturn(true);
        doNothing().when(schoolRepository).deleteById(1L);

        assertDoesNotThrow(() -> schoolService.delete(1L));
        verify(schoolRepository).deleteById(1L);
    }

    @Test
    void delete_ShouldThrowException_WhenNotFound() {
        when(schoolRepository.existsById(1L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> schoolService.delete(1L));
    }

    @Test
    void getSchoolByCode_ShouldReturnSchool_WhenExists() {
        when(schoolRepository.findByCode("SCH001")).thenReturn(Optional.of(school));
        when(schoolMapper.toDto(any(School.class))).thenReturn(schoolDTO);

        SchoolDTO result = schoolService.getSchoolByCode("SCH001");

        assertNotNull(result);
        assertEquals(schoolDTO.code(), result.code());
        verify(schoolRepository).findByCode("SCH001");
    }

    @Test
    void getSchoolByCode_ShouldThrowException_WhenNotFound() {
        when(schoolRepository.findByCode("SCH001")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> schoolService.getSchoolByCode("SCH001"));
    }

    @Test
    void getSchoolsByRegionId_ShouldReturnSchools_WhenRegionExists() {
        List<School> schools = Arrays.asList(school);
        when(schoolRepository.findByRegionId(1L)).thenReturn(schools);
        when(schoolMapper.toDto(any(School.class))).thenReturn(schoolDTO);

        List<SchoolDTO> results = schoolService.getSchoolsByRegionId(1L);

        assertNotNull(results);
        assertEquals(1, results.size());
        verify(schoolRepository).findByRegionId(1L);
    }

    @Test
    void getSchoolsByRegionId_ShouldReturnEmptyList_WhenNoSchoolsFound() {
        when(schoolRepository.findByRegionId(1L)).thenReturn(List.of());

        List<SchoolDTO> results = schoolService.getSchoolsByRegionId(1L);

        assertNotNull(results);
        assertTrue(results.isEmpty());
        verify(schoolRepository).findByRegionId(1L);
    }
} 