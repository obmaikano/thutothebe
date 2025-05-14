package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.RegionDTO;
import com.ohma.thutothebe.entity.Region;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.RegionMapper;
import com.ohma.thutothebe.repository.RegionRepository;
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
class RegionServiceImplTest {

    @Mock
    private RegionRepository regionRepository;

    @Mock
    private RegionMapper regionMapper;

    @InjectMocks
    private RegionServiceImpl regionService;

    private Region region;
    private RegionDTO regionDTO;

    @BeforeEach
    void setUp() {
        region = new Region();
        region.setId(1L);
        region.setCode("REG001");
        region.setName("Test Region");
        region.setDescription("Test Description");
        region.setActive(true);

        regionDTO = new RegionDTO(
            1L,
            "REG001",
            "Test Region",
            "Test Description",
            true
        );
    }

    @Test
    void create_ShouldCreateNewRegion() {
        when(regionMapper.toEntity(any(RegionDTO.class))).thenReturn(region);
        when(regionRepository.save(any(Region.class))).thenReturn(region);
        when(regionMapper.toDto(any(Region.class))).thenReturn(regionDTO);

        RegionDTO result = regionService.create(regionDTO);

        assertNotNull(result);
        assertEquals(regionDTO.code(), result.code());
        assertEquals(regionDTO.name(), result.name());
        verify(regionRepository).save(any(Region.class));
    }

    @Test
    void getById_ShouldReturnRegion_WhenExists() {
        when(regionRepository.findById(1L)).thenReturn(Optional.of(region));
        when(regionMapper.toDto(any(Region.class))).thenReturn(regionDTO);

        RegionDTO result = regionService.getById(1L);

        assertNotNull(result);
        assertEquals(regionDTO.id(), result.id());
        verify(regionRepository).findById(1L);
    }

    @Test
    void getById_ShouldThrowException_WhenNotFound() {
        when(regionRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> regionService.getById(1L));
    }

    @Test
    void getAll_ShouldReturnAllRegions() {
        List<Region> regions = Arrays.asList(region);
        when(regionRepository.findAll()).thenReturn(regions);
        when(regionMapper.toDto(any(Region.class))).thenReturn(regionDTO);

        List<RegionDTO> results = regionService.getAll();

        assertNotNull(results);
        assertEquals(1, results.size());
        verify(regionRepository).findAll();
    }

    @Test
    void getAll_WithPagination_ShouldReturnPagedRegions() {
        List<Region> regions = Arrays.asList(region);
        Page<Region> regionPage = new PageImpl<>(regions);
        Pageable pageable = PageRequest.of(0, 10);

        when(regionRepository.findAll(pageable)).thenReturn(regionPage);
        when(regionMapper.toDto(any(Region.class))).thenReturn(regionDTO);

        Page<RegionDTO> results = regionService.getAll(pageable);

        assertNotNull(results);
        assertEquals(1, results.getTotalElements());
        verify(regionRepository).findAll(pageable);
    }

    @Test
    void update_ShouldUpdateRegion_WhenExists() {
        when(regionRepository.findById(1L)).thenReturn(Optional.of(region));
        when(regionRepository.save(any(Region.class))).thenReturn(region);
        when(regionMapper.toDto(any(Region.class))).thenReturn(regionDTO);

        RegionDTO result = regionService.update(1L, regionDTO);

        assertNotNull(result);
        assertEquals(regionDTO.id(), result.id());
        verify(regionRepository).save(any(Region.class));
    }

    @Test
    void update_ShouldThrowException_WhenNotFound() {
        when(regionRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> regionService.update(1L, regionDTO));
    }

    @Test
    void delete_ShouldDeleteRegion_WhenExists() {
        when(regionRepository.existsById(1L)).thenReturn(true);
        doNothing().when(regionRepository).deleteById(1L);

        assertDoesNotThrow(() -> regionService.delete(1L));
        verify(regionRepository).deleteById(1L);
    }

    @Test
    void delete_ShouldThrowException_WhenNotFound() {
        when(regionRepository.existsById(1L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> regionService.delete(1L));
    }

    @Test
    void getRegionByCode_ShouldReturnRegion_WhenExists() {
        when(regionRepository.findByCode("REG001")).thenReturn(Optional.of(region));
        when(regionMapper.toDto(any(Region.class))).thenReturn(regionDTO);

        RegionDTO result = regionService.getRegionByCode("REG001");

        assertNotNull(result);
        assertEquals(regionDTO.code(), result.code());
        verify(regionRepository).findByCode("REG001");
    }

    @Test
    void getRegionByCode_ShouldThrowException_WhenNotFound() {
        when(regionRepository.findByCode("REG001")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> regionService.getRegionByCode("REG001"));
    }
} 